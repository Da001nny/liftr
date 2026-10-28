import test from 'node:test';
import assert from 'node:assert/strict';
import { NotifierStore, Clock, clear, getToasts } from '../src/lib/notifier';
import { 
  classifyFailure, 
  categoryToKey, 
  reportFailure, 
  ACTION_KEY_MAP, 
  SupportedActionKey, 
  FailureCategory 
} from '../src/lib/failure';
import { completeWorkoutSession } from '../src/lib/workoutService';
import { fetchAllCompletedWorkouts } from '../src/lib/progressService';
import { performWorkoutsExport } from '../src/components/progress/ExportDataCenterSection';
import { decideFinishOutcome, resolveRepeatCompletion, selectPRsForWorkout } from '../src/lib/finishOutcome';
import { t } from '../src/i18n';

class MockClock implements Clock {
  public currentTime = 10000;
  private timerIdCounter = 0;
  public timers = new Map<number, { fn: () => void; triggerAt: number }>();

  constructor(initialTime = 10000) {
    this.currentTime = initialTime;
  }

  now(): number {
    return this.currentTime;
  }

  setTimeout(fn: () => void, ms: number): number {
    this.timerIdCounter += 1;
    const id = this.timerIdCounter;
    this.timers.set(id, { fn, triggerAt: this.currentTime + ms });
    return id;
  }

  clearTimeout(id: unknown): void {
    this.timers.delete(id as number);
  }

  advance(ms: number): void {
    this.currentTime += ms;
    // Execute all timers that should fire by new currentTime in chronological order
    const dueTimers = Array.from(this.timers.entries())
      .filter(([_, timer]) => timer.triggerAt <= this.currentTime)
      .sort((a, b) => a[1].triggerAt - b[1].triggerAt);

    for (const [id, timer] of dueTimers) {
      if (this.timers.has(id)) {
        this.timers.delete(id);
        timer.fn();
      }
    }
  }
}

test('Failure: classifyFailure categorizes statuses and network errors accurately', () => {
  assert.strictEqual(classifyFailure({ status: 401 }), 'auth');
  assert.strictEqual(classifyFailure({ status: 403 }), 'auth');
  assert.strictEqual(classifyFailure({ status: 404 }), 'notFound');
  assert.strictEqual(classifyFailure({ status: 500 }), 'server');
  assert.strictEqual(classifyFailure({ status: 502 }), 'server');
  assert.strictEqual(classifyFailure({ status: 503 }), 'server');
  assert.strictEqual(classifyFailure({ networkError: true }), 'network');
  assert.strictEqual(classifyFailure({ status: 400 }), 'other');
  assert.strictEqual(classifyFailure({ status: 422 }), 'other');
  assert.strictEqual(classifyFailure(undefined), 'other');

  assert.strictEqual(categoryToKey('auth'), 'errors.unauthorized');
  assert.strictEqual(categoryToKey('notFound'), 'errors.notFound');
  assert.strictEqual(categoryToKey('server'), 'errors.serverError');
  assert.strictEqual(categoryToKey('network'), 'errors.networkError');
  assert.strictEqual(categoryToKey('other'), 'errors.generic');
});

test('NotifierStore: deduplication ignores same key within 4 seconds', () => {
  const clock = new MockClock();
  const notifier = new NotifierStore(clock);

  const id1 = notifier.notify({ kind: 'error', key: 'errors.actions.completeWorkout' });
  assert.ok(id1 !== null, 'First notification should succeed');
  assert.strictEqual(notifier.getToasts().length, 1);

  // Immediate repeat: ignored
  const id2 = notifier.notify({ kind: 'error', key: 'errors.actions.completeWorkout' });
  assert.strictEqual(id2, null, 'Duplicate within 4 seconds should be ignored');
  assert.strictEqual(notifier.getToasts().length, 1);

  // Advance clock by 3999ms: still ignored
  clock.advance(3999);
  const id3 = notifier.notify({ kind: 'error', key: 'errors.actions.completeWorkout' });
  assert.strictEqual(id3, null, 'Duplicate at 3999ms should be ignored');
  assert.strictEqual(notifier.getToasts().length, 1);

  // Advance clock past 4000ms: succeeds
  clock.advance(2); // total +4001ms
  const id4 = notifier.notify({ kind: 'error', key: 'errors.actions.completeWorkout' });
  assert.ok(id4 !== null, 'Notification after 4 seconds should be accepted');
  assert.strictEqual(notifier.getToasts().length, 2);
});

