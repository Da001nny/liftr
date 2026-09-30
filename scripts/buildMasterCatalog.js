import fs from 'fs';
import path from 'path';
import { MUSCLE_REGIONS, MUSCLES } from './taxonomyData.js';
import { getFullExerciseList as getChest } from './catalogChest.js';
import { getBackExerciseList as getBack } from './catalogBack.js';
import { getShouldersExerciseList as getShoulders } from './catalogShoulders.js';
import { getArmsExerciseList as getArms } from './catalogArms.js';
import { getLegsExerciseList as getLegs } from './catalogLegs.js';
import { getGlutesCoreInnerThighExerciseList as getGlutesCoreInnerThigh } from './catalogGlutesCoreInnerThigh.js';

const allExercises = [
  ...getChest(),
  ...getBack(),
  ...getShoulders(),
  ...getArms(),
  ...getLegs(),
  ...getGlutesCoreInnerThigh(),
];

console.log(`\n========================================`);
console.log(`TOTAL EXERCISES ASSEMBLED: ${allExercises.length}`);
console.log(`========================================\n`);

// Validation Suite
const exerciseIdSet = new Set();
const contributionIdSet = new Set();
const allContributions = [];
const muscleIdSet = new Set(MUSCLES.map(m => m.id));
const regionIdSet = new Set(MUSCLE_REGIONS.map(r => r.id));

const regionCounts = {};
MUSCLE_REGIONS.forEach(r => regionCounts[r.id] = 0);

allExercises.forEach(({ exercise, contributions }, idx) => {
  // 1. Unique exercise ID
  if (exerciseIdSet.has(exercise.id)) {
    throw new Error(`Duplicate exercise ID: ${exercise.id}`);
  }
  exerciseIdSet.add(exercise.id);

  // 2. Region exists
  if (!regionIdSet.has(exercise.targetRegionId)) {
    throw new Error(`Invalid region: ${exercise.targetRegionId} on ${exercise.id}`);
  }
  regionCounts[exercise.targetRegionId]++;

  // 3. Contribution validation
  let primarySum = 0;
  let secondarySum = 0;
  let hasPrimary = false;

  contributions.forEach(c => {
    if (contributionIdSet.has(c.id)) {
      throw new Error(`Duplicate contribution ID: ${c.id}`);
    }
    contributionIdSet.add(c.id);

    if (!muscleIdSet.has(c.muscleId)) {
      throw new Error(`Invalid muscle ID: ${c.muscleId} on ${c.id}`);
    }

    if (c.role === 'Primary') {
      hasPrimary = true;
      primarySum += c.percentage;
    } else if (c.role === 'Secondary') {
      secondarySum += c.percentage;
    } else if (c.role === 'Stabilizer') {
      // Valid separate stabilizer
    } else {
      throw new Error(`Invalid contribution role: ${c.role} on ${c.id}`);
    }

    allContributions.push(c);
  });

  if (!hasPrimary) {
    throw new Error(`Exercise ${exercise.name} (${exercise.id}) has no Primary contributions!`);
  }

  const agonistTotal = primarySum + secondarySum;
  if (Math.abs(agonistTotal - 100) > 0.01) {
    throw new Error(`Exercise ${exercise.name} agonist contributions do not sum to 100%! Got ${agonistTotal}% (${primarySum}% primary, ${secondarySum}% secondary)`);
  }
});

console.log('✓ All exercise IDs unique:', exerciseIdSet.size);
console.log('✓ All contribution IDs unique:', contributionIdSet.size);
console.log('✓ All 203 exercises have strictly validated 100% agonist contribution distributions.');
console.log('\nRegion Breakdown:');
Object.entries(regionCounts).forEach(([reg, count]) => {
  console.log(`  - ${reg.padEnd(14)}: ${count} exercises`);
});

// Verification of Step 3: Region Filtering
// "filter by direct regionId/targetRegion match OR role === 'Primary' contribution in that region — do NOT match on any Secondary/Stabilizer contribution"
console.log('\nTesting Step 3 Region Filtering for all 8 regions:');
MUSCLE_REGIONS.forEach(reg => {
  const matches = allExercises.filter(({ exercise, contributions }) => {
    if (exercise.targetRegionId === reg.id) return true;
    return contributions.some(c => {
      if (c.role !== 'Primary') return false;
      const m = MUSCLES.find(muscle => muscle.id === c.muscleId);
      return m && m.regionId === reg.id;
    });
  });
  console.log(`  - Region filter '${reg.id}': ${matches.length} matching exercises`);
  if (matches.length === 0) throw new Error(`Region filter '${reg.id}' returned 0 exercises!`);
});

