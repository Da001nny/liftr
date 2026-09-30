import fs from 'fs';
import { MUSCLE_REGIONS, MUSCLES } from './taxonomyData.js';

// Verify muscles mapping
const muscleMap = new Map();
MUSCLES.forEach(m => muscleMap.set(m.id, m));

const regionMap = new Map();
MUSCLE_REGIONS.forEach(r => regionMap.set(r.id, r));

// Helper to create an exercise with contributions and validate 100% distribution
let exerciseCounter = 0;
let contributionCounter = 0;

function createExercise({
  id,
  name,
  description,
  equipment,
  movementType,
  difficulty,
  targetRegionId,
  instructions,
  videoUrl = null,
  imageUrl = null,
  primaryContributions, // [ [muscleId, percentage, notes] ]
  secondaryContributions = [], // [ [muscleId, percentage, notes] ]
  stabilizerContributions = [], // [ [muscleId, percentage, notes] ]
}) {
  exerciseCounter++;
  const exId = id || `ex_${exerciseCounter.toString().padStart(3, '0')}`;

  if (!regionMap.has(targetRegionId)) {
    throw new Error(`Invalid targetRegionId '${targetRegionId}' for exercise '${name}'`);
  }

  // Validate primary & secondary contributions sum to 100%
  let sumPrimary = 0;
  let sumSecondary = 0;

  const contributions = [];

  for (const [mId, pct, notes] of primaryContributions) {
    if (!muscleMap.has(mId)) throw new Error(`Invalid muscle '${mId}' in '${name}'`);
    sumPrimary += pct;
    contributionCounter++;
    contributions.push({
      id: `emc_${exId}_${mId}_pri`,
      exerciseId: exId,
      muscleId: mId,
      percentage: pct,
      role: 'Primary',
      notes: notes || 'Primary agonist force producer',
    });
  }

  for (const [mId, pct, notes] of secondaryContributions) {
    if (!muscleMap.has(mId)) throw new Error(`Invalid muscle '${mId}' in '${name}'`);
    sumSecondary += pct;
    contributionCounter++;
    contributions.push({
      id: `emc_${exId}_${mId}_sec`,
      exerciseId: exId,
      muscleId: mId,
      percentage: pct,
      role: 'Secondary',
      notes: notes || 'Synergist contributor',
    });
  }

  const totalAgonist = sumPrimary + sumSecondary;
  if (Math.abs(totalAgonist - 100) > 0.01) {
    throw new Error(`Exercise '${name}' agonist distribution (${sumPrimary}% primary + ${sumSecondary}% secondary = ${totalAgonist}%) must sum to exactly 100%!`);
  }

  for (const [mId, pct, notes] of stabilizerContributions) {
    if (!muscleMap.has(mId)) throw new Error(`Invalid muscle '${mId}' in '${name}'`);
    contributionCounter++;
    contributions.push({
      id: `emc_${exId}_${mId}_stab`,
      exerciseId: exId,
      muscleId: mId,
      percentage: pct,
      role: 'Stabilizer',
      notes: notes || 'Joint & pelvic stabilizer',
    });
  }

  return {
    exercise: {
      id: exId,
      name,
      description,
      equipment,
      movementType,
      difficulty,
      instructions,
      imageUrl,
      videoUrl,
      targetRegionId,
    },
    contributions,
  };
}

export { createExercise };
