/**
 * liftr: Database-to-UI Label Mapping Layer
 * 
 * Non-negotiable rule: Database-driven values (exercise difficulty, equipment,
 * movement type, PR categories, set types, region and muscle names, data sources,
 * scheduled statuses, and note categories) MUST go through this label-mapping layer.
 * The stored database value never changes; only the displayed label is looked up
 * in the translation dictionary.
 * 
 * Each enum mapping table is strictly typed with Record<UnionType, TranslationKeyPath>
 * so adding or altering an enum value without updating translations will fail tsc at build time.
 * For any unexpected or unknown database value, the mapping logs a warning and returns
 * the raw value.
 */

import { t, TranslationKeyPath } from '../i18n';
import { 
  DifficultyLevel, 
  EquipmentType, 
  MovementType, 
  ContributionRole,
  EXERCISES
} from '../data/exerciseCatalog';

export type PRCategory = 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';
export type SetType = 'warmup' | 'working' | 'drop' | 'failure';
export type RegionId = 'chest' | 'back' | 'shoulders' | 'arms' | 'legs' | 'glutes' | 'core' | 'inner_thigh';
export type DataSource = 'manual' | 'apple_health' | 'google_fit' | 'fitbit' | 'garmin';
export type ScheduledStatus = 'scheduled' | 'completed' | 'missed' | 'cancelled';
export type NoteCategory = 'general' | 'nutrition' | 'recovery';

export type MuscleId =
  | 'm_chest_clavicular'
  | 'm_chest_sternal'
  | 'm_chest_costal'
  | 'm_latissimus_dorsi'
  | 'm_trapezius_upper'
  | 'm_trapezius_middle'
  | 'm_trapezius_lower'
  | 'm_teres_major'
  | 'm_erector_spinae'
  | 'm_deltoid_anterior'
  | 'm_deltoid_lateral'
  | 'm_deltoid_posterior'
  | 'm_rotator_cuff'
  | 'm_biceps_long_head'
  | 'm_biceps_short_head'
  | 'm_brachialis'
  | 'm_triceps_long_head'
  | 'm_triceps_lateral_head'
  | 'm_triceps_medial_head'
  | 'm_forearms'
  | 'm_quadriceps'
  | 'm_hamstrings'
  | 'm_calves_gastrocnemius'
  | 'm_calves_soleus'
  | 'm_tibialis_anterior'
  | 'm_gluteus_maximus'
  | 'm_gluteus_medius'
  | 'm_gluteus_minimus'
  | 'm_rectus_abdominis'
  | 'm_obliques'
  | 'm_transverse_abdominis'
  | 'm_serratus_anterior'
  | 'm_core'
  | 'm_adductor_magnus'
  | 'm_adductor_longus'
  | 'm_gracilis';

const DIFFICULTY_MAP: Record<DifficultyLevel, TranslationKeyPath> = {
  beginner: 'difficulty.beginner',
  intermediate: 'difficulty.intermediate',
  advanced: 'difficulty.advanced',
};

const EQUIPMENT_MAP: Record<EquipmentType, TranslationKeyPath> = {
  barbell: 'equipment.barbell',
  dumbbell: 'equipment.dumbbell',
  cable: 'equipment.cable',
  machine: 'equipment.machine',
  bodyweight: 'equipment.bodyweight',
  kettlebell: 'equipment.kettlebell',
  smith_machine: 'equipment.smith_machine',
  band: 'equipment.band',
};

const MOVEMENT_TYPE_MAP: Record<MovementType, TranslationKeyPath> = {
  compound: 'movementType.compound',
  isolation: 'movementType.isolation',
};

const PR_CATEGORY_MAP: Record<PRCategory, TranslationKeyPath> = {
  heaviest_weight: 'prCategories.heaviest_weight',
  best_estimated_1rm: 'prCategories.best_estimated_1rm',
  best_single_set_volume: 'prCategories.best_single_set_volume',
  rep_pr: 'prCategories.rep_pr',
};

const SET_TYPE_MAP: Record<SetType, TranslationKeyPath> = {
  warmup: 'setTypes.warmup',
  working: 'setTypes.working',
  drop: 'setTypes.drop',
  failure: 'setTypes.failure',
};

const REGION_MAP: Record<RegionId, TranslationKeyPath> = {
  chest: 'regions.chest',
  back: 'regions.back',
  shoulders: 'regions.shoulders',
  arms: 'regions.arms',
  legs: 'regions.legs',
  glutes: 'regions.glutes',
  core: 'regions.core',
  inner_thigh: 'regions.inner_thigh',
};

