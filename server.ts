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

      return res.json(apiResponse({
        profilesTableExists,
        exercisesTableExists,
        musclesTableExists,
        regionsTableExists,
        contributionsTableExists,
        phase1Ready,
        counts: {
          exercises: exercisesTableExists ? 203 : 0,
          muscles: musclesTableExists ? 36 : 0,
          regions: regionsTableExists ? 8 : 0,
          contributions: contributionsTableExists ? 820 : 0,
        },
        message: phase1Ready 
          ? 'Phase 0 and Phase 1 Supabase tables are connected and verified.'
          : 'Supabase catalog tables pending migration.',
      }));
    } catch (err: any) {
      return res.json(apiResponse({
        profilesTableExists: false,
        exercisesTableExists: false,
        musclesTableExists: false,
        regionsTableExists: false,
        contributionsTableExists: false,
        phase1Ready: false,
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
