-- liftr: Supabase Postgres Database Schema
-- Phase 4: Calendar, Workout Series, Scheduled Workouts, Notes & Rest Days
-- Row Level Security (RLS) enabled at creation, strictly scoped to auth.uid()

-- =========================================================================
-- 1. WORKOUT SERIES (Recurring Workout Rule / Schedule)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.workout_series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  recurrence_type TEXT NOT NULL CHECK (recurrence_type IN ('daily', 'weekly', 'biweekly', 'custom')),
  recurrence_interval INTEGER NOT NULL DEFAULT 1 CHECK (recurrence_interval >= 1),
  days_of_week INTEGER[] NOT NULL DEFAULT '{}',
  start_date DATE NOT NULL,
  end_date DATE,
  target_time TEXT NOT NULL DEFAULT '09:00',
  user_timezone TEXT NOT NULL DEFAULT 'UTC',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.workout_series ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own workout series" ON public.workout_series;
CREATE POLICY "Users can read own workout series"
  ON public.workout_series FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own workout series" ON public.workout_series;
CREATE POLICY "Users can insert own workout series"
  ON public.workout_series FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own workout series" ON public.workout_series;
CREATE POLICY "Users can update own workout series"
  ON public.workout_series FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own workout series" ON public.workout_series;
CREATE POLICY "Users can delete own workout series"
  ON public.workout_series FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_workout_series_user_id ON public.workout_series(user_id);


-- =========================================================================
-- 2. SCHEDULED WORKOUTS (Individual occurrences on calendar)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.scheduled_workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  series_id UUID REFERENCES public.workout_series(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL DEFAULT '09:00',
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'missed', 'cancelled')),
  notes TEXT,
  is_override BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.scheduled_workouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own scheduled workouts" ON public.scheduled_workouts;
CREATE POLICY "Users can read own scheduled workouts"
  ON public.scheduled_workouts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own scheduled workouts" ON public.scheduled_workouts;
CREATE POLICY "Users can insert own scheduled workouts"
  ON public.scheduled_workouts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own scheduled workouts" ON public.scheduled_workouts;
CREATE POLICY "Users can update own scheduled workouts"
  ON public.scheduled_workouts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own scheduled workouts" ON public.scheduled_workouts;
CREATE POLICY "Users can delete own scheduled workouts"
  ON public.scheduled_workouts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_scheduled_workouts_user_date ON public.scheduled_workouts(user_id, scheduled_date);
CREATE INDEX IF NOT EXISTS idx_scheduled_workouts_series_id ON public.scheduled_workouts(series_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_workouts_workout_id ON public.scheduled_workouts(workout_id);


-- =========================================================================
-- 3. CALENDAR NOTES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.calendar_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.calendar_notes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own calendar notes" ON public.calendar_notes;
CREATE POLICY "Users can read own calendar notes"
  ON public.calendar_notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own calendar notes" ON public.calendar_notes;
CREATE POLICY "Users can insert own calendar notes"
  ON public.calendar_notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own calendar notes" ON public.calendar_notes;
CREATE POLICY "Users can update own calendar notes"
  ON public.calendar_notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own calendar notes" ON public.calendar_notes;
CREATE POLICY "Users can delete own calendar notes"
  ON public.calendar_notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_calendar_notes_user_date ON public.calendar_notes(user_id, date);


-- =========================================================================
-- 4. CALENDAR REST DAYS
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.calendar_rest_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_rest_day UNIQUE (user_id, date)
);

ALTER TABLE public.calendar_rest_days ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own calendar rest days" ON public.calendar_rest_days;
CREATE POLICY "Users can read own calendar rest days"
  ON public.calendar_rest_days FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own calendar rest days" ON public.calendar_rest_days;
CREATE POLICY "Users can insert own calendar rest days"
  ON public.calendar_rest_days FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own calendar rest days" ON public.calendar_rest_days;
CREATE POLICY "Users can update own calendar rest days"
  ON public.calendar_rest_days FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own calendar rest days" ON public.calendar_rest_days;
CREATE POLICY "Users can delete own calendar rest days"
  ON public.calendar_rest_days FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_calendar_rest_days_user_date ON public.calendar_rest_days(user_id, date);
