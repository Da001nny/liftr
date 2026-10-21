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
  CONTRIBUTIONS_BY_EXERCISE,
  EXERCISES
} from '../data/exerciseCatalog';
import { WeightUnit, kgToLbs } from './units';
import { 
  getWorkoutsCsvHeaders, 
  getBodyweightCsvHeaders, 
  STEPS_CSV_HEADERS,
  CSV_DEFAULT_WORKOUT_NAME,
  CSV_DEFAULT_ENTRY_SOURCE
} from '../constants/csvHeaders';

export interface ExerciseSet {
  weight: number; // in canonical kg
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
export function calculateEstimated1RM(weight: number, reps: number, unrounded = false): number {
  if (weight <= 0 || reps <= 0) return 0;
  if (reps === 1) return weight;
  const epley = weight * (1 + reps / 30);
  if (unrounded) return epley;
  return Math.round(epley * 100) / 100;
}

/**
 * Shared helper to determine if a set is countable for working volume, 1RM, and PR calculations.
 * Counts ONLY completed, non-warmup sets with weight > 0 and reps > 0.
 * Incomplete sets, warmup sets, or sets with non-positive weight/reps return false.
 * Drop ('drop') and failure ('failure') sets count as working sets; only warmup ('warmup') sets are excluded.
 */
export function isCountableSet(set: {
  weight?: number | null;
  reps?: number | null;
  completed?: boolean | null;
  is_completed?: boolean | null;
  set_type?: string | null;
} | null | undefined): boolean {
  if (!set) return false;
  const isCompleted = set.completed ?? set.is_completed ?? false;
  if (!isCompleted) return false;
  if (set.set_type === 'warmup') return false;
  const weight = Number(set.weight) || 0;
  const reps = Number(set.reps) || 0;
  return weight > 0 && reps > 0;
}

/**
 * Authoritative single set volume calculation.
 * Counts ONLY completed, non-warmup sets with weight > 0 and reps > 0 via isCountableSet.
 * Incomplete sets, warmup sets, or sets with non-positive weight/reps return 0.
 *
 * Accepts either:
 *   - A set object: { weight, reps, completed?, is_completed?, set_type? }, unrounded?: boolean
 *   - Direct weight and reps numbers: (weight, reps, unrounded?: boolean)
 */
export function calculateSetVolume(
  setOrWeight: {
    weight?: number | null;
    reps?: number | null;
    completed?: boolean | null;
    is_completed?: boolean | null;
    set_type?: string | null;
  } | number | null | undefined,
  repsOrUnrounded?: number | boolean,
  unrounded = false
): number {
  if (typeof setOrWeight === 'number') {
    const weight = setOrWeight;
    const reps = typeof repsOrUnrounded === 'number' ? repsOrUnrounded : 0;
    const isUnrounded = typeof repsOrUnrounded === 'boolean' ? repsOrUnrounded : unrounded;
    if (weight <= 0 || reps <= 0) return 0;
    if (isUnrounded) return weight * reps;
    return Math.round(weight * reps * 100) / 100;
  }

  if (!isCountableSet(setOrWeight)) return 0;
  const weight = Number(setOrWeight!.weight) || 0;
  const reps = Number(setOrWeight!.reps) || 0;
  const isUnrounded = typeof repsOrUnrounded === 'boolean' ? repsOrUnrounded : unrounded;
  if (isUnrounded) return weight * reps;
  return Math.round(weight * reps * 100) / 100;
}

/**
 * Authoritative workout totals calculator across a collection of sets.
 * Evaluates:
 * - totalVolume: accumulated volume across completed, non-warmup working sets (weight > 0 and reps > 0)
 * - completedWorkingSets: count of completed, non-warmup working sets
 * - completedWorkingReps: count of completed, non-warmup working reps
 * 
 * NOTE: Drop ('drop') and failure ('failure') sets count as working sets.
 * Warmup ('warmup') sets and incomplete sets are strictly excluded.
 */
export function calculateWorkoutTotals(sets: Array<{
  weight?: number | null;
  reps?: number | null;
  completed?: boolean | null;
  is_completed?: boolean | null;
  set_type?: string | null;
}>): {
  totalVolume: number;
  completedWorkingSets: number;
  completedWorkingReps: number;
} {
  let totalVolume = 0;
  let completedWorkingSets = 0;
  let completedWorkingReps = 0;

  for (const s of sets || []) {
    if (isCountableSet(s)) {
      totalVolume += calculateSetVolume(s);
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

export interface HistoricalPRCandidateSet {
  workoutId: string;
  setId: string;
  weight: number;
  reps: number;
  achievedAt: string;
}

export interface GeneratedPRRecord {
  user_id: string;
  exercise_id: string;
  workout_id: string;
  workout_set_id: string;
  category: 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';
  value: number;
  weight: number | null;
  reps: number | null;
  achieved_at: string;
}

/**
 * Authoritative historical PR computation across a chronological list of completed working sets for an exercise.
 * Shared between backend (server.ts) and unit tests to ensure single PR engine implementation.
 */
export function calculateHistoricalPRs(
  candidateSets: HistoricalPRCandidateSet[],
  exerciseId: string,
  userId: string
): GeneratedPRRecord[] {
  let heaviestWeight = 0;
  let bestEstimated1RM = 0;
  let bestSingleSetVolume = 0;
  const repPRsByWeight: Record<number, number> = {};
  const prs: GeneratedPRRecord[] = [];

  for (const cand of candidateSets) {
    const res = detectPersonalRecords(
      { weight: cand.weight, reps: cand.reps },
      { heaviestWeight, bestEstimated1RM, bestSingleSetVolume, repPRsByWeight }
    );

    if (res.isHeaviestWeightPR && res.newHeaviestWeight !== undefined) {
      heaviestWeight = res.newHeaviestWeight;
      prs.push({
        user_id: userId,
        exercise_id: exerciseId,
        workout_id: cand.workoutId,
        workout_set_id: cand.setId,
        category: 'heaviest_weight',
        value: res.newHeaviestWeight,
        weight: res.newHeaviestWeight,
        reps: cand.reps,
        achieved_at: cand.achievedAt,
      });
    }

    if (res.isEstimated1RMPR && res.newEstimated1RM !== undefined) {
      bestEstimated1RM = res.newEstimated1RM;
      prs.push({
        user_id: userId,
        exercise_id: exerciseId,
        workout_id: cand.workoutId,
        workout_set_id: cand.setId,
        category: 'best_estimated_1rm',
        value: res.newEstimated1RM,
        weight: cand.weight,
        reps: cand.reps,
        achieved_at: cand.achievedAt,
      });
    }

    if (res.isSingleSetVolumePR && res.newSingleSetVolume !== undefined) {
      bestSingleSetVolume = res.newSingleSetVolume;
      prs.push({
        user_id: userId,
        exercise_id: exerciseId,
        workout_id: cand.workoutId,
        workout_set_id: cand.setId,
        category: 'best_single_set_volume',
        value: res.newSingleSetVolume,
        weight: cand.weight,
        reps: cand.reps,
        achieved_at: cand.achievedAt,
      });
    }

    if (res.isRepPR && res.newRepPR) {
      repPRsByWeight[res.newRepPR.weight] = res.newRepPR.reps;
      prs.push({
        user_id: userId,
        exercise_id: exerciseId,
        workout_id: cand.workoutId,
        workout_set_id: cand.setId,
        category: 'rep_pr',
        value: res.newRepPR.weight,
        weight: res.newRepPR.weight,
        reps: res.newRepPR.reps,
        achieved_at: cand.achievedAt,
      });
    }
  }

  return prs;
}

/**
 * PR Detection across all four categories:
 * 1. Heaviest weight
 * 2. Best estimated 1RM
 * 3. Best single-set volume (weight * reps for ONE set)
 * 4. Rep PR at a given weight
 * 
 * Strict '>' rule: An exact tie is NEVER a new PR.
 * Evaluates candidate sets using isCountableSet and unrounded volume compared at 4 decimals.
 */
export function detectPersonalRecords(
  candidate: PersonalRecordCandidate | {
    weight?: number | null;
    reps?: number | null;
    completed?: boolean | null;
    is_completed?: boolean | null;
    set_type?: string | null;
  },
  currentRecords: PersonalRecordState
): DetectedPRs {
  const candidateSet = {
    weight: candidate.weight,
    reps: candidate.reps,
    completed: (candidate as any).completed ?? (candidate as any).is_completed ?? true,
    set_type: (candidate as any).set_type ?? 'working',
  };

  if (!isCountableSet(candidateSet)) {
    return {
      isHeaviestWeightPR: false,
      isEstimated1RMPR: false,
      isSingleSetVolumePR: false,
      isRepPR: false,
    };
  }

  const weight = Number(candidate.weight) || 0;
  const reps = Number(candidate.reps) || 0;

  const est1RM = calculateEstimated1RM(weight, reps);
  const unroundedVolume = calculateSetVolume(candidateSet, true);

  // Strict > for all categories: compare canonical values rounded to 4 decimals
  // to eliminate floating-point noise so a tie is never treated as a PR.
  const candWeight = Math.round(weight * 10000) / 10000;
  const currWeight = Math.round((currentRecords.heaviestWeight ?? 0) * 10000) / 10000;
  const isHeaviestWeightPR = candWeight > currWeight;

  const candEst1RM = Math.round(est1RM * 10000) / 10000;
  const currEst1RM = Math.round((currentRecords.bestEstimated1RM ?? 0) * 10000) / 10000;
  const isEstimated1RMPR = candEst1RM > currEst1RM;

  const candVol = Math.round(unroundedVolume * 10000) / 10000;
  const currVol = Math.round((currentRecords.bestSingleSetVolume ?? 0) * 10000) / 10000;
  const isSingleSetVolumePR = candVol > currVol;

  // Rep PR: Reps must strictly exceed the best reps achieved at ANY recorded weight >= candidate weight.
  // Weights are compared at 4 decimal places of precision to eliminate floating-point noise.
  let bestRepsAtOrAbove = 0;
  if (currentRecords.repPRsByWeight) {
    for (const [recordedWeightStr, recordedReps] of Object.entries(currentRecords.repPRsByWeight)) {
      const recWeight = Math.round(Number(recordedWeightStr) * 10000) / 10000;
      if (recWeight >= candWeight) {
        if (recordedReps > bestRepsAtOrAbove) {
          bestRepsAtOrAbove = recordedReps;
        }
      }
    }
  }
  const isRepPR = reps > bestRepsAtOrAbove;

  return {
    isHeaviestWeightPR,
    isEstimated1RMPR,
    isSingleSetVolumePR,
    isRepPR,
    newHeaviestWeight: isHeaviestWeightPR ? weight : undefined,
    newEstimated1RM: isEstimated1RMPR ? est1RM : undefined,
    newSingleSetVolume: isSingleSetVolumePR ? unroundedVolume : undefined,
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
export { toUtcIsoString, formatLocalTimestamp } from './date';

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

  // Canonical storage: treats every stored row as kg whatever the leftover unit column says
  const getCanonicalWeight = (e: BodyweightEntryRow): number => {
    return Number(e.weight) || 0;
  };

  const starting = getCanonicalWeight(sorted[0]);
  const current = getCanonicalWeight(sorted[sorted.length - 1]);
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
    ? Math.round((last7DaysEntries.reduce((sum, e) => sum + getCanonicalWeight(e), 0) / last7DaysEntries.length) * 100) / 100
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
    const avg30DaysAgo = entries30DaysAgo.reduce((sum, e) => sum + getCanonicalWeight(e), 0) / entries30DaysAgo.length;
    thirtyDayTrend = Math.round((sevenDayAverage - avg30DaysAgo) * 100) / 100;
  }
  // Return thirtyDayTrend: null when there's no data in the comparison window, instead of falling back to net change.

  return {
    currentWeight: current,
    startingWeight: starting,
    netChange,
    sevenDayAverage,
    thirtyDayTrend,
    unit: 'kg',
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

  // Filter to completed workouts only
  const completedWorkouts = workouts.filter(w => w.status === 'completed');

  // Sort ascending by completion date
  const sorted = [...completedWorkouts].sort((a, b) => {
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
      if (!isCountableSet(set)) continue;

      const weight = Number(set.weight) || 0;
      const reps = Number(set.reps) || 0;

      const vol = calculateSetVolume(set);
      totalVolume += vol;

      if (weight > heaviestWeight) heaviestWeight = weight;
      if (reps > maxReps) maxReps = reps;

      const set1RM = calculateEstimated1RM(weight, reps);
      if (set1RM > estimated1RM) estimated1RM = set1RM;
    }

    if (heaviestWeight > 0 || maxReps > 0 || totalVolume > 0) {
      points.push({
        date: wDate,
        workoutId: w.id,
        workoutName: w.name || null,
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

// ============================================================================
// PHASE 6: DETAILED ANALYTICS EXPANSION
// ============================================================================

export type TrendPeriodPresetId =
  | 'thisMonth'
  | 'lastMonth'
  | 'last30'
  | 'prior30'
  | 'last7'
  | 'prior7';

export interface TrendPeriodSpec {
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  presetId?: TrendPeriodPresetId;
  label?: string;
}

export type TrendFilter =
  | { type: 'total_volume' }
  | { type: 'exercise'; exerciseId: string }
  | { type: 'region'; regionId: string };

export interface TrendPeriodMetrics {
  startDate: string;
  endDate: string;
  presetId?: TrendPeriodPresetId;
  label?: string;
  volume: number;
  workoutCount: number;
  workingSetsCount: number;
  hasData: boolean;
}


export type RangeTrendStatusCode =
  | 'insufficientDataBoth'
  | 'insufficientDataComparison'
  | 'insufficientDataSelected'
  | 'success';

export interface RangeTrendStatus {
  code: RangeTrendStatusCode;
  params?: Record<string, string | number>;
}

export interface TrendComparisonResult {
  periodA: TrendPeriodMetrics;
  periodB: TrendPeriodMetrics;
  absoluteChange: number | null;
  percentageChange: number | null;
  hasEnoughData: boolean;
  status: RangeTrendStatus;
  filterType: 'total_volume' | 'exercise' | 'region';
  targetName: string | null;
}

/**
 * Calculates trend comparisons across two customizable date windows.
 * Evaluates: total volume, a specific exercise, or a muscle region.
 * Returns null / "not enough data" when either comparison period has no data.
 * All volume and set counts route strictly through authoritative calculateWorkoutTotals.
 */
export function calculateRangeTrendComparison(
  workouts: any[],
  periodA: TrendPeriodSpec,
  periodB: TrendPeriodSpec,
  filter: TrendFilter
): TrendComparisonResult {
  const completed = (workouts || []).filter(w => w.status === 'completed');

  const evalPeriod = (spec: TrendPeriodSpec): TrendPeriodMetrics => {
    let volume = 0;
    let workoutCount = 0;
    let workingSetsCount = 0;

    for (const w of completed) {
      const wDate = (w.completed_at || w.started_at || w.created_at || '').slice(0, 10);
      if (wDate < spec.startDate || wDate > spec.endDate) continue;

      let workoutContributed = false;

      if (filter.type === 'total_volume') {
        for (const we of w.workout_exercises || []) {
          const sets = we.workout_sets || [];
          const totals = calculateWorkoutTotals(sets);
          if (totals.totalVolume > 0 || totals.completedWorkingSets > 0) {
            volume += totals.totalVolume;
            workingSetsCount += totals.completedWorkingSets;
            workoutContributed = true;
          }
        }
      } else if (filter.type === 'exercise') {
        const we = (w.workout_exercises || []).find((e: any) => e.exercise_id === filter.exerciseId);
        if (we) {
          const sets = we.workout_sets || [];
          const totals = calculateWorkoutTotals(sets);
          if (totals.totalVolume > 0 || totals.completedWorkingSets > 0) {
            volume += totals.totalVolume;
            workingSetsCount += totals.completedWorkingSets;
            workoutContributed = true;
          }
        }
      } else if (filter.type === 'region') {
        for (const we of w.workout_exercises || []) {
          const contribs = CONTRIBUTIONS_BY_EXERCISE.get(we.exercise_id) || [];
          if (contribs.length === 0) continue;

          // Only include dynamic contributions (exclude stabilizers, consistent with calculateMuscleExposureAnalytics)
          const regionContrib = contribs.filter(c => {
            if (c.role === 'Stabilizer') return false;
            const muscle = MUSCLES.find(m => m.id === c.muscleId);
            return muscle?.regionId === filter.regionId;
          });

          if (regionContrib.length === 0) continue;

          const sets = we.workout_sets || [];
          const totals = calculateWorkoutTotals(sets);
          if (totals.totalVolume > 0) {
            const regionalPercentage = regionContrib.reduce((sum, c) => sum + (c.percentage || 0), 0);
            const factor = regionalPercentage / 100;
            volume += totals.totalVolume * factor;
            workingSetsCount += totals.completedWorkingSets * factor;
            workoutContributed = true;
          }
        }
      }

      if (workoutContributed) {
        workoutCount += 1;
      }
    }

    volume = Math.round(volume * 10) / 10;
    workingSetsCount = Math.round(workingSetsCount * 10) / 10;
    const hasData = workoutCount > 0 && volume > 0;

    return {
      startDate: spec.startDate,
      endDate: spec.endDate,
      presetId: spec.presetId,
      label: spec.label || `${spec.startDate} - ${spec.endDate}`,
      volume,
      workoutCount,
      workingSetsCount,
      hasData,
    };
  };

  const metricsA = evalPeriod(periodA);
  const metricsB = evalPeriod(periodB);

  // Target name resolution
  let targetName: string | null = null;
  if (filter.type === 'exercise') {
    const ex = EXERCISES.find(e => e.id === filter.exerciseId);
    targetName = ex ? ex.name : filter.exerciseId;
  } else if (filter.type === 'region') {
    const reg = MUSCLE_REGIONS.find(r => r.id === filter.regionId);
    targetName = reg ? `${reg.name} Region` : filter.regionId;
  }

  // Strict empty data handling: do NOT invent a number!
  if (!metricsA.hasData && !metricsB.hasData) {
    return {
      periodA: metricsA,
      periodB: metricsB,
      absoluteChange: null,
      percentageChange: null,
      hasEnoughData: false,
      status: { code: 'insufficientDataBoth' },
      filterType: filter.type,
      targetName,
    };
  }

  if (!metricsB.hasData) {
    return {
      periodA: metricsA,
      periodB: metricsB,
      absoluteChange: null,
      percentageChange: null,
      hasEnoughData: false,
      status: { code: 'insufficientDataComparison' },
      filterType: filter.type,
      targetName,
    };
  }

  if (!metricsA.hasData) {
    return {
      periodA: metricsA,
      periodB: metricsB,
      absoluteChange: null,
      percentageChange: null,
      hasEnoughData: false,
      status: { code: 'insufficientDataSelected' },
      filterType: filter.type,
      targetName,
    };
  }

  // Baseline determination: The earlier period is strictly the baseline for percentage change.
  const isPeriodAEarlier = periodA.startDate.localeCompare(periodB.startDate) < 0;
  const earlierMetrics = isPeriodAEarlier ? metricsA : metricsB;
  const laterMetrics = isPeriodAEarlier ? metricsB : metricsA;

  // Percentage change formula: ((later.volume - earlier.volume) / earlier.volume) * 100%
  // Baseline is strictly earlierMetrics (the earlier chronological period).
  const absChange = Math.round((laterMetrics.volume - earlierMetrics.volume) * 10) / 10;
  const pctChange = earlierMetrics.volume > 0 
    ? Math.round(((laterMetrics.volume - earlierMetrics.volume) / earlierMetrics.volume) * 1000) / 10
    : null;

  return {
    periodA: metricsA,
    periodB: metricsB,
    absoluteChange: absChange,
    percentageChange: pctChange,
    hasEnoughData: true,
    status: { code: 'success', params: { pctChange: pctChange ?? 0 } },
    filterType: filter.type,
    targetName,
  };
}

/**
 * Returns preset comparison windows with strict UTC date math.
 */
export function getPresetComparisonPeriods(
  preset: 'this_month_vs_last_month' | 'last_30_days' | 'last_7_days',
  refDate?: Date
): { periodA: TrendPeriodSpec; periodB: TrendPeriodSpec } {
  const now = refDate || new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth(); // 0 - 11
  const todayStr = now.toISOString().slice(0, 10);

  if (preset === 'this_month_vs_last_month') {
    // Period A: Current month (from 1st to end of current month)
    const thisMonthStart = new Date(Date.UTC(y, m, 1)).toISOString().slice(0, 10);
    const thisMonthEnd = new Date(Date.UTC(y, m + 1, 0)).toISOString().slice(0, 10);

    // Period B: Prior month (from 1st of prior month to end of prior month)
    const lastMonthStart = new Date(Date.UTC(y, m - 1, 1)).toISOString().slice(0, 10);
    const lastMonthEnd = new Date(Date.UTC(y, m, 0)).toISOString().slice(0, 10);

    return {
      periodA: { startDate: thisMonthStart, endDate: thisMonthEnd, presetId: 'thisMonth' },
      periodB: { startDate: lastMonthStart, endDate: lastMonthEnd, presetId: 'lastMonth' },
    };
  }

  if (preset === 'last_30_days') {
    const curStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 29)).toISOString().slice(0, 10);
    const prevStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 59)).toISOString().slice(0, 10);
    const prevEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 30)).toISOString().slice(0, 10);

    return {
      periodA: { startDate: curStart, endDate: todayStr, presetId: 'last30' },
      periodB: { startDate: prevStart, endDate: prevEnd, presetId: 'prior30' },
    };
  }

  // last_7_days
  const curStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 6)).toISOString().slice(0, 10);
  const prevStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 13)).toISOString().slice(0, 10);
  const prevEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 7)).toISOString().slice(0, 10);

  return {
    periodA: { startDate: curStart, endDate: todayStr, presetId: 'last7' },
    periodB: { startDate: prevStart, endDate: prevEnd, presetId: 'prior7' },
  };
}

