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
      muscle_regions: {
        Row: {
          id: string;
          name: string;
          description: string;
          order_index: number;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          order_index?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          order_index?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      muscles: {
        Row: {
          id: string;
          name: string;
          common_name: string;
          region_id: string;
          subregion: string;
          description: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          common_name: string;
          region_id: string;
          subregion: string;
          description: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          common_name?: string;
          region_id?: string;
          subregion?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "muscles_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "muscle_regions";
            referencedColumns: ["id"];
          }
        ];
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string;
          equipment: string;
          movement_type: string;
          difficulty: string;
          instructions: Json;
          image_url: string | null;
          video_url: string | null;
          target_region_id: string;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description: string;
          equipment: string;
          movement_type: string;
          difficulty: string;
          instructions?: Json;
          image_url?: string | null;
          video_url?: string | null;
          target_region_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          equipment?: string;
          movement_type?: string;
          difficulty?: string;
          instructions?: Json;
          image_url?: string | null;
          video_url?: string | null;
          target_region_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercises_target_region_id_fkey";
            columns: ["target_region_id"];
            isOneToOne: false;
            referencedRelation: "muscle_regions";
            referencedColumns: ["id"];
          }
        ];
      };
      exercise_muscle_contributions: {
        Row: {
          id: string;
          exercise_id: string;
          muscle_id: string;
          percentage: number;
          role: 'Primary' | 'Secondary' | 'Stabilizer';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          exercise_id: string;
          muscle_id: string;
          percentage: number;
          role: 'Primary' | 'Secondary' | 'Stabilizer';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          exercise_id?: string;
          muscle_id?: string;
          percentage?: number;
          role?: 'Primary' | 'Secondary' | 'Stabilizer';
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "exercise_muscle_contributions_exercise_id_fkey";
            columns: ["exercise_id"];
            isOneToOne: false;
            referencedRelation: "exercises";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "exercise_muscle_contributions_muscle_id_fkey";
            columns: ["muscle_id"];
            isOneToOne: false;
            referencedRelation: "muscles";
            referencedColumns: ["id"];
          }
        ];
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
