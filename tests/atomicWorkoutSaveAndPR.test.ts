import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSaveWorkoutArgs } from '../src/lib/workoutSaveArgs.ts';
import { reconcileUserPRs } from '../src/lib/prReconcile.ts';
import { calculateHistoricalPRs } from '../src/lib/calculations.ts';
import { deleteWorkoutAndReconcile } from '../src/lib/workoutDeleteHelper.ts';

// Helper to create a controllable mock Supabase client for unit testing
function createMockSupabaseClient({
  workouts = [] as any[],
  workoutsError = null as any,
  rpcData = [] as any[],
  rpcError = null as any,
  onRpcCall = (_name: string, _args: any) => {},
} = {}) {
  return {
    from: (table: string) => {
      assert.strictEqual(table, 'workouts');
      const queryObj: any = {
        select: () => queryObj,
        eq: () => queryObj,
        order: () => Promise.resolve({ data: workouts, error: workoutsError }),
      };
      return queryObj;
    },
    rpc: (name: string, args: any) => {
      onRpcCall(name, args);
      return Promise.resolve({ data: rpcData, error: rpcError });
    },
  };
}

// ============================================================================
// 6a: buildSaveWorkoutArgs Tests
// ============================================================================
test('6a: buildSaveWorkoutArgs omits undefined fields', () => {
  const args = buildSaveWorkoutArgs('w-123', {});
  assert.strictEqual(args.p_workout_id, 'w-123');
  assert.strictEqual('p_name' in args, false);
  assert.strictEqual('p_duration_seconds' in args, false);
  assert.strictEqual('p_notes' in args, false);
  assert.strictEqual('p_exercises' in args, false);
  assert.strictEqual('p_complete' in args, false);
  assert.strictEqual('p_total_volume' in args, false);
});

test('6a: buildSaveWorkoutArgs passes body.exercises untouched and calculates totalVolume correctly', () => {
  const body = {
    name: 'Chest Day',
    durationSeconds: 3600,
    notes: 'Felt strong',
    exercises: [
      {
        exercise_id: 'ex_bench',
        notes: 'Pauses at chest',
        rest_timer_seconds: 90,
        sets: [
          { weight: 50, reps: 10, completed: true, set_type: 'warmup' }, // Warmup: 0 volume
          { weight: 100, reps: 5, completed: true, set_type: 'working' }, // 500
          { weight: 100, reps: 5, completed: false, set_type: 'working' }, // Incomplete: 0 volume
          { weight: 120, reps: 3, completed: true, set_type: 'working' }, // 360
        ],
      },
    ],
  };

  const args = buildSaveWorkoutArgs('w-456', body, { complete: true });

  assert.strictEqual(args.p_workout_id, 'w-456');
  assert.strictEqual(args.p_name, 'Chest Day');
  assert.strictEqual(args.p_duration_seconds, 3600);
  assert.strictEqual(args.p_notes, 'Felt strong');
  assert.strictEqual(args.p_complete, true);
  // Total volume: 500 + 360 = 860
  assert.strictEqual(args.p_total_volume, 860);
  // Exercises passed through untouched
  assert.strictEqual(args.p_exercises, body.exercises);
});

test('6a: buildSaveWorkoutArgs respects complete option and totalVolume passed directly', () => {
  const argsInProgress = buildSaveWorkoutArgs('w-789', { totalVolume: 1250 }, { complete: false });
  assert.strictEqual(argsInProgress.p_complete, false);
  assert.strictEqual(argsInProgress.p_total_volume, 1250);
});

// ============================================================================
// 6b: reconcileUserPRs calls replace_user_personal_records
// ============================================================================
test('6b: reconcileUserPRs calls replace_user_personal_records with p_exercise_id and formatted rows', async () => {
  const mockWorkouts = [
    {
      id: 'w-1',
      started_at: '2026-11-01T10:00:00Z',
      completed_at: '2026-11-01T11:00:00Z',
      workout_exercises: [
        {
          id: 'we-1',
          exercise_id: 'ex_bench',
          workout_sets: [
            {
              id: 'ws-1',
              set_number: 1,
              set_type: 'working',
              weight: 100,
              reps: 5,
              completed: true,
              completed_at: '2026-11-01T10:15:00Z',
            },
          ],
        },
      ],
    },
  ];

  let capturedRpcName = '';
  let capturedRpcArgs: any = null;

  const fakePRRows = [
    { id: 'pr-1', category: 'heaviest_weight', value: 100, exercise_id: 'ex_bench', workout_id: 'w-1' },
  ];

  const client = createMockSupabaseClient({
    workouts: mockWorkouts,
    rpcData: fakePRRows,
    onRpcCall: (name, args) => {
      capturedRpcName = name;
      capturedRpcArgs = args;
    },
  });

  const result = await reconcileUserPRs(client, 'user-abc', 'ex_bench');

  assert.strictEqual(capturedRpcName, 'replace_user_personal_records');
  assert.strictEqual(capturedRpcArgs.p_exercise_id, 'ex_bench');
  assert.ok(Array.isArray(capturedRpcArgs.p_rows));
  assert.ok(capturedRpcArgs.p_rows.length > 0);
  assert.strictEqual(capturedRpcArgs.p_rows[0].exercise_id, 'ex_bench');
  assert.strictEqual(capturedRpcArgs.p_rows[0].user_id, 'user-abc');
  assert.strictEqual(result, fakePRRows);
});