// ============================================================================
// CROSS-EXERCISE COMPARISON
// ============================================================================

export interface CrossExerciseSeries {
  id: string;
  name: string;
  equipment: string;
  hasData: boolean;
  points: ExerciseProgressPoint[];
  best1RM: number;
  bestVolume: number;
  latest1RM: number;
  latestVolume: number;
}

export type CrossExerciseStatusCode =
  | 'noHistoryBoth'
  | 'noHistorySingle'
  | 'success';

export interface CrossExerciseStatus {
  code: CrossExerciseStatusCode;
  params?: {
    exerciseName?: string;
  };
}

export interface CrossExerciseComparison {
  exerciseA: CrossExerciseSeries;
  exerciseB: CrossExerciseSeries;
  hasDataAtLeastOne: boolean;
  hasDataBoth: boolean;
  status: CrossExerciseStatus;
}

/**
 * Compares two exercises side-by-side using authoritative calculateExerciseProgress.
 * Reuses the authoritative Epley formula without reimplementing it.
 */
export function calculateCrossExerciseComparison(
  workouts: any[],
  exerciseAId: string,
  exerciseBId: string,
  range: '7d' | '30d' | '3m' | '6m' | '1y' | 'all' = 'all'
): CrossExerciseComparison {
  const exAObj = EXERCISES.find(e => e.id === exerciseAId);
  const exBObj = EXERCISES.find(e => e.id === exerciseBId);

  const pointsA = calculateExerciseProgress(workouts, exerciseAId, range);
  const pointsB = calculateExerciseProgress(workouts, exerciseBId, range);

  const buildSeries = (id: string, obj: any, points: ExerciseProgressPoint[]): CrossExerciseSeries => {
    const hasData = points.length > 0;
    const best1RM = hasData ? Math.max(...points.map(p => p.estimated1RM)) : 0;
    const bestVolume = hasData ? Math.max(...points.map(p => p.totalVolume)) : 0;
    const latest = points[points.length - 1];

    return {
      id,
      name: obj ? obj.name : id,
      equipment: obj ? obj.equipment : '',
      hasData,
      points,
      best1RM,
      bestVolume,
      latest1RM: latest ? latest.estimated1RM : 0,
      latestVolume: latest ? latest.totalVolume : 0,
    };
  };

  const seriesA = buildSeries(exerciseAId, exAObj, pointsA);
  const seriesB = buildSeries(exerciseBId, exBObj, pointsB);

  const hasDataBoth = seriesA.hasData && seriesB.hasData;
  const hasDataAtLeastOne = seriesA.hasData || seriesB.hasData;

  let status: CrossExerciseStatus;
  if (!seriesA.hasData && !seriesB.hasData) {
    status = { code: 'noHistoryBoth' };
  } else if (!seriesA.hasData) {
    status = { code: 'noHistorySingle', params: { exerciseName: seriesA.name } };
  } else if (!seriesB.hasData) {
    status = { code: 'noHistorySingle', params: { exerciseName: seriesB.name } };
  } else {
    status = { code: 'success' };
  }

  return {
    exerciseA: seriesA,
    exerciseB: seriesB,
    hasDataAtLeastOne,
    hasDataBoth,
    status,
  };
}