test('NotifierStore: at most 3 toasts displayed at once (oldest dropped)', () => {
  const clock = new MockClock();
  const notifier = new NotifierStore(clock);

  notifier.notify({ kind: 'info', key: 'common.loading' });
  clock.advance(10);
  notifier.notify({ kind: 'success', key: 'common.saved' });
  clock.advance(10);
  notifier.notify({ kind: 'error', key: 'errors.actions.saveSteps' });

  assert.strictEqual(notifier.getToasts().length, 3);
  assert.strictEqual(notifier.getToasts()[0].key, 'common.loading');

  // Push 4th toast: oldest ('common.loading') is dropped
  clock.advance(10);
  notifier.notify({ kind: 'error', key: 'errors.actions.saveBodyweight' });

  const toasts = notifier.getToasts();
  assert.strictEqual(toasts.length, 3);
  assert.strictEqual(toasts[0].key, 'common.saved');
  assert.strictEqual(toasts[1].key, 'errors.actions.saveSteps');
  assert.strictEqual(toasts[2].key, 'errors.actions.saveBodyweight');
});

test('NotifierStore: errors auto-dismiss after 7s and others after 4s', () => {
  const clock = new MockClock();
  const notifier = new NotifierStore(clock);

  notifier.notify({ kind: 'info', key: 'common.saved' });
  clock.advance(10);
  notifier.notify({ kind: 'error', key: 'errors.actions.createWorkout' });

  assert.strictEqual(notifier.getToasts().length, 2);

  // Advance 3500ms: info toast (due at +4000ms) has not yet fired
  clock.advance(3500);
  assert.strictEqual(notifier.getToasts().length, 2);

  // Advance another 600ms (total 4110ms): info toast has fired and dismissed
  clock.advance(600);
  assert.strictEqual(notifier.getToasts().length, 1);
  assert.strictEqual(notifier.getToasts()[0].kind, 'error');

  // Advance to 7010ms from error toast -> error auto-dismisses
  clock.advance(3000);
  assert.strictEqual(notifier.getToasts().length, 0);
});

test('NotifierStore: manual dismiss removes toast and unsubscribe detaches listener', () => {
  const clock = new MockClock();
  const notifier = new NotifierStore(clock);

  let subscriberCalls = 0;
  let lastToastCount = 0;
  const unsubscribe = notifier.subscribe(toasts => {
    subscriberCalls += 1;
    lastToastCount = toasts.length;
  });

  const id = notifier.notify({ kind: 'error', key: 'errors.actions.exportData' });
  assert.strictEqual(lastToastCount, 1);

  notifier.dismiss(id!);
  assert.strictEqual(lastToastCount, 0);

  // Unsubscribe
  unsubscribe();
  const previousCalls = subscriberCalls;
  notifier.notify({ kind: 'success', key: 'common.saved' });
  assert.strictEqual(subscriberCalls, previousCalls, 'Listener should not be called after unsubscribe');
});

test('Batch 3B-3 6a: completeWorkoutSession handles 500, rejection, and 200 properly', async () => {
  const originalFetch = globalThis.fetch;
  try {
    // 1. 500 Error
    clear();
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    const res500 = await completeWorkoutSession('test_token', 'w1', { durationSeconds: 120 });
    assert.strictEqual(res500, null);
    const toasts500 = getToasts();
    assert.strictEqual(toasts500.length, 1);
    assert.strictEqual(toasts500[0].key, 'errors.actions.completeWorkout');
    assert.strictEqual(toasts500[0].categoryKey, 'errors.serverError');

    // 2. Rejecting Fetch (Network Error)
    clear();
    globalThis.fetch = async () => { throw new Error('Network offline'); };
    const resNet = await completeWorkoutSession('test_token', 'w1', { durationSeconds: 120 });
    assert.strictEqual(resNet, null);
    const toastsNet = getToasts();
    assert.strictEqual(toastsNet.length, 1);
    assert.strictEqual(toastsNet[0].key, 'errors.actions.completeWorkout');
    assert.strictEqual(toastsNet[0].categoryKey, 'errors.networkError');

    // 3. 200 Success
    clear();
    globalThis.fetch = async () => new Response(JSON.stringify({ data: { items: [{ workout: { id: 'w1' }, newPRs: [] }] } }), { status: 200 });
    const res200 = await completeWorkoutSession('test_token', 'w1', { durationSeconds: 120 });
    assert.ok(res200 !== null);
    const toasts200 = getToasts();
    assert.strictEqual(toasts200.length, 0, 'Success emits no toasts');
  } finally {
    globalThis.fetch = originalFetch;
    clear();
  }
});

