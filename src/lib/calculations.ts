/**
 * liftr: Authoritative Calculation and Logic Engine
 * 
 * Non-negotiable rule: Every calculation in liftr MUST be defined here
 * and imported by other modules. Never duplicate these calculations across files.
 */

import { 
  BodyweightEntryRow, 
  BodyweightStats, 
  MuscleExposureAnalytics, 
  RegionExposureItem, 
  MuscleExposureItem, 
  ExposureLevel,
  ExerciseProgressPoint 
} from '../types/database';
import { 
  MUSCLES, 
  MUSCLE_REGIONS, 
  CONTRIBUTIONS_BY_EXERCISE 
} from '../data/exerciseCatalog';

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
 * Single set volume calculation: weight * reps.
 * Counts ONLY completed, non-warmup sets with weight > 0 and reps > 0.
 * Incomplete sets, warmup sets, or sets with non-positive weight/reps return 0.
 */
export function calculateSetVolume(set: {
  weight?: number;
  reps?: number;
  completed?: boolean;
  is_completed?: boolean;
  set_type?: string;
}): number {
  const isCompleted = set.completed ?? set.is_completed ?? false;
  if (!isCompleted) return 0;
  if (set.set_type === 'warmup') return 0;
  const weight = Number(set.weight) || 0;
  const reps = Number(set.reps) || 0;
  if (weight <= 0 || reps <= 0) return 0;
  return calculateSingleSetVolume(weight, reps);
}

/**
 * Authoritative workout totals calculator across a collection of sets.
 * Evaluates:
 * - totalVolume: accumulated volume across completed, non-warmup working sets (weight > 0 and reps > 0)
 * - completedWorkingSets: count of completed, non-warmup working sets
 * - completedWorkingReps: count of completed, non-warmup working reps
 * 
 * Warmup sets and incomplete sets are strictly excluded.
 */
export function calculateWorkoutTotals(sets: Array<{
  weight?: number;
  reps?: number;
  completed?: boolean;
  is_completed?: boolean;
  set_type?: string;
}>): {
  totalVolume: number;
  completedWorkingSets: number;
  completedWorkingReps: number;
} {
  let totalVolume = 0;
  let completedWorkingSets = 0;
  let completedWorkingReps = 0;

  for (const s of sets || []) {
    const vol = calculateSetVolume(s);
    if (vol > 0) {
      totalVolume += vol;
      completedWorkingSets += 1;
      completedWorkingReps += Number(s.reps) || 0;
    }
  }

  return {
    totalVolume: Math.round(totalVolume * 100) / 100,
    completedWorkingSets,
    completedWorkingReps,
  };
}

/**
 * Total Session Volume calculation
 * Formula: sum of (weight * reps) for all completed, non-warmup working sets only.
 * Warmup sets are excluded from total volume and set/rep counts per Phase 3 specifications.
 */
export function calculateTotalSessionVolume(sets: Array<{
  weight?: number;
  reps?: number;
  completed?: boolean;
  is_completed?: boolean;
  set_type?: string;
}>): number {
  return calculateWorkoutTotals(sets).totalVolume;
}

/**
 * Total Completed Working Sets count
 * Only completed sets with set_type !== 'warmup' count.
 */
export function calculateCompletedWorkingSetsCount(sets: Array<{
  weight?: number;
  reps?: number;
  completed?: boolean;
  is_completed?: boolean;
  set_type?: string;
}>): number {
  return calculateWorkoutTotals(sets).completedWorkingSets;
}

/**
 * Total Completed Working Reps count
 * Only completed sets with set_type !== 'warmup' count.
 */
