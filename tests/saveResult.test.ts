import test from 'node:test';
import assert from 'node:assert/strict';
import {
  unwrapSaveResult,
  formatSavedExercises,
  buildCompleteResponse,
  buildUpdateResponse,
} from '../src/lib/saveResult.ts';
import { buildSaveWorkoutArgs } from '../src/lib/workoutSaveArgs.ts';

// Sample JSON returned by save_workout_session SQL function
const sampleRpcData = {
  workout: {
    id: 'w-100',
    user_id: 'u-1',
    name: 'Push Hypertrophy',
    status: 'completed',
    started_at: '2026-11-01T10:00:00Z',
    completed_at: '2026-11-01T11:00:00Z',
    duration_seconds: 3600,
    total_volume: 12500,
    notes: 'Great workout',
  },
  already_completed: false,
  exercises: [
    {
      id: 'we-1',
      workout_id: 'w-100',
      exercise_id: 'ex_bench',
      order_index: 0,
      notes: 'Flat bench',
      rest_timer_seconds: 90,
      sets: [
        { id: 's-3', set_number: 3, set_type: 'working', weight: 100, reps: 5, completed: true },
        { id: 's-1', set_number: 1, set_type: 'working', weight: 80, reps: 10, completed: true },
        { id: 's-2', set_number: 2, set_type: 'working', weight: 90, reps: 8, completed: true },
      ],
    },
  ],
};

// ============================================================================
// 4a: unwrapSaveResult returns three parts and throws on invalid inputs
// ============================================================================
test('4a: unwrapSaveResult returns the three parts; throws on null, non-object, and missing workout', () => {
  const unwrapped = unwrapSaveResult(sampleRpcData);
  assert.strictEqual(unwrapped.workout, sampleRpcData.workout);
  assert.strictEqual(unwrapped.exercises, sampleRpcData.exercises);
  assert.strictEqual(unwrapped.alreadyCompleted, false);

  // Throws on null
  assert.throws(
    () => unwrapSaveResult(null),
    /Invalid save result: expected an object/
  );

  // Throws on non-object
  assert.throws(
    () => unwrapSaveResult('non-object'),
    /Invalid save result: expected an object/
  );
  assert.throws(
    () => unwrapSaveResult([1, 2, 3]),
    /Invalid save result: expected an object/
  );

  // Throws on object without workout
  assert.throws(
    () => unwrapSaveResult({ exercises: [], already_completed: false }),
    /Invalid save result: missing workout object/
  );
});

// ============================================================================
// 4b: buildCompleteResponse has volume, duration, name at top level of workout without nested workout key
// ============================================================================
test('4b: buildCompleteResponse workout has total_volume, duration_seconds, name at top level and NO nested workout key', () => {
  const fakePRs = [{ id: 'pr-1', workout_id: 'w-100', category: 'heaviest_weight', value: 100 }];
  const response = buildCompleteResponse(sampleRpcData, fakePRs);

  // Regression check: metrics must be top-level properties on workout
  assert.strictEqual(response.workout.total_volume, 12500);
  assert.strictEqual(response.workout.duration_seconds, 3600);
  assert.strictEqual(response.workout.name, 'Push Hypertrophy');
  assert.strictEqual(response.workout.completed_at, '2026-11-01T11:00:00Z');

  // Verify workout is not nested inside workout
  assert.strictEqual('workout' in response.workout, false);
  assert.deepStrictEqual(response.newPRs, fakePRs);
});

// ============================================================================
// 4c: buildUpdateResponse has workout fields at top level and sorted exercises with exerciseName
// ============================================================================
test('4c: buildUpdateResponse has id, status, total_volume at top level and sorted exercises array with exerciseName fallback', () => {
  const exerciseMap = new Map([
    ['ex_bench', { name: 'Barbell Bench Press', targetRegionId: 'chest' }],
  ]);

  const rpcDataMulti = {
    ...sampleRpcData,
    exercises: [
      sampleRpcData.exercises[0],
      {
        id: 'we-2',
        workout_id: 'w-100',
        exercise_id: 'ex_custom_unknown',
        order_index: 1,
        notes: '',
        rest_timer_seconds: 60,
        sets: [
          { id: 's-4', set_number: 1, set_type: 'working', weight: 50, reps: 10, completed: true },
        ],
      },
    ],
  };

  const updated = buildUpdateResponse(rpcDataMulti, exerciseMap);

  assert.strictEqual(updated.id, 'w-100');
  assert.strictEqual(updated.status, 'completed');
  assert.strictEqual(updated.total_volume, 12500);
  assert.strictEqual(updated.exercises.length, 2);

  // Mapped exercise
  assert.strictEqual(updated.exercises[0].exerciseName, 'Barbell Bench Press');
  assert.strictEqual(updated.exercises[0].exerciseTargetRegion, 'chest');
  assert.strictEqual(updated.exercises[0].sets[0].set_number, 1);
  assert.strictEqual(updated.exercises[0].sets[1].set_number, 2);
  assert.strictEqual(updated.exercises[0].sets[2].set_number, 3);

  // Missing map entry falls back to raw exercise_id and empty target region
  assert.strictEqual(updated.exercises[1].exerciseName, 'ex_custom_unknown');
  assert.strictEqual(updated.exercises[1].exerciseTargetRegion, '');
});

// ============================================================================
// 4d: formatSavedExercises sorts sets 3,1,2 into 1,2,3 and does not mutate its input
// ============================================================================
test('4d: formatSavedExercises sorts sets 3,1,2 into 1,2,3 and does not mutate its input', () => {
  const rawSets = [
    { set_number: 3, weight: 100 },
    { set_number: 1, weight: 80 },
    { set_number: 2, weight: 90 },
  ];
  const inputExercises = [
    {
      id: 'we-1',
      exercise_id: 'ex_bench',
      sets: rawSets,
    },
  ];

  const formatted = formatSavedExercises(inputExercises);

  assert.strictEqual(formatted[0].sets[0].set_number, 1);
  assert.strictEqual(formatted[0].sets[1].set_number, 2);
  assert.strictEqual(formatted[0].sets[2].set_number, 3);

  // Input array was not mutated
  assert.strictEqual(rawSets[0].set_number, 3);
  assert.strictEqual(rawSets[1].set_number, 1);
  assert.strictEqual(rawSets[2].set_number, 2);
});

// ============================================================================
// 4e: empty-array rule computes volume 0 and p_exercises is [], undefined omits p_exercises
// ============================================================================
test('4e: empty-array rule: with exercises = [] computes volume 0 and p_exercises is [], with undefined no p_exercises exists', () => {
  const argsEmpty = buildSaveWorkoutArgs('w-empty', { exercises: [] });
  assert.strictEqual(argsEmpty.p_total_volume, 0);
  assert.deepStrictEqual(argsEmpty.p_exercises, []);

  const argsUndefined = buildSaveWorkoutArgs('w-undef', {});
  assert.strictEqual('p_exercises' in argsUndefined, false);
  assert.strictEqual('p_total_volume' in argsUndefined, false);
});