// ============================================================================
// 6c: reconcileUserPRs throws on failures
// ============================================================================
test('6c: reconcileUserPRs throws when workouts fetch fails', async () => {
  const client = createMockSupabaseClient({
    workoutsError: { message: 'Database query timeout' },
  });

  await assert.rejects(
    async () => {
      await reconcileUserPRs(client, 'user-abc');
    },
    {
      name: 'Error',
      message: /Failed to fetch completed workouts: Database query timeout/,
    }
  );
});

test('6c: reconcileUserPRs throws when RPC execution fails', async () => {
  const client = createMockSupabaseClient({
    workouts: [],
    rpcError: { message: 'RPC function replace_user_personal_records raised an error' },
  });

  await assert.rejects(
    async () => {
      await reconcileUserPRs(client, 'user-abc');
    },
    {
      name: 'Error',
      message: /Failed to replace personal records: RPC function replace_user_personal_records raised an error/,
    }
  );
});

// ============================================================================
// 6d: reconcileUserPRs calls RPC even when rows array is empty
// ============================================================================
test('6d: reconcileUserPRs calls RPC even when rows array is empty', async () => {
  let capturedRpcArgs: any = null;

  const client = createMockSupabaseClient({
    workouts: [], // No completed workouts
    rpcData: [],
    onRpcCall: (_name, args) => {
      capturedRpcArgs = args;
    },
  });

  const result = await reconcileUserPRs(client, 'user-abc');

  assert.ok(capturedRpcArgs !== null);
  assert.strictEqual(capturedRpcArgs.p_exercise_id, null);
  assert.deepStrictEqual(capturedRpcArgs.p_rows, []);
  assert.deepStrictEqual(result, []);
});

// ============================================================================
// 5a: reconcile rows deep-equal calculateHistoricalPRs for two-workout fixture
// ============================================================================
test('5a: reconcile passes rows deep-equal to calculateHistoricalPRs for two workouts where workout 2 beats workout 1', async () => {
  const mockWorkouts = [
    {
      id: 'w-1',
      started_at: '2026-11-01T10:00:00Z',
      completed_at: '2026-11-01T11:00:00Z',
      workout_exercises: [
        {
          id: 'we-1',
          exercise_id: 'ex_bench',
          workout_sets: [
            {
              id: 'ws-1',
              set_number: 1,
              set_type: 'working',
              weight: 100,
              reps: 5,
              completed: true,
              completed_at: '2026-11-01T10:15:00Z',
            },
          ],
        },
      ],
    },
    {
      id: 'w-2',
      started_at: '2026-11-02T10:00:00Z',
      completed_at: '2026-11-02T11:00:00Z',
      workout_exercises: [
        {
          id: 'we-2',
          exercise_id: 'ex_bench',
          workout_sets: [
            {
              id: 'ws-2',
              set_number: 1,
              set_type: 'working',
              weight: 120,
              reps: 6,
              completed: true,
              completed_at: '2026-11-02T10:15:00Z',
            },
          ],
        },
      ],
    },
  ];

  let capturedRpcArgs: any = null;
  const client = createMockSupabaseClient({
    workouts: mockWorkouts,
    onRpcCall: (_name, args) => {
      capturedRpcArgs = args;
    },
  });

  // Calculate expected rows with real calculation engine
  const candidateSets = [
    {
      workoutId: 'w-1',
      setId: 'ws-1',
      weight: 100,
      reps: 5,
      achievedAt: '2026-11-01T10:15:00Z',
    },
    {
      workoutId: 'w-2',
      setId: 'ws-2',
      weight: 120,
      reps: 6,
      achievedAt: '2026-11-02T10:15:00Z',
    },
  ];
  const expectedPRs = calculateHistoricalPRs(candidateSets, 'ex_bench', 'user-abc');

  await reconcileUserPRs(client, 'user-abc');

  assert.ok(capturedRpcArgs !== null);
  assert.deepStrictEqual(capturedRpcArgs.p_rows, expectedPRs);
});

