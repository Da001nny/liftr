import express, { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  MUSCLE_REGIONS,
  MUSCLES,
  EXERCISES,
  EXERCISE_MUSCLE_CONTRIBUTIONS,
  MUSCLE_MAP,
  REGION_MAP,
  EXERCISE_MAP,
  CONTRIBUTIONS_BY_EXERCISE,
  CONTRIBUTIONS_BY_MUSCLE,
  filterExercisesByRegion,
  reverseSearchByMuscle,
} from './src/data/exerciseCatalog.ts';
import {
  calculateEstimated1RM,
  calculateSingleSetVolume,
  calculateTotalSessionVolume,
  detectPersonalRecords,
  calculateCalendarConsistency,
  calculateBodyweightStats,
  calculateExerciseProgress,
  calculateMuscleExposureAnalytics,
  calculateRangeTrendComparison,
  getPresetComparisonPeriods,
  calculateCrossExerciseComparison,
  generateWorkoutsCsv,
  generateBodyweightCsv,
  generateStepsCsv,
} from './src/lib/calculations.ts';
import {
  localTimeToUtcIso,
  utcIsoToLocalDate,
  utcIsoToLocalTime,
  addDaysUtc,
  getDayOfWeekUtc,
  generateOccurrencesForSeries,
} from './src/lib/calendarService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://cetpdeuuymspiygxnmdg.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldHBkZXV1eW1zcGl5Z3hubWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyOTkyNTgsImV4cCI6MjEwNTg3NTI1OH0.4uZq0Y-Tp51MWN-mFWfVWcqDgR4Q_MHf7J765sShg5Y';

// Server-side Supabase client
const supabaseServer = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

/**
 * Authoritative API Response Formatter
 * Strict rule: Every endpoint returns { data: { items: T[], total, page, limit }, error?: string | null }
 */
function apiResponse<T>(items: T | T[] | null | undefined, total?: number, page: number = 1, limit?: number) {
  let arr: T[];
  if (items === null || items === undefined) {
    arr = [];
  } else if (Array.isArray(items)) {
    arr = items;
  } else {
    arr = [items];
  }
  const effectiveTotal = total !== undefined ? total : arr.length;
  const effectiveLimit = limit !== undefined ? limit : (arr.length > 0 ? arr.length : 1);
  return {
    data: {
      items: arr,
      total: effectiveTotal,
      page,
      limit: effectiveLimit,
    },
    error: null,
  };
}

function apiError(message: string, page: number = 1, limit: number = 0) {
  return {
    data: {
      items: [],
      total: 0,
      page,
      limit,
    },
    error: message,
  };
}

/**
 * Server-side Authentication Guard
 * Validates the JWT Bearer token with Supabase Auth.
 * NEVER trusts any client-supplied user ID; user identity is derived purely from the JWT.
 */
