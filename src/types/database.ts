export type ThemeMode = 'light' | 'dark' | 'system';
export type SurfaceIntensity = 'low' | 'medium' | 'high';
export type GenderModel = 'male' | 'female';
export type SkinTone = 'fair' | 'medium' | 'tan' | 'dark';

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
  skin_tone?: SkinTone;
  heatmap_glow_color?: string;
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
          skin_tone?: SkinTone;
          heatmap_glow_color?: string;
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
          skin_tone?: SkinTone;
          heatmap_glow_color?: string;
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
          skin_tone?: SkinTone;
          heatmap_glow_color?: string;
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
      workout_templates: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      template_exercises: {
        Row: {
          id: string;
          template_id: string;
          exercise_id: string;
          order_index: number;
          default_sets: number;
          target_reps: number;
          rest_timer_seconds: number | null;
          notes: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          exercise_id: string;
          order_index?: number;
          default_sets?: number;
          target_reps?: number;
          rest_timer_seconds?: number | null;
          notes?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          exercise_id?: string;
          order_index?: number;
          default_sets?: number;
          target_reps?: number;
          rest_timer_seconds?: number | null;
          notes?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          template_id: string | null;
          name: string;
          status: 'in_progress' | 'completed' | 'discarded';
          started_at: string;
          completed_at: string | null;
          duration_seconds: number;
          total_volume: number;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          template_id?: string | null;
          name: string;
          status?: 'in_progress' | 'completed' | 'discarded';
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number;
          total_volume?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_id?: string | null;
          name?: string;
          status?: 'in_progress' | 'completed' | 'discarded';
          started_at?: string;
          completed_at?: string | null;
          duration_seconds?: number;
          total_volume?: number;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_id: string;
          exercise_id: string;
          order_index: number;
          notes: string;
          rest_timer_seconds: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_id: string;
          exercise_id: string;
          order_index?: number;
          notes?: string;
          rest_timer_seconds?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_id?: string;
          exercise_id?: string;
          order_index?: number;
          notes?: string;
          rest_timer_seconds?: number | null;
          created_at?: string;
        };
        Relationships: [];
      };
      workout_sets: {
        Row: {
          id: string;
          workout_exercise_id: string;
          set_number: number;
          set_type: 'warmup' | 'working' | 'drop' | 'failure';
          weight: number;
          reps: number;
          rir: number | null;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_exercise_id: string;
          set_number?: number;
          set_type?: 'warmup' | 'working' | 'drop' | 'failure';
          weight?: number;
          reps?: number;
          rir?: number | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_exercise_id?: string;
          set_number?: number;
          set_type?: 'warmup' | 'working' | 'drop' | 'failure';
          weight?: number;
          reps?: number;
          rir?: number | null;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      personal_records: {
        Row: {
          id: string;
          user_id: string;
          exercise_id: string;
          workout_id: string | null;
          workout_set_id: string | null;
          category: 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';
          value: number;
          reps: number | null;
          achieved_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          exercise_id: string;
          workout_id?: string | null;
          workout_set_id?: string | null;
          category: 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';
          value: number;
          reps?: number | null;
          achieved_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          exercise_id?: string;
          workout_id?: string | null;
          workout_set_id?: string | null;
          category?: 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';
          value?: number;
          reps?: number | null;
          achieved_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      workout_series: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          template_id: string | null;
          recurrence_type: 'daily' | 'weekly' | 'biweekly' | 'custom';
          recurrence_interval: number;
          days_of_week: number[];
          start_date: string;
          end_date: string | null;
          target_time: string;
          user_timezone: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          template_id?: string | null;
          recurrence_type: 'daily' | 'weekly' | 'biweekly' | 'custom';
          recurrence_interval?: number;
          days_of_week?: number[];
          start_date: string;
          end_date?: string | null;
          target_time?: string;
          user_timezone?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          template_id?: string | null;
          recurrence_type?: 'daily' | 'weekly' | 'biweekly' | 'custom';
          recurrence_interval?: number;
          days_of_week?: number[];
          start_date?: string;
          end_date?: string | null;
          target_time?: string;
          user_timezone?: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      scheduled_workouts: {
        Row: {
          id: string;
          user_id: string;
          series_id: string | null;
          template_id: string | null;
          workout_id: string | null;
          name: string;
          scheduled_date: string;
          scheduled_time: string;
          scheduled_at: string;
          status: 'scheduled' | 'completed' | 'missed' | 'cancelled';
          notes: string | null;
          is_override: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          series_id?: string | null;
          template_id?: string | null;
          workout_id?: string | null;
          name: string;
          scheduled_date: string;
          scheduled_time?: string;
          scheduled_at: string;
          status?: 'scheduled' | 'completed' | 'missed' | 'cancelled';
          notes?: string | null;
          is_override?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          series_id?: string | null;
          template_id?: string | null;
          workout_id?: string | null;
          name?: string;
          scheduled_date?: string;
          scheduled_time?: string;
          scheduled_at?: string;
          status?: 'scheduled' | 'completed' | 'missed' | 'cancelled';
          notes?: string | null;
          is_override?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      calendar_notes: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          content: string;
          category: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          content: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          content?: string;
          category?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      calendar_rest_days: {
        Row: {
          id: string;
          user_id: string;
          date: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          date: string;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          date?: string;
          notes?: string | null;
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

// Domain Model Exports for Phase 3
export type WorkoutStatus = 'in_progress' | 'completed' | 'discarded';
export type SetType = 'warmup' | 'working' | 'drop' | 'failure';
export type PRCategory = 'heaviest_weight' | 'best_estimated_1rm' | 'best_single_set_volume' | 'rep_pr';

export type WorkoutRow = Database['public']['Tables']['workouts']['Row'];
export type WorkoutExerciseRow = Database['public']['Tables']['workout_exercises']['Row'];
export type WorkoutSetRow = Database['public']['Tables']['workout_sets']['Row'];
export type PersonalRecordRow = Database['public']['Tables']['personal_records']['Row'];
export type WorkoutTemplateRow = Database['public']['Tables']['workout_templates']['Row'];
export type TemplateExerciseRow = Database['public']['Tables']['template_exercises']['Row'];

// Domain Model Exports for Phase 4
export type RecurrenceType = 'daily' | 'weekly' | 'biweekly' | 'custom';
export type ScheduleStatus = 'scheduled' | 'completed' | 'missed' | 'cancelled';
export type EditingScope = 'this_occurrence' | 'this_and_future' | 'entire_series';

export type WorkoutSeriesRow = Database['public']['Tables']['workout_series']['Row'];
export type ScheduledWorkoutRow = Database['public']['Tables']['scheduled_workouts']['Row'];
export type CalendarNoteRow = Database['public']['Tables']['calendar_notes']['Row'];
export type CalendarRestDayRow = Database['public']['Tables']['calendar_rest_days']['Row'];

export interface EnrichedScheduledWorkout extends ScheduledWorkoutRow {
  series?: WorkoutSeriesRow | null;
  workout?: WorkoutRow | null;
  exerciseIds?: string[];
  muscleIds?: string[];
}

export interface CalendarDayData {
  dateStr: string; // YYYY-MM-DD
  dayNumber: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  scheduledWorkouts: EnrichedScheduledWorkout[];
  completedWorkouts: WorkoutRow[];
  restDay: CalendarRestDayRow | null;
  notes: CalendarNoteRow[];
  personalRecords: PersonalRecordRow[];
  trainedMuscles: string[]; // Set of muscle ids trained on this date
  performedExercises: string[]; // Set of exercise ids performed on this date
}

export interface ActiveWorkoutSet extends WorkoutSetRow {
  tempId?: string;
}

export interface ActiveWorkoutExercise extends WorkoutExerciseRow {
  exerciseName?: string;
  exerciseTargetRegion?: string;
  sets: ActiveWorkoutSet[];
}

export interface ActiveWorkoutSession extends WorkoutRow {
  exercises: ActiveWorkoutExercise[];
}

