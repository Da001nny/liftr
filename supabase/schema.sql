-- liftr: Authoritative Supabase Postgres Database Schema
-- Phase 0: Foundation

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_mode TEXT NOT NULL DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
  accent_color TEXT NOT NULL DEFAULT '#3b82f6',
  surface_intensity TEXT NOT NULL DEFAULT 'medium' CHECK (surface_intensity IN ('low', 'medium', 'high')),
  rest_timer_defaults JSONB NOT NULL DEFAULT '{"defaultRestSeconds": 90, "warmupRestSeconds": 60, "compoundRestSeconds": 180}'::jsonb,
  gender TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    theme_mode,
    accent_color,
    surface_intensity,
    rest_timer_defaults,
    gender
  )
  VALUES (
    NEW.id,
    'system',
    '#3b82f6',
    'medium',
    '{"defaultRestSeconds": 90, "warmupRestSeconds": 60, "compoundRestSeconds": 180}'::jsonb,
    'male'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
