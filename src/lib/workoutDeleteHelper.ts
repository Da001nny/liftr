/**
 * liftr: Workout Delete and PR Replay Helper
 * 
 * Handles database deletion of a workout session and re-reconciles personal records.
 * If deletion succeeds but PR reconciliation fails, returns prsStale: true with HTTP 200
 * while logging the error, ensuring the user is not falsely blocked.
 */

import { reconcileUserPRs } from './prReconcile.ts';

export interface DeleteWorkoutOutcome {
  status: number;
  data?: {
    success: boolean;
    deletedId: string;
    prsStale?: boolean;
  };
  error?: string;
}

export async function deleteWorkoutAndReconcile(
  client: any,
  userId: string,
  workoutId: string,
  reconcileFn: (client: any, userId: string) => Promise<any> = reconcileUserPRs
): Promise<DeleteWorkoutOutcome> {
  // 1. Delete workout (CASCADE drops workout_exercises and workout_sets)
  const { error: dError } = await client
    .from('workouts')
    .delete()
    .eq('id', workoutId)
    .eq('user_id', userId);

  if (dError) {
    const errorText = `Error deleting workout: ${dError.message}`;
    return {
      status: 500,
      error: errorText,
    };
  }

  // 2. Reconcile PRs across remaining history so no phantom PRs exist!
  try {
    await reconcileFn(client, userId);
    return {
      status: 200,
      data: { success: true, deletedId: workoutId },
    };
  } catch (err: any) {
    console.error(`Failed to reconcile PRs after workout deletion ${workoutId}:`, err);
    return {
      status: 200,
      data: { success: true, deletedId: workoutId, prsStale: true },
    };
  }
}
