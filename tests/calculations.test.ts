import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSetVolume,
  calculateWorkoutTotals,
  calculateTotalSessionVolume,
  calculateCompletedWorkingSetsCount,
  calculateCompletedWorkingRepsCount,
  calculateBodyweightStats,
  calculateMuscleExposureAnalytics,
  calculateRangeTrendComparison,
  getPresetComparisonPeriods,
  calculateCrossExerciseComparison,
  generateWorkoutsCsv,
  generateBodyweightCsv,
  generateStepsCsv,
  escapeCsvCell,
} from '../src/lib/calculations';
import { BodyweightEntryRow } from '../src/types/database';

// ============================================================================
// TEST SUITE: WORKOUT CONTAINING WARMUP SETS
// ============================================================================
test('calculates workout totals excluding warmup and incomplete sets', () => {
  const sets = [
    // Warmup set - must be excluded
    { weight: 50, reps: 10, completed: true, set_type: 'warmup' },
    // Completed working set 1 - must be included (100 * 5 = 500)
    { weight: 100, reps: 5, completed: true, set_type: 'working' },
    // Completed working set 2 - must be included (100 * 5 = 500)
    { weight: 100, reps: 5, completed: true, set_type: 'working' },
    // Incomplete set - must be excluded
    { weight: 100, reps: 5, completed: false, set_type: 'working' },
    // Zero weight / zero reps - must be excluded
    { weight: 0, reps: 10, completed: true, set_type: 'working' },
    { weight: 100, reps: 0, completed: true, set_type: 'working' },
  ];

  assert.strictEqual(calculateSetVolume(sets[0]), 0, 'Warmup set must have 0 volume');
  assert.strictEqual(calculateSetVolume(sets[1]), 500, 'Completed working set must have 500 volume');
  assert.strictEqual(calculateSetVolume(sets[3]), 0, 'Incomplete set must have 0 volume');

  const totals = calculateWorkoutTotals(sets);
  assert.strictEqual(totals.totalVolume, 1000, 'Total volume should sum working sets only (500 + 500)');
  assert.strictEqual(totals.completedWorkingSets, 2, 'Completed working sets count should be 2');
  assert.strictEqual(totals.completedWorkingReps, 10, 'Completed working reps should be 10');

  assert.strictEqual(calculateTotalSessionVolume(sets), 1000);
  assert.strictEqual(calculateCompletedWorkingSetsCount(sets), 2);
  assert.strictEqual(calculateCompletedWorkingRepsCount(sets), 10);
});

test('calculateMuscleExposureAnalytics excludes warmup sets from muscle exposure', () => {
  const workoutWithWarmup = {
    id: 'w_warmup_test',
    status: 'completed',
    completed_at: '2026-10-07T12:00:00Z',
    workout_exercises: [
      {
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [
          // Warmup set: 60kg x 10 = 600kg (should be IGNORED)
          { weight: 60, reps: 10, completed: true, set_type: 'warmup' },
          // Working set: 100kg x 10 = 1000kg (must be COUNTED)
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
        ],
      },
    ],
  };

  const analytics = calculateMuscleExposureAnalytics([workoutWithWarmup], 'session');
  assert.strictEqual(analytics.totalVolume, 1000, 'Total volume must only reflect the working set (1000kg), warmup excluded');
  assert.strictEqual(analytics.totalSets, 1, 'Total sets must be 1 working set, warmup excluded');
});

