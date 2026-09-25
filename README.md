# liftr — Anatomical Gym & Fitness Tracker

Built from scratch with Supabase Postgres, Supabase Auth, and metallic chrome design system.

---

## 1. Architectural Ground Rules & Contracts

### A. Authoritative API Response Contract
Every single API endpoint without exception returns the exact envelope:
```json
{
  "data": {
    "items": [...],
    "total": 1,
    "page": 1,
    "limit": 1
  },
  "error": null
}
```
- **Single-Item Responses**: (e.g. `GET /api/profile`) wrap the item in `items: [item]`, `total: 1`, `page: 1`, `limit: 1`.
- **Lists**: wrap items array with `total`, `page`, `limit`.
- **Empty Responses**: return `items: []`, `total: 0`, `page: 1`, `limit: 0`.
- **Never** return raw unwrapped arrays or bare objects.

### B. Supabase Postgres & Row Level Security (RLS)
- The database is Supabase Postgres from the very first line of backend code.
- RLS is enabled immediately upon table creation.
- Security policies are strictly scoped to `auth.uid() = id`.
- User identity is always derived server-side from the verified Supabase Auth JWT token (`req.user.id`).
- Never trust client-supplied user IDs.

### C. Authoritative Calculation Engine (`src/lib/calculations.ts`)
- **Estimated 1RM**: Epley formula — `weight * (1 + reps / 30)`, except `reps === 1` returns `weight` exactly.
- **PR Categories**:
  1. Heaviest weight
  2. Best estimated 1RM
  3. Best single-set volume (`weight * reps` for ONE set, not session total)
  4. Rep PR at a given weight
  *Strict `>` rule for all — an exact tie is never a new PR.*
- **Calendar Consistency %**: `completed scheduled sessions ÷ explicitly scheduled sessions`.
  *Unscheduled workouts are excluded from the denominator entirely. 0 scheduled sessions defaults to 100% (intentional documented default).*
- **Timestamps**: Stored in UTC (ISO 8601); converted to local timezone only for display. Recurrence date-walking happens in UTC to avoid daylight saving time drift.

### D. Metallic Chrome & Silver Design System
- **Canvas / Background**: Flat plain (light: `#f8fafc`, dark: `#090d16`).
- **Elevated Surfaces**: Metallic gradient sheen strictly on primary cards (`data-surface="primary-metallic"`), progress rings, and chart/bar fills.
- **Secondary Surfaces**: Clean flat cards (`data-surface="secondary-flat"`), zero gradient sheen.
- **Customizable**: Dark / Light / System modes, customizable accent color, and surface intensity variants (Low, Medium, High).
- Preferences persist directly to the Supabase `public.profiles` table.

### E. Navigation Contract
- Exactly 5 tabs in the bottom bar: **Dashboard**, **Workouts**, **Body**, **Progress**, **Calendar**.
- Exercises lives inside Workouts.
- Activity lives inside Progress.
- Profile / Settings is accessible via persistent avatar icon in the top bar.

---

## 2. Supabase Database Migration

Execute the migration in your Supabase SQL Editor:
```sql
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

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, theme_mode, accent_color, surface_intensity, rest_timer_defaults, gender)
  VALUES (NEW.id, 'system', '#3b82f6', 'medium', '{"defaultRestSeconds": 90, "warmupRestSeconds": 60, "compoundRestSeconds": 180}'::jsonb, 'male')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
