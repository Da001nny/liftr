/**
 * liftr: Workout, Template, and Progression Service
 * 
 * Interacts with the backend API and Supabase Postgres database.
 * Every call derives identity server-side via Supabase Auth JWT.
 */

import { ApiResponse } from './api-response';
import { 
  ActiveWorkoutSession, 
  WorkoutRow, 
  WorkoutTemplateRow, 
  PersonalRecordRow,
  SetType,
  ActiveWorkoutExercise,
  ActiveWorkoutSet
} from '../types/database';
import { reportFailure } from './failure';

export interface DashboardSummaryData {
  totalVolume: number;
  sessionsCompleted: number;
  scheduledSessions: number;
  consistencyPercent: number;
  recentWorkout: WorkoutRow | null;
  recentPRs: PersonalRecordRow[];
}

export interface CreateWorkoutPayload {
  name: string;
  templateId?: string | null;
  exercises?: Array<{
    exerciseId: string;
    restTimerSeconds?: number | null;
    notes?: string;
    sets?: Array<{
      weight: number;
      reps: number;
      setType?: SetType;
      rir?: number | null;
    }>;
  }>;
}

export interface CreateTemplatePayload {
  name: string;
  description?: string;
  exercises: Array<{
    exerciseId: string;
    defaultSets?: number;
    targetReps?: number;
    restTimerSeconds?: number | null;
    notes?: string;
  }>;
}

export interface EnrichedTemplateExercise {
  id: string;
  templateId: string;
  exerciseId: string;
  exerciseName: string;
  orderIndex: number;
  defaultSets: number;
  targetReps: number;
  restTimerSeconds: number | null;
  notes: string;
}

export interface EnrichedWorkoutTemplate extends WorkoutTemplateRow {
  exercises: EnrichedTemplateExercise[];
}

function getAuthHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ----------------------------------------------------------------------------
// WORKOUT SESSIONS
// ----------------------------------------------------------------------------