// Generate src/data/exerciseCatalog.ts
const tsContent = `// liftr: Authoritative Exercise & Muscle Taxonomy Catalog
// Total: 203 Validated Exercises, 31 Muscles, 8 Regions
// Strictly validated contribution distributions (Primary + Secondary === 100%, Stabilizers separate)

export interface MuscleRegion {
  id: string;
  name: string;
  description: string;
  orderIndex: number;
}

export interface Muscle {
  id: string;
  name: string;
  commonName: string;
  regionId: string;
  subregion: string;
  description: string;
}

export type EquipmentType = 
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'kettlebell'
  | 'smith_machine'
  | 'band';

export type MovementType = 'compound' | 'isolation';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type ContributionRole = 'Primary' | 'Secondary' | 'Stabilizer';

export interface Exercise {
  id: string;
  name: string;
  description: string;
  equipment: EquipmentType;
  movementType: MovementType;
  difficulty: DifficultyLevel;
  targetRegionId: string;
  instructions: string[];
  imageUrl: string | null;
  videoUrl: string | null;
}

export interface ExerciseMuscleContribution {
  id: string;
  exerciseId: string;
  muscleId: string;
  percentage: number;
  role: ContributionRole;
  notes: string | null;
}

export const MUSCLE_REGIONS: MuscleRegion[] = ${JSON.stringify(MUSCLE_REGIONS, null, 2)};

export const MUSCLES: Muscle[] = ${JSON.stringify(MUSCLES, null, 2)};

export const EXERCISES: Exercise[] = ${JSON.stringify(allExercises.map(e => e.exercise), null, 2)};

export const EXERCISE_MUSCLE_CONTRIBUTIONS: ExerciseMuscleContribution[] = ${JSON.stringify(allContributions, null, 2)};

// Fast lookup maps
export const MUSCLE_MAP = new Map<string, Muscle>(MUSCLES.map(m => [m.id, m]));
export const REGION_MAP = new Map<string, MuscleRegion>(MUSCLE_REGIONS.map(r => [r.id, r]));
export const EXERCISE_MAP = new Map<string, Exercise>(EXERCISES.map(e => [e.id, e]));

// Group contributions by exercise
export const CONTRIBUTIONS_BY_EXERCISE = new Map<string, ExerciseMuscleContribution[]>();
EXERCISE_MUSCLE_CONTRIBUTIONS.forEach(c => {
  const list = CONTRIBUTIONS_BY_EXERCISE.get(c.exerciseId) || [];
  list.push(c);
  CONTRIBUTIONS_BY_EXERCISE.set(c.exerciseId, list);
});

// Group contributions by muscle (for reverse search)
export const CONTRIBUTIONS_BY_MUSCLE = new Map<string, ExerciseMuscleContribution[]>();
EXERCISE_MUSCLE_CONTRIBUTIONS.forEach(c => {
  const list = CONTRIBUTIONS_BY_MUSCLE.get(c.muscleId) || [];
  list.push(c);
  CONTRIBUTIONS_BY_MUSCLE.set(c.muscleId, list);
});

/**
 * Filter exercises by region according to Step 3 Rule:
 * Direct regionId/targetRegion match OR role === 'Primary' contribution in that region.
 * NEVER match on Secondary or Stabilizer contributions to prevent compound bleed.
 */
export function filterExercisesByRegion(regionId: string): Exercise[] {
  if (!regionId || regionId === 'all') return EXERCISES;
  return EXERCISES.filter(ex => {
    if (ex.targetRegionId === regionId) return true;
    const contribs = CONTRIBUTIONS_BY_EXERCISE.get(ex.id) || [];
    return contribs.some(c => {
      if (c.role !== 'Primary') return false;
      const m = MUSCLE_MAP.get(c.muscleId);
      return m && m.regionId === regionId;
    });
  });
}

/**
 * Reverse muscle search: select a muscle, return exercises that train it,
 * ranked by contribution percentage weight (descending).
 */
export function reverseSearchByMuscle(muscleId: string): Array<{ exercise: Exercise; contribution: ExerciseMuscleContribution }> {
  const contribs = CONTRIBUTIONS_BY_MUSCLE.get(muscleId) || [];
  return contribs
    .map(c => ({
      exercise: EXERCISE_MAP.get(c.exerciseId)!,
      contribution: c,
    }))
    .filter(item => Boolean(item.exercise))
    .sort((a, b) => {
      // Primary role first, then higher percentage
      const roleWeight = { Primary: 3, Secondary: 2, Stabilizer: 1 };
      const diff = (roleWeight[b.contribution.role] || 0) - (roleWeight[a.contribution.role] || 0);
      if (diff !== 0) return diff;
      return b.contribution.percentage - a.contribution.percentage;
    });
}
`;

fs.mkdirSync(path.resolve('src/data'), { recursive: true });
fs.writeFileSync(path.resolve('src/data/exerciseCatalog.ts'), tsContent, 'utf-8');
console.log('✓ Wrote src/data/exerciseCatalog.ts');

