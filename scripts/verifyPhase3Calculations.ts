import { 
  calculateEstimated1RM, 
  calculateSetVolume, 
  calculateTotalSessionVolume, 
  detectPersonalRecords,
  calculateCalendarConsistency,
  PersonalRecordState
} from '../src/lib/calculations.ts';

console.log('================================================================');
console.log('LIFTR PHASE 3 AUTHORITATIVE CALCULATION & PR ENGINE VERIFICATION');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName} ${detail ? `- ${detail}` : ''}`);
  }
}

// 1. Epley 1RM Tests
console.log('--- 1. Epley 1RM Formula & Exceptions ---');
assert(calculateEstimated1RM(100, 1) === 100, 'reps === 1 returns weight exactly (100kg @ 1 rep = 100kg)');
assert(calculateEstimated1RM(142.5, 1) === 142.5, 'reps === 1 decimal test (142.5kg @ 1 rep = 142.5kg)');

const epley10 = calculateEstimated1RM(100, 10);
// 100 * (1 + 10/30) = 133.33
assert(epley10 === 133.33, '100kg x 10 reps = 133.33kg', `got ${epley10}`);

const epley5 = calculateEstimated1RM(80, 5);
// 80 * (1 + 5/30) = 80 * (1.16666...) = 93.33
assert(epley5 === 93.33, '80kg x 5 reps = 93.33kg', `got ${epley5}`);

assert(calculateEstimated1RM(0, 10) === 0, '0 weight returns 0');
assert(calculateEstimated1RM(100, 0) === 0, '0 reps returns 0');

// 2. Volume Calculations
console.log('\n--- 2. Single-Set and Session Volume ---');
assert(calculateSetVolume(80, 8) === 640, 'Single set volume 80kg x 8 = 640kg');
assert(calculateSetVolume(100.5, 4) === 402, 'Single set decimal volume 100.5kg x 4 = 402kg');

const sampleSets = [
  { weight: 60, reps: 10, completed: true, set_type: 'warmup' as const }, // Warmup: excluded
  { weight: 100, reps: 10, completed: true, set_type: 'working' as const }, // 1000
  { weight: 100, reps: 8, completed: true, set_type: 'working' as const },  // 800
  { weight: 100, reps: 6, completed: false, set_type: 'working' as const }, // Uncompleted: excluded
];
const totalVol = calculateTotalSessionVolume(sampleSets.filter(s => s.set_type !== 'warmup' && s.completed));
assert(totalVol === 1800, 'Total session volume sums completed working sets only (1000 + 800 = 1800kg)', `got ${totalVol}`);

// 3. PR Detection Engine (Strict > Rule)
console.log('\n--- 3. PR Detection across All 4 Categories (Strict > Rule) ---');
const baselineRecords: PersonalRecordState = {
  heaviestWeight: 100,
  bestEstimated1RM: 133.33, // from 100kg x 10
  bestSingleSetVolume: 1000, // 100kg x 10
  repPRsByWeight: {
    100: 10,
    110: 5,
  },
};

// Case A: Strict Tie on Weight (100kg)
const tieWeight = detectPersonalRecords({ weight: 100, reps: 5 }, baselineRecords);
assert(tieWeight.isHeaviestWeightPR === false, 'Exact tie on heaviest weight (100kg vs 100kg) is NOT a PR');

// Case B: Strict Tie on Reps at Weight (100kg x 10 reps)
const tieReps = detectPersonalRecords({ weight: 100, reps: 10 }, baselineRecords);
assert(tieReps.isRepPR === false, 'Exact tie on reps for weight (10 reps vs 10 reps) is NOT a PR');
assert(tieReps.isSingleSetVolumePR === false, 'Exact tie on single-set volume (1000 vs 1000) is NOT a PR');
assert(tieReps.isEstimated1RMPR === false, 'Exact tie on 1RM (133.33 vs 133.33) is NOT a PR');

// Case C: Genuine New Heaviest Weight
const newWeight = detectPersonalRecords({ weight: 102.5, reps: 1 }, baselineRecords);
assert(newWeight.isHeaviestWeightPR === true, 'Heavier weight (102.5kg > 100kg) IS a heaviest weight PR');
assert(newWeight.newHeaviestWeight === 102.5, 'newHeaviestWeight reported as 102.5kg');

// Case D: Genuine New 1RM
const new1RM = detectPersonalRecords({ weight: 110, reps: 8 }, baselineRecords);
// 110 * (1 + 8/30) = 139.33 > 133.33
assert(new1RM.isEstimated1RMPR === true, 'Higher 1RM (139.33kg > 133.33kg) IS an estimated 1RM PR');
// Single set volume: 110 * 8 = 880 < 1000 (not volume PR)
assert(new1RM.isSingleSetVolumePR === false, 'Lesser single-set volume (880 < 1000) is correctly NOT a volume PR');

// Case E: Genuine New Rep PR at weight
const newReps = detectPersonalRecords({ weight: 100, reps: 12 }, baselineRecords);
assert(newReps.isRepPR === true, 'Higher reps at 100kg (12 > 10) IS a rep PR');
assert(newReps.newRepPR?.reps === 12, 'newRepPR reported with reps = 12');
assert(newReps.isSingleSetVolumePR === true, 'Single set volume (1200 > 1000) IS a single-set volume PR');

// 4. Calendar Consistency Calculation
console.log('\n--- 4. Calendar Consistency % Calculation ---');
assert(calculateCalendarConsistency(0, 0) === 100, '0 scheduled sessions returns 100% intentional default');
assert(calculateCalendarConsistency(3, 4) === 75, '3 completed / 4 scheduled = 75%');
assert(calculateCalendarConsistency(4, 4) === 100, '4 completed / 4 scheduled = 100%');
assert(calculateCalendarConsistency(5, 4) === 100, 'Overcompleted capped at 100% max');

console.log('\n================================================================');
console.log(`SUMMARY: ${passedTests} / ${totalTests} tests passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
