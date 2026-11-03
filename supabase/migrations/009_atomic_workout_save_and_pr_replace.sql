-- liftr: Supabase Postgres Database Schema Migration
-- Migration 009: Atomic Workout Save and PR Replace Database Functions

-- 1. FUNCTION: replace_user_personal_records
-- Atomically deletes existing personal records within the given exercise scope (or all PRs if exercise is null)
-- and inserts the newly calculated authoritative PR rows in a single database transaction.
CREATE OR REPLACE FUNCTION public.replace_user_personal_records(
  p_exercise_id TEXT DEFAULT NULL,
  p_rows JSONB DEFAULT '[]'::jsonb
)
RETURNS SETOF public.personal_records
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  IF p_rows IS NOT NULL AND jsonb_typeof(p_rows) <> 'array' THEN
    RAISE EXCEPTION 'p_rows must be a JSON array' USING ERRCODE = '22023';
  END IF;

  -- 1. Delete existing PRs in scope for the authenticated user
  IF p_exercise_id IS NOT NULL AND p_exercise_id <> '' THEN
    DELETE FROM public.personal_records
    WHERE user_id = v_user_id
      AND exercise_id = p_exercise_id;
  ELSE
    DELETE FROM public.personal_records
    WHERE user_id = v_user_id;
  END IF;

  -- 2. Insert new PR rows if provided
  IF p_rows IS NOT NULL AND jsonb_array_length(p_rows) > 0 THEN
    RETURN QUERY
    INSERT INTO public.personal_records (
      user_id,
      exercise_id,
      workout_id,
      workout_set_id,
      category,
      value,
      weight,
      reps,
      achieved_at
    )
    SELECT
      v_user_id,
      (elem->>'exercise_id')::TEXT,
      (elem->>'workout_id')::UUID,
      (elem->>'workout_set_id')::UUID,
      (elem->>'category')::TEXT,
      (elem->>'value')::NUMERIC,
      (elem->>'weight')::NUMERIC,
      (elem->>'reps')::INTEGER,
      COALESCE((elem->>'achieved_at')::TIMESTAMPTZ, timezone('utc'::text, now()))
    FROM jsonb_array_elements(p_rows) AS elem
    RETURNING *;
  ELSE
    RETURN;
  END IF;
END;
$$;

