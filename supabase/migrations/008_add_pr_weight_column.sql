-- liftr: Supabase Postgres Database Schema Migration
-- Migration 008: Add explicit weight column to personal_records for rep_pr and all PR categories

-- 1. ADD WEIGHT COLUMN TO PERSONAL_RECORDS
ALTER TABLE public.personal_records
  ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 4);

-- 2. BACKFILL WEIGHT FOR EXISTING RECORDS
-- For rep_pr and heaviest_weight, the value column historically stored weight in kg
UPDATE public.personal_records
SET weight = value
WHERE category IN ('rep_pr', 'heaviest_weight') AND weight IS NULL;

-- For 1RM and single-set volume, if workout_set_id is present, populate from workout_sets.weight
UPDATE public.personal_records pr
SET weight = ws.weight
FROM public.workout_sets ws
WHERE pr.workout_set_id = ws.id
  AND pr.weight IS NULL;

-- 3. ENSURE INDEX ON EXERCISE AND WEIGHT
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_weight 
  ON public.personal_records(user_id, exercise_id, weight);
