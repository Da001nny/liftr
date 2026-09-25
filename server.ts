import express, { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

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

  // 1. Health check endpoint (Public)
  app.get('/api/health', (req, res) => {
    res.json(apiResponse({
      status: 'ok',
      service: 'liftr-api',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    }));
  });

  // 2. Schema status check (Public)
  app.get('/api/schema-status', async (req, res) => {
    try {
      const { error } = await supabaseServer.from('profiles').select('id').limit(1);
      if (error && (error.code === 'PGRST205' || error.message.includes('profiles'))) {
        return res.json(apiResponse({
          profilesTableExists: false,
          error: error.message,
          message: 'The public.profiles table has not been created yet in Supabase.',
        }));
      }
      return res.json(apiResponse({
        profilesTableExists: true,
        message: 'Supabase profiles table is connected and ready.',
      }));
    } catch (err: any) {
      return res.json(apiResponse({
        profilesTableExists: false,
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

  // Mount Vite middleware in development
  const vite = await createViteServer({
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
