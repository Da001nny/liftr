/**
 * liftr: Authoritative Calculation and Logic Engine
 * 
 * Non-negotiable rule: Every calculation in liftr MUST be defined here
 * and imported by other modules. Never duplicate these calculations across files.
 */

export interface ExerciseSet {
  weight: number; // in user's unit (kg or lbs)
  reps: number;
  completed?: boolean;
}

export interface PersonalRecordCandidate {
  weight: number;
  reps: number;
}

export interface PersonalRecordState {
  heaviestWeight: number;
  bestEstimated1RM: number;
  bestSingleSetVolume: number;
  repPRsByWeight: Record<number, number>; // weight -> max reps achieved
}

export interface DetectedPRs {
  isHeaviestWeightPR: boolean;
  isEstimated1RMPR: boolean;
  isSingleSetVolumePR: boolean;
  isRepPR: boolean;
  newHeaviestWeight?: number;
  newEstimated1RM?: number;
  newSingleSetVolume?: number;
  newRepPR?: { weight: number; reps: number };
}

/**
 * Estimated 1RM calculation: Epley formula
 * Formula: weight * (1 + reps / 30)
 * Note: When reps === 1, returns weight exactly.
 */
export function calculateEstimated1RM(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  const epley = weight * (1 + reps / 30);
  return Math.round(epley * 100) / 100;
}

/**
 * Single-Set Volume calculation
 * Formula: weight * reps for ONE set (not session total)
 * 
 * BEST VOLUME INTERPRETATION: Represents best single-set volume (weight * reps), not session total volume.
 * Documented per specification: Volume PR evaluates maximal output achieved in a single discrete set.
 */
export function calculateSingleSetVolume(weight: number, reps: number): number {
  if (weight <= 0 || reps <= 0) return 0;
  return Math.round(weight * reps * 100) / 100;
}

/**
 * Total Session Volume calculation
 * Formula: sum of (weight * reps) for all completed, non-warmup working sets only.
 * Warmup sets are excluded from total volume and set/rep counts per Phase 3 specifications.
 */
export function calculateTotalSessionVolume(sets: Array<{ weight: number; reps: number; is_completed?: boolean; set_type?: string }>): number {
  return sets.reduce((sum, s) => {
    // Only completed non-warmup sets count towards total volume
    if (s.is_completed === false) return sum;
    if (s.set_type === 'warmup') return sum;
    if (s.weight > 0 && s.reps > 0) {
      return sum + s.weight * s.reps;
    }
    return sum;
  }, 0);
}

/**
 * Total Completed Working Sets count
 * Only completed sets with set_type !== 'warmup' count.
 */
export function calculateCompletedWorkingSetsCount(sets: Array<{ is_completed?: boolean; set_type?: string }>): number {
  return sets.filter(s => s.is_completed === true && s.set_type !== 'warmup').length;
}

/**
 * Total Completed Working Reps count
 * Only completed sets with set_type !== 'warmup' count.
 */
export function calculateCompletedWorkingRepsCount(sets: Array<{ reps: number; is_completed?: boolean; set_type?: string }>): number {
  return sets.reduce((sum, s) => {
    if (s.is_completed === true && s.set_type !== 'warmup' && s.reps > 0) {
      return sum + s.reps;
    }
    return sum;
  }, 0);
}

/**
 * PR Detection across all four categories:
 * 1. Heaviest weight
 * 2. Best estimated 1RM
 * 3. Best single-set volume (weight * reps for ONE set)
 * 4. Rep PR at a given weight
 * 
 * Strict '>' rule: An exact tie is NEVER a new PR.
 */
export function detectPersonalRecords(
  candidate: PersonalRecordCandidate,
  currentRecords: PersonalRecordState
): DetectedPRs {
  const { weight, reps } = candidate;
  if (weight <= 0 || reps <= 0) {
    return {
      isHeaviestWeightPR: false,
      isEstimated1RMPR: false,
      isSingleSetVolumePR: false,
      isRepPR: false,
    };
  }

  const est1RM = calculateEstimated1RM(weight, reps);
  const setVolume = calculateSingleSetVolume(weight, reps);

  // Strict > for all categories
  const isHeaviestWeightPR = weight > currentRecords.heaviestWeight;
  const isEstimated1RMPR = est1RM > currentRecords.bestEstimated1RM;
  const isSingleSetVolumePR = setVolume > currentRecords.bestSingleSetVolume;

  const previousBestRepsForWeight = currentRecords.repPRsByWeight[weight] ?? 0;
  const isRepPR = reps > previousBestRepsForWeight;

  return {
    isHeaviestWeightPR,
    isEstimated1RMPR,
    isSingleSetVolumePR,
    isRepPR,
    newHeaviestWeight: isHeaviestWeightPR ? weight : undefined,
    newEstimated1RM: isEstimated1RMPR ? est1RM : undefined,
    newSingleSetVolume: isSingleSetVolumePR ? setVolume : undefined,
    newRepPR: isRepPR ? { weight, reps } : undefined,
  };
}

/**
 * Calendar consistency %
 * Formula: completed scheduled ÷ explicitly scheduled sessions.
 * Unscheduled workouts are excluded from the denominator entirely.
 * 
 * Intentional default: 0 scheduled sessions returns 100%
 * (Documented per specification: if a user has no scheduled sessions,
 * they have missed 0 sessions, giving 100% baseline consistency).
 */
export function calculateCalendarConsistency(
  completedScheduledSessions: number,
  explicitlyScheduledSessions: number
): number {
  // Intentional default: 0 scheduled sessions -> 100%
  if (explicitlyScheduledSessions <= 0) {
    return 100;
  }
  const ratio = (completedScheduledSessions / explicitlyScheduledSessions) * 100;
  return Math.min(100, Math.max(0, Math.round(ratio * 10) / 10));
}

/**
 * Authoritative Timestamp Normalization:
 * - Timestamps are stored in UTC (ISO 8601).
 * - Converted to local timezone only for display.
 */
export function toUtcIsoString(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Formats a UTC ISO timestamp for local display.
 */
export function formatLocalTimestamp(
  utcIsoString: string,
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = new Date(utcIsoString);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, options ?? {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
}
