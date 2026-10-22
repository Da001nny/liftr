import test from 'node:test';
import assert from 'node:assert/strict';
import {
  kgToLbs,
  lbsToKg,
  kmToMi,
  miToKm,
  formatWeight,
  formatWeightValue,
  formatDistance,
  formatDistanceValue,
  parseWeightInput,
  parseDistanceInput,
  roundToFourDecimals,
  roundToOneDecimal,
  formatPRDisplay,
  KG_TO_LBS_RATIO,
  MI_TO_KM_RATIO,
  WeightUnit,
} from '../src/lib/units';
import {
  detectPersonalRecords,
  calculateEstimated1RM,
  calculateSetVolume,
  calculateTotalSessionVolume,
  calculateBodyweightStats,
} from '../src/lib/calculations';
import {
  completeSet,
  deleteSet,
  handlePendingTextUnitSwitch,
  resolveCompletedSetWeight,
  SetPendingInputState,
} from '../src/lib/setEditing';
import { BodyweightEntryRow, ActiveWorkoutExercise } from '../src/types/database';

test('exact constants match authoritative standards', () => {
  assert.strictEqual(KG_TO_LBS_RATIO, 2.20462262185);
  assert.strictEqual(MI_TO_KM_RATIO, 1.609344);
});

test('round trip test: 135 lbs -> kg -> 135.0 lbs', () => {
  // Input 135 lbs parsed to canonical kg
  const canonicalKg = parseWeightInput(135, 'lbs');
  // 135 / 2.20462262185 ≈ 61.23497... -> rounded to 4 decimals = 61.235
  assert.strictEqual(canonicalKg, roundToFourDecimals(135 / KG_TO_LBS_RATIO));

  // Display back in lbs with 1 decimal place
  const displayedLbs = formatWeight(canonicalKg, 'lbs');
  assert.strictEqual(displayedLbs, '135.0 lbs');

  // Value only
  const val = formatWeightValue(canonicalKg, 'lbs');
  assert.strictEqual(val, 135.0);
});

test('round trip test: additional weights and distances', () => {
  // 225 lbs
  const kg225 = parseWeightInput(225, 'lbs');
  assert.strictEqual(formatWeight(kg225, 'lbs'), '225.0 lbs');

  // 100 kg
  const kg100 = parseWeightInput(100, 'kg');
  assert.strictEqual(kg100, 100);
  assert.strictEqual(formatWeight(kg100, 'kg'), '100.0 kg');

  // 5 km
  const km5 = parseDistanceInput(5, 'km');
  assert.strictEqual(km5, 5);
  assert.strictEqual(formatDistance(km5, 'km'), '5.0 km');

  // 3.1 mi -> km -> 3.1 mi
  const kmFromMi = parseDistanceInput(3.1, 'mi');
  assert.strictEqual(formatDistance(kmFromMi, 'mi'), '3.1 mi');
});

test('PR tie stays a tie after switching units', () => {
  // Scenario: Lifter previously set a PR of 100 kg
  const existingRecords = {
    heaviestWeight: 100.0,
    bestEstimated1RM: 100.0,
    bestSingleSetVolume: 100.0,
    repPRsByWeight: { 100: 1 },
  };

  // Case A: Next session in kg, user lifts 100 kg for 1 rep -> EXACT TIE -> NOT A PR
  const candidateKg = { weight: 100, reps: 1 };
  const resultKg = detectPersonalRecords(candidateKg, existingRecords);
  assert.strictEqual(resultKg.isHeaviestWeightPR, false, 'Tie in kg should not be a PR');
  assert.strictEqual(resultKg.isEstimated1RMPR, false, 'Tie 1RM in kg should not be a PR');
  assert.strictEqual(resultKg.isSingleSetVolumePR, false, 'Tie volume in kg should not be a PR');
  assert.strictEqual(resultKg.isRepPR, false, 'Tie reps in kg should not be a PR');

  // Case B: User switches UI unit preference to lbs.
  // 100 kg converted to lbs is ~220.4623 lbs.
  // User enters 220.4623 lbs.
  // parseWeightInput converts 220.4623 lbs back to canonical kg (rounded to 4 decimals).
  const lbsInput = roundToFourDecimals(100 * KG_TO_LBS_RATIO); // 220.4623 lbs
  const canonicalConvertedKg = parseWeightInput(lbsInput, 'lbs'); // 100.0000 kg

  // With canonical comparison rounded to 4 decimals, canonicalConvertedKg equals 100
  assert.strictEqual(roundToFourDecimals(canonicalConvertedKg), 100.0);

  const candidateLbsConverted = { weight: canonicalConvertedKg, reps: 1 };
  const resultLbs = detectPersonalRecords(candidateLbsConverted, existingRecords);
  assert.strictEqual(resultLbs.isHeaviestWeightPR, false, 'Converted tie must stay a tie (not a PR)');
  assert.strictEqual(resultLbs.isEstimated1RMPR, false, 'Converted 1RM tie must stay a tie');
  assert.strictEqual(resultLbs.isSingleSetVolumePR, false, 'Converted volume tie must stay a tie');
  assert.strictEqual(resultLbs.isRepPR, false, 'Converted rep tie must stay a tie');
});

