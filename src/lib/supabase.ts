import { createClient } from '@supabase/supabase-js';
import { Database, UserProfile } from '../types/database';

const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 'https://cetpdeuuymspiygxnmdg.supabase.co';
const supabaseAnonKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNldHBkZXV1eW1zcGl5Z3hubWRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyOTkyNTgsImV4cCI6MjEwNTg3NTI1OH0.4uZq0Y-Tp51MWN-mFWfVWcqDgR4Q_MHf7J765sShg5Y';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const DEFAULT_PROFILE: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'> = {
  theme_mode: 'system',
  accent_color: '#3b82f6',
  surface_intensity: 'medium',
  rest_timer_defaults: {
    defaultRestSeconds: 90,
    warmupRestSeconds: 60,
    compoundRestSeconds: 180,
  },
  gender: 'male',
  skin_tone: 'medium',
  heatmap_glow_color: '#00f0ff',
  weight_unit: 'kg',
  distance_unit: 'km',
};