// ============================================================================
// TEST SUITE: SESSION CALL WITH UNSORTED INPUT & STATUS FILTERING
// ============================================================================
test('calculateMuscleExposureAnalytics with timeframe="session" sorts by completion date and ignores input order', () => {
  const workoutOld = {
    id: 'w_old',
    status: 'completed',
    completed_at: '2026-10-01T10:00:00Z',
    workout_exercises: [
      {
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [{ weight: 50, reps: 10, completed: true, set_type: 'working' }],
      },
    ],
  };

  const workoutRecent = {
    id: 'w_recent',
    status: 'completed',
    completed_at: '2026-10-07T18:00:00Z', // Most recent completed!
    workout_exercises: [
      {
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [{ weight: 120, reps: 5, completed: true, set_type: 'working' }],
      },
    ],
  };

  const workoutMiddle = {
    id: 'w_middle',
    status: 'completed',
    completed_at: '2026-10-04T12:00:00Z',
    workout_exercises: [
      {
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [{ weight: 80, reps: 5, completed: true, set_type: 'working' }],
      },
    ],
  };

  const workoutIncomplete = {
    id: 'w_incomplete',
    status: 'in_progress', // Not completed - must be ignored!
    completed_at: '2026-10-08T00:00:00Z',
    workout_exercises: [
      {
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [{ weight: 200, reps: 10, completed: true, set_type: 'working' }],
      },
    ],
  };

  // Provide array in completely unsorted order: [old, incomplete, middle, recent]
  const unsortedInput = [workoutOld, workoutIncomplete, workoutMiddle, workoutRecent];

  const sessionAnalytics = calculateMuscleExposureAnalytics(unsortedInput, 'session');
  assert.strictEqual(sessionAnalytics.totalAnalyzedWorkouts, 1, 'Must analyze exactly 1 session');
  assert.strictEqual(
    sessionAnalytics.totalVolume,
    600, // 120 * 5 = 600 from workoutRecent
    'Must select workoutRecent (120*5 = 600kg) based on chronologically most recent completed_at'
  );

  // Even if workoutOld is first in the array, it must not be chosen
  const reverseInput = [workoutOld, workoutMiddle];
  const reverseAnalytics = calculateMuscleExposureAnalytics(reverseInput, 'session');
  assert.strictEqual(reverseAnalytics.totalVolume, 400, 'Must select workoutMiddle (80*5 = 400kg)');
});

// ============================================================================
// TEST SUITE: STABILIZER PERCENTAGES & REGION NORMALIZATION
// ============================================================================
test('calculateMuscleExposureAnalytics handles stabilizers correctly: excluded from percentageOfTotal so regions sum to 100%', () => {
  // Barbell bench press has Primary (Chest: 65%), Secondary (Shoulders: 20%, Triceps: 15%), and Stabilizer (Core: 10%)
  const workoutWithStabilizers = {
    id: 'w_bench_stab',
    status: 'completed',
    completed_at: '2026-10-07T12:00:00Z',
    workout_exercises: [
      {
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [{ weight: 100, reps: 10, completed: true, set_type: 'working' }], // 1000kg
      },
    ],
  };

  const analytics = calculateMuscleExposureAnalytics([workoutWithStabilizers], 'session');
  assert.strictEqual(analytics.totalVolume, 1000);

  // 1. Stabilizer muscles should still have their individual exposure tracked
  const coreMuscle = analytics.topMuscles.find(m => m.muscleId === 'm_core');
  assert.ok(coreMuscle, 'Core muscle should appear in top muscles');
  assert.strictEqual(coreMuscle.totalVolume, 100, 'Core should receive 10% of 1000kg = 100kg stabilizer exposure');
  assert.strictEqual(coreMuscle.totalSets, 0.1, 'Core should receive 10% of 1 completed working set = 0.1 set');

  // 2. Region percentageOfTotal sums strictly to 100%
  const totalRegionPercentage = analytics.regions.reduce((sum, r) => sum + r.percentageOfTotal, 0);
  assert.ok(
    Math.abs(totalRegionPercentage - 100) <= 0.2,
    `Region percentages must sum to 100% (actual: ${totalRegionPercentage})`
  );

  // 3. Core region percentageOfTotal is 0 because stabilizers are excluded from dynamic percentage-of-total
  const coreRegion = analytics.regions.find(r => r.regionId === 'core');
  assert.ok(coreRegion, 'Core region exists');
  assert.strictEqual(coreRegion.percentageOfTotal, 0, 'Core region percentageOfTotal should be 0 (stabilizers excluded from dynamic total)');
  assert.strictEqual(coreRegion.totalVolume, 100, 'Core region totalVolume still tracks the 100kg stabilizer exposure');
});

