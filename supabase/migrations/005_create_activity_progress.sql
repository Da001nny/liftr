-- liftr: Supabase Postgres Database Schema
-- Phase 5: Activity & Progress (Bodyweight, Step Tracking, Activity Logs)
-- Row Level Security (RLS) enabled at creation, strictly scoped to auth.uid()
-- Architected so wearable integrations (Apple Health, Fitbit, Garmin, Google Fit) slot in without schema rewrites

-- =========================================================================
-- 1. BODYWEIGHT ENTRIES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.bodyweight_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight NUMERIC(5, 2) NOT NULL CHECK (weight > 0),
  unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'lbs')),
  notes TEXT,
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'apple_health', 'fitbit', 'garmin', 'google_fit'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_bodyweight_date UNIQUE (user_id, date)
);

ALTER TABLE public.bodyweight_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own bodyweight entries" ON public.bodyweight_entries;
CREATE POLICY "Users can read own bodyweight entries"
  ON public.bodyweight_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own bodyweight entries" ON public.bodyweight_entries;
CREATE POLICY "Users can insert own bodyweight entries"
  ON public.bodyweight_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own bodyweight entries" ON public.bodyweight_entries;
CREATE POLICY "Users can update own bodyweight entries"
  ON public.bodyweight_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own bodyweight entries" ON public.bodyweight_entries;
CREATE POLICY "Users can delete own bodyweight entries"
  ON public.bodyweight_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_bodyweight_entries_user_date ON public.bodyweight_entries(user_id, date DESC);


-- =========================================================================
-- 2. STEP ENTRIES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.step_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  step_count INTEGER NOT NULL CHECK (step_count >= 0),
  goal INTEGER NOT NULL DEFAULT 10000 CHECK (goal > 0),
  source TEXT NOT NULL DEFAULT 'manual', -- 'manual', 'apple_health', 'fitbit', 'garmin', 'google_fit'
  device_info JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_step_date UNIQUE (user_id, date)
);

ALTER TABLE public.step_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own step entries" ON public.step_entries;
CREATE POLICY "Users can read own step entries"
  ON public.step_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own step entries" ON public.step_entries;
CREATE POLICY "Users can insert own step entries"
  ON public.step_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own step entries" ON public.step_entries;
CREATE POLICY "Users can update own step entries"
  ON public.step_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own step entries" ON public.step_entries;
CREATE POLICY "Users can delete own step entries"
  ON public.step_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_step_entries_user_date ON public.step_entries(user_id, date DESC);
