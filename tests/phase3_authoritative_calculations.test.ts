import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  calculateEstimated1RM, 
  calculateSetVolume, 
  calculateTotalSessionVolume, 
  calculateWorkoutTotals,
  detectPersonalRecords,
  calculateCalendarConsistency,
  PersonalRecordState,
  isCountableSet
} from '../src/lib/calculations';

// ============================================================================
// PHASE 3 AUTHORITATIVE CALCULATION & PR ENGINE TEST SUITE (24 TESTS)
// ============================================================================

test('Phase 3 - 1. Epley 1RM: reps === 1 returns weight exactly (100kg @ 1 rep = 100kg)', () => {
  assert.strictEqual(calculateEstimated1RM(100, 1), 100);
});

test('Phase 3 - 2. Epley 1RM: reps === 1 decimal test (142.5kg @ 1 rep = 142.5kg)', () => {
  assert.strictEqual(calculateEstimated1RM(142.5, 1), 142.5);
});

test('Phase 3 - 3. Epley 1RM: 100kg x 10 reps = 133.33kg', () => {
  assert.strictEqual(calculateEstimated1RM(100, 10), 133.33);
});

test('Phase 3 - 4. Epley 1RM: 80kg x 5 reps = 93.33kg', () => {
  assert.strictEqual(calculateEstimated1RM(80, 5), 93.33);
});

test('Phase 3 - 5. Epley 1RM: 0 weight returns 0', () => {
  assert.strictEqual(calculateEstimated1RM(0, 10), 0);
});

test('Phase 3 - 6. Epley 1RM: 0 reps returns 0', () => {
  assert.strictEqual(calculateEstimated1RM(100, 0), 0);
});

test('Phase 3 - 7. Volume: Single set volume 80kg x 8 = 640kg', () => {
  assert.strictEqual(calculateSetVolume(80, 8), 640);
});

test('Phase 3 - 8. Volume: Single set decimal volume 100.5kg x 4 = 402kg', () => {
  assert.strictEqual(calculateSetVolume(100.5, 4), 402);
});

test('Phase 3 - 9. Volume: Total session volume sums completed working sets only (1000 + 800 = 1800kg)', () => {
  const sampleSets = [
    { weight: 60, reps: 10, completed: true, set_type: 'warmup' as const }, // Warmup: excluded
    { weight: 100, reps: 10, completed: true, set_type: 'working' as const }, // 1000
    { weight: 100, reps: 8, completed: true, set_type: 'working' as const },  // 800
    { weight: 100, reps: 6, completed: false, set_type: 'working' as const }, // Uncompleted: excluded
  ];
  const totalVol = calculateTotalSessionVolume(sampleSets.filter(s => s.set_type !== 'warmup' && s.completed));
  assert.strictEqual(totalVol, 1800);
});

const baselineRecords: PersonalRecordState = {
  heaviestWeight: 100,
  bestEstimated1RM: 133.33,
  bestSingleSetVolume: 1000,
  repPRsByWeight: {
    100: 10,
    110: 5,
  },
};

test('Phase 3 - 10. PR Engine: Exact tie on heaviest weight (100kg vs 100kg) is NOT a PR', () => {
  const tieWeight = detectPersonalRecords({ weight: 100, reps: 5 }, baselineRecords);
  assert.strictEqual(tieWeight.isHeaviestWeightPR, false);
});

test('Phase 3 - 11. PR Engine: Exact tie on reps for weight (10 reps vs 10 reps) is NOT a PR', () => {
  const tieReps = detectPersonalRecords({ weight: 100, reps: 10 }, baselineRecords);
  assert.strictEqual(tieReps.isRepPR, false);
});

test('Phase 3 - 12. PR Engine: Exact tie on single-set volume (1000 vs 1000) is NOT a PR', () => {
  const tieReps = detectPersonalRecords({ weight: 100, reps: 10 }, baselineRecords);
  assert.strictEqual(tieReps.isSingleSetVolumePR, false);
});

test('Phase 3 - 13. PR Engine: Exact tie on 1RM (133.33 vs 133.33) is NOT a PR', () => {
  const tieReps = detectPersonalRecords({ weight: 100, reps: 10 }, baselineRecords);
  assert.strictEqual(tieReps.isEstimated1RMPR, false);
});

test('Phase 3 - 14. PR Engine: Heavier weight (102.5kg > 100kg) IS a heaviest weight PR', () => {
  const newWeight = detectPersonalRecords({ weight: 102.5, reps: 1 }, baselineRecords);
  assert.strictEqual(newWeight.isHeaviestWeightPR, true);
});

test('Phase 3 - 15. PR Engine: newHeaviestWeight reported as 102.5kg', () => {
  const newWeight = detectPersonalRecords({ weight: 102.5, reps: 1 }, baselineRecords);
  assert.strictEqual(newWeight.newHeaviestWeight, 102.5);
});