test('exercise with Primary, Secondary and Stabilizer contributions: region percentageOfTotal values sum to 100 (±0.2 for rounding)', () => {
  // ex_barbell_bench_press has:
  // - Primary: m_chest_sternal (60%) -> chest region
  // - Secondary: m_deltoid_anterior (25%) -> shoulders region
  // - Secondary: m_triceps_lateral_head (15%) -> arms region
  // - Stabilizer: m_rotator_cuff (15%) -> shoulders region
  // - Stabilizer: m_core (10%) -> core region
  const workout = {
    id: 'w_bench_tri_role',
    status: 'completed',
    completed_at: '2026-10-08T09:00:00Z',
    workout_exercises: [
      {
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [
          { weight: 80, reps: 10, completed: true, set_type: 'working' }, // 800 kg
        ],
      },
    ],
  };

  const analytics = calculateMuscleExposureAnalytics([workout], 'session');

  // Sum all region percentageOfTotal values across all regions
  const sumOfRegionPercentages = analytics.regions.reduce((sum, r) => sum + r.percentageOfTotal, 0);

  // Assert sum is 100 (±0.2 for rounding)
  assert.ok(
    Math.abs(sumOfRegionPercentages - 100) <= 0.2,
    `Expected region percentageOfTotal values to sum to 100 (±0.2), got ${sumOfRegionPercentages}`
  );

  // Assert specific region breakdowns
  const chest = analytics.regions.find(r => r.regionId === 'chest');
  const shoulders = analytics.regions.find(r => r.regionId === 'shoulders');
  const arms = analytics.regions.find(r => r.regionId === 'arms');
  const core = analytics.regions.find(r => r.regionId === 'core');

  assert.strictEqual(chest?.percentageOfTotal, 60.0);
  assert.strictEqual(shoulders?.percentageOfTotal, 25.0);
  assert.strictEqual(arms?.percentageOfTotal, 15.0);
  assert.strictEqual(core?.percentageOfTotal, 0.0); // Stabilizer excluded from percentage-of-total
});

// ============================================================================
// TEST SUITE: BODYWEIGHT STATS WITH UTC MATH & THIRTY-DAY TREND NULL FALLBACK
// ============================================================================
test('calculateBodyweightStats returns thirtyDayTrend: null when no comparison data in window', () => {
  // Only recent entries (no entries ~30 days ago)
  const entries: BodyweightEntryRow[] = [
    {
      id: 'bw1',
      user_id: 'user_1',
      date: '2026-10-01',
      weight: 80.0,
      unit: 'kg',
      notes: null,
      source: 'manual',
      created_at: '2026-10-01T08:00:00Z',
      updated_at: '2026-10-01T08:00:00Z',
    },
    {
      id: 'bw2',
      user_id: 'user_1',
      date: '2026-10-07',
      weight: 81.0,
      unit: 'kg',
      notes: null,
      source: 'manual',
      created_at: '2026-10-07T08:00:00Z',
      updated_at: '2026-10-07T08:00:00Z',
    },
  ];

  const stats = calculateBodyweightStats(entries);
  assert.strictEqual(stats.currentWeight, 81.0);
  assert.strictEqual(stats.startingWeight, 80.0);
  assert.strictEqual(stats.netChange, 1.0);
  assert.strictEqual(
    stats.thirtyDayTrend,
    null,
    'thirtyDayTrend must be strictly null when there is no comparison data ~30 days prior, not fall back to net change'
  );
});

