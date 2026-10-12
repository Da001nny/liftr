-- liftr: Supabase Postgres Database Schema Migration
-- Migration 008: Add explicit weight column to personal_records with authoritative backfill order

-- 1. ADD WEIGHT COLUMN TO PERSONAL_RECORDS
ALTER TABLE public.personal_records
  ADD COLUMN IF NOT EXISTS weight NUMERIC(10, 4);

-- 2. BACKFILL: JOIN THROUGH WORKOUT_SET_ID RUNS FIRST FOR EVERY CATEGORY
-- Authoritative source of truth: the logged workout set itself
UPDATE public.personal_records pr
SET weight = ws.weight
FROM public.workout_sets ws
WHERE pr.workout_set_id = ws.id
  AND pr.weight IS NULL;

-- 3. VALUE FALLBACK ONLY FOR HEAVIEST_WEIGHT ROWS WITH NO SET LINK (NEVER FOR REP_PR)
-- Heaviest weight historically stored the lifted weight in the value column.
-- Never use value as fallback for rep_pr, where value could represent repetitions.
UPDATE public.personal_records
SET weight = value
WHERE category = 'heaviest_weight'
  AND weight IS NULL;

-- 4. ENSURE INDEX ON EXERCISE AND WEIGHT
CREATE INDEX IF NOT EXISTS idx_personal_records_exercise_weight 
  ON public.personal_records(user_id, exercise_id, weight);