test('135 lbs entered twice is a tie (not a PR), and 135 lbs then 61.235 kg is also a tie', () => {
  // First set: 135 lbs for 5 reps
  const parsedKg1 = parseWeightInput(135, 'lbs'); // 61.235 kg
  assert.strictEqual(parsedKg1, 61.235);

  const est1RM = calculateEstimated1RM(parsedKg1, 5);
  const setVol = calculateSetVolume({ weight: parsedKg1, reps: 5, completed: true, set_type: 'working' });

  const recordsAfterSet1 = {
    heaviestWeight: parsedKg1,
    bestEstimated1RM: est1RM,
    bestSingleSetVolume: setVol,
    repPRsByWeight: { [roundToFourDecimals(parsedKg1)]: 5 },
  };

  // Second set: Same set entered as 135 lbs twice -> exact tie, not a PR
  const parsedKg2 = parseWeightInput(135, 'lbs'); // 61.235 kg
  const candidate2 = { weight: parsedKg2, reps: 5 };
  const result2 = detectPersonalRecords(candidate2, recordsAfterSet1);
  assert.strictEqual(result2.isHeaviestWeightPR, false, 'Same set entered as 135 lbs twice is a tie for heaviest weight');
  assert.strictEqual(result2.isEstimated1RMPR, false, 'Same set entered as 135 lbs twice is a tie for 1RM');
  assert.strictEqual(result2.isSingleSetVolumePR, false, 'Same set entered as 135 lbs twice is a tie for volume');
  assert.strictEqual(result2.isRepPR, false, 'Same set entered as 135 lbs twice is a tie for reps');

  // Third set: Entered as 61.235 kg (canonical value of 135 lbs) -> exact tie, not a PR
  const parsedKg3 = parseWeightInput(61.235, 'kg'); // 61.235 kg
  const candidate3 = { weight: parsedKg3, reps: 5 };
  const result3 = detectPersonalRecords(candidate3, recordsAfterSet1);
  assert.strictEqual(result3.isHeaviestWeightPR, false, '135 lbs entered then 61.235 kg is a tie for heaviest weight');
  assert.strictEqual(result3.isEstimated1RMPR, false, '135 lbs entered then 61.235 kg is a tie for 1RM');
  assert.strictEqual(result3.isSingleSetVolumePR, false, '135 lbs entered then 61.235 kg is a tie for volume');
  assert.strictEqual(result3.isRepPR, false, '135 lbs entered then 61.235 kg is a tie for reps');
});

test('volume calculation gives identical canonical result under either unit preference', () => {
  // Set: 10 reps with a target canonical weight of 80 kg
  const reps = 10;
  const canonicalWeightKg = 80; // stored in kg

  // Under kg preference:
  const setKg = { weight: canonicalWeightKg, reps, completed: true, set_type: 'working' };
  const canonicalVolumeKg = calculateSetVolume(setKg); // 80 * 10 = 800 kg

  // Under lbs preference:
  // User enters 176.3698 lbs (which is 80 kg * 2.20462262185)
  const userEnteredLbs = 80 * KG_TO_LBS_RATIO;
  // System parses input to canonical storage before persisting:
  const parsedKg = parseWeightInput(userEnteredLbs, 'lbs');
  const setFromLbs = { weight: parsedKg, reps, completed: true, set_type: 'working' };
  const canonicalVolumeFromLbs = calculateSetVolume(setFromLbs);

  // Both stored canonical volumes must match to 4 decimal places
  assert.strictEqual(roundToFourDecimals(canonicalVolumeKg), 800);
  assert.strictEqual(roundToFourDecimals(canonicalVolumeFromLbs), 800);

  // Total session volume over 3 identical sets
  const sessionSets = [setFromLbs, setFromLbs, setFromLbs];
  const totalSessionVol = calculateTotalSessionVolume(sessionSets);
  assert.strictEqual(roundToFourDecimals(totalSessionVol), 2400);

  // Displaying the total volume in either preference at UI boundary:
  assert.strictEqual(formatWeight(totalSessionVol, 'kg'), '2400.0 kg');
  const expectedLbsVol = roundToOneDecimal(kgToLbs(2400)).toFixed(1);
  assert.strictEqual(formatWeight(totalSessionVol, 'lbs'), `${expectedLbsVol} lbs`);
});

