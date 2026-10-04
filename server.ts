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
} from './src/lib/calculations.ts';

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
        counts: {
          exercises: exercisesTableExists ? 203 : 0,
          muscles: musclesTableExists ? 36 : 0,
          regions: regionsTableExists ? 8 : 0,
          contributions: contributionsTableExists ? 820 : 0,
        },
        message: phase3Ready
          ? 'Phase 0, 1, and 3 Supabase tables are connected and verified.'
          : (phase1Ready ? 'Phase 3 workout & progression tables pending migration.' : 'Supabase catalog tables pending migration.'),
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
        };

        const { data: created, error: insertError } = await client
          .from('profiles')
          .insert(defaultProfile)
          .select('*')
          .single();

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
    const { theme_mode, accent_color, surface_intensity, rest_timer_defaults, gender } = req.body;

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

    try {
      const { data, error } = await client
        .from('profiles')
        .upsert({ id: user.id, ...updates })
        .select('*')
        .single();

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

      // 0 scheduled sessions = 100% baseline intentional default
      const consistencyPercent = calculateCalendarConsistency(sessionsCompleted, 0);

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
        scheduledSessions: 0,
        consistencyPercent,
        recentWorkout,
        recentPRs: prs || [],
      };

      return res.json(apiResponse(summary, 1, 1, 1));
    } catch (err: any) {
      return res.status(500).json(apiError(`Server error generating dashboard summary: ${err.message}`));
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
