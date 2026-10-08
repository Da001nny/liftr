-- liftr: Supabase Postgres Database Migration
-- Phase 6 Optional Addendum: Expand step_entries with extended health metrics
-- (active_minutes, distance_km, calories, notes)

ALTER TABLE public.step_entries 
  ADD COLUMN IF NOT EXISTS active_minutes INTEGER CHECK (active_minutes >= 0),
  ADD COLUMN IF NOT EXISTS distance_km NUMERIC(6, 2) CHECK (distance_km >= 0),
  ADD COLUMN IF NOT EXISTS calories INTEGER CHECK (calories >= 0),
  ADD COLUMN IF NOT EXISTS notes TEXT;

COMMENT ON COLUMN public.step_entries.active_minutes IS 'Duration in minutes of moderate-to-vigorous physical activity';
COMMENT ON COLUMN public.step_entries.distance_km IS 'Distance walked or run in kilometers';
COMMENT ON COLUMN public.step_entries.calories IS 'Estimated active calories burned during daily steps';
COMMENT ON COLUMN public.step_entries.notes IS 'Optional user notes regarding step activity or conditions';