test('calculateBodyweightStats treats every stored row as kg whatever the leftover unit column says', () => {
  const entries: BodyweightEntryRow[] = [
    {
      id: '1',
      user_id: 'user-1',
      date: '2026-01-01',
      weight: 70.0,
      unit: 'lbs', // leftover legacy label, stored canonical value is 70.0 kg
      notes: null,
      source: 'manual',
      created_at: '2026-01-01T08:00:00Z',
      updated_at: '2026-01-01T08:00:00Z',
    },
    {
      id: '2',
      user_id: 'user-1',
      date: '2026-01-08',
      weight: 71.5,
      unit: 'kg',
      notes: null,
      source: 'manual',
      created_at: '2026-01-08T08:00:00Z',
      updated_at: '2026-01-08T08:00:00Z',
    },
  ];

  const stats = calculateBodyweightStats(entries);
  assert.strictEqual(roundToOneDecimal(stats.startingWeight || 0), 70.0);
  assert.strictEqual(roundToOneDecimal(stats.currentWeight || 0), 71.5);
  assert.strictEqual(stats.unit, 'kg');
  assert.strictEqual(roundToOneDecimal(stats.netChange || 0), 1.5);
});

test('formatPRDisplay formats a 100 kg x 12 rep PR in both kg and lbs using exact real database row shape', () => {
  // Real row shape exactly matching public.personal_records table and server insert
  const realDatabaseRepPRRow = {
    id: 'b149b5d2-f477-4c74-a690-3f741d441111',
    user_id: 'a903c733-149b-4bd2-9744-1f741d442222',
    exercise_id: 'barbell_bench_press',
    workout_id: 'c881b5d2-f477-4c74-a690-3f741d443333',
    workout_set_id: 'd992b5d2-f477-4c74-a690-3f741d444444',
    category: 'rep_pr' as const,
    value: 100, // canonical kg
    weight: 100, // canonical kg (from migration 008 column)
    reps: 12,
    achieved_at: '2026-10-12T04:00:00.000Z',
    created_at: '2026-10-12T04:00:00.000Z',
  };

  // In kg: stored weight is 100 kg -> "100.0 kg × 12"
  assert.strictEqual(formatPRDisplay(realDatabaseRepPRRow, 'kg'), '100.0 kg × 12');

  // In lbs: 100 kg * 2.20462262185 = 220.462... -> "220.5 lbs × 12"
  assert.strictEqual(formatPRDisplay(realDatabaseRepPRRow, 'lbs'), '220.5 lbs × 12');

  // Also verify legacy row before migration 008 where weight column is null/undefined and value holds weight
  const legacyDatabaseRepPRRow = {
    id: 'e111b5d2-f477-4c74-a690-3f741d445555',
    user_id: 'a903c733-149b-4bd2-9744-1f741d442222',
    exercise_id: 'barbell_bench_press',
    workout_id: 'c881b5d2-f477-4c74-a690-3f741d443333',
    workout_set_id: 'd992b5d2-f477-4c74-a690-3f741d444444',
    category: 'rep_pr' as const,
    value: 100, // canonical kg
    weight: null,
    reps: 12,
    achieved_at: '2026-10-12T04:00:00.000Z',
    created_at: '2026-10-12T04:00:00.000Z',
  };
  assert.strictEqual(formatPRDisplay(legacyDatabaseRepPRRow, 'kg'), '100.0 kg × 12');
  assert.strictEqual(formatPRDisplay(legacyDatabaseRepPRRow, 'lbs'), '220.5 lbs × 12');

  // Heaviest weight PR
  const weightPR = {
    id: 'f222b5d2-f477-4c74-a690-3f741d446666',
    user_id: 'a903c733-149b-4bd2-9744-1f741d442222',
    exercise_id: 'barbell_bench_press',
    workout_id: 'c881b5d2-f477-4c74-a690-3f741d443333',
    workout_set_id: 'd992b5d2-f477-4c74-a690-3f741d444444',
    category: 'heaviest_weight' as const,
    value: 100,
    weight: 100,
    reps: 5,
    achieved_at: '2026-10-12T04:00:00.000Z',
    created_at: '2026-10-12T04:00:00.000Z',
  };
  assert.strictEqual(formatPRDisplay(weightPR, 'kg'), '100.0 kg');
  assert.strictEqual(formatPRDisplay(weightPR, 'lbs'), '220.5 lbs');
});