const MUSCLE_MAP: Record<MuscleId, TranslationKeyPath> = {
  m_chest_clavicular: 'muscles.m_chest_clavicular.name',
  m_chest_sternal: 'muscles.m_chest_sternal.name',
  m_chest_costal: 'muscles.m_chest_costal.name',
  m_latissimus_dorsi: 'muscles.m_latissimus_dorsi.name',
  m_trapezius_upper: 'muscles.m_trapezius_upper.name',
  m_trapezius_middle: 'muscles.m_trapezius_middle.name',
  m_trapezius_lower: 'muscles.m_trapezius_lower.name',
  m_teres_major: 'muscles.m_teres_major.name',
  m_erector_spinae: 'muscles.m_erector_spinae.name',
  m_deltoid_anterior: 'muscles.m_deltoid_anterior.name',
  m_deltoid_lateral: 'muscles.m_deltoid_lateral.name',
  m_deltoid_posterior: 'muscles.m_deltoid_posterior.name',
  m_rotator_cuff: 'muscles.m_rotator_cuff.name',
  m_biceps_long_head: 'muscles.m_biceps_long_head.name',
  m_biceps_short_head: 'muscles.m_biceps_short_head.name',
  m_brachialis: 'muscles.m_brachialis.name',
  m_triceps_long_head: 'muscles.m_triceps_long_head.name',
  m_triceps_lateral_head: 'muscles.m_triceps_lateral_head.name',
  m_triceps_medial_head: 'muscles.m_triceps_medial_head.name',
  m_forearms: 'muscles.m_forearms.name',
  m_quadriceps: 'muscles.m_quadriceps.name',
  m_hamstrings: 'muscles.m_hamstrings.name',
  m_calves_gastrocnemius: 'muscles.m_calves_gastrocnemius.name',
  m_calves_soleus: 'muscles.m_calves_soleus.name',
  m_tibialis_anterior: 'muscles.m_tibialis_anterior.name',
  m_gluteus_maximus: 'muscles.m_gluteus_maximus.name',
  m_gluteus_medius: 'muscles.m_gluteus_medius.name',
  m_gluteus_minimus: 'muscles.m_gluteus_minimus.name',
  m_rectus_abdominis: 'muscles.m_rectus_abdominis.name',
  m_obliques: 'muscles.m_obliques.name',
  m_transverse_abdominis: 'muscles.m_transverse_abdominis.name',
  m_serratus_anterior: 'muscles.m_serratus_anterior.name',
  m_core: 'muscles.m_core.name',
  m_adductor_magnus: 'muscles.m_adductor_magnus.name',
  m_adductor_longus: 'muscles.m_adductor_longus.name',
  m_gracilis: 'muscles.m_gracilis.name',
};

const MUSCLE_COMMON_MAP: Record<MuscleId, TranslationKeyPath> = {
  m_chest_clavicular: 'muscles.m_chest_clavicular.commonName',
  m_chest_sternal: 'muscles.m_chest_sternal.commonName',
  m_chest_costal: 'muscles.m_chest_costal.commonName',
  m_latissimus_dorsi: 'muscles.m_latissimus_dorsi.commonName',
  m_trapezius_upper: 'muscles.m_trapezius_upper.commonName',
  m_trapezius_middle: 'muscles.m_trapezius_middle.commonName',
  m_trapezius_lower: 'muscles.m_trapezius_lower.commonName',
  m_teres_major: 'muscles.m_teres_major.commonName',
  m_erector_spinae: 'muscles.m_erector_spinae.commonName',
  m_deltoid_anterior: 'muscles.m_deltoid_anterior.commonName',
  m_deltoid_lateral: 'muscles.m_deltoid_lateral.commonName',
  m_deltoid_posterior: 'muscles.m_deltoid_posterior.commonName',
  m_rotator_cuff: 'muscles.m_rotator_cuff.commonName',
  m_biceps_long_head: 'muscles.m_biceps_long_head.commonName',
  m_biceps_short_head: 'muscles.m_biceps_short_head.commonName',
  m_brachialis: 'muscles.m_brachialis.commonName',
  m_triceps_long_head: 'muscles.m_triceps_long_head.commonName',
  m_triceps_lateral_head: 'muscles.m_triceps_lateral_head.commonName',
  m_triceps_medial_head: 'muscles.m_triceps_medial_head.commonName',
  m_forearms: 'muscles.m_forearms.commonName',
  m_quadriceps: 'muscles.m_quadriceps.commonName',
  m_hamstrings: 'muscles.m_hamstrings.commonName',
  m_calves_gastrocnemius: 'muscles.m_calves_gastrocnemius.commonName',
  m_calves_soleus: 'muscles.m_calves_soleus.commonName',
  m_tibialis_anterior: 'muscles.m_tibialis_anterior.commonName',
  m_gluteus_maximus: 'muscles.m_gluteus_maximus.commonName',
  m_gluteus_medius: 'muscles.m_gluteus_medius.commonName',
  m_gluteus_minimus: 'muscles.m_gluteus_minimus.commonName',
  m_rectus_abdominis: 'muscles.m_rectus_abdominis.commonName',
  m_obliques: 'muscles.m_obliques.commonName',
  m_transverse_abdominis: 'muscles.m_transverse_abdominis.commonName',
  m_serratus_anterior: 'muscles.m_serratus_anterior.commonName',
  m_core: 'muscles.m_core.commonName',
  m_adductor_magnus: 'muscles.m_adductor_magnus.commonName',
  m_adductor_longus: 'muscles.m_adductor_longus.commonName',
  m_gracilis: 'muscles.m_gracilis.commonName',
};