-- 2. FUNCTION: save_workout_session
-- Atomically updates the workout record, syncs exercises and sets, and calculates/records completion status.
-- Returns structured JSON: { workout: <workout row>, already_completed: boolean, exercises: [ { ...exercise row, sets: [ ...set rows ] } ] }
CREATE OR REPLACE FUNCTION public.save_workout_session(
  p_workout_id UUID,
  p_name TEXT DEFAULT NULL,
  p_duration_seconds INTEGER DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_exercises JSONB DEFAULT NULL,
  p_complete BOOLEAN DEFAULT NULL,
  p_total_volume NUMERIC DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
  v_workout public.workouts%ROWTYPE;
  v_already_completed BOOLEAN;
  v_ex JSONB;
  v_set JSONB;
  v_we_id UUID;
  v_result JSONB;
  v_now TIMESTAMPTZ;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated' USING ERRCODE = '28000';
  END IF;

  IF p_workout_id IS NULL THEN
    RAISE EXCEPTION 'Workout ID is required' USING ERRCODE = '22004';
  END IF;

  v_now := timezone('utc'::text, now());

  -- 1. Verify workout ownership and lock for update
  SELECT * INTO v_workout
  FROM public.workouts
  WHERE id = p_workout_id AND user_id = v_user_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workout not found or unauthorized' USING ERRCODE = 'P0002';
  END IF;

  v_already_completed := (v_workout.status = 'completed');

  -- 2. Update workout fields
  UPDATE public.workouts
  SET
    name = COALESCE(p_name, name),
    duration_seconds = COALESCE(p_duration_seconds, duration_seconds),
    notes = COALESCE(p_notes, notes),
    total_volume = COALESCE(p_total_volume, total_volume),
    status = CASE
      WHEN p_complete IS TRUE THEN 'completed'
      ELSE status
    END,
    completed_at = CASE
      WHEN p_complete IS TRUE AND NOT v_already_completed THEN v_now
      ELSE completed_at
    END,
    updated_at = v_now
  WHERE id = p_workout_id AND user_id = v_user_id
  RETURNING * INTO v_workout;

  -- 3. Replace exercises and sets if exercises payload is provided
  IF p_exercises IS NOT NULL THEN
    IF jsonb_typeof(p_exercises) <> 'array' THEN
      RAISE EXCEPTION 'p_exercises must be a JSON array' USING ERRCODE = '22023';
    END IF;

    -- Delete existing exercises (foreign key CASCADE removes existing sets)
    DELETE FROM public.workout_exercises
    WHERE workout_id = p_workout_id;

    -- Insert new exercises and their sets
    FOR v_ex IN SELECT * FROM jsonb_array_elements(p_exercises)
    LOOP
      INSERT INTO public.workout_exercises (
        workout_id,
        exercise_id,
        order_index,
        notes,
        rest_timer_seconds
      )
      VALUES (
        p_workout_id,
        (v_ex->>'exercise_id')::TEXT,
        COALESCE((v_ex->>'order_index')::INTEGER, 0),
        COALESCE(v_ex->>'notes', ''),
        (v_ex->>'rest_timer_seconds')::INTEGER
      )
      RETURNING id INTO v_we_id;

      IF v_ex ? 'sets' AND jsonb_typeof(v_ex->'sets') = 'array' THEN
        FOR v_set IN SELECT * FROM jsonb_array_elements(v_ex->'sets')
        LOOP
          INSERT INTO public.workout_sets (
            workout_exercise_id,
            set_number,
            set_type,
            weight,
            reps,
            rir,
            completed,
            completed_at
          )
          VALUES (
            v_we_id,
            COALESCE((v_set->>'set_number')::INTEGER, 1),
            COALESCE(v_set->>'set_type', 'working'),
            COALESCE((v_set->>'weight')::NUMERIC, 0),
            COALESCE((v_set->>'reps')::INTEGER, 0),
            (v_set->>'rir')::NUMERIC,
            COALESCE((v_set->>'completed')::BOOLEAN, false),
            CASE
              WHEN (v_set->>'completed')::BOOLEAN IS TRUE THEN
                COALESCE((v_set->>'completed_at')::TIMESTAMPTZ, v_now)
              ELSE NULL
            END
          );
        END LOOP;
      END IF;
    END LOOP;
  END IF;

  -- 4. Build returned workout JSON: { workout: <workout row>, already_completed: boolean, exercises: [ ... ] }
  SELECT jsonb_build_object(
    'workout', to_jsonb(v_workout),
    'already_completed', v_already_completed,
    'exercises', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', we.id,
            'workout_id', we.workout_id,
            'exercise_id', we.exercise_id,
            'order_index', we.order_index,
            'notes', we.notes,
            'rest_timer_seconds', we.rest_timer_seconds,
            'created_at', we.created_at,
            'sets', COALESCE(
              (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'id', ws.id,
                    'workout_exercise_id', ws.workout_exercise_id,
                    'set_number', ws.set_number,
                    'set_type', ws.set_type,
                    'weight', ws.weight,
                    'reps', ws.reps,
                    'rir', ws.rir,
                    'completed', ws.completed,
                    'completed_at', ws.completed_at,
                    'created_at', ws.created_at
                  ) ORDER BY ws.set_number ASC
                )
                FROM public.workout_sets ws
                WHERE ws.workout_exercise_id = we.id
              ),
              '[]'::jsonb
            )
          ) ORDER BY we.order_index ASC
        )
        FROM public.workout_exercises we
        WHERE we.workout_id = p_workout_id
      ),
      '[]'::jsonb
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Permissions and Access Hardening
REVOKE ALL ON FUNCTION public.replace_user_personal_records(TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.save_workout_session(UUID, TEXT, INTEGER, TEXT, JSONB, BOOLEAN, NUMERIC) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.replace_user_personal_records(TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.save_workout_session(UUID, TEXT, INTEGER, TEXT, JSONB, BOOLEAN, NUMERIC) TO authenticated;
