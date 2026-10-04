-- =========================================================================
-- LIFTR PHASE 3: WORKOUT LOGGING, PROGRESSION, TEMPLATES & PRs
-- 
-- PostgreSQL schema for Supabase with Row Level Security (RLS) enabled.
-- Child tables (workout_exercises, workout_sets, template_exercises) are
-- securely scoped to auth.uid() through their parent table via EXISTS policies.
-- =========================================================================

-- 1. WORKOUT TEMPLATES TABLE
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Users can insert own workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Users can update own workout templates" ON public.workout_templates;
DROP POLICY IF EXISTS "Users can delete own workout templates" ON public.workout_templates;

CREATE POLICY "Users can read own workout templates" ON public.workout_templates 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workout templates" ON public.workout_templates 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workout templates" ON public.workout_templates 
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own workout templates" ON public.workout_templates 
  FOR DELETE USING (auth.uid() = user_id);

-- 2. TEMPLATE EXERCISES TABLE (Child of workout_templates)
CREATE TABLE IF NOT EXISTS public.template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  target_sets INTEGER NOT NULL DEFAULT 3,
  target_reps INTEGER NOT NULL DEFAULT 10,
  rest_timer_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own template exercises" ON public.template_exercises;
DROP POLICY IF EXISTS "Users can insert own template exercises" ON public.template_exercises;
DROP POLICY IF EXISTS "Users can update own template exercises" ON public.template_exercises;
DROP POLICY IF EXISTS "Users can delete own template exercises" ON public.template_exercises;

-- Scoped through parent workout_templates.user_id via EXISTS-style policy:
CREATE POLICY "Users can read own template exercises" ON public.template_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND workout_templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own template exercises" ON public.template_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND workout_templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own template exercises" ON public.template_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND workout_templates.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND workout_templates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own template exercises" ON public.template_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
      AND workout_templates.user_id = auth.uid()
    )
  );

-- 3. WORKOUTS TABLE (Parent)
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('in_progress', 'completed', 'discarded')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  total_volume NUMERIC(12, 2) NOT NULL DEFAULT 0,
  total_completed_sets INTEGER NOT NULL DEFAULT 0,
  total_completed_reps INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can insert own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can update own workouts" ON public.workouts;
DROP POLICY IF EXISTS "Users can delete own workouts" ON public.workouts;

CREATE POLICY "Users can read own workouts" ON public.workouts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own workouts" ON public.workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own workouts" ON public.workouts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own workouts" ON public.workouts
  FOR DELETE USING (auth.uid() = user_id);

-- 4. WORKOUT EXERCISES TABLE (Child of workouts)
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  target_region_id TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  rest_timer_seconds INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own workout exercises" ON public.workout_exercises;
DROP POLICY IF EXISTS "Users can insert own workout exercises" ON public.workout_exercises;
DROP POLICY IF EXISTS "Users can update own workout exercises" ON public.workout_exercises;
DROP POLICY IF EXISTS "Users can delete own workout exercises" ON public.workout_exercises;

-- Scoped through parent workouts.user_id via EXISTS-style policy:
CREATE POLICY "Users can read own workout exercises" ON public.workout_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout exercises" ON public.workout_exercises
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout exercises" ON public.workout_exercises
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout exercises" ON public.workout_exercises
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
      AND workouts.user_id = auth.uid()
    )
  );

-- 5. WORKOUT SETS TABLE (Child of workout_exercises)
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL DEFAULT 1,
  set_type TEXT NOT NULL DEFAULT 'working' CHECK (set_type IN ('working', 'warmup', 'drop', 'failure')),
  weight NUMERIC(8, 2) NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  rir INTEGER,
  rpe NUMERIC(3, 1),
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  estimated_1rm NUMERIC(8, 2) NOT NULL DEFAULT 0,
  volume NUMERIC(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own workout sets" ON public.workout_sets;
DROP POLICY IF EXISTS "Users can insert own workout sets" ON public.workout_sets;
DROP POLICY IF EXISTS "Users can update own workout sets" ON public.workout_sets;
DROP POLICY IF EXISTS "Users can delete own workout sets" ON public.workout_sets;

-- Scoped through parent workouts.user_id via EXISTS-style policy:
CREATE POLICY "Users can read own workout sets" ON public.workout_sets
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own workout sets" ON public.workout_sets
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own workout sets" ON public.workout_sets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  ) WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own workout sets" ON public.workout_sets
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
      AND workouts.user_id = auth.uid()
    )
  );

-- 6. PERSONAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL,
  exercise_name TEXT NOT NULL,
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  workout_set_id UUID NOT NULL REFERENCES public.workout_sets(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('heaviest_weight', 'best_estimated_1rm', 'best_volume', 'rep_pr')),
  value NUMERIC(10, 2) NOT NULL,
  weight NUMERIC(8, 2) NOT NULL,
  reps INTEGER NOT NULL,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own personal records" ON public.personal_records;
DROP POLICY IF EXISTS "Users can insert own personal records" ON public.personal_records;
DROP POLICY IF EXISTS "Users can update own personal records" ON public.personal_records;
DROP POLICY IF EXISTS "Users can delete own personal records" ON public.personal_records;

CREATE POLICY "Users can read own personal records" ON public.personal_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own personal records" ON public.personal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own personal records" ON public.personal_records
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own personal records" ON public.personal_records
  FOR DELETE USING (auth.uid() = user_id);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_workouts_user_status ON public.workouts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout ON public.workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_exercise ON public.workout_sets(workout_exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_exercise ON public.personal_records(user_id, exercise_id, category);
CREATE INDEX IF NOT EXISTS idx_workout_templates_user ON public.workout_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_template_exercises_template ON public.template_exercises(template_id);
