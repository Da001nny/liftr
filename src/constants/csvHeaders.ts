/**
 * liftr: Authoritative CSV Column Headers & Schema Constant Definitions
 * 
 * CSV column headers represent a fixed file-format specification (RFC 4180),
 * NOT translated UI text. They are centralized here as typed English constants.
 */

import { WeightUnit } from '../lib/units';

export const WORKOUTS_CSV_HEADERS_KG = [
  'Date',
  'Workout',
  'Exercise',
  'Set Type',
  'Weight (kg)',
  'Reps',
  'Volume (kg)',
  'Estimated 1RM (kg)',
] as const;

export const WORKOUTS_CSV_HEADERS_LBS = [
  'Date',
  'Workout',
  'Exercise',
  'Set Type',
  'Weight (lbs)',
  'Reps',
  'Volume (lbs)',
  'Estimated 1RM (lbs)',
] as const;

export function getWorkoutsCsvHeaders(weightUnit: WeightUnit): readonly string[] {
  return weightUnit === 'lbs' ? WORKOUTS_CSV_HEADERS_LBS : WORKOUTS_CSV_HEADERS_KG;
}

export function getWorkoutsCsvHeaderPreview(weightUnit: WeightUnit): string {
  return getWorkoutsCsvHeaders(weightUnit).join(', ');
}

export const BODYWEIGHT_CSV_HEADERS_KG = [
  'Date',
  'Weight (kg)',
  'Unit',
  'Notes',
  'Source',
] as const;

export const BODYWEIGHT_CSV_HEADERS_LBS = [
  'Date',
  'Weight (lbs)',
  'Unit',
  'Notes',
  'Source',
] as const;

export function getBodyweightCsvHeaders(weightUnit: WeightUnit): readonly string[] {
  return weightUnit === 'lbs' ? BODYWEIGHT_CSV_HEADERS_LBS : BODYWEIGHT_CSV_HEADERS_KG;
}

export function getBodyweightCsvHeaderPreview(weightUnit: WeightUnit): string {
  return getBodyweightCsvHeaders(weightUnit).join(', ');
}

export const STEPS_CSV_HEADERS = [
  'Date',
  'Steps',
  'Goal',
  'Source',
] as const;

export const STEPS_CSV_HEADER_PREVIEW = STEPS_CSV_HEADERS.join(', ');
