/**
 * liftr: Authoritative Unit Conversion & Formatting Module
 * 
 * Rules:
 * 1. Canonical Storage: All weights are stored in kg, all distances in km.
 * 2. Exact Constants:
 *    - 1 kg = 2.20462262185 lb
 *    - 1 mi = 1.609344 km
 * 3. Every conversion in the application routes strictly through this module.
 *    No inline unit math anywhere in the codebase.
 * 4. Display rounds to 1 decimal place for user-facing weights and distances.
 * 5. Canonical values use 4 decimal places for precision to prevent floating-point noise.
 */

export type WeightUnit = 'kg' | 'lbs';
export type DistanceUnit = 'km' | 'mi';

// Authoritative exact constants per specification
export const KG_TO_LBS_RATIO = 2.20462262185;
export const MI_TO_KM_RATIO = 1.609344;

/**
 * Converts kilograms to pounds (exact ratio).
 */
export function kgToLbs(kg: number): number {
  if (!kg || isNaN(kg)) return 0;
  return kg * KG_TO_LBS_RATIO;
}

/**
 * Converts pounds to kilograms (exact ratio).
 */
export function lbsToKg(lbs: number): number {
  if (!lbs || isNaN(lbs)) return 0;
  return lbs / KG_TO_LBS_RATIO;
}

/**
 * Converts kilometers to miles (exact ratio).
 */
export function kmToMi(km: number): number {
  if (!km || isNaN(km)) return 0;
  return km / MI_TO_KM_RATIO;
}

/**
 * Converts miles to kilometers (exact ratio).
 */
export function miToKm(mi: number): number {
  if (!mi || isNaN(mi)) return 0;
  return mi * MI_TO_KM_RATIO;
}

/**
 * Rounds a number to exactly 4 decimal places for canonical storage and PR comparisons.
 * Eliminates floating-point noise so that genuine ties are never treated as PRs.
 */
export function roundToFourDecimals(val: number): number {
  if (!val || isNaN(val)) return 0;
  return Math.round(val * 10000) / 10000;
}

/**
 * Rounds a number to 1 decimal place for UI display.
 */
export function roundToOneDecimal(val: number): number {
  if (!val || isNaN(val)) return 0;
  return Math.round(val * 10) / 10;
}

/**
 * Converts a canonical weight (kg) to the user's preferred unit value (number, 1 decimal).
 */
export function formatWeightValue(kgValue: number | null | undefined, unit: WeightUnit = 'kg'): number {
  if (kgValue === null || kgValue === undefined || isNaN(kgValue)) return 0;
  const valueInUnit = unit === 'lbs' ? kgToLbs(kgValue) : kgValue;
  return roundToOneDecimal(valueInUnit);
}

/**
 * Formats a canonical weight (kg) for display with 1 decimal place and unit suffix.
 * e.g., 61.235 kg -> "61.2 kg" or "135.0 lbs"
 */
export function formatWeight(
  kgValue: number | null | undefined,
  unit: WeightUnit = 'kg',
  includeUnit: boolean = true
): string {
  if (kgValue === null || kgValue === undefined || isNaN(kgValue)) {
    return includeUnit ? `0.0 ${unit}` : '0.0';
  }
  const val = formatWeightValue(kgValue, unit);
  const formattedNumber = val.toFixed(1);
  return includeUnit ? `${formattedNumber} ${unit}` : formattedNumber;
}

/**
 * Converts a canonical distance (km) to the user's preferred unit value (number, 1 decimal).
 */
export function formatDistanceValue(kmValue: number | null | undefined, unit: DistanceUnit = 'km'): number {
  if (kmValue === null || kmValue === undefined || isNaN(kmValue)) return 0;
  const valueInUnit = unit === 'mi' ? kmToMi(kmValue) : kmValue;
  return roundToOneDecimal(valueInUnit);
}

/**
 * Formats a canonical distance (km) for display with 1 decimal place and unit suffix.
 * e.g., 5.0 km -> "5.0 km" or "3.1 mi"
 */
export function formatDistance(
  kmValue: number | null | undefined,
  unit: DistanceUnit = 'km',
  includeUnit: boolean = true
): string {
  if (kmValue === null || kmValue === undefined || isNaN(kmValue)) {
    return includeUnit ? `0.0 ${unit}` : '0.0';
  }
  const val = formatDistanceValue(kmValue, unit);
  const formattedNumber = val.toFixed(1);
  return includeUnit ? `${formattedNumber} ${unit}` : formattedNumber;
}

/**
 * Parses user weight input from their preferred unit into canonical storage kg (4 decimals).
 */
export function parseWeightInput(input: number | string, unit: WeightUnit = 'kg'): number {
  const numeric = typeof input === 'string' ? parseFloat(input) : input;
  if (isNaN(numeric) || numeric <= 0) return 0;
  const inKg = unit === 'lbs' ? lbsToKg(numeric) : numeric;
  return roundToFourDecimals(inKg);
}

/**
 * Parses user distance input from their preferred unit into canonical storage km (4 decimals).
 */
export function parseDistanceInput(input: number | string, unit: DistanceUnit = 'km'): number {
  const numeric = typeof input === 'string' ? parseFloat(input) : input;
  if (isNaN(numeric) || numeric <= 0) return 0;
  const inKm = unit === 'mi' ? miToKm(numeric) : numeric;
  return roundToFourDecimals(inKm);
}

/**
 * Formats a Personal Record (PR) row or card for display in user's unit.
 * Rep PRs show the PR's stored weight (formatted in user's unit) along with reps.
 */
export function formatPRDisplay(
  pr: { category: string; value: number; reps?: number | null; weight?: number | null },
  unit: WeightUnit = 'kg'
): string {
  const weight = pr.weight !== undefined && pr.weight !== null ? pr.weight : pr.value;
  if (pr.category === 'rep_pr') {
    if (pr.reps !== null && pr.reps !== undefined && pr.reps > 0) {
      return `${formatWeight(weight, unit)} × ${pr.reps}`;
    }
    return formatWeight(weight, unit);
  }
  return formatWeight(pr.value, unit);
}