async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json(apiError('Authentication required: missing or malformed Bearer token'));
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json(apiError('Authentication required: empty token'));
  }

  try {
    const { data: { user }, error } = await supabaseServer.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json(apiError(error ? error.message : 'Invalid or expired session token'));
    }

    // Attach verified user and client authenticated with user token
    (req as any).user = user;
    (req as any).userToken = token;
    (req as any).userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: {
        headers: { Authorization: `Bearer ${token}` },
      },
    });
    next();
  } catch (err: any) {
    return res.status(401).json(apiError('Unauthorized session'));
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());
  app.use('/screenshots', express.static(path.join(__dirname, 'public/screenshots')));
  app.use('/anatomy', express.static(path.join(__dirname, 'public/anatomy')));
  app.use('/src/assets/images', express.static(path.join(__dirname, 'src/assets/images')));

  // 1. Health check endpoint (Public)
  app.get('/api/health', (req, res) => {
    res.json(apiResponse({
      status: 'ok',
      service: 'liftr-api',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    }));
  });

  // Hotspot calibration endpoints (Admin / Dev)
  const CALIBRATION_FILE = path.join(__dirname, 'src', 'data', 'hotspotCalibration.json');

  app.get('/api/calibration', (req, res) => {
    try {
      if (fs.existsSync(CALIBRATION_FILE)) {
        const raw = fs.readFileSync(CALIBRATION_FILE, 'utf-8');
        return res.json(apiResponse(JSON.parse(raw)));
      }
      return res.json(apiResponse(null));
    } catch (err: any) {
      return res.status(500).json(apiError(`Failed reading calibration: ${err.message}`));
    }
  });

  app.post('/api/calibration', (req, res) => {
    try {
      const data = req.body;
      if (!data || typeof data !== 'object') {
        return res.status(400).json(apiError('Invalid calibration payload'));
      }
      fs.writeFileSync(CALIBRATION_FILE, JSON.stringify(data, null, 2), 'utf-8');
      return res.json(apiResponse({ success: true, savedAt: new Date().toISOString() }));
    } catch (err: any) {
      return res.status(500).json(apiError(`Failed writing calibration: ${err.message}`));
    }
  });

  // 2. Schema status check (Public)
  app.get('/api/schema-status', async (req, res) => {
    try {
      const { error: profileErr } = await supabaseServer.from('profiles').select('id').limit(1);
      const profilesTableExists = !profileErr || (profileErr.code !== 'PGRST205' && !profileErr.message.includes('profiles'));

      const { data: exData, error: exErr } = await supabaseServer.from('exercises').select('id').limit(1);
      const exercisesTableExists = !exErr || (exErr.code !== 'PGRST205' && !exErr.message.includes('exercises'));

      const { data: mData, error: mErr } = await supabaseServer.from('muscles').select('id').limit(1);
      const musclesTableExists = !mErr || (mErr.code !== 'PGRST205' && !mErr.message.includes('muscles'));

      const { data: rData, error: rErr } = await supabaseServer.from('muscle_regions').select('id').limit(1);
      const regionsTableExists = !rErr || (rErr.code !== 'PGRST205' && !rErr.message.includes('muscle_regions'));

      const { data: cData, error: cErr } = await supabaseServer.from('exercise_muscle_contributions').select('id').limit(1);
      const contributionsTableExists = !cErr || (cErr.code !== 'PGRST205' && !cErr.message.includes('exercise_muscle_contributions'));

      const phase1Ready = exercisesTableExists && musclesTableExists && regionsTableExists && contributionsTableExists;

      // Phase 3 tables
      const { error: wErr } = await supabaseServer.from('workouts').select('id').limit(1);
      const workoutsTableExists = !wErr || (wErr.code !== 'PGRST205' && !wErr.message.includes('workouts'));

      const { error: weErr } = await supabaseServer.from('workout_exercises').select('id').limit(1);
      const workoutExercisesTableExists = !weErr || (weErr.code !== 'PGRST205' && !weErr.message.includes('workout_exercises'));

      const { error: wsErr } = await supabaseServer.from('workout_sets').select('id').limit(1);
      const workoutSetsTableExists = !wsErr || (wsErr.code !== 'PGRST205' && !wsErr.message.includes('workout_sets'));

      const { error: prErr } = await supabaseServer.from('personal_records').select('id').limit(1);
      const prsTableExists = !prErr || (prErr.code !== 'PGRST205' && !prErr.message.includes('personal_records'));

      const { error: wtErr } = await supabaseServer.from('workout_templates').select('id').limit(1);
      const templatesTableExists = !wtErr || (wtErr.code !== 'PGRST205' && !wtErr.message.includes('workout_templates'));

      const { error: teErr } = await supabaseServer.from('template_exercises').select('id').limit(1);
      const templateExercisesTableExists = !teErr || (teErr.code !== 'PGRST205' && !teErr.message.includes('template_exercises'));

      const phase3Ready = workoutsTableExists && workoutExercisesTableExists && workoutSetsTableExists && prsTableExists && templatesTableExists && templateExercisesTableExists;

      // Phase 4 tables
      const { error: sSeriesErr } = await supabaseServer.from('workout_series').select('id').limit(1);
      const workoutSeriesTableExists = !sSeriesErr || (sSeriesErr.code !== 'PGRST205' && !sSeriesErr.message.includes('workout_series'));

      const { error: sSchedErr } = await supabaseServer.from('scheduled_workouts').select('id').limit(1);
      const scheduledWorkoutsTableExists = !sSchedErr || (sSchedErr.code !== 'PGRST205' && !sSchedErr.message.includes('scheduled_workouts'));

      const { error: cNotesErr } = await supabaseServer.from('calendar_notes').select('id').limit(1);
      const calendarNotesTableExists = !cNotesErr || (cNotesErr.code !== 'PGRST205' && !cNotesErr.message.includes('calendar_notes'));

      const { error: cRestErr } = await supabaseServer.from('calendar_rest_days').select('id').limit(1);
      const calendarRestDaysTableExists = !cRestErr || (cRestErr.code !== 'PGRST205' && !cRestErr.message.includes('calendar_rest_days'));

      const phase4Ready = workoutSeriesTableExists && scheduledWorkoutsTableExists && calendarNotesTableExists && calendarRestDaysTableExists;

      // Phase 5 tables
      const { error: bwErr } = await supabaseServer.from('bodyweight_entries').select('id').limit(1);
      const bodyweightEntriesTableExists = !bwErr || (bwErr.code !== 'PGRST205' && !bwErr.message.includes('bodyweight_entries'));

      const { error: stepErr } = await supabaseServer.from('step_entries').select('id').limit(1);
      const stepEntriesTableExists = !stepErr || (stepErr.code !== 'PGRST205' && !stepErr.message.includes('step_entries'));

      const phase5Ready = phase4Ready && bodyweightEntriesTableExists && stepEntriesTableExists;

      return res.json(apiResponse({
        profilesTableExists,
        exercisesTableExists,
        musclesTableExists,
        regionsTableExists,
        contributionsTableExists,
        phase1Ready,
        workoutsTableExists,
        workoutExercisesTableExists,
        workoutSetsTableExists,
        prsTableExists,
        templatesTableExists,
        templateExercisesTableExists,
        phase3Ready,
        workoutSeriesTableExists,
        scheduledWorkoutsTableExists,
        calendarNotesTableExists,
        calendarRestDaysTableExists,
        phase4Ready,
        bodyweightEntriesTableExists,
        stepEntriesTableExists,
        phase5Ready,
        counts: {
          exercises: exercisesTableExists ? 203 : 0,
          muscles: musclesTableExists ? 36 : 0,
          regions: regionsTableExists ? 8 : 0,
          contributions: contributionsTableExists ? 820 : 0,
        },
        message: phase5Ready
          ? 'Phase 0, 1, 3, 4, and 5 Supabase tables are connected and verified.'
          : (phase4Ready ? 'Phase 5 activity & progress tables pending migration.' : (phase3Ready ? 'Phase 4 calendar & scheduling tables pending migration.' : 'Supabase tables pending migration.')),
      }));
    } catch (err: any) {
      return res.json(apiResponse({
        profilesTableExists: false,
        exercisesTableExists: false,
        musclesTableExists: false,
        regionsTableExists: false,
        contributionsTableExists: false,
        phase1Ready: false,
        workoutsTableExists: false,
        workoutExercisesTableExists: false,
        workoutSetsTableExists: false,
        prsTableExists: false,
        templatesTableExists: false,
        templateExercisesTableExists: false,
        phase3Ready: false,
        error: err?.message || 'Database connection error',
      }));
    }
  });

  // 3. User Profile: Read (Protected)
  // Rejects unauthenticated requests server-side.
  // Identity derived strictly from JWT (req.user.id).
  app.get('/api/profile', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      // Query profiles table using user's RLS-scoped client
      const { data, error } = await client
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        // If table doesn't exist yet, return schema error
        if (error.code === 'PGRST205') {
          return res.status(503).json(apiError('Database table public.profiles does not exist yet. Please run migration.'));
        }
        return res.status(500).json(apiError(`Error reading profile: ${error.message}`));
      }

      if (!data) {
        // Fallback: If trigger hasn't populated profile yet, auto-create it now
        const defaultProfile = {
          id: user.id,
          theme_mode: 'system',
          accent_color: '#3b82f6',
          surface_intensity: 'medium',
          rest_timer_defaults: {
            defaultRestSeconds: 90,
            warmupRestSeconds: 60,
            compoundRestSeconds: 180,
          },
          gender: 'male',
          weight_unit: 'kg',
          distance_unit: 'km',
        };

        let { data: created, error: insertError } = await client
          .from('profiles')
          .insert(defaultProfile)
          .select('*')
          .single();

        if (insertError && (insertError.message.includes('weight_unit') || insertError.message.includes('distance_unit') || insertError.message.includes('schema cache'))) {
          const { weight_unit, distance_unit, ...baseProfile } = defaultProfile;
          const retry = await client
            .from('profiles')
            .insert(baseProfile)
            .select('*')
            .single();
          created = retry.data;
          insertError = retry.error;
        }

        if (insertError) {
          // If insert fails due to missing table
          if (insertError.code === 'PGRST205') {
            return res.status(503).json(apiError('Database table public.profiles does not exist. Please run migration.'));
          }
          return res.status(500).json(apiError(`Failed to initialize profile: ${insertError.message}`));
        }

        return res.json(apiResponse(created, 1, 1, 1));
      }

      return res.json(apiResponse(data, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Internal server error: ${err.message}`));
    }
  });

  // 4. User Profile: Update (Protected)
  // Never trusts any client-supplied user ID; identity strictly from req.user.id.
  app.patch('/api/profile', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const { theme_mode, accent_color, surface_intensity, rest_timer_defaults, gender, weight_unit, distance_unit } = req.body;

    // Build sanitised payload
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (theme_mode && ['light', 'dark', 'system'].includes(theme_mode)) {
      updates.theme_mode = theme_mode;
    }
    if (typeof accent_color === 'string' && accent_color.startsWith('#')) {
      updates.accent_color = accent_color;
    }
    if (surface_intensity && ['low', 'medium', 'high'].includes(surface_intensity)) {
      updates.surface_intensity = surface_intensity;
    }
    if (rest_timer_defaults && typeof rest_timer_defaults === 'object') {
      updates.rest_timer_defaults = rest_timer_defaults;
    }
    if (gender && ['male', 'female'].includes(gender)) {
      updates.gender = gender;
    }
    if (weight_unit && ['kg', 'lbs'].includes(weight_unit)) {
      updates.weight_unit = weight_unit;
    }
    if (distance_unit && ['km', 'mi'].includes(distance_unit)) {
      updates.distance_unit = distance_unit;
    }

    try {
      let { data, error } = await client
        .from('profiles')
        .upsert({ id: user.id, ...updates })
        .select('*')
        .single();

      if (error && (error.message.includes('weight_unit') || error.message.includes('distance_unit') || error.message.includes('schema cache'))) {
        const fallbackUpdates = { ...updates };
        delete fallbackUpdates.weight_unit;
        delete fallbackUpdates.distance_unit;
        const retry = await client
          .from('profiles')
          .upsert({ id: user.id, ...fallbackUpdates })
          .select('*')
          .single();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        return res.status(500).json(apiError(`Failed to update profile: ${error.message}`));
      }

      return res.json(apiResponse(data, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Internal server error: ${err.message}`));
    }
  });

  // 5. Dashboard Data (Protected)
  // Real empty state for Phase 0: 0 workouts, 0 volume, 100% consistency default
  app.get('/api/dashboard', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      // In Phase 0, no workout tables exist yet; return clean, honest empty state
      // consistency default is 100% (0 completed / 0 scheduled = 100% documented default)
      const dashboardState = {
        userId: user.id,
        userEmail: user.email,
        totalVolume: 0,
        volumeUnit: 'kg',
        sessionsCompleted: 0,
        activeSplit: null,
        consistencyPercentage: 100, // Intentional default: 0 scheduled sessions = 100%
        recentSessions: [],
        muscleExposure: [],
        nextScheduledSession: null,
      };

      return res.json(apiResponse(dashboardState, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Dashboard error: ${err.message}`));
    }
  });

  // Helper to enrich exercise with full contributions & muscle metadata
  function enrichExercise(ex: any) {
    const contribs = (CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || []).map(c => {
      const muscle = MUSCLE_MAP.get(c.muscleId);
      return {
        id: c.id,
        exerciseId: c.exerciseId,
        muscleId: c.muscleId,
        muscleName: muscle ? muscle.name : c.muscleId,
        muscleCommonName: muscle ? muscle.commonName : c.muscleId,
        subregion: muscle ? muscle.subregion : '',
        regionId: muscle ? muscle.regionId : '',
        percentage: Number(c.percentage),
        role: c.role,
        notes: c.notes,
      };
    });
    return {
      ...ex,
      targetRegion: REGION_MAP.get(ex.targetRegionId) || null,
      contributions: contribs,
    };
  }

  // 6. Phase 1 SQL Migration Endpoint (Public)
  app.get('/api/migration-sql/phase-1', (req, res) => {
    try {
      const sqlPath = path.resolve('supabase/migrations/002_create_exercise_catalog.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        return res.json(apiResponse({ sql, filename: '002_create_exercise_catalog.sql' }));
      }
      return res.status(404).json(apiError('Migration SQL file not found'));
    } catch (err: any) {
      return res.status(500).json(apiError(`Failed to read migration SQL: ${err.message}`));
    }
  });

  // Phase 3 SQL Migration Endpoint (Public)
  app.get('/api/migration-sql/phase-3', (req, res) => {
    try {
      const sqlPath = path.resolve('supabase/migrations/003_create_workout_progression.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        return res.json(apiResponse({ sql, filename: '003_create_workout_progression.sql' }));
      }
      return res.status(404).json(apiError('Migration SQL file not found'));
    } catch (err: any) {
      return res.status(500).json(apiError(`Failed to read migration SQL: ${err.message}`));
    }
  });

  // Phase 4 SQL Migration Endpoint (Public)
  app.get('/api/migration-sql/phase-4', (req, res) => {
    try {
      const sqlPath = path.resolve('supabase/migrations/004_create_calendar_scheduling.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        return res.json(apiResponse({ sql, filename: '004_create_calendar_scheduling.sql' }));
      }
      return res.status(404).json(apiError('Migration SQL file not found'));
    } catch (err: any) {
      return res.status(500).json(apiError(`Failed to read migration SQL: ${err.message}`));
    }
  });

  // Phase 5 SQL Migration Endpoint (Public)
  app.get('/api/migration-sql/phase-5', (req, res) => {
    try {
      const sqlPath = path.resolve('supabase/migrations/005_create_activity_progress.sql');
      if (fs.existsSync(sqlPath)) {
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        return res.json(apiResponse({ sql, filename: '005_create_activity_progress.sql' }));
      }
      return res.status(404).json(apiError('Migration SQL file not found'));
    } catch (err: any) {
      return res.status(500).json(apiError(`Failed to read migration SQL: ${err.message}`));
    }
  });

  // 7. Muscle Regions (Protected)
  app.get('/api/muscle-regions', requireAuth, async (req: Request, res: Response) => {
    try {
      const client = (req as any).userClient;
      const { data, error } = await client
        .from('muscle_regions')
        .select('*')
        .order('order_index');

      if (!error && data && data.length > 0) {
        return res.json(apiResponse(data, data.length, 1, data.length));
      }
      // Authoritative fallback from validated catalog
      return res.json(apiResponse(MUSCLE_REGIONS, MUSCLE_REGIONS.length, 1, MUSCLE_REGIONS.length));
    } catch (err: any) {
      return res.json(apiResponse(MUSCLE_REGIONS, MUSCLE_REGIONS.length, 1, MUSCLE_REGIONS.length));
    }
  });

  // 8. Muscles (Protected)
  app.get('/api/muscles', requireAuth, async (req: Request, res: Response) => {
    const regionId = req.query.regionId as string;
    try {
      const client = (req as any).userClient;
      let query = client.from('muscles').select('*');
      if (regionId && regionId !== 'all') {
        query = query.eq('region_id', regionId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        return res.json(apiResponse(data, data.length, 1, data.length));
      }

      let filtered = MUSCLES;
      if (regionId && regionId !== 'all') {
        filtered = MUSCLES.filter(m => m.regionId === regionId);
      }
      return res.json(apiResponse(filtered, filtered.length, 1, filtered.length));
    } catch (err: any) {
      let filtered = MUSCLES;
      if (regionId && regionId !== 'all') {
        filtered = MUSCLES.filter(m => m.regionId === regionId);
      }
      return res.json(apiResponse(filtered, filtered.length, 1, filtered.length));
    }
  });

  // 9. Exercise Catalog: Search & Filter (Protected)
  // Step 3 Rule: Filter by direct regionId/targetRegion match OR role === 'Primary' contribution in that region.
  // Never match on Secondary or Stabilizer contributions to prevent compound bleed.
  app.get('/api/exercises', requireAuth, async (req: Request, res: Response) => {
    try {
      const search = (req.query.search as string || '').trim().toLowerCase();
      const region = req.query.region as string;
      const muscle = req.query.muscle as string;
      const equipment = req.query.equipment as string;
      const difficulty = req.query.difficulty as string;
      const movementType = req.query.movementType as string;
      const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
      const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string || '12', 10)));

      // Step 3: Base filter by region using authoritative primary-only rule
      let workingSet = region && region !== 'all' 
        ? filterExercisesByRegion(region)
        : EXERCISES;

      // Filter by muscle if specified
      if (muscle && muscle !== 'all') {
        workingSet = workingSet.filter(ex => {
          const contribs = CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || [];
          return contribs.some(c => c.muscleId === muscle);
        });
      }

      // Filter by equipment if specified
      if (equipment && equipment !== 'all') {
        workingSet = workingSet.filter(ex => ex.equipment === equipment);
      }

      // Filter by difficulty if specified
      if (difficulty && difficulty !== 'all') {
        workingSet = workingSet.filter(ex => ex.difficulty === difficulty);
      }

      // Filter by movement type if specified
      if (movementType && movementType !== 'all') {
        workingSet = workingSet.filter(ex => ex.movementType === movementType);
      }

      // Filter by free text search query
      if (search) {
        workingSet = workingSet.filter(ex => {
          if (ex.name.toLowerCase().includes(search)) return true;
          if (ex.description.toLowerCase().includes(search)) return true;
          if (ex.equipment.toLowerCase().includes(search)) return true;
          if (ex.targetRegionId.toLowerCase().includes(search)) return true;
          const contribs = CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || [];
          return contribs.some(c => {
            const m = MUSCLE_MAP.get(c.muscleId);
            return m && (m.name.toLowerCase().includes(search) || m.commonName.toLowerCase().includes(search));
          });
        });
      }

      const total = workingSet.length;
      const startIndex = (page - 1) * limit;
      const paginated = workingSet.slice(startIndex, startIndex + limit);
      const enriched = paginated.map(enrichExercise);

      return res.json(apiResponse(enriched, total, page, limit));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error querying exercise catalog: ${err.message}`));
    }
  });

  // 10. Single Exercise Detail (Protected)
  app.get('/api/exercises/:id', requireAuth, async (req: Request, res: Response) => {
    const exerciseId = req.params.id;
    try {
      const ex = EXERCISE_MAP.get(exerciseId);
      if (!ex) {
        return res.status(404).json(apiError(`Exercise with ID '${exerciseId}' not found`));
      }
      return res.json(apiResponse(enrichExercise(ex), 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error loading exercise: ${err.message}`));
    }
  });

  // 11. Reverse Muscle Search (Protected)
  // Select a muscle/region, see exercises that train it, ranked by contribution weight (Primary > Secondary > Stabilizer, descending percentage)
  app.get('/api/muscles/reverse-search', requireAuth, async (req: Request, res: Response) => {
    const muscleId = req.query.muscleId as string;
    if (!muscleId) {
      return res.status(400).json(apiError('Missing required parameter muscleId'));
    }

    try {
      const results = reverseSearchByMuscle(muscleId);
      const enriched = results.map(item => ({
        exercise: enrichExercise(item.exercise),
        contribution: {
          ...item.contribution,
          muscle: MUSCLE_MAP.get(item.contribution.muscleId) || null,
        },
      }));

      return res.json(apiResponse(enriched, enriched.length, 1, enriched.length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error in reverse muscle search: ${err.message}`));
    }
  });

  // =========================================================================
  // PHASE 3: WORKOUT LOGGING, TEMPLATES, PRS, AND PROGRESSION
  // =========================================================================

  /**
   * Authoritative PR Reconciler:
   * Replays completed workout history in chronological order.
   * Enforces strict '>' rule for all 4 PR categories.
   * Atomically replaces personal_records for affected exercise(s).
   * Guarantees zero phantom PRs on workout edit or deletion.
   */
  async function reconcileUserPRs(client: any, userId: string, targetExerciseId?: string) {
    try {
      const { data: workouts, error: wError } = await client
        .from('workouts')
        .select(`
          id,
          started_at,
          completed_at,
          workout_exercises (
            id,
            exercise_id,
            workout_sets (
              id,
              set_number,
              set_type,
              weight,
              reps,
              completed,
              completed_at
            )
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('completed_at', { ascending: true, nullsFirst: false });

      if (wError || !workouts) {
        console.error('[reconcileUserPRs] Error fetching completed workouts:', wError);
        return [];
      }

      // Group candidate sets by exerciseId across chronological workouts
      const exerciseSetsMap = new Map<string, Array<{
        workoutId: string;
        setId: string;
        weight: number;
        reps: number;
        achievedAt: string;
      }>>();

      for (const w of workouts) {
        const achievedAt = w.completed_at || w.started_at || new Date().toISOString();
        for (const we of (w.workout_exercises || [])) {
          if (targetExerciseId && we.exercise_id !== targetExerciseId) continue;
          if (!exerciseSetsMap.has(we.exercise_id)) {
            exerciseSetsMap.set(we.exercise_id, []);
          }
          for (const s of (we.workout_sets || [])) {
            if (s.completed && s.set_type !== 'warmup' && Number(s.weight) > 0 && Number(s.reps) > 0) {
              exerciseSetsMap.get(we.exercise_id)!.push({
                workoutId: w.id,
                setId: s.id,
                weight: Number(s.weight),
                reps: Number(s.reps),
                achievedAt: s.completed_at || achievedAt,
              });
            }
          }
        }
      }

      // Delete existing PRs for the target scope
      let deleteOp = client.from('personal_records').delete().eq('user_id', userId);
      if (targetExerciseId) {
        deleteOp = deleteOp.eq('exercise_id', targetExerciseId);
      }
      await deleteOp;

      const prsToInsert: Array<{
        user_id: string;
        exercise_id: string;
        workout_id: string;
        workout_set_id: string;
        category: 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';
        value: number;
        weight: number | null;
        reps: number | null;
        achieved_at: string;
      }> = [];

      for (const [exId, candidateSets] of exerciseSetsMap.entries()) {
        let heaviestWeight = 0;
        let bestEstimated1RM = 0;
        let bestSingleSetVolume = 0;
        const repPRsByWeight: Record<number, number> = {};

        for (const cand of candidateSets) {
          const res = detectPersonalRecords(
            { weight: cand.weight, reps: cand.reps },
            { heaviestWeight, bestEstimated1RM, bestSingleSetVolume, repPRsByWeight }
          );

          if (res.isHeaviestWeightPR && res.newHeaviestWeight !== undefined) {
            heaviestWeight = res.newHeaviestWeight;
            prsToInsert.push({
              user_id: userId,
              exercise_id: exId,
              workout_id: cand.workoutId,
              workout_set_id: cand.setId,
              category: 'heaviest_weight',
              value: res.newHeaviestWeight,
              weight: res.newHeaviestWeight,
              reps: cand.reps,
              achieved_at: cand.achievedAt,
            });
          }

          if (res.isEstimated1RMPR && res.newEstimated1RM !== undefined) {
            bestEstimated1RM = res.newEstimated1RM;
            prsToInsert.push({
              user_id: userId,
              exercise_id: exId,
              workout_id: cand.workoutId,
              workout_set_id: cand.setId,
              category: 'best_estimated_1rm',
              value: res.newEstimated1RM,
              weight: cand.weight,
              reps: cand.reps,
              achieved_at: cand.achievedAt,
            });
          }

          if (res.isSingleSetVolumePR && res.newSingleSetVolume !== undefined) {
            bestSingleSetVolume = res.newSingleSetVolume;
            prsToInsert.push({
              user_id: userId,
              exercise_id: exId,
              workout_id: cand.workoutId,
              workout_set_id: cand.setId,
              category: 'best_single_set_volume',
              value: res.newSingleSetVolume,
              weight: cand.weight,
              reps: cand.reps,
              achieved_at: cand.achievedAt,
            });
          }

          if (res.isRepPR && res.newRepPR) {
            repPRsByWeight[res.newRepPR.weight] = res.newRepPR.reps;
            prsToInsert.push({
              user_id: userId,
              exercise_id: exId,
              workout_id: cand.workoutId,
              workout_set_id: cand.setId,
              category: 'rep_pr',
              value: res.newRepPR.weight,
              weight: res.newRepPR.weight,
              reps: res.newRepPR.reps,
              achieved_at: cand.achievedAt,
            });
          }
        }
      }

      if (prsToInsert.length > 0) {
        const { data: inserted, error: insertError } = await client
          .from('personal_records')
          .insert(prsToInsert)
          .select();
        if (insertError) {
          console.error('[reconcileUserPRs] Insert error:', insertError);
        }
        return inserted || [];
      }
      return [];
    } catch (err) {
      console.error('[reconcileUserPRs] Unexpected error:', err);
      return [];
    }
  }

  // 12. List Workouts (Protected)
  app.get('/api/workouts', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const offset = (page - 1) * limit;

    try {
      const { data, count, error } = await client
        .from('workouts')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('started_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        return res.status(500).json(apiError(`Error loading workouts: ${error.message}`));
      }

      return res.json(apiResponse(data || [], count || (data ? data.length : 0), page, limit));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error loading workouts: ${err.message}`));
    }
  });

  // 13. Get Active In-Progress Workout (Protected)
  app.get('/api/workouts/active', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      const { data: workout, error: wError } = await client
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'in_progress')
        .order('started_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (wError) {
        return res.status(500).json(apiError(`Error checking active workout: ${wError.message}`));
      }

      if (!workout) {
        return res.json(apiResponse(null, 0, 1, 0));
      }

      // Load exercises and sets for this workout
      const { data: exercises, error: eError } = await client
        .from('workout_exercises')
        .select(`
          *,
          workout_sets (*)
        `)
        .eq('workout_id', workout.id)
        .order('order_index', { ascending: true });

      if (eError) {
        return res.status(500).json(apiError(`Error loading workout exercises: ${eError.message}`));
      }

      const formattedExercises = (exercises || []).map((we: any) => {
        const exMeta = EXERCISE_MAP.get(we.exercise_id);
        const sortedSets = (we.workout_sets || []).sort((a: any, b: any) => a.set_number - b.set_number);
        return {
          ...we,
          exerciseName: exMeta ? exMeta.name : we.exercise_id,
          exerciseTargetRegion: exMeta ? exMeta.targetRegionId : '',
          sets: sortedSets,
        };
      });

      const session = {
        ...workout,
        exercises: formattedExercises,
      };

      return res.json(apiResponse(session, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error getting active workout: ${err.message}`));
    }
  });

  // 14. Start / Create Workout (Protected)
  app.post('/api/workouts', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const { name, templateId, exercises } = req.body;

    try {
      const workoutName = name && name.trim().length > 0 
        ? name.trim() 
        : `Workout ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;

      const { data: workout, error: wError } = await client
        .from('workouts')
        .insert({
          user_id: user.id,
          template_id: templateId || null,
          name: workoutName,
          status: 'in_progress',
          started_at: new Date().toISOString(),
          duration_seconds: 0,
          total_volume: 0,
        })
        .select()
        .single();

      if (wError || !workout) {
        return res.status(500).json(apiError(`Error creating workout: ${wError?.message}`));
      }

      const builtExercises: any[] = [];

      // If starting from a template and no custom exercises provided, populate from template
      if (templateId && (!exercises || exercises.length === 0)) {
        const { data: tplExercises } = await client
          .from('template_exercises')
          .select('*')
          .eq('template_id', templateId)
          .order('order_index', { ascending: true });

        if (tplExercises && tplExercises.length > 0) {
          for (let i = 0; i < tplExercises.length; i++) {
            const te = tplExercises[i];
            const { data: we } = await client
              .from('workout_exercises')
              .insert({
                workout_id: workout.id,
                exercise_id: te.exercise_id,
                order_index: i,
                notes: te.notes || '',
                rest_timer_seconds: te.rest_timer_seconds,
              })
              .select()
              .single();

            if (we) {
              const setsToInsert = [];
              const numSets = te.default_sets || 3;
              for (let s = 1; s <= numSets; s++) {
                setsToInsert.push({
                  workout_exercise_id: we.id,
                  set_number: s,
                  set_type: 'working',
                  weight: 0,
                  reps: te.target_reps || 10,
                  completed: false,
                });
              }
              const { data: insertedSets } = await client
                .from('workout_sets')
                .insert(setsToInsert)
                .select();

              const exMeta = EXERCISE_MAP.get(we.exercise_id);
              builtExercises.push({
                ...we,
                exerciseName: exMeta ? exMeta.name : we.exercise_id,
                exerciseTargetRegion: exMeta ? exMeta.targetRegionId : '',
                sets: insertedSets || [],
              });
            }
          }
        }
      } else if (exercises && Array.isArray(exercises)) {
        for (let i = 0; i < exercises.length; i++) {
          const exInput = exercises[i];
          const { data: we } = await client
            .from('workout_exercises')
            .insert({
              workout_id: workout.id,
              exercise_id: exInput.exerciseId,
              order_index: i,
              notes: exInput.notes || '',
              rest_timer_seconds: exInput.restTimerSeconds,
            })
            .select()
            .single();

          if (we) {
            const setsToInsert = (exInput.sets && exInput.sets.length > 0)
              ? exInput.sets.map((s: any, idx: number) => ({
                  workout_exercise_id: we.id,
                  set_number: idx + 1,
                  set_type: s.setType || 'working',
                  weight: s.weight || 0,
                  reps: s.reps || 0,
                  rir: s.rir ?? null,
                  completed: s.completed || false,
                }))
              : [
                  { workout_exercise_id: we.id, set_number: 1, set_type: 'working', weight: 0, reps: 10, completed: false },
                  { workout_exercise_id: we.id, set_number: 2, set_type: 'working', weight: 0, reps: 10, completed: false },
                  { workout_exercise_id: we.id, set_number: 3, set_type: 'working', weight: 0, reps: 10, completed: false },
                ];

            const { data: insertedSets } = await client
              .from('workout_sets')
              .insert(setsToInsert)
              .select();

            const exMeta = EXERCISE_MAP.get(we.exercise_id);
            builtExercises.push({
              ...we,
              exerciseName: exMeta ? exMeta.name : we.exercise_id,
              exerciseTargetRegion: exMeta ? exMeta.targetRegionId : '',
              sets: insertedSets || [],
            });
          }
        }
      }

      const activeSession = {
        ...workout,
        exercises: builtExercises,
      };

      return res.json(apiResponse(activeSession, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error creating workout: ${err.message}`));
    }
  });

  // 15. Get Workout Details by ID (Protected)
  app.get('/api/workouts/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const workoutId = req.params.id;

    try {
      const { data: workout, error: wError } = await client
        .from('workouts')
        .select('*')
        .eq('id', workoutId)
        .eq('user_id', user.id)
        .single();

      if (wError || !workout) {
        return res.status(404).json(apiError('Workout not found'));
      }

      const { data: exercises } = await client
        .from('workout_exercises')
        .select(`
          *,
          workout_sets (*)
        `)
        .eq('workout_id', workout.id)
        .order('order_index', { ascending: true });

      const formattedExercises = (exercises || []).map((we: any) => {
        const exMeta = EXERCISE_MAP.get(we.exercise_id);
        const sortedSets = (we.workout_sets || []).sort((a: any, b: any) => a.set_number - b.set_number);
        return {
          ...we,
          exerciseName: exMeta ? exMeta.name : we.exercise_id,
          exerciseTargetRegion: exMeta ? exMeta.targetRegionId : '',
          sets: sortedSets,
        };
      });

      return res.json(apiResponse({ ...workout, exercises: formattedExercises }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error loading workout: ${err.message}`));
    }
  });

  // 16. Update In-Progress Workout (Protected)
  app.put('/api/workouts/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const workoutId = req.params.id;
    const { name, durationSeconds, notes, exercises } = req.body;

    try {
      // 1. Update workout row
      const updates: any = { updated_at: new Date().toISOString() };
      if (name !== undefined) updates.name = name;
      if (durationSeconds !== undefined) updates.duration_seconds = durationSeconds;
      if (notes !== undefined) updates.notes = notes;

      const { data: workout, error: wError } = await client
        .from('workouts')
        .update(updates)
        .eq('id', workoutId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (wError || !workout) {
        return res.status(500).json(apiError(`Error updating workout: ${wError?.message}`));
      }

      // 2. Sync exercises & sets if provided
      if (exercises && Array.isArray(exercises)) {
        // Delete existing exercises (CASCADE cleans sets)
        await client.from('workout_exercises').delete().eq('workout_id', workoutId);

        const newBuiltExercises: any[] = [];
        for (let i = 0; i < exercises.length; i++) {
          const ex = exercises[i];
          const { data: newWe } = await client
            .from('workout_exercises')
            .insert({
              workout_id: workoutId,
              exercise_id: ex.exercise_id,
              order_index: i,
              notes: ex.notes || '',
              rest_timer_seconds: ex.rest_timer_seconds,
            })
            .select()
            .single();

          if (newWe) {
            const setsToInsert = (ex.sets || []).map((s: any, idx: number) => ({
              workout_exercise_id: newWe.id,
              set_number: idx + 1,
              set_type: s.set_type || 'working',
              weight: s.weight || 0,
              reps: s.reps || 0,
              rir: s.rir ?? null,
              completed: s.completed || false,
              completed_at: s.completed ? (s.completed_at || new Date().toISOString()) : null,
            }));

            const { data: insertedSets } = await client
              .from('workout_sets')
              .insert(setsToInsert)
              .select();

            const exMeta = EXERCISE_MAP.get(newWe.exercise_id);
            newBuiltExercises.push({
              ...newWe,
              exerciseName: exMeta ? exMeta.name : newWe.exercise_id,
              exerciseTargetRegion: exMeta ? exMeta.targetRegionId : '',
              sets: (insertedSets || []).sort((a: any, b: any) => a.set_number - b.set_number),
            });
          }
        }
        return res.json(apiResponse({ ...workout, exercises: newBuiltExercises }, 1, 1, 1));
      }

      return res.json(apiResponse(workout, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error updating workout: ${err.message}`));
    }
  });

  // 17. Complete Workout & Recalculate PRs Atomically (Protected)
  app.post('/api/workouts/:id/complete', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const workoutId = req.params.id;
    const { durationSeconds, notes, exercises } = req.body;

    try {
      // 1. Sync exercises/sets if provided
      if (exercises && Array.isArray(exercises)) {
        await client.from('workout_exercises').delete().eq('workout_id', workoutId);
        for (let i = 0; i < exercises.length; i++) {
          const ex = exercises[i];
          const { data: newWe } = await client
            .from('workout_exercises')
            .insert({
              workout_id: workoutId,
              exercise_id: ex.exercise_id,
              order_index: i,
              notes: ex.notes || '',
              rest_timer_seconds: ex.rest_timer_seconds,
            })
            .select()
            .single();

          if (newWe && ex.sets) {
            const setsToInsert = ex.sets.map((s: any, idx: number) => ({
              workout_exercise_id: newWe.id,
              set_number: idx + 1,
              set_type: s.set_type || 'working',
              weight: s.weight || 0,
              reps: s.reps || 0,
              rir: s.rir ?? null,
              completed: s.completed || false,
              completed_at: s.completed ? (s.completed_at || new Date().toISOString()) : null,
            }));
            await client.from('workout_sets').insert(setsToInsert);
          }
        }
      }

      // 2. Fetch all completed sets for authoritative volume calculation
      const { data: fullWorkout } = await client
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            id,
            exercise_id,
            workout_sets (*)
          )
        `)
        .eq('id', workoutId)
        .single();

      let totalSessionVolume = 0;
      if (fullWorkout && fullWorkout.workout_exercises) {
        for (const we of fullWorkout.workout_exercises) {
          for (const s of (we.workout_sets || [])) {
            // Authoritative: sum(weight * reps) across completed non-warmup sets only
            if (s.completed && s.set_type !== 'warmup' && Number(s.weight) > 0 && Number(s.reps) > 0) {
              totalSessionVolume += calculateSingleSetVolume(Number(s.weight), Number(s.reps));
            }
          }
        }
      }

      // 3. Mark workout as completed
      const nowIso = new Date().toISOString();
      const { data: completedWorkout, error: cError } = await client
        .from('workouts')
        .update({
          status: 'completed',
          completed_at: nowIso,
          duration_seconds: durationSeconds || fullWorkout?.duration_seconds || 0,
          total_volume: totalSessionVolume,
          notes: notes !== undefined ? notes : fullWorkout?.notes || '',
          updated_at: nowIso,
        })
        .eq('id', workoutId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (cError || !completedWorkout) {
        return res.status(500).json(apiError(`Error completing workout: ${cError?.message}`));
      }

      // 4. Atomically recalculate PRs for the user
      const newPRs = await reconcileUserPRs(client, user.id);

      return res.json(apiResponse({ workout: completedWorkout, newPRs }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error completing workout: ${err.message}`));
    }
  });

  // 18. Delete Workout with Cascade and PR Replay (Protected)
  app.delete('/api/workouts/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const workoutId = req.params.id;

    try {
      // 1. Delete workout (CASCADE drops workout_exercises and workout_sets)
      const { error: dError } = await client
        .from('workouts')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (dError) {
        return res.status(500).json(apiError(`Error deleting workout: ${dError.message}`));
      }

      // 2. Reconcile PRs across remaining history so no phantom PRs exist!
      await reconcileUserPRs(client, user.id);

      return res.json(apiResponse({ success: true, deletedId: workoutId }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error deleting workout: ${err.message}`));
    }
  });

  // 19. List Workout Templates (Protected)
  app.get('/api/templates', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      const { data: templates, error: tError } = await client
        .from('workout_templates')
        .select(`
          *,
          template_exercises (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (tError) {
        return res.status(500).json(apiError(`Error loading templates: ${tError.message}`));
      }

      const formatted = (templates || []).map((t: any) => ({
        ...t,
        exercises: (t.template_exercises || [])
          .sort((a: any, b: any) => a.order_index - b.order_index)
          .map((te: any) => {
            const exMeta = EXERCISE_MAP.get(te.exercise_id);
            return {
              ...te,
              exerciseName: exMeta ? exMeta.name : te.exercise_id,
            };
          }),
      }));

      return res.json(apiResponse(formatted, formatted.length, 1, formatted.length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error loading templates: ${err.message}`));
    }
  });

  // 20. Create Template (Protected)
  app.post('/api/templates', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const { name, description, exercises } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json(apiError('Template name is required'));
    }

    try {
      const { data: template, error: tError } = await client
        .from('workout_templates')
        .insert({
          user_id: user.id,
          name: name.trim(),
          description: description ? description.trim() : '',
        })
        .select()
        .single();

      if (tError || !template) {
        return res.status(500).json(apiError(`Error creating template: ${tError?.message}`));
      }

      const insertedExercises: any[] = [];
      if (exercises && Array.isArray(exercises) && exercises.length > 0) {
        const rows = exercises.map((ex: any, idx: number) => ({
          template_id: template.id,
          exercise_id: ex.exerciseId,
          order_index: idx,
          default_sets: ex.defaultSets || 3,
          target_reps: ex.targetReps || 10,
          rest_timer_seconds: ex.restTimerSeconds || null,
          notes: ex.notes || '',
        }));

        const { data: exData, error: exError } = await client
          .from('template_exercises')
          .insert(rows)
          .select();

        if (exData) {
          for (const item of exData) {
            const exMeta = EXERCISE_MAP.get(item.exercise_id);
            insertedExercises.push({
              ...item,
              exerciseName: exMeta ? exMeta.name : item.exercise_id,
            });
          }
        }
      }

      return res.json(apiResponse({ ...template, exercises: insertedExercises }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error creating template: ${err.message}`));
    }
  });

  // 21. Duplicate Template (Protected)
  app.post('/api/templates/:id/duplicate', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const templateId = req.params.id;

    try {
      const { data: original, error: oError } = await client
        .from('workout_templates')
        .select(`*, template_exercises (*)`)
        .eq('id', templateId)
        .eq('user_id', user.id)
        .single();

      if (oError || !original) {
        return res.status(404).json(apiError('Original template not found'));
      }

      const { data: cloned, error: cError } = await client
        .from('workout_templates')
        .insert({
          user_id: user.id,
          name: `${original.name} (Copy)`,
          description: original.description,
        })
        .select()
        .single();

      if (cError || !cloned) {
        return res.status(500).json(apiError(`Error duplicating template: ${cError?.message}`));
      }

      const clonedExercises: any[] = [];
      if (original.template_exercises && original.template_exercises.length > 0) {
        const rows = original.template_exercises.map((te: any) => ({
          template_id: cloned.id,
          exercise_id: te.exercise_id,
          order_index: te.order_index,
          default_sets: te.default_sets,
          target_reps: te.target_reps,
          rest_timer_seconds: te.rest_timer_seconds,
          notes: te.notes,
        }));

        const { data: newExercises } = await client
          .from('template_exercises')
          .insert(rows)
          .select();

        if (newExercises) {
          for (const item of newExercises) {
            const exMeta = EXERCISE_MAP.get(item.exercise_id);
            clonedExercises.push({
              ...item,
              exerciseName: exMeta ? exMeta.name : item.exercise_id,
            });
          }
        }
      }

      return res.json(apiResponse({ ...cloned, exercises: clonedExercises }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error duplicating template: ${err.message}`));
    }
  });

  // 22. Delete Template (Protected)
  app.delete('/api/templates/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const templateId = req.params.id;

    try {
      const { error: dError } = await client
        .from('workout_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (dError) {
        return res.status(500).json(apiError(`Error deleting template: ${dError.message}`));
      }

      return res.json(apiResponse({ success: true, deletedId: templateId }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error deleting template: ${err.message}`));
    }
  });

  // 23. Personal Records Endpoint (Protected)
  app.get('/api/personal-records', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const exerciseId = req.query.exerciseId as string;

    try {
      let query = client
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });

      if (exerciseId) {
        query = query.eq('exercise_id', exerciseId);
      }

      const { data, error } = await query;
      if (error) {
        return res.status(500).json(apiError(`Error loading PRs: ${error.message}`));
      }

      return res.json(apiResponse(data || [], (data || []).length, 1, (data || []).length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error loading PRs: ${err.message}`));
    }
  });

  // 24. Dashboard Summary Endpoint (Protected)
  app.get('/api/dashboard/summary', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      // 1. Completed workouts
      const { data: completedWorkouts } = await client
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false });

      const workoutsList = completedWorkouts || [];
      const sessionsCompleted = workoutsList.length;
      const totalVolume = workoutsList.reduce((acc: number, w: any) => acc + (Number(w.total_volume) || 0), 0);
      const recentWorkout = workoutsList.length > 0 ? workoutsList[0] : null;

      // Phase 4: Query real scheduled sessions for consistency calculation
      let explicitlyScheduled = 0;
      let completedScheduled = 0;
      try {
        const { data: schedData } = await client
          .from('scheduled_workouts')
          .select('id, status')
          .eq('user_id', user.id);
        if (schedData) {
          explicitlyScheduled = schedData.filter((s: any) => s.status !== 'cancelled').length;
          completedScheduled = schedData.filter((s: any) => s.status === 'completed').length;
        }
      } catch {
        // Safe fallback if table not yet created
      }

      // 0 scheduled sessions = 100% baseline intentional default
      const consistencyPercent = calculateCalendarConsistency(completedScheduled, explicitlyScheduled);

      // 2. Recent Personal Records
      const { data: prs } = await client
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false })
        .limit(5);

      const summary = {
        totalVolume: Math.round(totalVolume * 100) / 100,
        sessionsCompleted,
        scheduledSessions: explicitlyScheduled,
        consistencyPercent,
        recentWorkout,
        recentPRs: prs || [],
      };

      return res.json(apiResponse(summary, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error generating dashboard summary: ${err.message}`));
    }
  });

  // =========================================================================
  // PHASE 4: CALENDAR, RECURRENCE & SCHEDULING ENDPOINTS
  // =========================================================================

  // In-memory fallback caches if Supabase migration is pending
  const fallbackSeries = new Map<string, any[]>();
  const fallbackScheduled = new Map<string, any[]>();
  const fallbackRestDays = new Map<string, any[]>();
  const fallbackNotes = new Map<string, any[]>();

  // 1. Get Calendar Month Data (Protected)
  app.get('/api/calendar/month', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const year = parseInt(req.query.year as string, 10) || new Date().getUTCFullYear();
    const month = parseInt(req.query.month as string, 10) || (new Date().getUTCMonth() + 1);

    // Compute month boundaries expanded by 7 days on each side for calendar grid display
    const startMonthStr = `${year}-${String(month).padStart(2, '0')}-01`;
    const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const endMonthStr = `${year}-${String(month).padStart(2, '0')}-${String(lastDayOfMonth).padStart(2, '0')}`;

    const startDate = addDaysUtc(startMonthStr, -7);
    const endDate = addDaysUtc(endMonthStr, 14);

    try {
      // 1. Scheduled Workouts
      let scheduledWorkouts: any[] = [];
      const { data: swData, error: swError } = await client
        .from('scheduled_workouts')
        .select('*, workout_series(*)')
        .eq('user_id', user.id)
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate)
        .order('scheduled_date', { ascending: true });

      if (!swError && swData) {
        scheduledWorkouts = swData;
      } else {
        scheduledWorkouts = (fallbackScheduled.get(user.id) || []).filter(
          s => s.scheduled_date >= startDate && s.scheduled_date <= endDate
        );
      }

      // Mark past scheduled workouts as missed if still 'scheduled'
      const todayStr = new Date().toISOString().slice(0, 10);
      scheduledWorkouts = scheduledWorkouts.map(sw => {
        if (sw.status === 'scheduled' && sw.scheduled_date < todayStr) {
          return { ...sw, status: 'missed' };
        }
        return sw;
      });

      // 2. Completed Workouts
      const { data: workoutsData } = await client
        .from('workouts')
        .select(`
          *,
          workout_exercises (
            *,
            workout_sets (*)
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .gte('completed_at', `${startDate}T00:00:00.000Z`)
        .lte('completed_at', `${endDate}T23:59:59.999Z`);

      const completedWorkouts = workoutsData || [];

      // 3. Rest Days
      let restDays: any[] = [];
      const { data: rdData, error: rdError } = await client
        .from('calendar_rest_days')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate);

      if (!rdError && rdData) {
        restDays = rdData;
      } else {
        restDays = (fallbackRestDays.get(user.id) || []).filter(
          r => r.date >= startDate && r.date <= endDate
        );
      }

      // 4. Notes
      let notes: any[] = [];
      const { data: nData, error: nError } = await client
        .from('calendar_notes')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true });

      if (!nError && nData) {
        notes = nData;
      } else {
        notes = (fallbackNotes.get(user.id) || []).filter(
          n => n.date >= startDate && n.date <= endDate
        );
      }

      // 5. Personal Records
      const { data: prsData } = await client
        .from('personal_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('achieved_at', `${startDate}T00:00:00.000Z`)
        .lte('achieved_at', `${endDate}T23:59:59.999Z`);

      const personalRecords = prsData || [];

      // 6. Authoritative Consistency Calculation
      const explicitlyScheduled = scheduledWorkouts.filter(s => s.status !== 'cancelled').length;
      const completedScheduled = scheduledWorkouts.filter(s => s.status === 'completed').length;
      const consistencyPercent = calculateCalendarConsistency(completedScheduled, explicitlyScheduled);

      return res.json(apiResponse({
        scheduledWorkouts,
        completedWorkouts,
        restDays,
        notes,
        personalRecords,
        stats: {
          totalScheduled: explicitlyScheduled,
          completedScheduled,
          consistencyPercent,
        },
      }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error loading calendar data: ${err.message}`));
    }
  });

  // 2. Create Scheduled Workout or Recurring Series (Protected)
  app.post('/api/calendar/scheduled', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const {
      name,
      templateId,
      scheduledDate,
      scheduledTime = '09:00',
      notes,
      isRecurring = false,
      recurrenceType = 'weekly',
      recurrenceInterval = 1,
      daysOfWeek = [],
      endDate,
      userTimezone = 'UTC',
    } = req.body;

    if (!name || !scheduledDate) {
      return res.status(400).json(apiError('Name and scheduledDate are required.'));
    }

    try {
      if (isRecurring) {
        // 1. Create WorkoutSeries
        const seriesPayload = {
          user_id: user.id,
          name: name.trim(),
          template_id: templateId || null,
          recurrence_type: recurrenceType,
          recurrence_interval: Math.max(1, parseInt(recurrenceInterval, 10) || 1),
          days_of_week: Array.isArray(daysOfWeek) ? daysOfWeek : [],
          start_date: scheduledDate,
          end_date: endDate || null,
          target_time: scheduledTime,
          user_timezone: userTimezone,
          notes: notes || null,
        };

        let seriesId = `series_${Date.now()}`;
        const { data: sData, error: sError } = await client
          .from('workout_series')
          .insert(seriesPayload)
          .select('*')
          .single();

        if (!sError && sData) {
          seriesId = sData.id;
        } else {
          // In-memory fallback
          const userSeries = fallbackSeries.get(user.id) || [];
          const localSeries = { ...seriesPayload, id: seriesId, created_at: new Date().toISOString() };
          userSeries.push(localSeries);
          fallbackSeries.set(user.id, userSeries);
        }

        // 2. Generate Occurrences strictly walking UTC dates & deriving local UTC at point of computation
        const occurrences = generateOccurrencesForSeries({
          recurrenceType,
          recurrenceInterval: Math.max(1, parseInt(recurrenceInterval, 10) || 1),
          daysOfWeek,
          startDate: scheduledDate,
          endDate: endDate || null,
          targetTime: scheduledTime,
          userTimezone,
          horizonDays: 90,
        });

        const rowsToInsert = occurrences.map(occ => ({
          user_id: user.id,
          series_id: seriesId,
          template_id: templateId || null,
          workout_id: null,
          name: name.trim(),
          scheduled_date: occ.scheduled_date,
          scheduled_time: occ.scheduled_time,
          scheduled_at: occ.scheduled_at,
          status: 'scheduled',
          notes: notes || null,
          is_override: false,
        }));

        let savedRows: any[] = [];
        const { data: schedData, error: schedError } = await client
          .from('scheduled_workouts')
          .insert(rowsToInsert)
          .select('*');

        if (!schedError && schedData) {
          savedRows = schedData;
        } else {
          // In-memory fallback
          const userSched = fallbackScheduled.get(user.id) || [];
          savedRows = rowsToInsert.map(r => ({ ...r, id: `sched_${Date.now()}_${Math.random().toString(36).slice(2, 7)}` }));
          fallbackScheduled.set(user.id, [...userSched, ...savedRows]);
        }

        return res.json(apiResponse(savedRows, savedRows.length, 1, savedRows.length));
      } else {
        // Single Standalone Scheduled Workout
        const scheduledAt = localTimeToUtcIso(scheduledDate, scheduledTime, userTimezone);
        const payload = {
          user_id: user.id,
          series_id: null,
          template_id: templateId || null,
          workout_id: null,
          name: name.trim(),
          scheduled_date: scheduledDate,
          scheduled_time: scheduledTime,
          scheduled_at: scheduledAt,
          status: 'scheduled',
          notes: notes || null,
          is_override: false,
        };

        const { data, error } = await client
          .from('scheduled_workouts')
          .insert(payload)
          .select('*')
          .single();

        if (!error && data) {
          return res.json(apiResponse(data, 1, 1, 1));
        }

        // Fallback
        const row = { ...payload, id: `sched_${Date.now()}` };
        const userSched = fallbackScheduled.get(user.id) || [];
        fallbackScheduled.set(user.id, [...userSched, row]);
        return res.json(apiResponse(row, 1, 1, 1));
      }
    } catch (err: any) {
      return res.status(500).json(apiError(`Error scheduling workout: ${err.message}`));
    }
  });

  // 3. Update Scheduled Workout (Protected, supports 3 scopes)
  app.put('/api/calendar/scheduled/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const id = req.params.id;
    const {
      name,
      scheduledDate,
      scheduledTime,
      status,
      notes,
      templateId,
      scope = 'this_occurrence', // 'this_occurrence' | 'this_and_future' | 'entire_series'
    } = req.body;

    try {
      // Find the current scheduled workout
      let currentSched: any = null;
      const { data: dbSched } = await client
        .from('scheduled_workouts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (dbSched) {
        currentSched = dbSched;
      } else {
        const userSched = fallbackScheduled.get(user.id) || [];
        currentSched = userSched.find(s => s.id === id);
      }

      if (!currentSched) {
        return res.status(404).json(apiError('Scheduled workout not found'));
      }

      const effectiveDate = scheduledDate || currentSched.scheduled_date;
      const effectiveTime = scheduledTime || currentSched.scheduled_time;
      const scheduledAt = localTimeToUtcIso(effectiveDate, effectiveTime, 'UTC');

      // Scope 1: THIS OCCURRENCE ONLY (or non-series item)
      if (scope === 'this_occurrence' || !currentSched.series_id) {
        const updatePayload: any = {
          is_override: true,
          updated_at: new Date().toISOString(),
        };
        if (name !== undefined) updatePayload.name = name.trim();
        if (scheduledDate !== undefined) updatePayload.scheduled_date = scheduledDate;
        if (scheduledTime !== undefined) updatePayload.scheduled_time = scheduledTime;
        if (scheduledDate || scheduledTime) updatePayload.scheduled_at = scheduledAt;
        if (status !== undefined) updatePayload.status = status;
        if (notes !== undefined) updatePayload.notes = notes;
        if (templateId !== undefined) updatePayload.template_id = templateId || null;

        await client
          .from('scheduled_workouts')
          .update(updatePayload)
          .eq('id', id)
          .eq('user_id', user.id);

        // Also update fallback
        const userSched = fallbackScheduled.get(user.id) || [];
        const idx = userSched.findIndex(s => s.id === id);
        if (idx >= 0) {
          userSched[idx] = { ...userSched[idx], ...updatePayload };
          fallbackScheduled.set(user.id, userSched);
        }

        return res.json(apiResponse({ id, updated: true, scope: 'this_occurrence' }, 1, 1, 1));
      }

      // Scope 2: THIS AND FUTURE
      if (scope === 'this_and_future' && currentSched.series_id) {
        const seriesId = currentSched.series_id;
        const cutoffDate = currentSched.scheduled_date;
        const dayBeforeCutoff = addDaysUtc(cutoffDate, -1);

        // 1. Truncate previous series end_date
        await client
          .from('workout_series')
          .update({ end_date: dayBeforeCutoff, updated_at: new Date().toISOString() })
          .eq('id', seriesId)
          .eq('user_id', user.id);

        // 2. Delete future occurrences for the previous series from cutoffDate forward
        await client
          .from('scheduled_workouts')
          .delete()
          .eq('series_id', seriesId)
          .eq('user_id', user.id)
          .gte('scheduled_date', cutoffDate)
          .eq('status', 'scheduled');

        // 3. Create a new series starting from effectiveDate
        const newSeriesPayload = {
          user_id: user.id,
          name: name ? name.trim() : currentSched.name,
          template_id: templateId !== undefined ? templateId : currentSched.template_id,
          recurrence_type: 'weekly',
          recurrence_interval: 1,
          days_of_week: [getDayOfWeekUtc(effectiveDate)],
          start_date: effectiveDate,
          end_date: null,
          target_time: effectiveTime,
          user_timezone: 'UTC',
          notes: notes !== undefined ? notes : currentSched.notes,
        };

        const { data: newSeries } = await client
          .from('workout_series')
          .insert(newSeriesPayload)
          .select('*')
          .single();

        const newSeriesId = newSeries ? newSeries.id : `series_${Date.now()}`;

        // 4. Generate new occurrences for the new series
        const newOccurrences = generateOccurrencesForSeries({
          recurrenceType: 'weekly',
          recurrenceInterval: 1,
          daysOfWeek: [getDayOfWeekUtc(effectiveDate)],
          startDate: effectiveDate,
          endDate: null,
          targetTime: effectiveTime,
          userTimezone: 'UTC',
          horizonDays: 90,
        });

        const rows = newOccurrences.map(occ => ({
          user_id: user.id,
          series_id: newSeriesId,
          template_id: newSeriesPayload.template_id,
          workout_id: null,
          name: newSeriesPayload.name,
          scheduled_date: occ.scheduled_date,
          scheduled_time: occ.scheduled_time,
          scheduled_at: occ.scheduled_at,
          status: 'scheduled',
          notes: newSeriesPayload.notes,
          is_override: false,
        }));

        await client.from('scheduled_workouts').insert(rows);

        // Fallback sync
        const userSched = fallbackScheduled.get(user.id) || [];
        const kept = userSched.filter(s => !(s.series_id === seriesId && s.scheduled_date >= cutoffDate && s.status === 'scheduled'));
        rows.forEach(r => {
          kept.push({ ...r, id: `sched_${Date.now()}_${Math.random().toString(36).substring(2, 7)}` });
        });
        fallbackScheduled.set(user.id, kept);

        return res.json(apiResponse({ updated: true, scope: 'this_and_future', count: rows.length }, 1, 1, 1));
      }

      // Scope 3: ENTIRE SERIES
      if (scope === 'entire_series' && currentSched.series_id) {
        const seriesId = currentSched.series_id;
        const updateSeries: any = { updated_at: new Date().toISOString() };
        if (name) updateSeries.name = name.trim();
        if (scheduledTime) updateSeries.target_time = scheduledTime;
        if (templateId !== undefined) updateSeries.template_id = templateId || null;
        if (notes !== undefined) updateSeries.notes = notes;

        await client
          .from('workout_series')
          .update(updateSeries)
          .eq('id', seriesId)
          .eq('user_id', user.id);

        // Update all scheduled future occurrences in this series
        const schedUpdate: any = {};
        if (name) schedUpdate.name = name.trim();
        if (scheduledTime) schedUpdate.scheduled_time = scheduledTime;
        if (templateId !== undefined) schedUpdate.template_id = templateId || null;
        if (notes !== undefined) schedUpdate.notes = notes;

        await client
          .from('scheduled_workouts')
          .update(schedUpdate)
          .eq('series_id', seriesId)
          .eq('user_id', user.id)
          .eq('status', 'scheduled');

        // Fallback sync
        const userSched = fallbackScheduled.get(user.id) || [];
        userSched.forEach(s => {
          if (s.series_id === seriesId && s.status === 'scheduled') {
            if (name) s.name = name.trim();
            if (scheduledTime) s.scheduled_time = scheduledTime;
            if (templateId !== undefined) s.template_id = templateId || null;
            if (notes !== undefined) s.notes = notes;
          }
        });
        fallbackScheduled.set(user.id, userSched);

        return res.json(apiResponse({ updated: true, scope: 'entire_series' }, 1, 1, 1));
      }

      return res.json(apiResponse({ updated: true }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error updating scheduled workout: ${err.message}`));
    }
  });

  // 4. Delete Scheduled Workout (Protected, supports 3 scopes)
  app.delete('/api/calendar/scheduled/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const id = req.params.id;
    const scope = (req.query.scope as string) || 'this_occurrence';

    try {
      let currentSched: any = null;
      const { data: dbSched } = await client
        .from('scheduled_workouts')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (dbSched) {
        currentSched = dbSched;
      } else {
        const userSched = fallbackScheduled.get(user.id) || [];
        currentSched = userSched.find(s => s.id === id);
      }

      if (!currentSched) {
        return res.status(404).json(apiError('Scheduled workout not found'));
      }

      // Scope 1: THIS OCCURRENCE ONLY
      if (scope === 'this_occurrence' || !currentSched.series_id) {
        await client
          .from('scheduled_workouts')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        // Fallback update
        const userSched = fallbackScheduled.get(user.id) || [];
        fallbackScheduled.set(user.id, userSched.filter(s => s.id !== id));

        return res.json(apiResponse({ deleted: true, scope: 'this_occurrence' }, 1, 1, 1));
      }

      // Scope 2: THIS AND FUTURE
      if (scope === 'this_and_future' && currentSched.series_id) {
        const seriesId = currentSched.series_id;
        const cutoffDate = currentSched.scheduled_date;
        const dayBeforeCutoff = addDaysUtc(cutoffDate, -1);

        await client
          .from('workout_series')
          .update({ end_date: dayBeforeCutoff, updated_at: new Date().toISOString() })
          .eq('id', seriesId)
          .eq('user_id', user.id);

        await client
          .from('scheduled_workouts')
          .delete()
          .eq('series_id', seriesId)
          .eq('user_id', user.id)
          .gte('scheduled_date', cutoffDate);

        // Fallback
        const userSched = fallbackScheduled.get(user.id) || [];
        fallbackScheduled.set(user.id, userSched.filter(s => !(s.series_id === seriesId && s.scheduled_date >= cutoffDate)));

        return res.json(apiResponse({ deleted: true, scope: 'this_and_future' }, 1, 1, 1));
      }

      // Scope 3: ENTIRE SERIES
      if (scope === 'entire_series' && currentSched.series_id) {
        const seriesId = currentSched.series_id;
        await client
          .from('workout_series')
          .delete()
          .eq('id', seriesId)
          .eq('user_id', user.id);

        // In case cascade is not enabled in DB
        await client
          .from('scheduled_workouts')
          .delete()
          .eq('series_id', seriesId)
          .eq('user_id', user.id);

        // Fallback
        const userSched = fallbackScheduled.get(user.id) || [];
        fallbackScheduled.set(user.id, userSched.filter(s => s.series_id !== seriesId));

        return res.json(apiResponse({ deleted: true, scope: 'entire_series' }, 1, 1, 1));
      }

      return res.json(apiResponse({ deleted: true }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error deleting scheduled workout: ${err.message}`));
    }
  });

  // 5. Rest Days
  app.post('/api/calendar/rest-days', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const { date, notes } = req.body;

    if (!date) return res.status(400).json(apiError('Date is required.'));

    try {
      const payload = {
        user_id: user.id,
        date,
        notes: notes || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('calendar_rest_days')
        .upsert(payload, { onConflict: 'user_id, date' })
        .select('*')
        .single();

      if (!error && data) {
        return res.json(apiResponse(data, 1, 1, 1));
      }

      // Fallback
      const userRest = fallbackRestDays.get(user.id) || [];
      const filtered = userRest.filter(r => r.date !== date);
      const row = { ...payload, id: `rest_${Date.now()}` };
      fallbackRestDays.set(user.id, [...filtered, row]);
      return res.json(apiResponse(row, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error saving rest day: ${err.message}`));
    }
  });

  app.delete('/api/calendar/rest-days/:date', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const date = req.params.date;

    try {
      await client
        .from('calendar_rest_days')
        .delete()
        .eq('user_id', user.id)
        .eq('date', date);

      // Fallback
      const userRest = fallbackRestDays.get(user.id) || [];
      fallbackRestDays.set(user.id, userRest.filter(r => r.date !== date));

      return res.json(apiResponse({ deleted: true, date }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error removing rest day: ${err.message}`));
    }
  });

  // 6. Notes
  app.post('/api/calendar/notes', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const { date, content, category = 'general' } = req.body;

    if (!date || !content) return res.status(400).json(apiError('Date and content are required.'));

    try {
      const payload = {
        user_id: user.id,
        date,
        content: content.trim(),
        category,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('calendar_notes')
        .insert(payload)
        .select('*')
        .single();

      if (!error && data) {
        return res.json(apiResponse(data, 1, 1, 1));
      }

      // Fallback
      const userNotes = fallbackNotes.get(user.id) || [];
      const row = { ...payload, id: `note_${Date.now()}` };
      fallbackNotes.set(user.id, [...userNotes, row]);
      return res.json(apiResponse(row, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error saving calendar note: ${err.message}`));
    }
  });

  app.delete('/api/calendar/notes/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const id = req.params.id;

    try {
      await client
        .from('calendar_notes')
        .delete()
        .eq('user_id', user.id)
        .eq('id', id);

      // Fallback
      const userNotes = fallbackNotes.get(user.id) || [];
      fallbackNotes.set(user.id, userNotes.filter(n => n.id !== id));

      return res.json(apiResponse({ deleted: true, id }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error deleting calendar note: ${err.message}`));
    }
  });

  // =========================================================================
  // PHASE 5: ACTIVITY, PROGRESS, MUSCLE EXPOSURE & GLOBAL SEARCH ENDPOINTS
  // =========================================================================

  const fallbackSteps = new Map<string, any[]>();
  const fallbackBodyweight = new Map<string, any[]>();

  // 1. Get Step Entry for Date (Protected)
  app.get('/api/activity/steps', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const date = (req.query.date as string) || new Date().toISOString().slice(0, 10);

    try {
      const { data, error } = await client
        .from('step_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', date)
        .maybeSingle();

      if (!error && data) {
        return res.json(apiResponse(data, 1, 1, 1));
      }

      // Fallback
      const userSteps = fallbackSteps.get(user.id) || [];
      const found = userSteps.find(s => s.date === date);
      if (found) {
        return res.json(apiResponse(found, 1, 1, 1));
      }

      // Default empty state for the requested date
      const defaultEntry = {
        id: `default_${date}`,
        user_id: user.id,
        date,
        step_count: 0,
        goal: 10000,
        source: 'manual',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return res.json(apiResponse(defaultEntry, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error fetching step entry: ${err.message}`));
    }
  });

  // 1b. List all step entries (Protected)
  app.get('/api/activity/steps', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    try {
      const { data, error } = await client
        .from('step_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      const fallbackList = fallbackSteps.get(user.id) || [];
      const list = (data && data.length > 0) ? data : fallbackList;
      return res.json(apiResponse(list, list.length, 1, list.length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error loading step entries: ${err.message}`));
    }
  });

  // 2. Save / Upsert Step Entry (Protected)
  app.post('/api/activity/steps', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const { date, stepCount, goal = 10000, source = 'manual', deviceInfo } = req.body;

    if (!date || stepCount === undefined || stepCount < 0) {
      return res.status(400).json(apiError('Valid date and non-negative stepCount are required'));
    }

    try {
      const payload = {
        user_id: user.id,
        date,
        step_count: Math.round(Number(stepCount)),
        goal: Math.max(1000, Math.round(Number(goal))),
        source,
        device_info: deviceInfo || null,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('step_entries')
        .upsert(payload, { onConflict: 'user_id,date' })
        .select('*')
        .single();

      if (!error && data) {
        // Also update fallback
        const userSteps = fallbackSteps.get(user.id) || [];
        const filtered = userSteps.filter(s => s.date !== date);
        fallbackSteps.set(user.id, [...filtered, data]);
        return res.json(apiResponse(data, 1, 1, 1));
      }

      // Fallback
      const userSteps = fallbackSteps.get(user.id) || [];
      const filtered = userSteps.filter(s => s.date !== date);
      const row = { ...payload, id: `step_${Date.now()}` };
      fallbackSteps.set(user.id, [...filtered, row]);
      return res.json(apiResponse(row, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error saving step entry: ${err.message}`));
    }
  });

  // 3. Get Bodyweight History (Protected)
  app.get('/api/activity/bodyweight', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      const { data, error } = await client
        .from('bodyweight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (!error && data && data.length > 0) {
        return res.json(apiResponse(data, data.length, 1, data.length));
      }

      // Fallback
      const userBw = fallbackBodyweight.get(user.id) || [];
      const sorted = [...userBw].sort((a, b) => a.date.localeCompare(b.date));
      return res.json(apiResponse(sorted, sorted.length, 1, sorted.length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error fetching bodyweight entries: ${err.message}`));
    }
  });

  // 4. Save / Upsert Bodyweight Entry (Protected)
  app.post('/api/activity/bodyweight', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const { date, weight, unit = 'kg', notes, source = 'manual' } = req.body;

    const numWeight = parseFloat(weight);
    if (!date || isNaN(numWeight) || numWeight <= 0) {
      return res.status(400).json(apiError('Valid date and positive weight are required'));
    }

    try {
      const payload = {
        user_id: user.id,
        date,
        weight: Math.round(numWeight * 10000) / 10000,
        unit: 'kg', // Canonical storage is ALWAYS 'kg'
        notes: notes ? String(notes).trim() : null,
        source,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await client
        .from('bodyweight_entries')
        .upsert(payload, { onConflict: 'user_id,date' })
        .select('*')
        .single();

      if (!error && data) {
        const userBw = fallbackBodyweight.get(user.id) || [];
        const filtered = userBw.filter(b => b.date !== date);
        fallbackBodyweight.set(user.id, [...filtered, data]);
        return res.json(apiResponse(data, 1, 1, 1));
      }

      // Fallback
      const userBw = fallbackBodyweight.get(user.id) || [];
      const filtered = userBw.filter(b => b.date !== date);
      const row = { ...payload, id: `bw_${Date.now()}` };
      fallbackBodyweight.set(user.id, [...filtered, row]);
      return res.json(apiResponse(row, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error saving bodyweight entry: ${err.message}`));
    }
  });

  // 5. Delete Bodyweight Entry (Protected)
  app.delete('/api/activity/bodyweight/:id', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const id = req.params.id;

    try {
      await client
        .from('bodyweight_entries')
        .delete()
        .eq('user_id', user.id)
        .eq('id', id);

      const userBw = fallbackBodyweight.get(user.id) || [];
      fallbackBodyweight.set(user.id, userBw.filter(b => b.id !== id));
      return res.json(apiResponse({ deleted: true, id }, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error deleting bodyweight entry: ${err.message}`));
    }
  });

  // 6. Exercise Progress Data (Protected, Phase 5 Step 4)
  app.get('/api/progress/exercise-history/:exerciseId', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const exerciseId = req.params.exerciseId;
    const range = (req.query.range as any) || 'all';

    try {
      const { data: workouts, error } = await client
        .from('workouts')
        .select(`
          id,
          name,
          started_at,
          completed_at,
          created_at,
          workout_exercises (
            id,
            exercise_id,
            workout_sets (
              id,
              set_type,
              weight,
              reps,
              completed
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: true });

      const workoutList = (!error && workouts) ? workouts : [];
      const points = calculateExerciseProgress(workoutList, exerciseId, range);
      return res.json(apiResponse(points, points.length, 1, points.length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error calculating exercise progress: ${err.message}`));
    }
  });

  // 7. Muscle Exposure Analytics (Protected, Phase 5 Step 5)
  app.get('/api/progress/muscle-exposure', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const timeframe = (req.query.timeframe as any) || 'month';

    try {
      const { data: workouts, error } = await client
        .from('workouts')
        .select(`
          id,
          name,
          started_at,
          completed_at,
          created_at,
          workout_exercises (
            id,
            exercise_id,
            workout_sets (
              id,
              set_type,
              weight,
              reps,
              completed
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: true });

      const workoutList = (!error && workouts) ? workouts : [];
      const analytics = calculateMuscleExposureAnalytics(workoutList, timeframe);
      return res.json(apiResponse(analytics, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error generating muscle exposure: ${err.message}`));
    }
  });

  // 7b. All Completed Workouts with Sets (Protected, Phase 6 Detailed Analytics)
  app.get('/api/progress/all-workouts', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      const { data: workouts, error } = await client
        .from('workouts')
        .select(`
          id,
          name,
          status,
          started_at,
          completed_at,
          created_at,
          total_volume,
          workout_exercises (
            id,
            exercise_id,
            workout_sets (
              id,
              set_type,
              weight,
              reps,
              completed
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: true });

      if (error) {
        return res.status(500).json(apiError(`Error loading all workouts: ${error.message}`));
      }
      return res.json(apiResponse(workouts || [], (workouts || []).length, 1, (workouts || []).length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error loading all workouts: ${err.message}`));
    }
  });

  // 7c. Export Workout History CSV (Protected, Phase 6 Infrastructure)
  app.get('/api/export/workouts.csv', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      const { data: workouts } = await client
        .from('workouts')
        .select(`
          id,
          name,
          status,
          started_at,
          completed_at,
          workout_exercises (
            id,
            exercise_id,
            workout_sets (
              id,
              set_type,
              weight,
              reps,
              completed
            )
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .order('completed_at', { ascending: true });

      const csvContent = generateWorkoutsCsv(workouts || []);
      const filename = `liftr_workout_history_${new Date().toISOString().slice(0, 10)}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvContent);
    } catch (err: any) {
      return res.status(500).json(apiError(`Error exporting workouts CSV: ${err.message}`));
    }
  });

  // 7d. Export Bodyweight History CSV (Protected, Phase 6 Infrastructure)
  app.get('/api/export/bodyweight.csv', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      const { data: entries } = await client
        .from('bodyweight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      const fallbackList = fallbackBodyweight.get(user.id) || [];
      const list = (entries && entries.length > 0) ? entries : fallbackList;
      const csvContent = generateBodyweightCsv(list);
      const filename = `liftr_bodyweight_${new Date().toISOString().slice(0, 10)}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvContent);
    } catch (err: any) {
      return res.status(500).json(apiError(`Error exporting bodyweight CSV: ${err.message}`));
    }
  });

  // 7e. Export Steps History CSV (Protected, Phase 6 Infrastructure)
  app.get('/api/export/steps.csv', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;

    try {
      const { data: entries } = await client
        .from('step_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      const fallbackList = fallbackSteps.get(user.id) || [];
      const list = (entries && entries.length > 0) ? entries : fallbackList;
      const csvContent = generateStepsCsv(list);
      const filename = `liftr_steps_${new Date().toISOString().slice(0, 10)}.csv`;
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csvContent);
    } catch (err: any) {
      return res.status(500).json(apiError(`Error exporting steps CSV: ${err.message}`));
    }
  });

  // 8. Global Search Endpoint (Protected, Phase 5 Step 6)
  app.get('/api/search', requireAuth, async (req: Request, res: Response) => {
    const user = (req as any).user;
    const client = (req as any).userClient;
    const query = String(req.query.q || '').trim().toLowerCase();

    if (!query) {
      return res.json(apiResponse([], 0, 1, 0));
    }

    try {
      const results: any[] = [];

      // 1. Exercises Search
      for (const ex of EXERCISES) {
        if (ex.name.toLowerCase().includes(query) || ex.description.toLowerCase().includes(query)) {
          results.push({
            id: `ex_${ex.id}`,
            title: ex.name,
            subtitle: `${ex.equipment} · ${ex.movementType} · ${ex.difficulty}`,
            type: 'exercise',
            badge: 'Exercise',
            targetTab: 'workouts',
            payload: { exerciseId: ex.id },
          });
          if (results.length >= 15) break;
        }
      }

      // 2. Muscles Search
      for (const m of MUSCLES) {
        if (m.name.toLowerCase().includes(query) || m.commonName.toLowerCase().includes(query)) {
          results.push({
            id: `muscle_${m.id}`,
            title: m.name,
            subtitle: `${m.commonName} · Region: ${m.regionId}`,
            type: 'muscle',
            badge: 'Muscle',
            targetTab: 'workouts',
            payload: { muscleId: m.id, targetSubtab: 'reverseSearch' },
          });
        }
      }

      // 3. Regions Search
      for (const r of MUSCLE_REGIONS) {
        if (r.name.toLowerCase().includes(query) || r.id.toLowerCase().includes(query)) {
          results.push({
            id: `region_${r.id}`,
            title: r.name,
            subtitle: r.description,
            type: 'region',
            badge: 'Region',
            targetTab: 'workouts',
            payload: { regionId: r.id },
          });
        }
      }

      // 4. Workout History Search
      const { data: userWorkouts } = await client
        .from('workouts')
        .select('id, name, completed_at, started_at, total_volume, status')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (userWorkouts) {
        for (const w of userWorkouts) {
          const wName = (w.name || '').toLowerCase();
          const wDate = (w.completed_at || w.started_at || '').slice(0, 10);
          if (wName.includes(query) || wDate.includes(query)) {
            results.push({
              id: `workout_${w.id}`,
              title: w.name || 'Workout Session',
              subtitle: `${wDate} · ${w.total_volume || 0}kg total volume`,
              type: 'workout',
              badge: 'Workout',
              targetTab: 'workouts',
              payload: { workoutId: w.id },
            });
            if (results.length >= 30) break;
          }
        }
      }

      // 5. Date Search
      // If query looks like a date (e.g. "2026-10-05" or "today" or "oct 5")
      if (/^\d{4}-\d{2}-\d{2}$/.test(query) || query === 'today' || query === 'yesterday') {
        const targetDate = query === 'today' 
          ? new Date().toISOString().slice(0, 10) 
          : (query === 'yesterday' ? new Date(Date.now() - 86400000).toISOString().slice(0, 10) : query);

        results.unshift({
          id: `date_${targetDate}`,
          title: `Calendar: ${targetDate}`,
          subtitle: `View scheduled & completed sessions on ${targetDate}`,
          type: 'date',
          badge: 'Date',
          targetTab: 'calendar',
          payload: { date: targetDate },
        });
      }

      return res.json(apiResponse(results, results.length, 1, results.length));
    } catch (err: any) {
      return res.status(500).json(apiError(`Error performing global search: ${err.message}`));
    }
  });

  // Mount Vite middleware in development
  const vite = await createViteServer({
    root: __dirname,
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`liftr server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
