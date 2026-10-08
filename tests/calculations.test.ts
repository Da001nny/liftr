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