test('calculateBodyweightStats calculates thirtyDayTrend accurately when comparison data exists', () => {
  const entries: BodyweightEntryRow[] = [
    // Entry 32 days prior (inside the [30, 36] days ago window)
    {
      id: 'bw_old',
      user_id: 'user_1',
      date: '2026-09-05',
      weight: 80.0,
      unit: 'kg',
      notes: null,
      source: 'manual',
      created_at: '2026-09-05T08:00:00Z',
      updated_at: '2026-09-05T08:00:00Z',
    },
    // Current entry on 2026-10-07
    {
      id: 'bw_now',
      user_id: 'user_1',
      date: '2026-10-07',
      weight: 82.5,
      unit: 'kg',
      notes: null,
      source: 'manual',
      created_at: '2026-10-07T08:00:00Z',
      updated_at: '2026-10-07T08:00:00Z',
    },
  ];

  const stats = calculateBodyweightStats(entries);
  assert.strictEqual(stats.currentWeight, 82.5);
  assert.strictEqual(stats.sevenDayAverage, 82.5);
  // avg30DaysAgo = 80.0, sevenDayAverage = 82.5 => trend = +2.5
  assert.strictEqual(stats.thirtyDayTrend, 2.5);
});

// ============================================================================
// STEP 0 TEST SUITE: REAL DATABASE ROW SHAPE WITH WARMUP SET
// ============================================================================
test('calculates totals from real database row shape matching Supabase workout_sets schema', () => {
  // Real DB workout row with nested workout_exercises and workout_sets matching Supabase schema definitions
  const realDbWorkout = {
    id: 'a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
    user_id: 'u1a2b3c4-e5f6-4a5b-8c9d-0123456789ab',
    template_id: null,
    name: 'Chest & Arms Hypertrophy',
    status: 'completed',
    started_at: '2026-10-08T08:00:00Z',
    completed_at: '2026-10-08T09:00:00Z',
    duration_seconds: 3600,
    total_volume: 1750,
    notes: 'Real DB row test',
    created_at: '2026-10-08T08:00:00Z',
    updated_at: '2026-10-08T09:00:00Z',
    workout_exercises: [
      {
        id: 'we1-a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
        workout_id: 'a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
        exercise_id: 'ex_barbell_bench_press',
        order_index: 0,
        notes: '',
        rest_timer_seconds: 90,
        created_at: '2026-10-08T08:00:00Z',
        workout_sets: [
          // DB Row 1: Warmup set with substantial weight (must be excluded from totalVolume and working sets)
          {
            id: 'ws1-a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
            workout_exercise_id: 'we1-a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
            set_number: 1,
            set_type: 'warmup',
            weight: 50.0,
            reps: 10,
            rir: null,
            completed: true,
            completed_at: '2026-10-08T08:05:00Z',
            created_at: '2026-10-08T08:00:00Z',
          },
          // DB Row 2: Working set (100kg x 10 = 1000kg)
          {
            id: 'ws2-a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
            workout_exercise_id: 'we1-a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
            set_number: 2,
            set_type: 'working',
            weight: 100.0,
            reps: 10,
            rir: 2.0,
            completed: true,
            completed_at: '2026-10-08T08:10:00Z',
            created_at: '2026-10-08T08:00:00Z',
          },
          // DB Row 3: Drop set (counted as working load: 75kg x 10 = 750kg)
          {
            id: 'ws3-a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
            workout_exercise_id: 'we1-a1b2c3d4-e5f6-4a5b-8c9d-0123456789ab',
            set_number: 3,
            set_type: 'drop',
            weight: 75.0,
            reps: 10,
            rir: 0.0,
            completed: true,
            completed_at: '2026-10-08T08:15:00Z',
            created_at: '2026-10-08T08:00:00Z',
          },
        ],
      },
    ],
  };

  const sets = realDbWorkout.workout_exercises[0].workout_sets;
  const totals = calculateWorkoutTotals(sets);

  // 1. Warmup (50 * 10 = 500) must be excluded. Working + Drop = 1000 + 750 = 1750.
  assert.strictEqual(totals.totalVolume, 1750, 'totalVolume must exclude the 500kg warmup');
  assert.strictEqual(totals.completedWorkingSets, 2, 'completedWorkingSets must count working + drop sets (2), excluding warmup');
  assert.strictEqual(totals.completedWorkingReps, 20, 'completedWorkingReps must count 10 + 10 = 20, excluding warmup');

  // 2. calculateMuscleExposureAnalytics must also strictly match
  const muscleAnalytics = calculateMuscleExposureAnalytics([realDbWorkout], 'session');
  assert.strictEqual(muscleAnalytics.totalVolume, 1750, 'Muscle exposure volume must match workout totals exactly (1750kg)');
  assert.strictEqual(muscleAnalytics.totalSets, 2, 'Muscle exposure sets count must match working sets (2)');
});