test('ActiveWorkoutModal pure handlers: (a) immediate checkmark, (b) set deletion isolation, (c) mid-workout unit switch', () => {
  // Real active workout exercise state matching ActiveWorkoutExercise
  let exercise: ActiveWorkoutExercise = {
    id: 'we-1',
    workout_id: 'w-1',
    exercise_id: 'barbell_bench_press',
    exerciseName: 'Barbell Bench Press',
    order_index: 0,
    notes: '',
    rest_timer_seconds: 90,
    created_at: new Date().toISOString(),
    sets: [
      {
        id: 'set-1',
        workout_exercise_id: 'we-1',
        set_number: 1,
        set_type: 'working',
        weight: 0,
        reps: 10,
        rir: null,
        completed: false,
        completed_at: null,
        created_at: new Date().toISOString(),
      },
      {
        id: 'set-2',
        workout_exercise_id: 'we-1',
        set_number: 2,
        set_type: 'working',
        weight: 80, // canonical kg
        reps: 8,
        rir: null,
        completed: false,
        completed_at: null,
        created_at: new Date().toISOString(),
      },
    ],
  };

  const pendingWeightsMap: Record<string, SetPendingInputState> = {};
  let currentUnit: WeightUnit = 'lbs';

  // Scenario (a): Type "135" (in lbs) and tap complete checkmark immediately without blur
  pendingWeightsMap['set-1'] = {
    rawText: '135',
    heldCanonicalKg: null,
    editedSinceSwitch: false,
  };

  const resA = completeSet(exercise, 0, {
    rawText: pendingWeightsMap['set-1'].rawText,
    unit: currentUnit,
    heldCanonicalKg: pendingWeightsMap['set-1'].heldCanonicalKg,
    editedSinceSwitch: pendingWeightsMap['set-1'].editedSinceSwitch,
  });

  exercise = resA.updatedExercise;
  assert.strictEqual(resA.willBeCompleted, true, 'Set 1 must be completed');
  assert.strictEqual(resA.restTimerSeconds, 90, 'Rest timer must be triggered for completed set');
  assert.strictEqual(exercise.sets[0].completed, true, 'Set 1 completed state in exercise');
  assert.strictEqual(exercise.sets[0].weight, 61.235, 'Set 1 must convert 135 lbs to canonical 61.235 kg');

  // Scenario (b): Remove a set, then complete the next set
  // User types "225" into set-1
  pendingWeightsMap['set-1'] = {
    rawText: '225',
    heldCanonicalKg: null,
    editedSinceSwitch: false,
  };

  // User deletes set-1
  const delRes = deleteSet(exercise, 0);
  exercise = delRes.updatedExercise;
  if (delRes.deletedSetId) {
    delete pendingWeightsMap[delRes.deletedSetId];
  }

  assert.strictEqual(pendingWeightsMap['set-1'], undefined, 'Deleted set ref must be removed from pending map');
  assert.strictEqual(exercise.sets.length, 1, 'Only set-2 remains in exercise');
  assert.strictEqual(exercise.sets[0].id, 'set-2', 'set-2 is now the first set at index 0');

  // Complete set-2 (which had 80 kg) without typing new text
  const resB = completeSet(exercise, 0, {
    rawText: pendingWeightsMap['set-2']?.rawText,
    unit: currentUnit,
    heldCanonicalKg: pendingWeightsMap['set-2']?.heldCanonicalKg,
    editedSinceSwitch: pendingWeightsMap['set-2']?.editedSinceSwitch,
  });
  exercise = resB.updatedExercise;

  assert.strictEqual(resB.willBeCompleted, true, 'set-2 must be completed');
  assert.strictEqual(exercise.sets[0].weight, 80, 'set-2 must preserve its own 80 kg and NEVER inherit set-1 225 value');
});

