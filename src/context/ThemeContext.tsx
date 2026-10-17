import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { supabase, DEFAULT_PROFILE } from '../lib/supabase';
import { 
  ThemeMode, 
  SurfaceIntensity, 
  GenderModel, 
  SkinTone, 
  UserProfile, 
  RestTimerDefaults,
  WeightUnit,
  DistanceUnit
} from '../types/database';

export {
  type PredefinedColor,
  type SkinToneOption,
  PREDEFINED_ACCENTS,
  PREDEFINED_GLOW_COLORS,
  SKIN_TONE_OPTIONS,
} from '../constants/themePresets';


interface ThemeContextType {
  themeMode: ThemeMode;
  accentColor: string;
  surfaceIntensity: SurfaceIntensity;
  gender: GenderModel;
  skinTone: SkinTone;
  heatmapGlowColor: string;
  restTimerDefaults: RestTimerDefaults;
  weightUnit: WeightUnit;
  distanceUnit: DistanceUnit;
  profile: UserProfile | null;
  effectiveTheme: 'light' | 'dark';
  isLoadingProfile: boolean;
  isSavingProfile: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setAccentColor: (hex: string) => Promise<void>;
  setSurfaceIntensity: (intensity: SurfaceIntensity) => Promise<void>;
  setGender: (gender: GenderModel) => Promise<void>;
  setSkinTone: (tone: SkinTone) => Promise<void>;
  setHeatmapGlowColor: (hex: string) => Promise<void>;
  setRestTimerDefaults: (defaults: RestTimerDefaults) => Promise<void>;
  setWeightUnit: (unit: WeightUnit) => Promise<void>;
  setDistanceUnit: (unit: DistanceUnit) => Promise<void>;
  reloadProfile: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('liftr_theme_mode');
        if (cached === 'light' || cached === 'dark' || cached === 'system') return cached;
      } catch {}
    }
    return 'dark'; // Liftr flagship default is dark
  });
  const [accentColor, setAccentColorState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('liftr_accent_color');
        if (cached) return cached;
      } catch {}
    }
    return DEFAULT_PROFILE.accent_color;
  });
  const [surfaceIntensity, setSurfaceIntensityState] = useState<SurfaceIntensity>(DEFAULT_PROFILE.surface_intensity);
  const [gender, setGenderState] = useState<GenderModel>(DEFAULT_PROFILE.gender);
  const [skinTone, setSkinToneState] = useState<SkinTone>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('liftr_skin_tone');
        if (cached === 'fair' || cached === 'medium' || cached === 'tan' || cached === 'dark') return cached;
      } catch {}
    }
    return DEFAULT_PROFILE.skin_tone || 'medium';
  });
  const [heatmapGlowColor, setHeatmapGlowColorState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('liftr_heatmap_glow_color');
        if (cached) return cached;
      } catch {}
    }
    return DEFAULT_PROFILE.heatmap_glow_color || '#00f0ff';
  });
  const [weightUnit, setWeightUnitState] = useState<WeightUnit>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('liftr_weight_unit');
        if (cached === 'kg' || cached === 'lbs') return cached;
      } catch {}
    }
    return DEFAULT_PROFILE.weight_unit || 'kg';
  });
  const [distanceUnit, setDistanceUnitState] = useState<DistanceUnit>(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('liftr_distance_unit');
        if (cached === 'km' || cached === 'mi') return cached;
      } catch {}
    }
    return DEFAULT_PROFILE.distance_unit || 'km';
  });
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
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }

    root.setAttribute('data-surface-intensity', surfaceIntensity);
    root.setAttribute('data-theme', effectiveTheme);
    root.style.setProperty('--accent-color', accentColor);
    
    // Convert hex to rgb for rgba CSS variables
    const hex = accentColor.replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      root.style.setProperty('--accent-rgb', `${r}, ${g}, ${b}`);
    }
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
        if (data.skin_tone) setSkinToneState(data.skin_tone);
        if (data.heatmap_glow_color) setHeatmapGlowColorState(data.heatmap_glow_color);
        if (data.weight_unit) setWeightUnitState(data.weight_unit);
        if (data.distance_unit) setDistanceUnitState(data.distance_unit);
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
          skin_tone: DEFAULT_PROFILE.skin_tone || 'medium',
          heatmap_glow_color: DEFAULT_PROFILE.heatmap_glow_color || '#00f0ff',
          weight_unit: DEFAULT_PROFILE.weight_unit || 'kg',
          distance_unit: DEFAULT_PROFILE.distance_unit || 'km',
        };
        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(initial)
          .select('*')
          .maybeSingle();

        if (createError && (createError.message.includes('weight_unit') || createError.message.includes('distance_unit') || createError.message.includes('schema cache'))) {
          // Fallback if migration 007 columns not yet in DB schema cache
          const { weight_unit, distance_unit, ...initialBase } = initial;
          const { data: createdBase } = await supabase
            .from('profiles')
            .insert(initialBase)
            .select('*')
            .maybeSingle();
          if (createdBase) {
            setProfile(createdBase as UserProfile);
          }
        } else if (created) {
          setProfile(created as UserProfile);
        }
      }
    } catch (err: any) {
      console.warn('[ThemeContext] Note loading profile from Supabase:', err?.message || err);
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
      const payload: Record<string, any> = {
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
        const isUnitColumnMissing = error.message.includes('weight_unit') ||
                                    error.message.includes('distance_unit') ||
                                    error.message.includes('schema cache');

        if (isUnitColumnMissing) {
          // Schema cache does not yet have weight_unit/distance_unit (migration 007 pending in user's Supabase SQL editor)
          // Gracefully retry upserting any other profile preferences (theme_mode, accent_color, etc.)
          const sanitizedPayload = { ...payload };
          delete sanitizedPayload.weight_unit;
          delete sanitizedPayload.distance_unit;

          const hasOtherFields = Object.keys(sanitizedPayload).some(k => k !== 'id' && k !== 'updated_at');
          if (hasOtherFields) {
            const { data: fallbackData } = await supabase
              .from('profiles')
              .upsert(sanitizedPayload)
              .select('*')
              .maybeSingle();
            if (fallbackData) {
              setProfile(fallbackData as UserProfile);
            }
          }
        } else {
          console.warn('[ThemeContext] Supabase upsert note:', error.message);
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
        }
      } else if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err: any) {
      console.warn('[ThemeContext] Note on profile persistence:', err?.message || err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    setThemeModeState(mode);
    try { localStorage.setItem('liftr_theme_mode', mode); } catch {}
    await persistProfileUpdate({ theme_mode: mode });
  };

  const setAccentColor = async (hex: string) => {
    setAccentColorState(hex);
    try { localStorage.setItem('liftr_accent_color', hex); } catch {}
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

  const setSkinTone = async (tone: SkinTone) => {
    setSkinToneState(tone);
    try { localStorage.setItem('liftr_skin_tone', tone); } catch {}
    await persistProfileUpdate({ skin_tone: tone });
  };

  const setHeatmapGlowColor = async (hex: string) => {
    setHeatmapGlowColorState(hex);
    try { localStorage.setItem('liftr_heatmap_glow_color', hex); } catch {}
    await persistProfileUpdate({ heatmap_glow_color: hex });
  };

  const setRestTimerDefaults = async (defaults: RestTimerDefaults) => {
    setRestTimerDefaultsState(defaults);
    await persistProfileUpdate({ rest_timer_defaults: defaults });
  };

  const setWeightUnit = async (unit: WeightUnit) => {
    setWeightUnitState(unit);
    try { localStorage.setItem('liftr_weight_unit', unit); } catch {}
    await persistProfileUpdate({ weight_unit: unit });
  };

  const setDistanceUnit = async (unit: DistanceUnit) => {
    setDistanceUnitState(unit);
    try { localStorage.setItem('liftr_distance_unit', unit); } catch {}
    await persistProfileUpdate({ distance_unit: unit });
  };

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        accentColor,
        surfaceIntensity,
        gender,
        skinTone,
        heatmapGlowColor,
        restTimerDefaults,
        weightUnit,
        distanceUnit,
        profile,
        effectiveTheme,
        isLoadingProfile,
        isSavingProfile,
        setThemeMode,
        setAccentColor,
        setSurfaceIntensity,
        setGender,
        setSkinTone,
        setHeatmapGlowColor,
        setRestTimerDefaults,
        setWeightUnit,
        setDistanceUnit,
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