// ============================================================================
// PHASE 6 TEST SUITE: TREND COMPARISONS & HAND CALCULATION MATCH
// ============================================================================
test('calculateRangeTrendComparison matches hand calculation on a small dataset', () => {
  // Test dataset:
  // Period B (Last Month: 2026-09-01 to 2026-09-30):
  // Workout 1 on 2026-09-10: Bench Press 2 sets of 100kg x 10 reps = 2000kg.
  // Workout 2 on 2026-09-20: Bench Press 2 sets of 100kg x 10 reps = 2000kg.
  // Total Period B volume = 4000kg.
  //
  // Period A (This Month: 2026-10-01 to 2026-10-31):
  // Workout 3 on 2026-10-05: Bench Press 2 sets of 100kg x 10 reps = 2000kg.
  // Workout 4 on 2026-10-08: Bench Press 3 sets of 100kg x 10 reps = 3000kg.
  // Total Period A volume = 5000kg.
  //
  // Hand calculation:
  // Volume A = 5000kg
  // Volume B = 4000kg
  // Absolute change = 5000 - 4000 = +1000kg
  // Percentage change = (1000 / 4000) * 100% = +25.0%
  const sampleWorkouts = [
    {
      id: 'w_sep_1',
      status: 'completed',
      completed_at: '2026-09-10T10:00:00Z',
      workout_exercises: [{
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
        ]
      }]
    },
    {
      id: 'w_sep_2',
      status: 'completed',
      completed_at: '2026-09-20T10:00:00Z',
      workout_exercises: [{
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
        ]
      }]
    },
    {
      id: 'w_oct_1',
      status: 'completed',
      completed_at: '2026-10-05T10:00:00Z',
      workout_exercises: [{
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
        ]
      }]
    },
    {
      id: 'w_oct_2',
      status: 'completed',
      completed_at: '2026-10-08T10:00:00Z',
      workout_exercises: [{
        exercise_id: 'ex_barbell_bench_press',
        workout_sets: [
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
          { weight: 100, reps: 10, completed: true, set_type: 'working' },
        ]
      }]
    },
  ];

  const periodA = { startDate: '2026-10-01', endDate: '2026-10-31', label: 'October 2026' };
  const periodB = { startDate: '2026-09-01', endDate: '2026-09-30', label: 'September 2026' };

  // 1. Total Volume comparison
  const totalVolResult = calculateRangeTrendComparison(sampleWorkouts, periodA, periodB, { type: 'total_volume' });
  assert.strictEqual(totalVolResult.hasEnoughData, true);
  assert.strictEqual(totalVolResult.periodA.volume, 5000, 'Period A total volume should be 5000kg');
  assert.strictEqual(totalVolResult.periodB.volume, 4000, 'Period B total volume should be 4000kg');
  assert.strictEqual(totalVolResult.absoluteChange, 1000, 'Absolute change should be +1000kg');
  assert.strictEqual(totalVolResult.percentageChange, 25.0, 'Percentage change should be +25.0%');

  // 2. Specific exercise comparison
  const exResult = calculateRangeTrendComparison(sampleWorkouts, periodA, periodB, {
    type: 'exercise',
    exerciseId: 'ex_barbell_bench_press'
  });
  assert.strictEqual(exResult.hasEnoughData, true);
  assert.strictEqual(exResult.periodA.volume, 5000);
  assert.strictEqual(exResult.periodB.volume, 4000);
  assert.strictEqual(exResult.absoluteChange, 1000);
  assert.strictEqual(exResult.percentageChange, 25.0);

  // 3. Region comparison (chest: bench press sternal head is 60% dynamic chest)
  // Period A chest = 5000 * 0.60 = 3000kg
  // Period B chest = 4000 * 0.60 = 2400kg
  // Abs change = 3000 - 2400 = 600kg
  // Pct change = 600 / 2400 = +25.0%
  const regResult = calculateRangeTrendComparison(sampleWorkouts, periodA, periodB, {
    type: 'region',
    regionId: 'chest'
  });
  assert.strictEqual(regResult.hasEnoughData, true);
  assert.strictEqual(regResult.periodA.volume, 3000);
  assert.strictEqual(regResult.periodB.volume, 2400);
  assert.strictEqual(regResult.absoluteChange, 600);
  assert.strictEqual(regResult.percentageChange, 25.0);

  // 4. Empty comparison period returns hasEnoughData: false with "not enough data"
  const emptyPeriodB = { startDate: '2026-07-01', endDate: '2026-07-31', label: 'July 2026' };
  const emptyResult = calculateRangeTrendComparison(sampleWorkouts, periodA, emptyPeriodB, { type: 'total_volume' });
  assert.strictEqual(emptyResult.hasEnoughData, false);
  assert.strictEqual(emptyResult.percentageChange, null, 'Must NOT invent a number when comparison period is empty');
  assert.strictEqual(emptyResult.absoluteChange, null);
  assert.strictEqual(emptyResult.statusMessage, 'Not enough data in comparison period');
});

