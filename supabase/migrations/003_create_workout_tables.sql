-- liftr: Phase 3 Schema Migration
-- Workout logging, Workout Exercises, Workout Sets, Personal Records, Templates

-- 1. WORKOUT TEMPLATES
CREATE TABLE IF NOT EXISTS public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. TEMPLATE EXERCISES
CREATE TABLE IF NOT EXISTS public.template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  default_sets INTEGER NOT NULL DEFAULT 3,
  target_reps INTEGER NOT NULL DEFAULT 10,
  rest_timer_seconds INTEGER,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. WORKOUTS
CREATE TABLE IF NOT EXISTS public.workouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'discarded')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  completed_at TIMESTAMPTZ,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  total_volume NUMERIC(10, 2) NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. WORKOUT EXERCISES
CREATE TABLE IF NOT EXISTS public.workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id UUID NOT NULL REFERENCES public.workouts(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  rest_timer_seconds INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. WORKOUT SETS
CREATE TABLE IF NOT EXISTS public.workout_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_exercise_id UUID NOT NULL REFERENCES public.workout_exercises(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL DEFAULT 1,
  set_type TEXT NOT NULL DEFAULT 'working' CHECK (set_type IN ('warmup', 'working', 'drop', 'failure')),
  weight NUMERIC(8, 2) NOT NULL DEFAULT 0,
  reps INTEGER NOT NULL DEFAULT 0,
  rir NUMERIC(3, 1),
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. PERSONAL RECORDS
CREATE TABLE IF NOT EXISTS public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES public.workouts(id) ON DELETE CASCADE,
  workout_set_id UUID REFERENCES public.workout_sets(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('heaviest_weight', 'best_estimated_1rm', 'best_single_set_volume', 'rep_pr')),
  value NUMERIC(10, 2) NOT NULL,
  reps INTEGER,
  achieved_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) - Immediate activation
-- ============================================================================
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

-- 1. workout_templates policies
DROP POLICY IF EXISTS "Users can manage own workout_templates" ON public.workout_templates;
CREATE POLICY "Users can manage own workout_templates"
  ON public.workout_templates
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 2. template_exercises policies (scoped through parent template)
DROP POLICY IF EXISTS "Users can manage own template_exercises" ON public.template_exercises;
CREATE POLICY "Users can manage own template_exercises"
  ON public.template_exercises
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
        AND workout_templates.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_templates
      WHERE workout_templates.id = template_exercises.template_id
        AND workout_templates.user_id = auth.uid()
    )
  );

-- 3. workouts policies
DROP POLICY IF EXISTS "Users can manage own workouts" ON public.workouts;
CREATE POLICY "Users can manage own workouts"
  ON public.workouts
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. workout_exercises policies (scoped through parent workout)
DROP POLICY IF EXISTS "Users can manage own workout_exercises" ON public.workout_exercises;
CREATE POLICY "Users can manage own workout_exercises"
  ON public.workout_exercises
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
        AND workouts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workouts
      WHERE workouts.id = workout_exercises.workout_id
        AND workouts.user_id = auth.uid()
    )
  );

-- 5. workout_sets policies (scoped through parent workout_exercise and workout)
DROP POLICY IF EXISTS "Users can manage own workout_sets" ON public.workout_sets;
CREATE POLICY "Users can manage own workout_sets"
  ON public.workout_sets
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
        AND workouts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_exercises
      JOIN public.workouts ON workouts.id = workout_exercises.workout_id
      WHERE workout_exercises.id = workout_sets.workout_exercise_id
        AND workouts.user_id = auth.uid()
    )
  );

-- 6. personal_records policies
DROP POLICY IF EXISTS "Users can manage own personal_records" ON public.personal_records;
CREATE POLICY "Users can manage own personal_records"
  ON public.personal_records
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON public.workouts(user_id);
CREATE INDEX IF NOT EXISTS idx_workouts_status ON public.workouts(status);
CREATE INDEX IF NOT EXISTS idx_workouts_started_at ON public.workouts(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workouts_completed_at ON public.workouts(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_exercises_workout_id ON public.workout_exercises(workout_id);
CREATE INDEX IF NOT EXISTS idx_workout_sets_workout_exercise_id ON public.workout_sets(workout_exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_exercise ON public.personal_records(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_category ON public.personal_records(category);
CREATE INDEX IF NOT EXISTS idx_workout_templates_user_id ON public.workout_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_template_exercises_template_id ON public.template_exercises(template_id);
