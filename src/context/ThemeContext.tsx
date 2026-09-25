import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase, DEFAULT_PROFILE } from '../lib/supabase';
import { ThemeMode, SurfaceIntensity, GenderModel, UserProfile, RestTimerDefaults } from '../types/database';

export interface PredefinedColor {
  id: string;
  name: string;
  hex: string;
}

export const PREDEFINED_ACCENTS: PredefinedColor[] = [
  { id: 'electric-blue', name: 'Electric Blue', hex: '#3b82f6' },
  { id: 'chrome-silver', name: 'Chrome Silver', hex: '#94a3b8' },
  { id: 'hyper-violet', name: 'Hyper Violet', hex: '#8b5cf6' },
  { id: 'crimson-steel', name: 'Crimson Steel', hex: '#f43f5e' },
  { id: 'emerald-titanium', name: 'Emerald Titanium', hex: '#10b981' },
  { id: 'amber-gold', name: 'Amber Gold', hex: '#f59e0b' },
];

interface ThemeContextType {
  themeMode: ThemeMode;
  accentColor: string;
  surfaceIntensity: SurfaceIntensity;
  gender: GenderModel;
  restTimerDefaults: RestTimerDefaults;
  profile: UserProfile | null;
  effectiveTheme: 'light' | 'dark';
  isLoadingProfile: boolean;
  isSavingProfile: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setAccentColor: (hex: string) => Promise<void>;
  setSurfaceIntensity: (intensity: SurfaceIntensity) => Promise<void>;
  setGender: (gender: GenderModel) => Promise<void>;
  setRestTimerDefaults: (defaults: RestTimerDefaults) => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(DEFAULT_PROFILE.theme_mode);
  const [accentColor, setAccentColorState] = useState<string>(DEFAULT_PROFILE.accent_color);
  const [surfaceIntensity, setSurfaceIntensityState] = useState<SurfaceIntensity>(DEFAULT_PROFILE.surface_intensity);
  const [gender, setGenderState] = useState<GenderModel>(DEFAULT_PROFILE.gender);
  const [restTimerDefaults, setRestTimerDefaultsState] = useState<RestTimerDefaults>(DEFAULT_PROFILE.rest_timer_defaults);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);

  // System media query state
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Track system dark mode change
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Compute effective theme ('light' or 'dark')
  const effectiveTheme = themeMode === 'system'
    ? (systemPrefersDark ? 'dark' : 'light')
    : themeMode;

  // Apply classes and CSS variables to documentElement
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    root.setAttribute('data-surface-intensity', surfaceIntensity);
    root.style.setProperty('--accent-color', accentColor);
  }, [effectiveTheme, surfaceIntensity, accentColor]);

  // Load profile from Supabase Postgres when authenticated user changes
  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setIsLoadingProfile(true);
    try {
      // Direct query with RLS scoped to auth.uid()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('[ThemeContext] Note on profiles query:', error.message);
      }

      if (data) {
        setProfile(data as UserProfile);
        setThemeModeState(data.theme_mode || 'system');
        setAccentColorState(data.accent_color || '#3b82f6');
        setSurfaceIntensityState(data.surface_intensity || 'medium');
        setGenderState(data.gender || 'male');
        if (data.rest_timer_defaults) {
          setRestTimerDefaultsState(data.rest_timer_defaults);
        }
      } else {
        // Attempt to auto-initialize profile in Supabase for this user
        const initial = {
          id: user.id,
          theme_mode: 'system' as const,
          accent_color: '#3b82f6',
          surface_intensity: 'medium' as const,
          rest_timer_defaults: DEFAULT_PROFILE.rest_timer_defaults,
          gender: 'male' as const,
        };
        const { data: created } = await supabase
          .from('profiles')
          .insert(initial)
          .select('*')
          .maybeSingle();

        if (created) {
          setProfile(created as UserProfile);
        }
      }
    } catch (err) {
      console.error('[ThemeContext] Error loading profile from Supabase:', err);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Persist preference updates to Supabase (not local state or memory!)
  const persistProfileUpdate = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    setIsSavingProfile(true);

    try {
      const payload = {
        id: user.id,
        ...updates,
        updated_at: new Date().toISOString(),
      };

      // 1. Send to Supabase Postgres (RLS protected)
      const { data, error } = await supabase
        .from('profiles')
        .upsert(payload)
        .select('*')
        .single();

      if (error) {
        console.error('[ThemeContext] Supabase upsert error:', error.message);
        // Fallback: If REST direct failed, attempt via backend /api/profile endpoint
        if (token) {
          await fetch('/api/profile', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
          });
        }
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err) {
      console.error('[ThemeContext] Failed to persist profile to Supabase:', err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    await persistProfileUpdate({ theme_mode: mode });
  };

  const setAccentColor = async (hex: string) => {
    setAccentColorState(hex);
    await persistProfileUpdate({ accent_color: hex });
  };

  const setSurfaceIntensity = async (intensity: SurfaceIntensity) => {
    setSurfaceIntensityState(intensity);
    await persistProfileUpdate({ surface_intensity: intensity });
  };

  const setGender = async (newGender: GenderModel) => {
    setGenderState(newGender);
    await persistProfileUpdate({ gender: newGender });
  };

  const setRestTimerDefaults = async (defaults: RestTimerDefaults) => {
    setRestTimerDefaultsState(defaults);
    await persistProfileUpdate({ rest_timer_defaults: defaults });
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        accentColor,
        surfaceIntensity,
        gender,
        restTimerDefaults,
        profile,
        effectiveTheme,
        isLoadingProfile,
        isSavingProfile,
        setThemeMode,
        setAccentColor,
        setSurfaceIntensity,
        setGender,
        setRestTimerDefaults,
        reloadProfile: loadProfile,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