test('Unit switching with pending text preserves canonical kg without rounding drift', () => {
  // Test case 1: Type 100 kg, switch to lbs (shows 220.5), complete -> stored exactly 100 kg
  const switch1 = handlePendingTextUnitSwitch('100', 'kg', 'lbs');
  assert.strictEqual(switch1.displayText, '220.5', '100 kg displays as 220.5 in lbs');
  assert.strictEqual(switch1.heldCanonicalKg, 100, 'heldCanonicalKg must be exactly 100');

  const resolvedWeight1 = resolveCompletedSetWeight({
    rawText: switch1.displayText,
    unit: 'lbs',
    heldCanonicalKg: switch1.heldCanonicalKg,
    editedSinceSwitch: false,
    fallbackWeightKg: 0,
  });
  assert.strictEqual(resolvedWeight1, 100, 'Completing without editing must store exactly 100 kg');

  // Test case 2: Type 135 lbs, switch to kg (shows 61.2), complete -> stored exactly 61.235 kg
  const switch2 = handlePendingTextUnitSwitch('135', 'lbs', 'kg');
  assert.strictEqual(switch2.displayText, '61.2', '135 lbs displays as 61.2 in kg');
  assert.strictEqual(switch2.heldCanonicalKg, 61.235, 'heldCanonicalKg must be 61.235');

  const resolvedWeight2 = resolveCompletedSetWeight({
    rawText: switch2.displayText,
    unit: 'kg',
    heldCanonicalKg: switch2.heldCanonicalKg,
    editedSinceSwitch: false,
    fallbackWeightKg: 0,
  });
  assert.strictEqual(resolvedWeight2, 61.235, 'Completing without editing must store exactly 61.235 kg');

  // Test case 3: If user edits the field after switching units, edited text is parsed in new unit
  const resolvedEdited = resolveCompletedSetWeight({
    rawText: '225',
    unit: 'lbs',
    heldCanonicalKg: switch1.heldCanonicalKg,
    editedSinceSwitch: true, // User edited after switch
    fallbackWeightKg: 0,
  });
  assert.strictEqual(resolvedEdited, 102.0583, 'Edited text must parse 225 lbs to 102.0583 kg');
});

test('Unit switching tie test: 100 kg switched to 220.5 lbs can never create a false heaviest-weight PR', () => {
  // Baseline: User's existing PR is exactly 100 kg
  const existingPRs = {
    heaviestWeight: 100, // canonical kg
    bestEstimated1RM: 115,
    bestSingleSetVolume: 500,
    repPRsByWeight: { 100: 5 },
  };

  // 1. Without canonical preservation:
  // If the system naive re-parsed "220.5" from lbs:
  const naiveKg = parseWeightInput('220.5', 'lbs'); // 100.0171 kg
  assert.strictEqual(naiveKg > 100, true, 'Naive conversion 100.0171 kg would falsely exceed 100 kg');
  const naivePR = detectPersonalRecords({ weight: naiveKg, reps: 5 }, existingPRs);
  assert.strictEqual(naivePR.isHeaviestWeightPR, true, 'Naive conversion would incorrectly trigger heaviest_weight PR');

  // 2. Authoritative system with held canonical kg:
  const switchResult = handlePendingTextUnitSwitch('100', 'kg', 'lbs');
  assert.strictEqual(switchResult.displayText, '220.5');
  assert.strictEqual(switchResult.heldCanonicalKg, 100);

  const authoritativeStoredKg = resolveCompletedSetWeight({
    rawText: switchResult.displayText,
    unit: 'lbs',
    heldCanonicalKg: switchResult.heldCanonicalKg,
    editedSinceSwitch: false,
  });
  assert.strictEqual(authoritativeStoredKg, 100, 'Stored weight must remain exact 100 kg');

  // Strict > tie check: 100 > 100 is false
  const authoritativePR = detectPersonalRecords({ weight: authoritativeStoredKg, reps: 5 }, existingPRs);
  assert.strictEqual(authoritativePR.isHeaviestWeightPR, false, 'Tie lift at 100 kg after switching to 220.5 lbs can NEVER create a heaviest-weight PR');
});

