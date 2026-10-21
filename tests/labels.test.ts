import test from 'node:test';
import assert from 'node:assert/strict';
import { tn } from '../src/i18n';
import { 
  EXERCISES, 
  MUSCLES, 
  MUSCLE_REGIONS 
} from '../src/data/exerciseCatalog';
import { filterExercises } from '../src/lib/exerciseService';
import { calculateHistoricalPRs } from '../src/lib/calculations';
import { 
  getDifficultyLabel, 
  getEquipmentLabel, 
  getMovementTypeLabel, 
  getPrCategoryLabel, 
  getSetTypeLabel, 
  getRegionLabel, 
  getMuscleLabel, 
  getMuscleCommonName, 
  getMuscleRoleLabel, 
  getDataSourceLabel, 
  getScheduledStatusLabel,
  getNoteCategoryLabel,
  getExerciseName
} from '../src/lib/labels';

test('Label Mapping: all distinct equipment values in catalog resolve to non-empty localized strings', () => {
  const distinctEquipment = Array.from(new Set(EXERCISES.map(e => e.equipment)));
  assert.ok(distinctEquipment.length > 0, 'Catalog should have equipment values');

  for (const eq of distinctEquipment) {
    const label = getEquipmentLabel(eq);
    assert.ok(label && label.length > 0, `Equipment "${eq}" must produce a non-empty label`);
    assert.ok(!label.startsWith('equipment.'), `Equipment "${eq}" returned untranslated key path: "${label}"`);
  }
});

test('Label Mapping: all distinct difficulty values in catalog resolve to non-empty localized strings', () => {
  const distinctDifficulty = Array.from(new Set(EXERCISES.map(e => e.difficulty)));
  assert.ok(distinctDifficulty.length > 0, 'Catalog should have difficulty values');

  for (const diff of distinctDifficulty) {
    const label = getDifficultyLabel(diff);
    assert.ok(label && label.length > 0, `Difficulty "${diff}" must produce a non-empty label`);
    assert.ok(!label.startsWith('difficulty.'), `Difficulty "${diff}" returned untranslated key path: "${label}"`);
  }
});

test('Label Mapping: all distinct movement types in catalog resolve to non-empty localized strings', () => {
  const distinctMovementTypes = Array.from(new Set(EXERCISES.map(e => e.movementType)));
  assert.ok(distinctMovementTypes.length > 0, 'Catalog should have movement types');

  for (const mt of distinctMovementTypes) {
    const label = getMovementTypeLabel(mt);
    assert.ok(label && label.length > 0, `MovementType "${mt}" must produce a non-empty label`);
    assert.ok(!label.startsWith('movementType.'), `MovementType "${mt}" returned untranslated key path: "${label}"`);
  }
});

test('Label Mapping: all distinct regions in catalog resolve to non-empty localized strings', () => {
  const distinctRegions = Array.from(new Set(MUSCLE_REGIONS.map(r => r.id)));
  assert.ok(distinctRegions.length > 0, 'Catalog should have regions');

  for (const rId of distinctRegions) {
    const label = getRegionLabel(rId);
    assert.ok(label && label.length > 0, `Region "${rId}" must produce a non-empty label`);
    assert.ok(!label.startsWith('regions.'), `Region "${rId}" returned untranslated key path: "${label}"`);
  }
});

test('Label Mapping: all distinct muscle IDs in catalog resolve to non-empty localized anatomical and common names', () => {
  assert.ok(MUSCLES.length > 0, 'Catalog should have muscles');

  for (const m of MUSCLES) {
    const anatomicalLabel = getMuscleLabel(m.id);
    assert.ok(anatomicalLabel && anatomicalLabel.length > 0, `Muscle "${m.id}" must produce non-empty name`);
    assert.ok(!anatomicalLabel.startsWith('muscles.'), `Muscle "${m.id}" returned untranslated name: "${anatomicalLabel}"`);

    const commonLabel = getMuscleCommonName(m.id);
    assert.ok(commonLabel && commonLabel.length > 0, `Muscle "${m.id}" must produce non-empty commonName`);
    assert.ok(!commonLabel.startsWith('muscles.'), `Muscle "${m.id}" returned untranslated commonName: "${commonLabel}"`);
  }
});

test('Label Mapping: all distinct contribution roles resolve to non-empty localized strings', () => {
  const roles = ['Primary', 'Secondary', 'Stabilizer'] as const;

  for (const role of roles) {
    const label = getMuscleRoleLabel(role);
    assert.ok(label && label.length > 0, `Role "${role}" must produce non-empty label`);
    assert.ok(!label.startsWith('roles.'), `Role "${role}" returned untranslated key path: "${label}"`);
  }
});