// ============================================================================
// 5b: reconcile with targetExerciseId passes p_exercise_id and only processes target exercise
// ============================================================================
test('5b: reconcile with targetExerciseId passes p_exercise_id and only processes target exercise', async () => {
  const mockWorkouts = [
    {
      id: 'w-1',
      started_at: '2026-11-01T10:00:00Z',
      completed_at: '2026-11-01T11:00:00Z',
      workout_exercises: [
        {
          id: 'we-1',
          exercise_id: 'ex_bench',
          workout_sets: [
            { id: 'ws-1', set_number: 1, set_type: 'working', weight: 100, reps: 5, completed: true, completed_at: '2026-11-01T10:15:00Z' },
          ],
        },
        {
          id: 'we-2',
          exercise_id: 'ex_squat',
          workout_sets: [
            { id: 'ws-2', set_number: 1, set_type: 'working', weight: 140, reps: 5, completed: true, completed_at: '2026-11-01T10:30:00Z' },
          ],
        },
      ],
    },
  ];

  let capturedRpcArgs: any = null;
  const client = createMockSupabaseClient({
    workouts: mockWorkouts,
    onRpcCall: (_name, args) => {
      capturedRpcArgs = args;
    },
  });

  await reconcileUserPRs(client, 'user-abc', 'ex_bench');

  assert.ok(capturedRpcArgs !== null);
  assert.strictEqual(capturedRpcArgs.p_exercise_id, 'ex_bench');
  assert.ok(capturedRpcArgs.p_rows.length > 0);
  assert.ok(capturedRpcArgs.p_rows.every((r: any) => r.exercise_id === 'ex_bench'));
  assert.ok(capturedRpcArgs.p_rows.every((r: any) => r.exercise_id !== 'ex_squat'));
});

// ============================================================================
// 5c: buildSaveWorkoutArgs passes exercises as identical reference without transformation
// ============================================================================
test('5c: buildSaveWorkoutArgs passes exercises as identical reference without transformation', () => {
  const inputExercises = [
    {
      exercise_id: 'ex_deadlift',
      order_index: 0,
      notes: 'Heavy pulls',
      rest_timer_seconds: 120,
      sets: [
        { set_number: 1, set_type: 'working', weight: 180, reps: 5, completed: true },
      ],
    },
  ];

  const args = buildSaveWorkoutArgs('w-789', { exercises: inputExercises });
  assert.strictEqual(args.p_exercises, inputExercises);
  assert.deepStrictEqual(args.p_exercises, inputExercises);
  assert.strictEqual(args.p_total_volume, 900);
});

// ============================================================================
// 5d: deleteWorkoutAndReconcile helper resilient on reconcile failure and propagates delete failure
// ============================================================================
test('5d: deleteWorkoutAndReconcile returns prsStale true when reconcile throws, and returns 500 when delete fails', async () => {
  // Case 1: Delete succeeds, reconcile throws -> returns 200 with prsStale: true
  const mockDeleteClientSuccess = {
    from: (table: string) => {
      assert.strictEqual(table, 'workouts');
      return {
        delete: () => ({
          eq: (_f1: string, _v1: any) => ({
            eq: (_f2: string, _v2: any) => Promise.resolve({ error: null }),
          }),
        }),
      };
    },
  };

  const failingReconcile = async () => {
    throw new Error('Database PR reconciliation timeout');
  };

  const outcomeStale = await deleteWorkoutAndReconcile(
    mockDeleteClientSuccess,
    'user-abc',
    'w-to-delete',
    failingReconcile
  );

  assert.strictEqual(outcomeStale.status, 200);
  assert.deepStrictEqual(outcomeStale.data, {
    success: true,
    deletedId: 'w-to-delete',
    prsStale: true,
  });

  // Case 2: Delete itself fails -> returns 500
  const mockDeleteClientFailure = {
    from: (table: string) => {
      assert.strictEqual(table, 'workouts');
      return {
        delete: () => ({
          eq: (_f1: string, _v1: any) => ({
            eq: (_f2: string, _v2: any) => Promise.resolve({ error: { message: 'Database constraint violation' } }),
          }),
        }),
      };
    },
  };

  const dummyReconcile = async () => [];

  const outcomeError = await deleteWorkoutAndReconcile(
    mockDeleteClientFailure,
    'user-abc',
    'w-failed',
    dummyReconcile
  );

  assert.strictEqual(outcomeError.status, 500);
  assert.match(outcomeError.error || '', /Database constraint violation/);
});