export function calculateCompletedWorkingRepsCount(sets: Array<{
  weight?: number;
  reps?: number;
  completed?: boolean;
  is_completed?: boolean;
  set_type?: string;
}>): number {
  return calculateWorkoutTotals(sets).completedWorkingReps;
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

// ============================================================================
// PHASE 5: BODYWEIGHT, EXERCISE PROGRESS & MUSCLE EXPOSURE CALCULATIONS
// ============================================================================

/**
 * Authoritative Bodyweight Statistics Calculator (Phase 5 Step 3)
 * Calculates:
 * - Current weight (most recent entry)
 * - Starting weight (earliest entry)
 * - Net change (current - starting)
 * - 7-day average (average of weights in the last 7 calendar days)
 * - 30-day trend (delta between recent 7-day average and average 30 days prior)
 */
export function calculateBodyweightStats(
  entries: BodyweightEntryRow[],
  preferredUnit: 'kg' | 'lbs' = 'kg'
): BodyweightStats {
  if (!entries || entries.length === 0) {
    return {
      currentWeight: null,
      startingWeight: null,
      netChange: null,
      sevenDayAverage: null,
      thirtyDayTrend: null,
      unit: preferredUnit,
      entries: [],
    };
  }

  // Sort ascending by date
  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const starting = Number(sorted[0].weight);
  const current = Number(sorted[sorted.length - 1].weight);
  const netChange = Math.round((current - starting) * 100) / 100;

  // Helper to parse 'YYYY-MM-DD' into UTC Date to avoid timezone drift
  const parseUtcDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(y, m - 1, d));
  };

  // 7-day average: entries within the last 7 calendar days from the latest entry date (inclusive)
  const latestDateObj = parseUtcDate(sorted[sorted.length - 1].date);
  const sevenDaysAgo = new Date(latestDateObj.getTime());
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6);
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().slice(0, 10);

  const last7DaysEntries = sorted.filter(e => e.date >= sevenDaysAgoStr);
  const sevenDayAverage = last7DaysEntries.length > 0
    ? Math.round((last7DaysEntries.reduce((sum, e) => sum + Number(e.weight), 0) / last7DaysEntries.length) * 100) / 100
    : current;

  // 30-day trend: compare recent 7-day average with entries ~30 days ago (window: 30 to 36 days prior)
  // Uses UTC date math (setUTCDate / getUTCDate)
  const thirtyDaysAgo = new Date(latestDateObj.getTime());
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().slice(0, 10);
  const thirtyDaysWindowStart = new Date(thirtyDaysAgo.getTime());
  thirtyDaysWindowStart.setUTCDate(thirtyDaysWindowStart.getUTCDate() - 6);
  const thirtyDaysWindowStartStr = thirtyDaysWindowStart.toISOString().slice(0, 10);

  const entries30DaysAgo = sorted.filter(e => e.date >= thirtyDaysWindowStartStr && e.date <= thirtyDaysAgoStr);
  let thirtyDayTrend: number | null = null;
  if (entries30DaysAgo.length > 0) {
    const avg30DaysAgo = entries30DaysAgo.reduce((sum, e) => sum + Number(e.weight), 0) / entries30DaysAgo.length;
    thirtyDayTrend = Math.round((sevenDayAverage - avg30DaysAgo) * 100) / 100;
  }
  // Return thirtyDayTrend: null when there's no data in the comparison window, instead of falling back to net change.

  return {
    currentWeight: current,
    startingWeight: starting,
    netChange,
    sevenDayAverage,
    thirtyDayTrend,
    unit: sorted[sorted.length - 1].unit || preferredUnit,
    entries: sorted,
  };
}

/**
 * Exercise Progress Points Calculator (Phase 5 Step 4)
 * Reuses the authoritative Epley formula calculateEstimated1RM.
 * Evaluates: heaviestWeight, maxReps, totalVolume, estimated1RM across workouts.
 */
export function calculateExerciseProgress(
  workouts: any[],
  exerciseId: string,
  range: '7d' | '30d' | '3m' | '6m' | '1y' | 'all' = 'all'
): ExerciseProgressPoint[] {
  if (!workouts || workouts.length === 0 || !exerciseId) return [];

  const now = new Date();
  let cutoffStr = '';
  if (range === '7d') {
    const d = new Date(now); d.setDate(d.getDate() - 7);
    cutoffStr = d.toISOString().slice(0, 10);
  } else if (range === '30d') {
    const d = new Date(now); d.setDate(d.getDate() - 30);
    cutoffStr = d.toISOString().slice(0, 10);
  } else if (range === '3m') {
    const d = new Date(now); d.setMonth(d.getMonth() - 3);
    cutoffStr = d.toISOString().slice(0, 10);
  } else if (range === '6m') {
    const d = new Date(now); d.setMonth(d.getMonth() - 6);
    cutoffStr = d.toISOString().slice(0, 10);
  } else if (range === '1y') {
    const d = new Date(now); d.setFullYear(d.getFullYear() - 1);
    cutoffStr = d.toISOString().slice(0, 10);
  }

  const points: ExerciseProgressPoint[] = [];

  // Sort ascending by completion date
  const sorted = [...workouts].sort((a, b) => {
    const dateA = a.completed_at || a.started_at || a.created_at || '';
    const dateB = b.completed_at || b.started_at || b.created_at || '';
    return dateA.localeCompare(dateB);
  });

  for (const w of sorted) {
    const wDate = (w.completed_at || w.started_at || w.created_at || '').slice(0, 10);
    if (cutoffStr && wDate < cutoffStr) continue;

    const matchedEx = w.workout_exercises?.find((we: any) => we.exercise_id === exerciseId);
    if (!matchedEx || !matchedEx.workout_sets || matchedEx.workout_sets.length === 0) continue;

    let heaviestWeight = 0;
    let maxReps = 0;
    let totalVolume = 0;
    let estimated1RM = 0;

    for (const set of matchedEx.workout_sets) {
      if (set.completed === false) continue;
      const weight = Number(set.weight) || 0;
      const reps = Number(set.reps) || 0;
      if (reps <= 0) continue;

      if (weight > heaviestWeight) heaviestWeight = weight;
      if (reps > maxReps) maxReps = reps;
      totalVolume += weight * reps;

      const set1RM = calculateEstimated1RM(weight, reps);
      if (set1RM > estimated1RM) estimated1RM = set1RM;
    }

    if (heaviestWeight > 0 || maxReps > 0 || totalVolume > 0) {
      points.push({
        date: wDate,
        workoutId: w.id,
        workoutName: w.name || 'Workout',
        heaviestWeight,
        maxReps,
        totalVolume: Math.round(totalVolume * 10) / 10,
        estimated1RM,
      });
    }
  }

  return points;
}