test('Label Mapping: selecting equipment "barbell" still filters by the raw value "barbell"', () => {
  const rawSelection = 'barbell';
  const label = getEquipmentLabel(rawSelection);
  assert.strictEqual(label, 'Barbell');

  // Filter query operates strictly against raw database column value via shared filterExercises
  const filtered = filterExercises(EXERCISES, { equipment: rawSelection });
  assert.ok(filtered.length > 0, 'Filtered exercises list should have barbell exercises');
  for (const ex of filtered) {
    assert.strictEqual(ex.equipment, 'barbell', 'Every matched exercise has raw equipment value "barbell"');
  }
});

test('Label Mapping: PR categories, set types, data sources, and scheduled statuses resolve cleanly', () => {
  const prCategories = ['heaviest_weight', 'best_estimated_1rm', 'best_single_set_volume', 'rep_pr'] as const;
  for (const cat of prCategories) {
    const label = getPrCategoryLabel(cat);
    assert.ok(label && !label.startsWith('prCategories.'));
  }

  const setTypes = ['warmup', 'working', 'drop', 'failure'] as const;
  for (const st of setTypes) {
    const label = getSetTypeLabel(st);
    assert.ok(label && !label.startsWith('setTypes.'));
  }

  const dataSources = ['manual', 'apple_health', 'google_fit', 'fitbit', 'garmin'] as const;
  for (const src of dataSources) {
    const label = getDataSourceLabel(src);
    assert.ok(label && !label.startsWith('dataSources.'));
  }

  const scheduledStatuses = ['scheduled', 'completed', 'missed', 'cancelled'] as const;
  for (const status of scheduledStatuses) {
    const label = getScheduledStatusLabel(status);
    assert.ok(label && !label.startsWith('scheduledStatuses.'));
  }

  const noteCategories = ['general', 'nutrition', 'recovery'] as const;
  for (const cat of noteCategories) {
    const label = getNoteCategoryLabel(cat);
    assert.ok(label && !label.startsWith('calendarNotes.'));
  }
});

test('Plural translations: tn resolves setsDone and notesCount singular variants properly', () => {
  assert.strictEqual(tn('workoutLogger.setsDone', 1), '1 set done');
  assert.strictEqual(tn('calendar.notesCount', 1), '1 note');
  assert.strictEqual(tn('workoutLogger.setsDone', 2), '2 sets done');
  assert.strictEqual(tn('calendar.notesCount', 3), '3 notes');
});

test('Exercise names: getExerciseName looks up catalog ID and falls back to localized unknownExercise', () => {
  assert.strictEqual(getExerciseName('ex_barbell_bench_press'), 'Barbell Bench Press');
  assert.strictEqual(getExerciseName('barbell_bench_press'), 'Barbell Bench Press');
  assert.strictEqual(getExerciseName('nonexistent_exercise_123'), 'Unknown Exercise');
  assert.strictEqual(getExerciseName(null), 'Unknown Exercise');
});

test('PR Reconciliation: calculateHistoricalPRs evaluates chronological real-shaped sets correctly', () => {
  const candidateSets = [
    { workoutId: 'w1', setId: 's1', weight: 100, reps: 5, achievedAt: '2026-01-01T10:00:00Z' },
    { workoutId: 'w2', setId: 's2', weight: 100, reps: 5, achievedAt: '2026-01-02T10:00:00Z' }, // tie - no PR
    { workoutId: 'w3', setId: 's3', weight: 105, reps: 5, achievedAt: '2026-01-03T10:00:00Z' }, // new heaviest & 1RM & volume
    { workoutId: 'w4', setId: 's4', weight: 100, reps: 8, achievedAt: '2026-01-04T10:00:00Z' }, // rep PR & volume PR
  ];
  const prs = calculateHistoricalPRs(candidateSets, 'ex_barbell_bench_press', 'usr_test');
  assert.ok(prs.length > 0, 'Should generate PR records');
  assert.ok(prs.some(p => p.category === 'heaviest_weight' && p.value === 105));
  assert.ok(prs.some(p => p.category === 'rep_pr' && p.reps === 8));
  // Exact tie on w2 generated 0 PRs for w2
  assert.strictEqual(prs.filter(p => p.workout_id === 'w2').length, 0);
});