export async function fetchWorkouts(
  token: string,
  page: number = 1,
  limit: number = 20
): Promise<{ items: WorkoutRow[]; total: number; page: number; limit: number }> {
  try {
    const res = await fetch(`/api/workouts?page=${page}&limit=${limit}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<WorkoutRow> = await res.json();
      return json.data;
    }
  } catch (err) {
    console.error('[workoutService] fetchWorkouts failed:', err);
  }
  return { items: [], total: 0, page, limit };
}

export async function fetchActiveWorkout(token: string): Promise<ActiveWorkoutSession | null> {
  try {
    const res = await fetch('/api/workouts/active', {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<ActiveWorkoutSession> = await res.json();
      if (json.data && json.data.items.length > 0) {
        return json.data.items[0];
      }
    }
  } catch (err) {
    console.error('[workoutService] fetchActiveWorkout failed:', err);
  }
  return null;
}

export async function createWorkout(
  token: string,
  payload: CreateWorkoutPayload
): Promise<ActiveWorkoutSession | null> {
  try {
    const res = await fetch('/api/workouts', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json: ApiResponse<ActiveWorkoutSession> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[workoutService] createWorkout failed:', err);
  }
  return null;
}

export async function fetchWorkoutById(
  token: string,
  workoutId: string
): Promise<ActiveWorkoutSession | null> {
  try {
    const res = await fetch(`/api/workouts/${workoutId}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<ActiveWorkoutSession> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[workoutService] fetchWorkoutById failed:', err);
  }
  return null;
}

export async function updateWorkoutSession(
  token: string,
  workoutId: string,
  payload: {
    name?: string;
    durationSeconds?: number;
    notes?: string;
    exercises?: ActiveWorkoutExercise[];
  }
): Promise<ActiveWorkoutSession | null> {
  try {
    const res = await fetch(`/api/workouts/${workoutId}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json: ApiResponse<ActiveWorkoutSession> = await res.json();
      return json.data.items[0] || null;
    }
    console.error('[workoutService] updateWorkoutSession failed: status', res.status);
    reportFailure('autosaveWorkout', { status: res.status }, { dedupeMs: 60000 });
  } catch (err) {
    console.error('[workoutService] updateWorkoutSession failed:', err);
    reportFailure('autosaveWorkout', { networkError: true }, { dedupeMs: 60000 });
  }
  return null;
}

export async function completeWorkoutSession(
  token: string,
  workoutId: string,
  payload: {
    durationSeconds: number;
    notes?: string;
    exercises?: ActiveWorkoutExercise[];
  }
): Promise<{ workout: WorkoutRow; newPRs: PersonalRecordRow[] } | null> {
  try {
    const res = await fetch(`/api/workouts/${workoutId}/complete`, {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && json.data.items.length > 0) {
        return json.data.items[0];
      }
    }
    console.error('[workoutService] completeWorkoutSession failed: status', res.status);
    reportFailure('completeWorkout', { status: res.status });
  } catch (err) {
    console.error('[workoutService] completeWorkoutSession failed:', err);
    reportFailure('completeWorkout', { networkError: true });
  }
  return null;
}

export async function deleteWorkoutSession(token: string, workoutId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/workouts/${workoutId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok;
  } catch (err) {
    console.error('[workoutService] deleteWorkoutSession failed:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// WORKOUT TEMPLATES
// ----------------------------------------------------------------------------

export async function fetchTemplates(token: string): Promise<EnrichedWorkoutTemplate[]> {
  try {
    const res = await fetch('/api/templates', {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<EnrichedWorkoutTemplate> = await res.json();
      return json.data.items;
    }
  } catch (err) {
    console.error('[workoutService] fetchTemplates failed:', err);
  }
  return [];
}

export async function createTemplate(
  token: string,
  payload: CreateTemplatePayload
): Promise<EnrichedWorkoutTemplate | null> {
  try {
    const res = await fetch('/api/templates', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json: ApiResponse<EnrichedWorkoutTemplate> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[workoutService] createTemplate failed:', err);
  }
  return null;
}

export async function duplicateTemplate(
  token: string,
  templateId: string
): Promise<EnrichedWorkoutTemplate | null> {
  try {
    const res = await fetch(`/api/templates/${templateId}/duplicate`, {
      method: 'POST',
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<EnrichedWorkoutTemplate> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[workoutService] duplicateTemplate failed:', err);
  }
  return null;
}

export async function deleteTemplate(token: string, templateId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/templates/${templateId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok;
  } catch (err) {
    console.error('[workoutService] deleteTemplate failed:', err);
    return false;
  }
}

// ----------------------------------------------------------------------------
// PERSONAL RECORDS & DASHBOARD
// ----------------------------------------------------------------------------

export async function fetchPersonalRecords(
  token: string,
  exerciseId?: string
): Promise<PersonalRecordRow[]> {
  try {
    const url = exerciseId 
      ? `/api/personal-records?exerciseId=${exerciseId}` 
      : '/api/personal-records';
    const res = await fetch(url, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<PersonalRecordRow> = await res.json();
      return json.data.items;
    }
  } catch (err) {
    console.error('[workoutService] fetchPersonalRecords failed:', err);
  }
  return [];
}

export async function fetchDashboardSummary(token: string): Promise<DashboardSummaryData> {
  try {
    const res = await fetch('/api/dashboard/summary', {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<DashboardSummaryData> = await res.json();
      if (json.data && json.data.items.length > 0) {
        return json.data.items[0];
      }
    }
  } catch (err) {
    console.error('[workoutService] fetchDashboardSummary failed:', err);
  }
  return {
    totalVolume: 0,
    sessionsCompleted: 0,
    scheduledSessions: 0,
    consistencyPercent: 100,
    recentWorkout: null,
    recentPRs: [],
  };
}