const MUSCLE_ROLE_MAP: Record<ContributionRole, TranslationKeyPath> = {
  Primary: 'roles.Primary',
  Secondary: 'roles.Secondary',
  Stabilizer: 'roles.Stabilizer',
};

const DATA_SOURCE_MAP: Record<DataSource, TranslationKeyPath> = {
  manual: 'dataSources.manual',
  apple_health: 'dataSources.apple_health',
  google_fit: 'dataSources.google_fit',
  fitbit: 'dataSources.fitbit',
  garmin: 'dataSources.garmin',
};

const SCHEDULED_STATUS_MAP: Record<ScheduledStatus, TranslationKeyPath> = {
  scheduled: 'scheduledStatuses.scheduled',
  completed: 'scheduledStatuses.completed',
  missed: 'scheduledStatuses.missed',
  cancelled: 'scheduledStatuses.cancelled',
};

const NOTE_CATEGORY_MAP: Record<NoteCategory, TranslationKeyPath> = {
  general: 'calendarNotes.general',
  nutrition: 'calendarNotes.nutrition',
  recovery: 'calendarNotes.recovery',
};

/**
 * Maps exercise difficulty level ('beginner' | 'intermediate' | 'advanced') to localized label.
 */
export function getDifficultyLabel(difficulty: string | null | undefined): string {
  if (!difficulty) return '';
  const key = DIFFICULTY_MAP[difficulty.toLowerCase() as DifficultyLevel];
  if (!key) {
    console.warn(`[getDifficultyLabel] Unknown difficulty value: "${difficulty}"`);
    return difficulty;
  }
  const translated = t(key);
  return translated !== key ? translated : difficulty;
}

/**
 * Maps exercise equipment type ('barbell' | 'dumbbell' | 'cable' | etc.) to localized label.
 */
export function getEquipmentLabel(equipment: string | null | undefined): string {
  if (!equipment) return '';
  const key = EQUIPMENT_MAP[equipment.toLowerCase() as EquipmentType];
  if (!key) {
    console.warn(`[getEquipmentLabel] Unknown equipment value: "${equipment}"`);
    return equipment;
  }
  const translated = t(key);
  return translated !== key ? translated : equipment;
}

/**
 * Maps exercise movement type ('compound' | 'isolation') to localized label.
 */
export function getMovementTypeLabel(movementType: string | null | undefined): string {
  if (!movementType) return '';
  const key = MOVEMENT_TYPE_MAP[movementType.toLowerCase() as MovementType];
  if (!key) {
    console.warn(`[getMovementTypeLabel] Unknown movementType value: "${movementType}"`);
    return movementType;
  }
  const translated = t(key);
  return translated !== key ? translated : movementType;
}

/**
 * Maps personal record category ('heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr') to localized label.
 */
export function getPrCategoryLabel(category: string | null | undefined): string {
  if (!category) return '';
  const key = PR_CATEGORY_MAP[category as PRCategory];
  if (!key) {
    console.warn(`[getPrCategoryLabel] Unknown PR category: "${category}"`);
    return category;
  }
  const translated = t(key);
  return translated !== key ? translated : category;
}

/**
 * Maps set type ('warmup' | 'working' | 'drop' | 'failure') to localized label.
 */
export function getSetTypeLabel(setType: string | null | undefined): string {
  if (!setType) return '';
  const key = SET_TYPE_MAP[setType.toLowerCase() as SetType];
  if (!key) {
    console.warn(`[getSetTypeLabel] Unknown setType: "${setType}"`);
    return setType;
  }
  const translated = t(key);
  return translated !== key ? translated : setType;
}

/**
 * Maps set type to badge letter/text ('W' | 'Set' | 'Drop' | 'Fail').
 */
