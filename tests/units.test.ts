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
} from '../src/lib/units';
import {
  detectPersonalRecords,
  calculateEstimated1RM,
  calculateSingleSetVolume,
  calculateSetVolume,
  calculateTotalSessionVolume,
  calculateBodyweightStats,
} from '../src/lib/calculations';
import { BodyweightEntryRow } from '../src/types/database';

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
  const setVol = calculateSingleSetVolume(parsedKg1, 5);

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

test('formatPRDisplay formats a 100 kg x 12 rep PR in both kg and lbs', () => {
  const repPRWithWeight = {
    category: 'rep_pr',
    value: 100,
    weight: 100,
    reps: 12,
  };

  // In kg: stored weight is 100 kg -> "100.0 kg × 12"
  assert.strictEqual(formatPRDisplay(repPRWithWeight, 'kg'), '100.0 kg × 12');

  // In lbs: 100 kg * 2.20462262185 = 220.462... -> "220.5 lbs × 12"
  assert.strictEqual(formatPRDisplay(repPRWithWeight, 'lbs'), '220.5 lbs × 12');

  // Also verify when weight is passed on personal_records row where value stores weight
  const repPRFromDB = {
    category: 'rep_pr',
    value: 100, // stored in kg
    reps: 12,
  };
  assert.strictEqual(formatPRDisplay(repPRFromDB, 'kg'), '100.0 kg × 12');
  assert.strictEqual(formatPRDisplay(repPRFromDB, 'lbs'), '220.5 lbs × 12');

  // Heaviest weight PR
  const weightPR = { category: 'heaviest_weight', value: 100 };
  assert.strictEqual(formatPRDisplay(weightPR, 'kg'), '100.0 kg');
  assert.strictEqual(formatPRDisplay(weightPR, 'lbs'), '220.5 lbs');
});
