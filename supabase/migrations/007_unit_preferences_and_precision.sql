-- liftr: Supabase Postgres Database Schema Migration
-- Migration 007: Unit Preferences (kg/lbs, km/mi), Precision Upgrade to NUMERIC(10,4), and Canonical Data Normalization

-- =========================================================================
-- 1. PROFILES TABLE: ADD UNIT PREFERENCES (Default: kg, km)
-- =========================================================================
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS weight_unit TEXT NOT NULL DEFAULT 'kg' CHECK (weight_unit IN ('kg', 'lbs')),
  ADD COLUMN IF NOT EXISTS distance_unit TEXT NOT NULL DEFAULT 'km' CHECK (distance_unit IN ('km', 'mi'));

-- Update the new user trigger function to initialize unit preferences
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    theme_mode,
    accent_color,
    surface_intensity,
    rest_timer_defaults,
    gender,
    weight_unit,
    distance_unit
  )
  VALUES (
    NEW.id,
    'system',
    '#3b82f6',
    'medium',
    '{"defaultRestSeconds": 90, "warmupRestSeconds": 60, "compoundRestSeconds": 180}'::jsonb,
    'male',
    'kg',
    'km'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =========================================================================
-- 2. PRECISION UPGRADES TO NUMERIC(10, 4) ACROSS WEIGHT & DISTANCE COLUMNS
-- (Must run before data updates so tables support 4 decimal places of precision)
-- =========================================================================

-- Workout sets weight column: allow 4 decimal places for lossless unit conversion
ALTER TABLE public.workout_sets
  ALTER COLUMN weight TYPE NUMERIC(10, 4);

-- Bodyweight entries weight column
ALTER TABLE public.bodyweight_entries
  ALTER COLUMN weight TYPE NUMERIC(10, 4);

-- Personal records value column (for heaviest weight, 1RM, volume)
ALTER TABLE public.personal_records
  ALTER COLUMN value TYPE NUMERIC(10, 4);

-- Workouts total volume column
ALTER TABLE public.workouts
  ALTER COLUMN total_volume TYPE NUMERIC(12, 4);

-- Step entries distance column (if present)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'step_entries' 
      AND column_name = 'distance_km'
  ) THEN
    ALTER TABLE public.step_entries ALTER COLUMN distance_km TYPE NUMERIC(10, 4);
  END IF;
END $$;

-- =========================================================================
-- 3. CANONICAL CONVERSION OF EXISTING BODYWEIGHT ENTRIES
-- Convert any rows previously entered in lbs to canonical kg (1 kg = 2.20462262185 lbs)
-- =========================================================================
UPDATE public.bodyweight_entries
SET 
  weight = ROUND(weight / 2.20462262185, 4),
  unit = 'kg'
WHERE unit = 'lbs';

-- Alter default of unit column to 'kg' (kept as canonical documentation)
ALTER TABLE public.bodyweight_entries 
  ALTER COLUMN unit SET DEFAULT 'kg';
