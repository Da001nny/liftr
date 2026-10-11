/**
 * liftr: Database-to-UI Label Mapping Layer
 * 
 * Non-negotiable rule: Database-driven values (exercise difficulty, equipment,
 * movement type, PR categories, set types, region and muscle names) MUST go
 * through this label-mapping layer. The stored database value never changes;
 * only the displayed label is looked up in the translation dictionary.
 */

import { t, TranslationKeyPath } from '../i18n';

/**
 * Maps exercise difficulty level ('beginner' | 'intermediate' | 'advanced') to localized label.
 */
export function getDifficultyLabel(difficulty: string | null | undefined): string {
  if (!difficulty) return '';
  const key = `difficulty.${difficulty.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

/**
 * Maps exercise equipment type ('barbell' | 'dumbbell' | 'cable' | etc.) to localized label.
 */
export function getEquipmentLabel(equipment: string | null | undefined): string {
  if (!equipment) return '';
  const key = `equipment.${equipment.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : equipment;
}

/**
 * Maps exercise movement type ('compound' | 'isolation') to localized label.
 */
export function getMovementTypeLabel(movementType: string | null | undefined): string {
  if (!movementType) return '';
  const key = `movementType.${movementType.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : movementType.charAt(0).toUpperCase() + movementType.slice(1);
}

/**
 * Maps personal record category ('heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr') to localized label.
 */
export function getPRCategoryLabel(category: string | null | undefined): string {
  if (!category) return '';
  const key = `prCategories.${category}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : category.replace(/_/g, ' ');
}

/**
 * Maps set type ('warmup' | 'working' | 'drop' | 'failure') to localized label.
 */
export function getSetTypeLabel(setType: string | null | undefined): string {
  if (!setType) return '';
  const key = `setTypes.${setType.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : setType.charAt(0).toUpperCase() + setType.slice(1);
}

/**
 * Maps set type to badge letter/text ('W' | 'Set' | 'D' | 'F').
 */
export function getSetTypeBadge(setType: string | null | undefined): string {
  if (!setType) return '';
  const key = `setBadges.${setType.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : setType === 'warmup' ? 'W' : setType === 'drop' ? 'D' : setType === 'failure' ? 'F' : 'Set';
}

/**
 * Maps region ID ('chest' | 'back' | 'shoulders' | etc.) to localized display name.
 */
export function getRegionLabel(regionId: string | null | undefined, fallbackName?: string): string {
  if (!regionId) return fallbackName || '';
  const key = `regions.${regionId.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : (fallbackName || regionId);
}

/**
 * Maps muscle ID ('m_chest_clavicular' | etc.) to localized anatomical name.
 */
export function getMuscleLabel(muscleId: string | null | undefined, fallbackName?: string): string {
  if (!muscleId) return fallbackName || '';
  const key = `muscles.${muscleId}.name` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : (fallbackName || muscleId);
}

/**
 * Maps muscle ID to localized common name ('Upper Chest' | etc.).
 */
export function getMuscleCommonName(muscleId: string | null | undefined, fallbackCommonName?: string): string {
  if (!muscleId) return fallbackCommonName || '';
  const key = `muscles.${muscleId}.commonName` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : (fallbackCommonName || muscleId);
}

/**
 * Maps biomechanical contribution role ('Primary' | 'Secondary' | 'Stabilizer') to localized label.
 */
export function getContributionRoleLabel(role: string | null | undefined): string {
  if (!role) return '';
  const key = `roles.${role}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : role;
}

/**
 * Maps calendar note category ('general' | 'nutrition' | 'recovery') to localized label.
 */
export function getNoteCategoryLabel(category: string | null | undefined): string {
  if (!category) return '';
  const key = `calendarNotes.${category.toLowerCase()}` as TranslationKeyPath;
  const translated = t(key);
  return translated !== key ? translated : category.charAt(0).toUpperCase() + category.slice(1);
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