test('Batch 3B-3 6b: fetchAllCompletedWorkouts failure returns result and emits NO toast; empty success returns []', async () => {
  const originalFetch = globalThis.fetch;
  try {
    clear();
    // 500 Server error
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'fail' }), { status: 500 });
    const failRes = await fetchAllCompletedWorkouts('test_token');
    assert.strictEqual(failRes.data, null);
    assert.strictEqual(failRes.status, 500);
    assert.strictEqual(getToasts().length, 0, 'fetchAllCompletedWorkouts must emit NO toast on failure');

    // Rejection / Network error
    globalThis.fetch = async () => { throw new Error('Offline'); };
    const netRes = await fetchAllCompletedWorkouts('test_token');
    assert.strictEqual(netRes.data, null);
    assert.strictEqual(netRes.networkError, true);
    assert.strictEqual(getToasts().length, 0, 'fetchAllCompletedWorkouts must emit NO toast on network error');

    // Empty success (200 OK with empty items)
    globalThis.fetch = async () => new Response(JSON.stringify({ data: { items: [] } }), { status: 200 });
    const successRes = await fetchAllCompletedWorkouts('test_token');
    assert.ok(Array.isArray(successRes.data));
    assert.strictEqual(successRes.data.length, 0);
    assert.strictEqual(getToasts().length, 0);
  } finally {
    globalThis.fetch = originalFetch;
    clear();
  }
});

test('Batch 3B-3 6c: export handler failure path emits one exportData toast and does not call download', async () => {
  clear();
  let downloadCalled = false;
  const mockDownload = () => { downloadCalled = true; };

  const success = await performWorkoutsExport('test_token', [], 'kg', {
    fetchWorkouts: async () => ({ data: null, status: 500 }),
    download: mockDownload,
    reportError: reportFailure,
    timeZone: 'UTC',
  });

  assert.strictEqual(success, false);
  assert.strictEqual(downloadCalled, false, 'Download must not be triggered on export failure');
  const toasts = getToasts();
  assert.strictEqual(toasts.length, 1);
  assert.strictEqual(toasts[0].key, 'errors.actions.exportData');
  assert.strictEqual(toasts[0].categoryKey, 'errors.serverError');
  clear();
});

test('Batch 3B-3 6d: every errors.* key used by reportFailure and categoryToKey resolves through t() with 0 warnings', () => {
  const originalWarn = console.warn;
  let warnCount = 0;
  console.warn = () => { warnCount += 1; };

  try {
    // Categories
    const categories: FailureCategory[] = ['network', 'auth', 'notFound', 'server', 'other'];
    for (const cat of categories) {
      const key = categoryToKey(cat);
      const str = t(key);
      assert.ok(str && typeof str === 'string' && str.length > 0 && str !== key, `Category key ${key} must resolve to text`);
    }

    // Action keys
    const actions: SupportedActionKey[] = [
      'completeWorkout',
      'createWorkout',
      'autosaveWorkout',
      'saveSteps',
      'saveBodyweight',
      'exportData',
    ];
    for (const act of actions) {
      const key = ACTION_KEY_MAP[act];
      const str = t(key);
      assert.ok(str && typeof str === 'string' && str.length > 0 && str !== key, `Action key ${key} must resolve to text`);
    }

    assert.strictEqual(warnCount, 0, 'There should be zero console.warn calls for missing i18n keys');
  } finally {
    console.warn = originalWarn;
  }
});

