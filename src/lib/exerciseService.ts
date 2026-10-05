import type { 
  Exercise, 
  Muscle, 
  MuscleRegion, 
  ExerciseMuscleContribution
} from '../data/exerciseCatalog';
import {
  filterExercisesByRegion,
  reverseSearchByMuscle,
  EXERCISES,
  MUSCLES,
  MUSCLE_REGIONS,
  EXERCISE_MAP,
  CONTRIBUTIONS_BY_EXERCISE,
  MUSCLE_MAP,
  REGION_MAP
} from '../data/exerciseCatalog';

export { 
  EXERCISES, 
  MUSCLES, 
  MUSCLE_REGIONS, 
  filterExercisesByRegion, 
  reverseSearchByMuscle
};
export type {
  Exercise, 
  Muscle, 
  MuscleRegion, 
  ExerciseMuscleContribution
};
import { ApiResponse } from './api-response';

export interface ExerciseFilterParams {
  search?: string;
  region?: string;
  muscle?: string;
  equipment?: string;
  difficulty?: string;
  movementType?: string;
  page?: number;
  limit?: number;
}

export interface EnrichedContribution extends ExerciseMuscleContribution {
  muscleName?: string;
  muscleCommonName?: string;
  subregion?: string;
  regionId?: string;
}

export interface EnrichedExercise extends Exercise {
  targetRegion?: MuscleRegion | null;
  contributions: EnrichedContribution[];
}

export interface ReverseSearchResult {
  exercise: EnrichedExercise;
  contribution: EnrichedContribution;
}

function enrichExercise(ex: Exercise): EnrichedExercise {
  const contribs = (CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || []).map(c => {
    const muscle = MUSCLE_MAP.get(c.muscleId);
    return {
      ...c,
      muscleName: muscle ? muscle.name : c.muscleId,
      muscleCommonName: muscle ? muscle.commonName : c.muscleId,
      subregion: muscle ? muscle.subregion : '',
      regionId: muscle ? muscle.regionId : '',
    };
  });
  return {
    ...ex,
    targetRegion: REGION_MAP.get(ex.targetRegionId) || null,
    contributions: contribs,
  };
}

export async function fetchExercises(
  params: ExerciseFilterParams,
  token?: string | null
): Promise<{ items: EnrichedExercise[]; total: number; page: number; limit: number }> {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.set('search', params.search);
  if (params.region && params.region !== 'all') queryParams.set('region', params.region);
  if (params.muscle && params.muscle !== 'all') queryParams.set('muscle', params.muscle);
  if (params.equipment && params.equipment !== 'all') queryParams.set('equipment', params.equipment);
  if (params.difficulty && params.difficulty !== 'all') queryParams.set('difficulty', params.difficulty);
  if (params.movementType && params.movementType !== 'all') queryParams.set('movementType', params.movementType);
  if (params.page) queryParams.set('page', params.page.toString());
  if (params.limit) queryParams.set('limit', params.limit.toString());

  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`/api/exercises?${queryParams.toString()}`, { headers });
    if (response.ok) {
      const result = (await response.json()) as ApiResponse<EnrichedExercise>;
      if (result.data) {
        return {
          items: result.data.items,
          total: result.data.total,
          page: result.data.page,
          limit: result.data.limit,
        };
      }
    }
  } catch (err) {
    console.warn('[exerciseService] API request failed, falling back to local catalog:', err);
  }

  // Graceful local fallback adhering to exact Step 3 primary-region rule
  let workingSet = params.region && params.region !== 'all' 
    ? filterExercisesByRegion(params.region)
    : EXERCISES;

  if (params.muscle && params.muscle !== 'all') {
    workingSet = workingSet.filter(ex => {
      const contribs = CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || [];
      return contribs.some(c => c.muscleId === params.muscle);
    });
  }

  if (params.equipment && params.equipment !== 'all') {
    workingSet = workingSet.filter(ex => ex.equipment === params.equipment);
  }

  if (params.difficulty && params.difficulty !== 'all') {
    workingSet = workingSet.filter(ex => ex.difficulty === params.difficulty);
  }

  if (params.movementType && params.movementType !== 'all') {
    workingSet = workingSet.filter(ex => ex.movementType === params.movementType);
  }

  if (params.search) {
    const q = params.search.toLowerCase().trim();
    workingSet = workingSet.filter(ex => {
      if (ex.name.toLowerCase().includes(q)) return true;
      if (ex.description.toLowerCase().includes(q)) return true;
      if (ex.equipment.toLowerCase().includes(q)) return true;
      if (ex.targetRegionId.toLowerCase().includes(q)) return true;
      const contribs = CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || [];
      return contribs.some(c => {
        const m = MUSCLE_MAP.get(c.muscleId);
        return m && (m.name.toLowerCase().includes(q) || m.commonName.toLowerCase().includes(q));
      });
    });
  }

  const page = params.page || 1;
  const limit = params.limit || 12;
  const total = workingSet.length;
  const startIndex = (page - 1) * limit;
  const paginated = workingSet.slice(startIndex, startIndex + limit).map(enrichExercise);

  return {
    items: paginated,
    total,
    page,
    limit,
  };
}