/**
 * Single Authoritative Muscle Exposure Analytics Engine (Phase 5 Step 5)
 * Formula: completed training volume / sets × taxonomy contribution weights (Phase 1 data).
 * Aggregated by muscle, region, week, month, session.
 * Labeled as estimates with strictly neutral language ('high' | 'moderate' | 'low').
 */
export function calculateMuscleExposureAnalytics(
  workouts: any[],
  timeframe: 'session' | 'week' | 'month' | 'all_time' = 'month'
): MuscleExposureAnalytics {
  // 1. Filter to status === 'completed' workouts only inside the function
  const completedWorkouts = (workouts || []).filter(w => w && w.status === 'completed');

  // 2. Sort descending by completion date (completed_at, fallback started_at / created_at)
  // Ensures deterministic ordering and picking the chronologically most recent workout.
  const sortedWorkouts = [...completedWorkouts].sort((a, b) => {
    const dateA = a.completed_at || a.started_at || a.created_at || '';
    const dateB = b.completed_at || b.started_at || b.created_at || '';
    return dateB.localeCompare(dateA);
  });

  const now = new Date();
  let cutoffStr = '';
  if (timeframe === 'week') {
    // True 7-day window: [today - 6 days, today] using consistent UTC date math
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - 6);
    cutoffStr = d.toISOString().slice(0, 10);
  } else if (timeframe === 'month') {
    // True 30-day window: [today - 29 days, today] using consistent UTC date math
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - 29);
    cutoffStr = d.toISOString().slice(0, 10);
  }

  let targetWorkouts: any[] = [];
  if (timeframe === 'session') {
    // For session, explicitly pick the single most recent completed workout
    targetWorkouts = sortedWorkouts.slice(0, 1);
  } else if (cutoffStr) {
    targetWorkouts = sortedWorkouts.filter(w => {
      const d = (w.completed_at || w.started_at || w.created_at || '').slice(0, 10);
      return d >= cutoffStr;
    });
  } else {
    targetWorkouts = sortedWorkouts;
  }

  // Map to store exposure by muscle:
  // - volume: total exposure volume (including stabilizers)
  // - sets: total exposure sets (including stabilizers)
  // - dynamicVolume: volume from Primary and Secondary roles (excluding stabilizers)
  const muscleMap = new Map<string, { volume: number; sets: number; dynamicVolume: number }>();
  let overallVolume = 0;
  let overallSets = 0;

  for (const w of targetWorkouts) {
    if (!w.workout_exercises) continue;
    for (const we of w.workout_exercises) {
      const contribs = CONTRIBUTIONS_BY_EXERCISE.get(we.exercise_id) || [];
      if (contribs.length === 0) continue;

      // Replaces inline set loop with authoritative calculateWorkoutTotals logic.
      // Counts only completed, non-warmup sets with weight > 0 and reps > 0.
      const sets = we.workout_sets || [];
      const { totalVolume: exVolume, completedWorkingSets: exSets } = calculateWorkoutTotals(sets);
      if (exSets === 0 || exVolume === 0) continue;

      overallVolume += exVolume;
      overallSets += exSets;

      for (const c of contribs) {
        const factor = (c.percentage || 0) / 100;
        const curr = muscleMap.get(c.muscleId) || { volume: 0, sets: 0, dynamicVolume: 0 };
        curr.volume += exVolume * factor;
        curr.sets += exSets * factor;
        if (c.role !== 'Stabilizer') {
          curr.dynamicVolume += exVolume * factor;
        }
        muscleMap.set(c.muscleId, curr);
      }
    }
  }

  let maxMuscleExposure = 0;
  muscleMap.forEach(val => {
    if (val.volume > maxMuscleExposure) maxMuscleExposure = val.volume;
  });

  // EXPOSURE LEVEL CALCULATION COMMENTS:
  // Muscle exposure levels ('high' | 'moderate' | 'low') are relative to the TOP MUSCLE
  // (i.e. percentage of the single highest muscle's exposure score: high >= 60%, moderate >= 25%).
  // In contrast, region exposure levels are relative to TOTAL workout volume across all regions
  // (i.e. percentage of total volume: high >= 25%, moderate >= 10%).

  const muscleItems: MuscleExposureItem[] = [];
  MUSCLES.forEach(m => {
    const data = muscleMap.get(m.id) || { volume: 0, sets: 0, dynamicVolume: 0 };
    const pctOfMax = maxMuscleExposure > 0 ? (data.volume / maxMuscleExposure) * 100 : 0;

    let exposureLevel: ExposureLevel = 'low';
    if (pctOfMax >= 60) {
      exposureLevel = 'high';
    } else if (pctOfMax >= 25) {
      exposureLevel = 'moderate';
    }

    muscleItems.push({
      muscleId: m.id,
      muscleName: m.name,
      commonName: m.commonName,
      regionId: m.regionId,
      totalVolume: Math.round(data.volume * 10) / 10,
      totalSets: Math.round(data.sets * 10) / 10,
      exposureScore: Math.round(data.volume),
      exposureLevel,
      percentageOfMax: Math.round(pctOfMax),
    });
  });

  // STABILIZER HANDLING CHOICE:
  // In liftr's exercise catalog taxonomy, Primary + Secondary muscle contributions
  // strictly sum to 100% of an exercise's dynamic load, while Stabilizers represent
  // supplementary isometric work.
  // We exclude stabilizers from the region percentage-of-total calculations so that
  // region workload distribution strictly reflects targeted dynamic training and sums to 100%.
  // Stabilizer muscles still receive full credit in their individual muscle volume,
  // sets, and exposure scores.
  let totalDynamicVolume = 0;
  muscleMap.forEach(val => {
    totalDynamicVolume += val.dynamicVolume;
  });

  const regionItems: RegionExposureItem[] = [];
  MUSCLE_REGIONS.forEach(reg => {
    const regMuscles = muscleItems.filter(mi => mi.regionId === reg.id);
    const regVolume = regMuscles.reduce((sum, mi) => sum + mi.totalVolume, 0);
    const regSets = regMuscles.reduce((sum, mi) => sum + mi.totalSets, 0);

    let regDynamicVolume = 0;
    for (const mi of regMuscles) {
      const data = muscleMap.get(mi.muscleId);
      if (data) {
        regDynamicVolume += data.dynamicVolume;
      }
    }

    const pctOfTotal = totalDynamicVolume > 0 ? (regDynamicVolume / totalDynamicVolume) * 100 : 0;

    let exposureLevel: ExposureLevel = 'low';
    if (pctOfTotal >= 25) {
      exposureLevel = 'high';
    } else if (pctOfTotal >= 10) {
      exposureLevel = 'moderate';
    }

    regionItems.push({
      regionId: reg.id,
      regionName: reg.name,
      totalVolume: Math.round(regVolume * 10) / 10,
      totalSets: Math.round(regSets * 10) / 10,
      exposureScore: Math.round(regVolume),
      exposureLevel,
      percentageOfTotal: Math.round(pctOfTotal * 10) / 10,
      muscles: regMuscles.sort((a, b) => b.totalVolume - a.totalVolume),
    });
  });

  const topMuscles = [...muscleItems].filter(m => m.totalVolume > 0).sort((a, b) => b.totalVolume - a.totalVolume);

  return {
    timeframe,
    totalAnalyzedWorkouts: targetWorkouts.length,
    totalVolume: Math.round(overallVolume * 10) / 10,
    totalSets: overallSets,
    regions: regionItems.sort((a, b) => b.totalVolume - a.totalVolume),
    topMuscles,
  };
}