test('Batch 3B-3 6e: Notifier works with a fake clock that starts at 0', () => {
  const zeroClock = new MockClock(0);
  assert.strictEqual(zeroClock.now(), 0);
  const notifier = new NotifierStore(zeroClock);

  // At t=0, first notification succeeds
  const id1 = notifier.notify({ kind: 'info', key: 'common.loading' });
  assert.ok(id1 !== null);
  assert.strictEqual(notifier.getToasts().length, 1);

  // At t=0, duplicate is rejected
  const id2 = notifier.notify({ kind: 'info', key: 'common.loading' });
  assert.strictEqual(id2, null);

  // Advance clock to 3999ms: still rejected
  zeroClock.advance(3999);
  const id3 = notifier.notify({ kind: 'info', key: 'common.loading' });
  assert.strictEqual(id3, null);

  // Advance past 4000ms (at t=4001): accepted
  zeroClock.advance(2);
  const id4 = notifier.notify({ kind: 'info', key: 'common.loading' });
  assert.ok(id4 !== null);
});

test('Batch 3B-3 6f: two different categories for the same key inside 4 s are both shown', () => {
  const clock = new MockClock(1000);
  const notifier = new NotifierStore(clock);

  // First notification with category errors.serverError
  const id1 = notifier.notify({
    kind: 'error',
    key: 'errors.actions.completeWorkout',
    categoryKey: 'errors.serverError',
  });
  assert.ok(id1 !== null);
  assert.strictEqual(notifier.getToasts().length, 1);

  // Inside 4 seconds (advance 1000ms), same action key but different category errors.networkError
  clock.advance(1000);
  const id2 = notifier.notify({
    kind: 'error',
    key: 'errors.actions.completeWorkout',
    categoryKey: 'errors.networkError',
  });
  assert.ok(id2 !== null, 'Different categoryKey for same key must NOT be deduplicated');
  assert.strictEqual(notifier.getToasts().length, 2);
  assert.strictEqual(notifier.getToasts()[0].categoryKey, 'errors.serverError');
  assert.strictEqual(notifier.getToasts()[1].categoryKey, 'errors.networkError');
});

test('Batch 3B-4 7a: decideFinishOutcome evaluates outcomes accurately', () => {
  assert.strictEqual(decideFinishOutcome(null), 'failed');
  assert.strictEqual(decideFinishOutcome(undefined), 'failed');
  assert.strictEqual(decideFinishOutcome({ workout: {}, newPRs: [] }), 'completed');
  assert.strictEqual(decideFinishOutcome({ workout: { id: 'w1' } }), 'completed');
});

test('Batch 3B-4 7b: completeWorkoutSession returning 500 yields null and decideFinishOutcome(that) is failed with exactly 1 toast', async () => {
  const originalFetch = globalThis.fetch;
  try {
    clear();
    globalThis.fetch = async () => new Response(JSON.stringify({ error: 'Database fail' }), { status: 500 });
    const result = await completeWorkoutSession('token_123', 'w_100', { durationSeconds: 60 });
    assert.strictEqual(result, null);
    assert.strictEqual(decideFinishOutcome(result), 'failed');

    const toasts = getToasts();
    assert.strictEqual(toasts.length, 1);
    assert.strictEqual(toasts[0].key, 'errors.actions.completeWorkout');
    assert.strictEqual(toasts[0].categoryKey, 'errors.serverError');
  } finally {
    globalThis.fetch = originalFetch;
    clear();
  }
});

test('Batch 3B-5 2a: resolveRepeatCompletion returns null and does not call reconcile when not completed or null/undefined', async () => {
  let reconcileCalls = 0;
  const mockReconcile = async () => {
    reconcileCalls += 1;
    return ['pr1'];
  };

  // In-progress workout
  const resInProgress = await resolveRepeatCompletion({ id: 'w1', status: 'in_progress' }, mockReconcile);
  assert.strictEqual(resInProgress, null);
  assert.strictEqual(reconcileCalls, 0);

  // Null workout
  const resNull = await resolveRepeatCompletion(null, mockReconcile);
  assert.strictEqual(resNull, null);
  assert.strictEqual(reconcileCalls, 0);

  // Undefined workout
  const resUndefined = await resolveRepeatCompletion(undefined, mockReconcile);
  assert.strictEqual(resUndefined, null);
  assert.strictEqual(reconcileCalls, 0);
});