export async function fetchExerciseById(
  id: string,
  token?: string | null
): Promise<EnrichedExercise | null> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/exercises/${id}`, { headers });
    if (response.ok) {
      const result = (await response.json()) as ApiResponse<EnrichedExercise>;
      if (result.data && result.data.items.length > 0) {
        return result.data.items[0];
      }
    }
  } catch (err) {
    console.warn('[exerciseService] API request failed, falling back to local catalog:', err);
  }

  const local = EXERCISE_MAP.get(id);
  return local ? enrichExercise(local) : null;
}

export async function fetchMuscleRegions(token?: string | null): Promise<MuscleRegion[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch('/api/muscle-regions', { headers });
    if (response.ok) {
      const result = (await response.json()) as ApiResponse<MuscleRegion>;
      if (result.data && result.data.items.length > 0) {
        return result.data.items;
      }
    }
  } catch (err) {
    console.warn('[exerciseService] API request failed, falling back to local catalog:', err);
  }

  return MUSCLE_REGIONS;
}

export async function fetchMuscles(regionId?: string, token?: string | null): Promise<Muscle[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const url = regionId && regionId !== 'all' ? `/api/muscles?regionId=${regionId}` : '/api/muscles';
    const response = await fetch(url, { headers });
    if (response.ok) {
      const result = (await response.json()) as ApiResponse<Muscle>;
      if (result.data && result.data.items.length > 0) {
        return result.data.items;
      }
    }
  } catch (err) {
    console.warn('[exerciseService] API request failed, falling back to local catalog:', err);
  }

  if (regionId && regionId !== 'all') {
    return MUSCLES.filter(m => m.regionId === regionId);
  }
  return MUSCLES;
}

export async function fetchReverseSearch(
  muscleId: string,
  token?: string | null
): Promise<ReverseSearchResult[]> {
  try {
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`/api/muscles/reverse-search?muscleId=${muscleId}`, { headers });
    if (response.ok) {
      const result = (await response.json()) as ApiResponse<ReverseSearchResult>;
      if (result.data) {
        return result.data.items;
      }
    }
  } catch (err) {
    console.warn('[exerciseService] Reverse search API failed, falling back to local:', err);
  }

  const results = reverseSearchByMuscle(muscleId);
  return results.map(item => ({
    exercise: enrichExercise(item.exercise),
    contribution: {
      ...item.contribution,
      muscleName: MUSCLE_MAP.get(item.contribution.muscleId)?.name,
      muscleCommonName: MUSCLE_MAP.get(item.contribution.muscleId)?.commonName,
      subregion: MUSCLE_MAP.get(item.contribution.muscleId)?.subregion,
      regionId: MUSCLE_MAP.get(item.contribution.muscleId)?.regionId,
    },
  }));
}

export async function fetchPhase1MigrationSql(): Promise<string | null> {
  try {
    const response = await fetch('/api/migration-sql/phase-1');
    if (response.ok) {
      const res = await response.json();
      return res.data?.items?.[0]?.sql || null;
    }
  } catch (err) {
    console.warn('[exerciseService] Failed to load migration SQL:', err);
  }
  return null;
}

export async function fetchPhase3MigrationSql(): Promise<string | null> {
  try {
    const response = await fetch('/api/migration-sql/phase-3');
    if (response.ok) {
      const res = await response.json();
      return res.data?.items?.[0]?.sql || null;
    }
  } catch (err) {
    console.warn('[exerciseService] Failed to load Phase 3 migration SQL:', err);
  }
  return null;
}

export async function fetchPhase4MigrationSql(): Promise<string | null> {
  try {
    const response = await fetch('/api/migration-sql/phase-4');
    if (response.ok) {
      const res = await response.json();
      return res.data?.items?.[0]?.sql || null;
    }
  } catch (err) {
    console.warn('[exerciseService] Failed to load Phase 4 migration SQL:', err);
  }
  return null;
}