// Generate PostgreSQL Migration SQL: supabase/migrations/002_create_exercise_catalog.sql
let sql = `-- liftr: Phase 1 Schema & Full Seed Migration
-- Muscle taxonomy, exercise catalog with videoUrl, contribution system

-- 1. MUSCLE REGIONS
CREATE TABLE IF NOT EXISTS public.muscle_regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. MUSCLES
CREATE TABLE IF NOT EXISTS public.muscles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  common_name TEXT NOT NULL,
  region_id TEXT NOT NULL REFERENCES public.muscle_regions(id) ON DELETE CASCADE,
  subregion TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. EXERCISES
CREATE TABLE IF NOT EXISTS public.exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  equipment TEXT NOT NULL,
  movement_type TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  video_url TEXT,
  target_region_id TEXT NOT NULL REFERENCES public.muscle_regions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. EXERCISE MUSCLE CONTRIBUTIONS
CREATE TABLE IF NOT EXISTS public.exercise_muscle_contributions (
  id TEXT PRIMARY KEY,
  exercise_id TEXT NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  muscle_id TEXT NOT NULL REFERENCES public.muscles(id) ON DELETE CASCADE,
  percentage NUMERIC(5, 2) NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Primary', 'Secondary', 'Stabilizer')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- RLS Configuration:
-- Public/read-only for all authenticated users (and anon for catalog exploration)
ALTER TABLE public.muscle_regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.muscles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_muscle_contributions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow authenticated read on muscle_regions" ON public.muscle_regions;
CREATE POLICY "Allow authenticated read on muscle_regions" ON public.muscle_regions FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated read on muscles" ON public.muscles;
CREATE POLICY "Allow authenticated read on muscles" ON public.muscles FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated read on exercises" ON public.exercises;
CREATE POLICY "Allow authenticated read on exercises" ON public.exercises FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Allow authenticated read on exercise_muscle_contributions" ON public.exercise_muscle_contributions;
CREATE POLICY "Allow authenticated read on exercise_muscle_contributions" ON public.exercise_muscle_contributions FOR SELECT TO authenticated, anon USING (true);

-- SEED DATA
-- 1. Muscle Regions
`;

MUSCLE_REGIONS.forEach(r => {
  sql += `INSERT INTO public.muscle_regions (id, name, description, order_index) VALUES ('${r.id}', '${r.name.replace(/'/g, "''")}', '${r.description.replace(/'/g, "''")}', ${r.orderIndex}) ON CONFLICT (id) DO NOTHING;\n`;
});

sql += `\n-- 2. Muscles\n`;
MUSCLES.forEach(m => {
  sql += `INSERT INTO public.muscles (id, name, common_name, region_id, subregion, description) VALUES ('${m.id}', '${m.name.replace(/'/g, "''")}', '${m.commonName.replace(/'/g, "''")}', '${m.regionId}', '${m.subregion.replace(/'/g, "''")}', '${m.description.replace(/'/g, "''")}') ON CONFLICT (id) DO NOTHING;\n`;
});

sql += `\n-- 3. Exercises (${allExercises.length} validated items)\n`;
allExercises.forEach(({ exercise: e }) => {
  const instructionsJson = JSON.stringify(e.instructions).replace(/'/g, "''");
  const videoVal = e.videoUrl ? `'${e.videoUrl}'` : 'NULL';
  const imgVal = e.imageUrl ? `'${e.imageUrl}'` : 'NULL';
  sql += `INSERT INTO public.exercises (id, name, description, equipment, movement_type, difficulty, instructions, image_url, video_url, target_region_id) VALUES ('${e.id}', '${e.name.replace(/'/g, "''")}', '${e.description.replace(/'/g, "''")}', '${e.equipment}', '${e.movementType}', '${e.difficulty}', '${instructionsJson}'::jsonb, ${imgVal}, ${videoVal}, '${e.targetRegionId}') ON CONFLICT (id) DO NOTHING;\n`;
});

sql += `\n-- 4. Exercise Muscle Contributions (${allContributions.length} validated items)\n`;
allContributions.forEach(c => {
  const notesVal = c.notes ? `'${c.notes.replace(/'/g, "''")}'` : 'NULL';
  sql += `INSERT INTO public.exercise_muscle_contributions (id, exercise_id, muscle_id, percentage, role, notes) VALUES ('${c.id}', '${c.exerciseId}', '${c.muscleId}', ${c.percentage}, '${c.role}', ${notesVal}) ON CONFLICT (id) DO NOTHING;\n`;
});

fs.writeFileSync(path.resolve('supabase/migrations/002_create_exercise_catalog.sql'), sql, 'utf-8');
console.log('✓ Wrote supabase/migrations/002_create_exercise_catalog.sql');

// Also append to supabase/schema.sql
const fullSchema = fs.readFileSync('supabase/schema.sql', 'utf-8');
if (!fullSchema.includes('muscle_regions')) {
  fs.writeFileSync('supabase/schema.sql', fullSchema + '\n\n-- PHASE 1: EXERCISE & MUSCLE TAXONOMY\n' + sql, 'utf-8');
  console.log('✓ Appended to supabase/schema.sql');
}

console.log('\nMaster Catalog build complete! All tests passed.');
