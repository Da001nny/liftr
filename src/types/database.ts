export type ThemeMode = 'light' | 'dark' | 'system';
export type SurfaceIntensity = 'low' | 'medium' | 'high';
export type GenderModel = 'male' | 'female';

export interface RestTimerDefaults {
  defaultRestSeconds: number;
  warmupRestSeconds: number;
  compoundRestSeconds: number;
}

export interface UserProfile {
  id: string;
  theme_mode: ThemeMode;
  accent_color: string;
  surface_intensity: SurfaceIntensity;
  rest_timer_defaults: RestTimerDefaults;
  gender: GenderModel;
  created_at: string;
  updated_at: string;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          theme_mode: ThemeMode;
          accent_color: string;
          surface_intensity: SurfaceIntensity;
          rest_timer_defaults: RestTimerDefaults;
          gender: GenderModel;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          theme_mode?: ThemeMode;
          accent_color?: string;
          surface_intensity?: SurfaceIntensity;
          rest_timer_defaults?: RestTimerDefaults;
          gender?: GenderModel;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          theme_mode?: ThemeMode;
          accent_color?: string;
          surface_intensity?: SurfaceIntensity;
          rest_timer_defaults?: RestTimerDefaults;
          gender?: GenderModel;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