export function getSetTypeBadge(setType: string | null | undefined): string {
  if (!setType) return '';
  const key = `setBadges.${setType.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : '';
}

/**
 * Maps region ID ('chest' | 'back' | 'shoulders' | etc.) to localized display name.
 */
export function getRegionLabel(regionId: string | null | undefined, fallbackName?: string): string {
  if (!regionId) return fallbackName || '';
  const key = REGION_MAP[regionId.toLowerCase() as RegionId];
  if (!key) {
    console.warn(`[getRegionLabel] Unknown regionId: "${regionId}"`);
    return fallbackName || regionId;
  }
  const translated = t(key);
  return translated !== key ? translated : (fallbackName || regionId);
}

/**
 * Maps muscle ID ('m_chest_clavicular' | etc.) to localized anatomical name.
 */
export function getMuscleLabel(muscleId: string | null | undefined, fallbackName?: string): string {
  if (!muscleId) return fallbackName || '';
  const key = MUSCLE_MAP[muscleId as MuscleId];
  if (!key) {
    console.warn(`[getMuscleLabel] Unknown muscleId: "${muscleId}"`);
    return fallbackName || muscleId;
  }
  const translated = t(key);
  return translated !== key ? translated : (fallbackName || muscleId);
}

/**
 * Maps muscle ID to localized common name ('Upper Chest' | etc.).
 */
export function getMuscleCommonName(muscleId: string | null | undefined, fallbackCommonName?: string): string {
  if (!muscleId) return fallbackCommonName || '';
  const key = MUSCLE_COMMON_MAP[muscleId as MuscleId];
  if (!key) {
    console.warn(`[getMuscleCommonName] Unknown muscleId: "${muscleId}"`);
    return fallbackCommonName || muscleId;
  }
  const translated = t(key);
  return translated !== key ? translated : (fallbackCommonName || muscleId);
}

/**
 * Maps biomechanical contribution role ('Primary' | 'Secondary' | 'Stabilizer') to localized label.
 */
export function getMuscleRoleLabel(role: string | null | undefined): string {
  if (!role) return '';
  const key = MUSCLE_ROLE_MAP[role as ContributionRole];
  if (!key) {
    console.warn(`[getMuscleRoleLabel] Unknown role: "${role}"`);
    return role;
  }
  const translated = t(key);
  return translated !== key ? translated : role;
}

/**
 * Maps data source identifier ('manual' | 'apple_health' | 'google_fit' | etc.) to localized label.
 */
export function getDataSourceLabel(source: string | null | undefined): string {
  if (!source) return '';
  const key = DATA_SOURCE_MAP[source.toLowerCase() as DataSource];
  if (!key) {
    console.warn(`[getDataSourceLabel] Unknown source: "${source}"`);
    return source;
  }
  const translated = t(key);
  return translated !== key ? translated : source;
}

/**
 * Maps scheduled workout status ('scheduled' | 'completed' | 'missed' | 'cancelled') to localized label.
 */
export function getScheduledStatusLabel(status: string | null | undefined): string {
  if (!status) return '';
  const key = SCHEDULED_STATUS_MAP[status.toLowerCase() as ScheduledStatus];
  if (!key) {
    console.warn(`[getScheduledStatusLabel] Unknown status: "${status}"`);
    return status;
  }
  const translated = t(key);
  return translated !== key ? translated : status;
}

/**
 * Maps calendar note category ('general' | 'nutrition' | 'recovery') to localized label.
 */
export function getNoteCategoryLabel(category: string | null | undefined): string {
  if (!category) return '';
  const key = NOTE_CATEGORY_MAP[category.toLowerCase() as NoteCategory];
  if (!key) {
    console.warn(`[getNoteCategoryLabel] Unknown note category: "${category}"`);
    return category;
  }
  const translated = t(key);
  return translated !== key ? translated : category;
}

/**
 * Maps muscle exposure level ('high' | 'moderate' | 'low') to localized label.
 */
export function getExposureLevelLabel(level: string | null | undefined): string {
  if (!level) return '';
  const lower = level.toLowerCase();
  if (lower === 'high') return t('progress.exposureHigh');
  if (lower === 'moderate') return t('progress.exposureModerate');
  if (lower === 'low') return t('progress.exposureLow');
  return level;
}

/**
 * Looks up the exercise ID in authoritative EXERCISES catalog.
 * Falls back to localized t('exercises.unknownExercise'), NEVER the raw ID.
 */
export function getExerciseName(exerciseId: string | null | undefined): string {
  if (!exerciseId) return t('exercises.unknownExercise');
  const normalized = exerciseId.trim();
  const found = EXERCISES.find(e => e.id === normalized || e.id === `ex_${normalized}` || e.id.replace(/^ex_/, '') === normalized);
  if (found) return found.name;
  return t('exercises.unknownExercise');
}
