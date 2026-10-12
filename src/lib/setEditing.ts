/**
 * liftr: Authoritative Set Editing & Unit Conversion Lifecycle Engine
 * 
 * Rules:
 * 1. Typing a weight in the active unit sets raw pending text.
 * 2. When switching units mid-workout with pending text:
 *    - Parse pending text in the previous unit into canonical kg (4 decimal places).
 *    - Hold that canonical value (`heldCanonicalKg`).
 *    - Display it rounded to 1 decimal place in the new unit.
 * 3. When completing a set:
 *    - If the user has not edited the field since the switch, use the held canonical kg exactly.
 *    - If the user edited the field, parse the edited text in the current unit.
 *    - This guarantees that typing 100 kg -> switching to lbs (showing 220.5) -> completing
 *      stores exactly 100 kg, preventing 220.5 lbs (100.0171 kg) floating-point PR pollution.
 */

import { WeightUnit, parseWeightInput, formatWeightValue } from './units';
import { ActiveWorkoutSet, ActiveWorkoutExercise } from '../types/database';

export interface SetPendingInputState {
  rawText: string;
  heldCanonicalKg: number | null;
  editedSinceSwitch: boolean;
}

/**
 * Pure function: handles switching units when an input has pending unsaved text.
 */
export function handlePendingTextUnitSwitch(
  pendingText: string,
  prevUnit: WeightUnit,
  newUnit: WeightUnit
): { displayText: string; heldCanonicalKg: number | null } {
  const trimmed = pendingText.trim();
  if (trimmed === '') {
    return { displayText: '', heldCanonicalKg: null };
  }
  const canonicalKg = parseWeightInput(trimmed, prevUnit);
  if (canonicalKg <= 0) {
    return { displayText: '', heldCanonicalKg: null };
  }
  const displayText = String(formatWeightValue(canonicalKg, newUnit));
  return { displayText, heldCanonicalKg: canonicalKg };
}

/**
 * Pure function: resolves the final canonical weight (in kg) to store when completing a set.
 */
export function resolveCompletedSetWeight(params: {
  rawText?: string;
  unit: WeightUnit;
  heldCanonicalKg?: number | null;
  editedSinceSwitch?: boolean;
  fallbackWeightKg?: number;
}): number {
  const { rawText, unit, heldCanonicalKg, editedSinceSwitch, fallbackWeightKg = 0 } = params;

  // If heldCanonicalKg is present and user did not edit since the unit switch,
  // use the held canonical value directly to prevent rounding noise.
  if (
    heldCanonicalKg !== null && 
    heldCanonicalKg !== undefined && 
    heldCanonicalKg > 0 && 
    !editedSinceSwitch
  ) {
    return heldCanonicalKg;
  }

  // Otherwise, parse the current raw text in the active unit
  if (rawText !== undefined && rawText.trim() !== '') {
    return parseWeightInput(rawText.trim(), unit);
  }

  return fallbackWeightKg;
}

/**
 * Pure function: applies set completion to an exercise.
 * Returns the updated exercise, completion status, and rest timer duration.
 */
export function completeSet(
  exercise: ActiveWorkoutExercise,
  setIndex: number,
  params: {
    rawText?: string;
    unit: WeightUnit;
    heldCanonicalKg?: number | null;
    editedSinceSwitch?: boolean;
  }
): {
  updatedExercise: ActiveWorkoutExercise;
  willBeCompleted: boolean;
  restTimerSeconds: number | null;
  finalWeightKg: number;
} {
  const targetSet = exercise.sets[setIndex];
  if (!targetSet) {
    return {
      updatedExercise: exercise,
      willBeCompleted: false,
      restTimerSeconds: null,
      finalWeightKg: 0,
    };
  }

  const finalWeightKg = resolveCompletedSetWeight({
    rawText: params.rawText,
    unit: params.unit,
    heldCanonicalKg: params.heldCanonicalKg,
    editedSinceSwitch: params.editedSinceSwitch,
    fallbackWeightKg: targetSet.weight,
  });

  const willBeCompleted = !targetSet.completed;

  const nextSets = exercise.sets.map((s, idx) => {
    if (idx !== setIndex) return s;
    return {
      ...s,
      weight: finalWeightKg > 0 ? finalWeightKg : s.weight,
      completed: willBeCompleted,
      completed_at: willBeCompleted ? new Date().toISOString() : null,
    };
  });

  return {
    updatedExercise: {
      ...exercise,
      sets: nextSets,
    },
    willBeCompleted,
    restTimerSeconds: willBeCompleted ? exercise.rest_timer_seconds : null,
    finalWeightKg,
  };
}

/**
 * Pure function: deletes a set from an exercise and renumbers remaining sets.
 */
export function deleteSet(
  exercise: ActiveWorkoutExercise,
  setIndex: number
): {
  updatedExercise: ActiveWorkoutExercise;
  deletedSetId: string | null;
} {
  const targetSet = exercise.sets[setIndex];
  const deletedSetId = targetSet ? targetSet.id : null;

  const filteredSets = exercise.sets
    .filter((_, idx) => idx !== setIndex)
    .map((s, idx) => ({ ...s, set_number: idx + 1 }));

  return {
    updatedExercise: {
      ...exercise,
      sets: filteredSets,
    },
    deletedSetId,
  };
}
