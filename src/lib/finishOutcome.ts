/**
 * liftr: Finish Workout Outcome Decision
 * 
 * Pure helpers determining workout completion outcomes and idempotency handling.
 */

export function decideFinishOutcome(result: unknown | null | undefined): 'completed' | 'failed' {
  if (result !== null && result !== undefined) {
    return 'completed';
  }
  return 'failed';
}

/**
 * Resolves idempotent repeat calls on workout completion.
 * - not completed (or null) -> returns null WITHOUT calling reconcile (route continues normal flow)
 * - already completed -> calls reconcile() once and returns { workout: existingWorkout, newPRs: <what reconcile returned> }
 * - if reconcile throws, the error propagates (route returns 500, client can retry again)
 */
export async function resolveRepeatCompletion<T extends { status?: string }>(
  existingWorkout: T | null | undefined,
  reconcile: () => Promise<unknown[]>
): Promise<{ workout: T; newPRs: unknown[] } | null> {
  if (!existingWorkout || existingWorkout.status !== 'completed') {
    return null;
  }
  const newPRs = await reconcile();
  return {
    workout: existingWorkout,
    newPRs,
  };
}

/**
 * Filters personal records to return only those achieved in the specified workout.
 * - Returns a new array containing only items where item.workout_id === workoutId.
 * - Does not mutate the input array.
 * - Items with null, undefined, or mismatching workout_id are excluded.
 */
export function selectPRsForWorkout<T extends { workout_id?: string | null }>(
  allPRs: T[],
  workoutId: string
): T[] {
  if (!Array.isArray(allPRs) || !workoutId) {
    return [];
  }
  return allPRs.filter(pr => pr !== null && pr !== undefined && pr.workout_id === workoutId);
}
