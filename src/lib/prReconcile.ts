/**
 * liftr: Authoritative Personal Records Reconciliation
 * 
 * Reconciles personal records by calculating authoritative PRs across a user's completed workouts
 * and persisting them atomically via the replace_user_personal_records RPC.
 */

import { isCountableSet, calculateHistoricalPRs } from './calculations.ts';

export async function reconcileUserPRs(
  client: any,
  userId: string,
  targetExerciseId?: string
): Promise<any[]> {
  const { data: workouts, error: wError } = await client
    .from('workouts')
    .select(`
      id,
      started_at,
      completed_at,
      workout_exercises (
        id,
        exercise_id,
        workout_sets (
          id,
          set_number,
          set_type,
          weight,
          reps,
          completed,
          completed_at
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'completed')
    .order('completed_at', { ascending: true, nullsFirst: false });

  if (wError) {
    throw new Error(`Failed to fetch completed workouts: ${wError.message}`);
  }
  if (!workouts) {
    throw new Error('Failed to fetch completed workouts: No data returned');
  }

  // Group candidate sets by exerciseId across chronological workouts
  const exerciseSetsMap = new Map<string, Array<{
    workoutId: string;
    setId: string;
    weight: number;
    reps: number;
    achievedAt: string;
  }>>();

  for (const w of workouts) {
    const achievedAt = w.completed_at || w.started_at || new Date().toISOString();
    for (const we of (w.workout_exercises || [])) {
      if (targetExerciseId && we.exercise_id !== targetExerciseId) continue;
      if (!exerciseSetsMap.has(we.exercise_id)) {
        exerciseSetsMap.set(we.exercise_id, []);
      }
      for (const s of (we.workout_sets || [])) {
        if (isCountableSet(s)) {
          exerciseSetsMap.get(we.exercise_id)!.push({
            workoutId: w.id,
            setId: s.id,
            weight: Number(s.weight),
            reps: Number(s.reps),
            achievedAt: s.completed_at || achievedAt,
          });
        }
      }
    }
  }

  const prsToInsert: Array<{
    user_id: string;
    exercise_id: string;
    workout_id: string;
    workout_set_id: string;
    category: 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';
    value: number;
    weight: number | null;
    reps: number | null;
    achieved_at: string;
  }> = [];

  for (const [exId, candidateSets] of exerciseSetsMap.entries()) {
    const exercisePRs = calculateHistoricalPRs(candidateSets, exId, userId);
    prsToInsert.push(...exercisePRs);
  }

  // Replace existing PRs for the target scope atomically via database RPC
  const { data: rpcResult, error: rpcError } = await client.rpc('replace_user_personal_records', {
    p_exercise_id: targetExerciseId ?? null,
    p_rows: prsToInsert,
  });

  if (rpcError) {
    throw new Error(`Failed to replace personal records: ${rpcError.message}`);
  }

  return rpcResult || [];
}