// ============================================================================
// PHASE 6 TEST SUITE: CROSS-EXERCISE COMPARISON
// ============================================================================
test('calculateCrossExerciseComparison correctly analyzes two exercises and empty states', () => {
  const workouts = [
    {
      id: 'w_cross_1',
      status: 'completed',
      completed_at: '2026-10-01T10:00:00Z',
      workout_exercises: [
        {
          exercise_id: 'ex_barbell_bench_press',
          workout_sets: [
            // 100kg x 10 reps -> est 1RM = 100 * (1 + 10/30) = 133.3kg, vol = 1000kg
            { weight: 100, reps: 10, completed: true, set_type: 'working' }
          ]
        }
      ]
    },
    {
      id: 'w_cross_2',
      status: 'completed',
      completed_at: '2026-10-05T10:00:00Z',
      workout_exercises: [
        {
          exercise_id: 'ex_barbell_bench_press',
          workout_sets: [
            // 110kg x 5 reps -> est 1RM = 110 * (1 + 5/30) = 128.3kg, vol = 550kg
            { weight: 110, reps: 5, completed: true, set_type: 'working' }
          ]
        },
        {
          exercise_id: 'ex_barbell_deadlift',
          workout_sets: [
            // 150kg x 5 reps -> est 1RM = 150 * (1 + 5/30) = 175kg, vol = 750kg
            { weight: 150, reps: 5, completed: true, set_type: 'working' }
          ]
        }
      ]
    }
  ];

  // 1. Both have data: Bench vs Deadlift
  const comparisonBoth = calculateCrossExerciseComparison(
    workouts,
    'ex_barbell_bench_press',
    'ex_barbell_deadlift',
    'all'
  );
  assert.strictEqual(comparisonBoth.exerciseA.hasData, true);
  assert.strictEqual(comparisonBoth.exerciseB.hasData, true);
  assert.strictEqual(comparisonBoth.hasDataBoth, true);
  assert.strictEqual(comparisonBoth.exerciseA.points.length, 2);
  assert.strictEqual(comparisonBoth.exerciseB.points.length, 1);
  assert.strictEqual(comparisonBoth.exerciseA.best1RM, 133.33);
  assert.strictEqual(comparisonBoth.exerciseB.best1RM, 175);

  // 2. Empty state when one exercise has no history: Bench vs Incline Dumbbell Press (no data)
  const comparisonOneEmpty = calculateCrossExerciseComparison(
    workouts,
    'ex_barbell_bench_press',
    'ex_dumbbell_incline_press',
    'all'
  );
  assert.strictEqual(comparisonOneEmpty.exerciseA.hasData, true);
  assert.strictEqual(comparisonOneEmpty.exerciseB.hasData, false);
  assert.strictEqual(comparisonOneEmpty.hasDataBoth, false);
  assert.strictEqual(comparisonOneEmpty.hasDataAtLeastOne, true);
  assert.ok(
    comparisonOneEmpty.statusMessage.includes('has no logged workout history yet'),
    'Should inform the user that exercise B has no logged workout history'
  );
});

