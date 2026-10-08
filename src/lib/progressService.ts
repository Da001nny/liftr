/**
 * liftr: Activity, Bodyweight, Exercise Progress & Search Service (Phase 5)
 */

import { ApiResponse } from './api-response';
import { 
  BodyweightEntryRow, 
  StepEntryRow, 
  BodyweightStats, 
  MuscleExposureAnalytics, 
  ExerciseProgressPoint, 
  GlobalSearchResult 
} from '../types/database';
import { 
  calculateBodyweightStats, 
  calculateExerciseProgress, 
  calculateMuscleExposureAnalytics 
} from './calculations';
import { EXERCISES, MUSCLES, MUSCLE_REGIONS } from '../data/exerciseCatalog';

function getAuthHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// ============================================================================
// 1. STEP TRACKING API
// ============================================================================

export interface SaveStepPayload {
  date: string; // YYYY-MM-DD
  stepCount: number;
  goal?: number;
  source?: string;
}

export async function fetchStepEntry(token: string, date: string): Promise<StepEntryRow | null> {
  try {
    const res = await fetch(`/api/activity/steps?date=${date}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<StepEntryRow> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[progressService] fetchStepEntry error:', err);
  }
  return null;
}

export async function fetchAllStepEntries(token: string): Promise<StepEntryRow[]> {
  try {
    const res = await fetch('/api/activity/steps', {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<StepEntryRow> = await res.json();
      return json.data.items || [];
    }
  } catch (err) {
    console.error('[progressService] fetchAllStepEntries error:', err);
  }
  return [];
}

export async function saveStepEntry(token: string, payload: SaveStepPayload): Promise<StepEntryRow | null> {
  try {
    const res = await fetch('/api/activity/steps', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json: ApiResponse<StepEntryRow> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[progressService] saveStepEntry error:', err);
  }
  return null;
}

// ============================================================================
// 2. BODYWEIGHT TRACKING API
// ============================================================================

export interface SaveBodyweightPayload {
  date: string; // YYYY-MM-DD
  weight: number;
  unit?: 'kg' | 'lbs';
  notes?: string;
  source?: string;
}

export async function fetchBodyweightEntries(token: string): Promise<BodyweightEntryRow[]> {
  try {
    const res = await fetch('/api/activity/bodyweight', {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<BodyweightEntryRow> = await res.json();
      return json.data.items || [];
    }
  } catch (err) {
    console.error('[progressService] fetchBodyweightEntries error:', err);
  }
  return [];
}

export async function saveBodyweightEntry(token: string, payload: SaveBodyweightPayload): Promise<BodyweightEntryRow | null> {
  try {
    const res = await fetch('/api/activity/bodyweight', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json: ApiResponse<BodyweightEntryRow> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[progressService] saveBodyweightEntry error:', err);
  }
  return null;
}

export async function deleteBodyweightEntry(token: string, id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/activity/bodyweight/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok;
  } catch (err) {
    console.error('[progressService] deleteBodyweightEntry error:', err);
  }
  return false;
}

// ============================================================================
// 3. EXERCISE PROGRESS API
// ============================================================================

export async function fetchExerciseProgressData(
  token: string,
  exerciseId: string,
  range: '7d' | '30d' | '3m' | '6m' | '1y' | 'all' = 'all'
): Promise<ExerciseProgressPoint[]> {
  try {
    const res = await fetch(`/api/progress/exercise-history/${exerciseId}?range=${range}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<ExerciseProgressPoint> = await res.json();
      return json.data.items || [];
    }
  } catch (err) {
    console.error('[progressService] fetchExerciseProgressData error:', err);
  }
  return [];
}

// ============================================================================
// 4. MUSCLE EXPOSURE ANALYTICS API
// ============================================================================

export async function fetchMuscleExposureData(
  token: string,
  timeframe: 'session' | 'week' | 'month' | 'all_time' = 'month'
): Promise<MuscleExposureAnalytics | null> {
  try {
    const res = await fetch(`/api/progress/muscle-exposure?timeframe=${timeframe}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[progressService] fetchMuscleExposureData error:', err);
  }
  return null;
}

// ============================================================================
// 5. GLOBAL SEARCH (Step 6)
// ============================================================================

export async function executeGlobalSearch(
  token: string,
  query: string
): Promise<GlobalSearchResult[]> {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return [];

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json: ApiResponse<GlobalSearchResult> = await res.json();
      return json.data.items || [];
    }
  } catch (err) {
    console.warn('[progressService] Remote search failed, falling back to local taxonomy search:', err);
  }

  // Client-side fallback search across Catalog Taxonomy
  const results: GlobalSearchResult[] = [];

  // Exercises
  for (const ex of EXERCISES) {
    if (ex.name.toLowerCase().includes(trimmed) || ex.description.toLowerCase().includes(trimmed)) {
      results.push({
        id: `ex_${ex.id}`,
        title: ex.name,
        subtitle: `${ex.equipment} · ${ex.movementType} · ${ex.difficulty}`,
        type: 'exercise',
        badge: 'Exercise',
        targetTab: 'workouts',
        payload: { exerciseId: ex.id },
      });
      if (results.length >= 20) break;
    }
  }

  // Muscles
  for (const m of MUSCLES) {
    if (m.name.toLowerCase().includes(trimmed) || m.commonName.toLowerCase().includes(trimmed)) {
      results.push({
        id: `muscle_${m.id}`,
        title: m.name,
        subtitle: `Common: ${m.commonName} · Region: ${m.regionId}`,
        type: 'muscle',
        badge: 'Muscle',
        targetTab: 'workouts',
        payload: { muscleId: m.id, targetSubtab: 'reverseSearch' },
      });
    }
  }

  // Regions
  for (const r of MUSCLE_REGIONS) {
    if (r.name.toLowerCase().includes(trimmed) || r.id.toLowerCase().includes(trimmed)) {
      results.push({
        id: `region_${r.id}`,
        title: r.name,
        subtitle: r.description,
        type: 'region',
        badge: 'Region',
        targetTab: 'workouts',
        payload: { regionId: r.id },
      });
    }
  }

  return results;
}

// ============================================================================
// 6. DETAILED ANALYTICS & EXPORT HELPERS (Phase 6)
// ============================================================================

export async function fetchAllCompletedWorkouts(token: string): Promise<any[]> {
  try {
    const res = await fetch('/api/progress/all-workouts', {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data.items || [];
    }
  } catch (err) {
    console.error('[progressService] fetchAllCompletedWorkouts error:', err);
  }
  return [];
}

export function triggerBrowserDownload(filename: string, content: string, mimeType: string = 'text/csv;charset=utf-8;') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