test('Phase 3 - 16. PR Engine: Higher 1RM (139.33kg > 133.33kg) IS an estimated 1RM PR', () => {
  const new1RM = detectPersonalRecords({ weight: 110, reps: 8 }, baselineRecords);
  assert.strictEqual(new1RM.isEstimated1RMPR, true);
});

test('Phase 3 - 17. PR Engine: Lesser single-set volume (880 < 1000) is correctly NOT a volume PR', () => {
  const new1RM = detectPersonalRecords({ weight: 110, reps: 8 }, baselineRecords);
  assert.strictEqual(new1RM.isSingleSetVolumePR, false);
});

test('Phase 3 - 18. PR Engine: Higher reps at 100kg (12 > 10) IS a rep PR', () => {
  const newReps = detectPersonalRecords({ weight: 100, reps: 12 }, baselineRecords);
  assert.strictEqual(newReps.isRepPR, true);
});

test('Phase 3 - 19. PR Engine: newRepPR reported with reps = 12', () => {
  const newReps = detectPersonalRecords({ weight: 100, reps: 12 }, baselineRecords);
  assert.strictEqual(newReps.newRepPR?.reps, 12);
});

test('Phase 3 - 20. PR Engine: Single set volume (1200 > 1000) IS a single-set volume PR', () => {
  const newReps = detectPersonalRecords({ weight: 100, reps: 12 }, baselineRecords);
  assert.strictEqual(newReps.isSingleSetVolumePR, true);
});

test('Phase 3 - 21. Calendar Consistency: 0 scheduled sessions returns 100% intentional default', () => {
  assert.strictEqual(calculateCalendarConsistency(0, 0), 100);
});

test('Phase 3 - 22. Calendar Consistency: 3 completed / 4 scheduled = 75%', () => {
  assert.strictEqual(calculateCalendarConsistency(3, 4), 75);
});

test('Phase 3 - 23. Calendar Consistency: 4 completed / 4 scheduled = 100%', () => {
  assert.strictEqual(calculateCalendarConsistency(4, 4), 100);
});

test('Phase 3 - 24. Calendar Consistency: Overcompleted capped at 100% max', () => {
  assert.strictEqual(calculateCalendarConsistency(5, 4), 100);
});

test('Phase 3 - 25. Rep PR Rule: 5 reps at 100 kg after 8 reps at 120 kg is NOT a rep PR', () => {
  const state: PersonalRecordState = {
    heaviestWeight: 120,
    bestEstimated1RM: 152,
    bestSingleSetVolume: 960,
    repPRsByWeight: {
      120: 8,
    },
  };
  const result = detectPersonalRecords({ weight: 100, reps: 5 }, state);
  assert.strictEqual(result.isRepPR, false, '5 reps at 100kg should not be a PR when user already did 8 reps at 120kg');
});

test('Phase 3 - 26. Rep PR Rule: 9 reps at 100 kg after 8 reps at 120 kg IS a rep PR', () => {
  const state: PersonalRecordState = {
    heaviestWeight: 120,
    bestEstimated1RM: 152,
    bestSingleSetVolume: 960,
    repPRsByWeight: {
      120: 8,
    },
  };
  const result = detectPersonalRecords({ weight: 100, reps: 9 }, state);
  assert.strictEqual(result.isRepPR, true, '9 reps at 100kg should be a PR because 9 exceeds the 8 reps at 120kg');
  assert.strictEqual(result.newRepPR?.weight, 100);
  assert.strictEqual(result.newRepPR?.reps, 9);
});

test('Phase 3 - 27. Rep PR Rule: 8 reps at 100 kg after 8 reps at 120 kg is a strict tie and NOT a PR', () => {
  const state: PersonalRecordState = {
    heaviestWeight: 120,
    bestEstimated1RM: 152,
    bestSingleSetVolume: 960,
    repPRsByWeight: {
      120: 8,
    },
  };
  const result = detectPersonalRecords({ weight: 100, reps: 8 }, state);
  assert.strictEqual(result.isRepPR, false, '8 reps at 100kg should tie the 8 reps at 120kg and be rejected by strict > rule');
});

test('Phase 3 - 28. calculateWorkoutTotals sums only countable completed working sets', () => {
  const sets = [
    { set_type: 'warmup', weight: 60, reps: 10, completed: true },
    { set_type: 'working', weight: 100, reps: 5, completed: false },
    { set_type: 'working', weight: 100, reps: 8, completed: true },
    { set_type: 'drop', weight: 80, reps: 10, completed: true },
    { set_type: 'failure', weight: 90, reps: 6, completed: true },
  ];
  const { totalVolume } = calculateWorkoutTotals(sets as any);
  assert.strictEqual(totalVolume, 2140, 'Total volume should sum only countable completed sets (800 + 800 + 540 = 2140)');
});