// ============================================================================
// PHASE 6 TEST SUITE: CSV EXPORT FORMAT & RFC 4180 COMPLIANCE
// ============================================================================
test('generateWorkoutsCsv, generateBodyweightCsv, and generateStepsCsv generate RFC 4180 valid CSVs', () => {
  // Workouts CSV
  const workouts = [
    {
      id: 'w_csv_1',
      status: 'completed',
      completed_at: '2026-10-07T14:30:00Z',
      name: 'Push "A", Hypertrophy', // Contains quotes and comma! Must escape!
      workout_exercises: [
        {
          exercise_id: 'ex_barbell_bench_press',
          workout_sets: [
            { weight: 50, reps: 10, completed: true, set_type: 'warmup' },
            { weight: 100, reps: 10, completed: true, set_type: 'working' },
          ]
        }
      ]
    }
  ];

  const workoutsCsv = generateWorkoutsCsv(workouts);
  assert.ok(workoutsCsv.startsWith('\uFEFF'), 'Workouts CSV must start with UTF-8 BOM for Excel');
  const lines = workoutsCsv.replace('\uFEFF', '').split('\r\n');
  assert.strictEqual(lines[0], 'Date,Workout,Exercise,Set Type,Weight,Reps,Volume,Estimated 1RM');
  
  // Row 1: Warmup set
  assert.ok(lines[1].includes('"Push ""A"", Hypertrophy"'), 'Must escape title with quotes and comma');
  assert.ok(lines[1].includes('warmup,50,10,0,0'), 'Warmup set must output 0 volume and 0 1RM');

  // Row 2: Working set (100kg x 10 reps -> 1000 volume, 133.33 1RM)
  assert.ok(lines[2].includes('working,100,10,1000,133.33'), 'Working set must match authoritative volume and 1RM');

  // Bodyweight CSV
  const bwEntries: BodyweightEntryRow[] = [
    {
      id: 'bw_csv_1',
      user_id: 'u1',
      date: '2026-10-07',
      weight: 81.5,
      unit: 'kg',
      notes: 'Post-workout, fasted',
      source: 'manual',
      created_at: '2026-10-07T08:00:00Z',
      updated_at: '2026-10-07T08:00:00Z',
    }
  ];
  const bwCsv = generateBodyweightCsv(bwEntries);
  assert.ok(bwCsv.startsWith('\uFEFF'));
  const bwLines = bwCsv.replace('\uFEFF', '').split('\r\n');
  assert.strictEqual(bwLines[0], 'Date,Weight,Unit,Notes,Source');
  assert.ok(bwLines[1].includes('2026-10-07,81.5,kg,"Post-workout, fasted",manual'));

  // Steps CSV (Reconciled to real step_entries schema: Date, Steps, Goal, Source)
  const stepsCsv = generateStepsCsv([
    { date: '2026-10-07', step_count: 10500, goal: 10000, source: 'manual' }
  ]);
  assert.ok(stepsCsv.startsWith('\uFEFF'));
  const stepLines = stepsCsv.replace('\uFEFF', '').split('\r\n');
  assert.strictEqual(stepLines[0], 'Date,Steps,Goal,Source');
  assert.ok(stepLines[1].includes('2026-10-07,10500,10000,manual'));
});

