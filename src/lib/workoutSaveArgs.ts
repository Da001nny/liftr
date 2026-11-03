/**
 * liftr: Workout Save Arguments Builder
 * 
 * Pure helper to construct arguments for the save_workout_session database RPC.
 * Omits any parameters with undefined values and authoritative computes total volume
 * when exercises are supplied.
 */

import { calculateWorkoutTotals } from './calculations.ts';

export interface SaveWorkoutOptions {
  complete?: boolean;
}

export function buildSaveWorkoutArgs(
  workoutId: string,
  body: any = {},
  opts?: SaveWorkoutOptions
): Record<string, any> {
  const result: Record<string, any> = {};

  if (workoutId !== undefined) {
    result.p_workout_id = workoutId;
  }

  if (body.name !== undefined) {
    result.p_name = body.name;
  }

  const duration = body.durationSeconds !== undefined ? body.durationSeconds : body.duration_seconds;
  if (duration !== undefined) {
    result.p_duration_seconds = duration;
  }

  if (body.notes !== undefined) {
    result.p_notes = body.notes;
  }

  if (body.exercises !== undefined) {
    result.p_exercises = body.exercises;
  }

  if (opts && opts.complete !== undefined) {
    result.p_complete = opts.complete;
  }

  let totalVolume: number | undefined = undefined;
  if (Array.isArray(body.exercises)) {
    const allSets = body.exercises.flatMap((ex: any) => ex.sets || []).map((s: any) => ({
      ...s,
      set_type: s.set_type || s.setType,
    }));
    totalVolume = calculateWorkoutTotals(allSets).totalVolume;
  } else if (body.total_volume !== undefined) {
    totalVolume = body.total_volume;
  } else if (body.totalVolume !== undefined) {
    totalVolume = body.totalVolume;
  }

  if (totalVolume !== undefined) {
    result.p_total_volume = totalVolume;
  }

  return result;
}