test('Batch 3B-5 2b: resolveRepeatCompletion preserves completed_at, calls reconcile once, and returns newPRs', async () => {
  let reconcileCalls = 0;
  const fakePRs = [{ id: 'pr_1', exercise_id: 'bench_press' }];
  const mockReconcile = async () => {
    reconcileCalls += 1;
    return fakePRs;
  };

  const fixedCompletedAt = '2026-10-25T14:30:00.000Z';
  const completedWorkout = {
    id: 'w_completed_1',
    status: 'completed',
    completed_at: fixedCompletedAt,
    total_volume: 5000,
  };

  const result = await resolveRepeatCompletion(completedWorkout, mockReconcile);
  assert.ok(result !== null);
  assert.strictEqual(reconcileCalls, 1, 'reconcile must be called exactly once');
  assert.strictEqual(result.workout, completedWorkout, 'workout object must be unchanged');
  assert.strictEqual(result.workout.completed_at, fixedCompletedAt, 'completed_at timestamp must not change');
  assert.deepStrictEqual(result.newPRs, fakePRs, 'newPRs must equal reconcile result');
});

test('Batch 3B-5 2c: resolveRepeatCompletion propagates error when reconcile rejects', async () => {
  const completedWorkout = { id: 'w2', status: 'completed' };
  const mockReconcile = async () => {
    throw new Error('Database connection failed during reconcile');
  };

  await assert.rejects(
    async () => {
      await resolveRepeatCompletion(completedWorkout, mockReconcile);
    },
    {
      name: 'Error',
      message: 'Database connection failed during reconcile',
    }
  );
});

test('Batch 3C-1 4a: mixed PRs from three workouts returns only requested workout rows in same order', () => {
  const pr1 = { id: 'pr1', workout_id: 'w1', value: 100 };
  const pr2 = { id: 'pr2', workout_id: 'w2', value: 105 };
  const pr3 = { id: 'pr3', workout_id: 'w1', value: 120 };
  const pr4 = { id: 'pr4', workout_id: 'w3', value: 110 };

  const input = [pr1, pr2, pr3, pr4];
  const selected = selectPRsForWorkout(input, 'w1');

  assert.deepStrictEqual(selected, [pr1, pr3]);
});

test('Batch 3C-1 4b: empty input returns []', () => {
  const selected = selectPRsForWorkout([], 'w1');
  assert.deepStrictEqual(selected, []);
});

test('Batch 3C-1 4c: no match returns []', () => {
  const input = [
    { id: 'pr1', workout_id: 'w2' },
    { id: 'pr2', workout_id: 'w3' },
  ];
  const selected = selectPRsForWorkout(input, 'w1');
  assert.deepStrictEqual(selected, []);
});

test('Batch 3C-1 4d: rows with null/undefined workout_id are never selected', () => {
  const input = [
    { id: 'pr1', workout_id: null },
    { id: 'pr2', workout_id: undefined },
    { id: 'pr3' },
    { id: 'pr4', workout_id: 'w1' },
  ];
  const selected = selectPRsForWorkout(input, 'w1');
  assert.deepStrictEqual(selected, [{ id: 'pr4', workout_id: 'w1' }]);

  const selectedNull = selectPRsForWorkout(input, 'null');
  assert.deepStrictEqual(selectedNull, []);
});

test('Batch 3C-1 4e: input array is not mutated', () => {
  const input = [
    Object.freeze({ id: 'pr1', workout_id: 'w1' }),
    Object.freeze({ id: 'pr2', workout_id: 'w2' }),
  ];
  const copy = [...input];

  const selected = selectPRsForWorkout(input, 'w1');
  assert.strictEqual(selected.length, 1);
  assert.notStrictEqual(selected, input);
  assert.deepStrictEqual(input, copy);
});