test('CSV export precision: 61.235 kg set exports with 4-decimal weight and 2-decimal volume and 1RM', () => {
  const workouts = [
    {
      id: 'w_precision_1',
      status: 'completed',
      completed_at: '2026-10-12T10:00:00Z',
      name: 'Bench Session',
      workout_exercises: [
        {
          exercise_id: 'ex_barbell_bench_press',
          workout_sets: [
            { weight: 61.235, reps: 10, completed: true, set_type: 'working' },
          ],
        },
      ],
    },
  ];

  // 1. Canonical kg export (default without unit preference)
  const csvKg = generateWorkoutsCsv(workouts);
  const linesKg = csvKg.replace('\uFEFF', '').split('\r\n');
  assert.ok(
    linesKg[1].includes('working,61.235,10,612.35,81.65'),
    `Canonical kg CSV must keep exact 61.235 weight, 612.35 volume, and 81.65 1RM. Got: ${linesKg[1]}`
  );

  // 2. Explicit kg preference export
  const csvExplicitKg = generateWorkoutsCsv(workouts, 'kg');
  const linesExplicitKg = csvExplicitKg.replace('\uFEFF', '').split('\r\n');
  assert.strictEqual(linesExplicitKg[0], 'Date,Workout,Exercise,Set Type,Weight (kg),Reps,Volume (kg),Estimated 1RM (kg)');
  assert.ok(
    linesExplicitKg[1].includes('working,61.235,10,612.35,81.65'),
    `Explicit kg CSV must keep exact 61.235 weight, 612.35 volume, and 81.65 1RM. Got: ${linesExplicitKg[1]}`
  );

  // 3. Lbs preference export (2 decimals)
  const csvLbs = generateWorkoutsCsv(workouts, 'lbs');
  const linesLbs = csvLbs.replace('\uFEFF', '').split('\r\n');
  assert.strictEqual(linesLbs[0], 'Date,Workout,Exercise,Set Type,Weight (lbs),Reps,Volume (lbs),Estimated 1RM (lbs)');
  assert.ok(
    linesLbs[1].includes('working,135,10,1350,180.01'),
    `Lbs CSV must format weight to 2 decimals (135), volume to 2 decimals (1350), and 1RM to 2 decimals (180.01). Got: ${linesLbs[1]}`
  );

  // 4. Bodyweight CSV precision test with 61.235 kg
  const bwEntries: BodyweightEntryRow[] = [
    {
      id: 'bw_1',
      user_id: 'u1',
      date: '2026-10-12',
      weight: 61.235,
      unit: 'kg',
      notes: null,
      source: 'manual',
      created_at: '2026-10-12T08:00:00Z',
      updated_at: '2026-10-12T08:00:00Z',
    },
  ];
  const bwCsvKg = generateBodyweightCsv(bwEntries);
  const bwLinesKg = bwCsvKg.replace('\uFEFF', '').split('\r\n');
  assert.ok(bwLinesKg[1].includes('2026-10-12,61.235,kg,,manual'), `Bodyweight kg CSV must retain 61.235`);

  const bwCsvLbs = generateBodyweightCsv(bwEntries, 'lbs');
  const bwLinesLbs = bwCsvLbs.replace('\uFEFF', '').split('\r\n');
  assert.ok(bwLinesLbs[1].includes('2026-10-12,135,lbs,,manual'), `Bodyweight lbs CSV must format to 2 decimals (135)`);
});