// ============================================================================
// CSV EXPORT GENERATORS (RFC 4180 COMPLIANT + UTF-8 BOM FOR EXCEL / SHEETS)
// ============================================================================

/**
 * Escapes an individual cell value according to RFC 4180.
 * Neutralizes formula injection on text cells starting with =, +, -, @ by prepending a single quote (').
 * Numbers (typeof val === 'number') and valid numeric literals are NOT neutralized.
 * If the string contains comma, double quote, or newlines, wrap in quotes and escape quotes with double quotes.
 */
export function escapeCsvCell(val: any): string {
  if (val === null || val === undefined) return '';

  // Numbers (typeof val === 'number') are not formula injection risks; output directly
  if (typeof val === 'number') {
    return String(val);
  }

  let str = String(val);

  // Neutralize formula injection on text cells starting with =, +, -, @, TAB (\t), or CR (\r)
  // Every string cell starting with these characters gets a leading apostrophe (')
  if (/^[=+\-@\t\r]/.test(str)) {
    str = `'${str}`;
  }

  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Authoritative CSV export of workout history:
 * One row per set: date, workout, exercise, set type, weight, reps, volume, estimated 1RM.
 * Uses calculateSetVolume for volume and calculateEstimated1RM for 1RM.
 * WeightUnit is strictly required. Values are converted once and rounded once at the end.
 */
export function generateWorkoutsCsv(workouts: any[], weightUnit: WeightUnit): string {
  const completed = (workouts || []).filter(w => w.status === 'completed');
  const sorted = [...completed].sort((a, b) => {
    const dateA = a.completed_at || a.started_at || a.created_at || '';
    const dateB = b.completed_at || b.started_at || b.created_at || '';
    return dateA.localeCompare(dateB);
  });

  const headers = getWorkoutsCsvHeaders(weightUnit);
  const rows: string[] = [headers.join(',')];

  for (const w of sorted) {
    const date = (w.completed_at || w.started_at || w.created_at || '').slice(0, 10);
    const workoutName = w.name || CSV_DEFAULT_WORKOUT_NAME;

    for (const we of w.workout_exercises || []) {
      const exerciseObj = EXERCISES.find(e => e.id === we.exercise_id);
      const exerciseName = exerciseObj ? exerciseObj.name : we.exercise_id;

      for (const set of we.workout_sets || []) {
        const setType = set.set_type || 'working';
        const weight = Number(set.weight) || 0;
        const reps = Number(set.reps) || 0;

        // Unrounded volume in canonical kg from authoritative calculateSetVolume
        const rawVolumeKg = calculateSetVolume(set, true);

        // Unrounded estimated 1RM in canonical kg from authoritative calculateEstimated1RM via isCountableSet
        const rawEst1RMKg = isCountableSet(set)
          ? calculateEstimated1RM(weight, reps, true)
          : 0;

        const isLbs = weightUnit === 'lbs';
        const displayWeight = isLbs
          ? Math.round(kgToLbs(weight) * 100) / 100
          : Math.round(weight * 10000) / 10000;
        const displayVolume = isLbs
          ? Math.round(kgToLbs(rawVolumeKg) * 100) / 100
          : Math.round(rawVolumeKg * 100) / 100;
        const displayEst1RM = isLbs
          ? Math.round(kgToLbs(rawEst1RMKg) * 100) / 100
          : Math.round(rawEst1RMKg * 100) / 100;

        rows.push([
          escapeCsvCell(date),
          escapeCsvCell(workoutName),
          escapeCsvCell(exerciseName),
          escapeCsvCell(setType),
          escapeCsvCell(displayWeight),
          escapeCsvCell(reps),
          escapeCsvCell(displayVolume),
          escapeCsvCell(displayEst1RM),
        ].join(','));
      }
    }
  }

  // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility and join with CRLF (\r\n)
  return '\uFEFF' + rows.join('\r\n');
}

/**
 * Authoritative CSV export of bodyweight entries.
 * WeightUnit is strictly required. Values are converted once and rounded once at the end.
 */
export function generateBodyweightCsv(entries: BodyweightEntryRow[], weightUnit: WeightUnit): string {
  const sorted = [...(entries || [])].sort((a, b) => a.date.localeCompare(b.date));
  const headers = getBodyweightCsvHeaders(weightUnit);
  const rows: string[] = [headers.join(',')];

  for (const e of sorted) {
    const canonicalKg = Number(e.weight) || 0;
    const isLbs = weightUnit === 'lbs';
    const displayWeight = isLbs
      ? Math.round(kgToLbs(canonicalKg) * 100) / 100
      : Math.round(canonicalKg * 10000) / 10000;
    const displayUnit = weightUnit;

    rows.push([
      escapeCsvCell(e.date),
      escapeCsvCell(displayWeight),
      escapeCsvCell(displayUnit),
      escapeCsvCell(e.notes || ''),
      escapeCsvCell(e.source || CSV_DEFAULT_ENTRY_SOURCE),
    ].join(','));
  }

  return '\uFEFF' + rows.join('\r\n');
}

/**
 * Authoritative CSV export of daily steps & activity entries.
 * Reconciled to real Supabase step_entries schema columns: date, step_count, goal, source.
 */
export function generateStepsCsv(entries: any[]): string {
  const sorted = [...(entries || [])].sort((a, b) => (a.date || '').localeCompare(b.date || ''));
  const headers = STEPS_CSV_HEADERS;
  const rows: string[] = [headers.join(',')];

  for (const s of sorted) {
    const stepCount = s.step_count !== undefined ? s.step_count : (s.steps !== undefined ? s.steps : 0);
    const goal = s.goal !== undefined ? s.goal : 10000;
    const source = s.source || CSV_DEFAULT_ENTRY_SOURCE;
    rows.push([
      escapeCsvCell(s.date),
      escapeCsvCell(stepCount),
      escapeCsvCell(goal),
      escapeCsvCell(source),
    ].join(','));
  }

  return '\uFEFF' + rows.join('\r\n');
}

