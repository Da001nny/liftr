/**
 * liftr: Save Result Formatting and Response Builders
 * 
 * Pure functions to parse and format the structured JSON returned by save_workout_session RPC:
 * { workout: <workout row>, already_completed: boolean, exercises: [ { ...exercise, sets: [ ... ] } ] }
 */

export interface UnwrappedSaveResult {
  workout: any;
  exercises: any[];
  alreadyCompleted: boolean;
}

export function unwrapSaveResult(rpcData: any): UnwrappedSaveResult {
  if (!rpcData || typeof rpcData !== 'object' || Array.isArray(rpcData)) {
    throw new Error('Invalid save result: expected an object');
  }
  if (!rpcData.workout || typeof rpcData.workout !== 'object' || Array.isArray(rpcData.workout)) {
    throw new Error('Invalid save result: missing workout object');
  }

  return {
    workout: rpcData.workout,
    exercises: Array.isArray(rpcData.exercises) ? rpcData.exercises : [],
    alreadyCompleted: Boolean(rpcData.already_completed ?? rpcData.alreadyCompleted),
  };
}

export function formatSavedExercises(
  exercises: any[] = [],
  exerciseMap?: Map<string, any> | Record<string, any>
): any[] {
  return (exercises || []).map((we: any) => {
    let exMeta: any = undefined;
    if (exerciseMap) {
      if (typeof (exerciseMap as any).get === 'function') {
        exMeta = (exerciseMap as Map<string, any>).get(we.exercise_id);
      } else {
        exMeta = (exerciseMap as Record<string, any>)[we.exercise_id];
      }
    }

    const rawSets = we.sets || [];
    const sortedSets = [...rawSets].sort((a: any, b: any) => (a.set_number ?? 0) - (b.set_number ?? 0));

    return {
      ...we,
      exerciseName: exMeta ? exMeta.name : we.exercise_id,
      exerciseTargetRegion: exMeta ? (exMeta.targetRegionId || exMeta.target_region_id || '') : '',
      sets: sortedSets,
    };
  });
}

export function buildCompleteResponse(
  rpcData: any,
  newPRs: any[] = []
): { workout: any; newPRs: any[] } {
  const { workout } = unwrapSaveResult(rpcData);
  return {
    workout,
    newPRs,
  };
}

export function buildUpdateResponse(
  rpcData: any,
  exerciseMap?: Map<string, any> | Record<string, any>
): any {
  const { workout, exercises } = unwrapSaveResult(rpcData);
  const formattedExercises = formatSavedExercises(exercises, exerciseMap);

  return {
    ...workout,
    exercises: formattedExercises,
  };
}
