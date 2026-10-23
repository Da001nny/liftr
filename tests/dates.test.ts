import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  toLocalDateKey, 
  todayLocalDateKey, 
  getUserTimeZone, 
  isValidTimeZone, 
  formatDisplayDate, 
  formatDisplayDateTime 
} from '../src/lib/dates';
import { generateWorkoutsCsv } from '../src/lib/calculations';

test('Dates: 2026-10-16T21:30:00Z in Asia/Karachi -> 2026-10-17', () => {
  const result = toLocalDateKey('2026-10-16T21:30:00Z', 'Asia/Karachi');
  assert.strictEqual(result, '2026-10-17', '21:30 UTC is 02:30 next day in UTC+5 (Karachi)');
});

test('Dates: 2026-10-16T21:30:00Z in UTC -> 2026-10-16', () => {
  const result = toLocalDateKey('2026-10-16T21:30:00Z', 'UTC');
  assert.strictEqual(result, '2026-10-16', 'In UTC, 21:30 remains the same calendar day');
});

test('Dates: New York timestamps on DST change days (2026-03-08 and 2026-11-01) give correct local dates', () => {
  // Spring forward: March 8, 2026
  // 07:30 UTC is 03:30 EDT in America/New_York (after 2am clock advance)
  const springDate = toLocalDateKey('2026-03-08T07:30:00Z', 'America/New_York');
  assert.strictEqual(springDate, '2026-03-08', 'Spring forward DST timestamp resolves to 2026-03-08 in America/New_York');

  // Fall back: November 1, 2026
  // 06:30 UTC is 01:30 EST in America/New_York (after 2am clock fallback)
  const fallDate = toLocalDateKey('2026-11-01T06:30:00Z', 'America/New_York');
  assert.strictEqual(fallDate, '2026-11-01', 'Fall back DST timestamp resolves to 2026-11-01 in America/New_York');
});

test('Dates: generateWorkoutsCsv with timeZone "Asia/Karachi" puts that workout on 2026-10-17', () => {
  const workouts = [
    {
      id: 'w_test_karachi',
      status: 'completed',
      completed_at: '2026-10-16T21:30:00Z',
      name: 'Night Session',
      workout_exercises: [
        {
          exercise_id: 'ex_barbell_bench_press',
          workout_sets: [
            { weight: 100, reps: 5, completed: true, set_type: 'working' }
          ]
        }
      ]
    }
  ];

  const csv = generateWorkoutsCsv(workouts, 'kg', 'Asia/Karachi');
  assert.ok(csv.includes('2026-10-17'), 'Workout row in CSV must have date 2026-10-17 in Asia/Karachi');
  assert.ok(!csv.includes('2026-10-16'), 'Workout row in CSV must not have date 2026-10-16 in Asia/Karachi');
});

test('Dates: isValidTimeZone("Not/AZone") is false and server fallback to UTC yields 2026-10-16', () => {
  assert.strictEqual(isValidTimeZone('Not/AZone'), false);
  assert.strictEqual(isValidTimeZone(''), false);
  assert.strictEqual(isValidTimeZone(null), false);
  assert.strictEqual(isValidTimeZone('UTC'), true);
  assert.strictEqual(isValidTimeZone('Asia/Karachi'), true);

  // Simulating server fallback: if invalid timezone is supplied, server falls back to UTC
  const rawTz = 'Not/AZone';
  const resolvedTz = isValidTimeZone(rawTz) ? rawTz : 'UTC';
  assert.strictEqual(resolvedTz, 'UTC');

  const workouts = [
    {
      id: 'w_fallback',
      status: 'completed',
      completed_at: '2026-10-16T21:30:00Z',
      name: 'Fallback Session',
      workout_exercises: [
        {
          exercise_id: 'ex_barbell_bench_press',
          workout_sets: [
            { weight: 100, reps: 5, completed: true, set_type: 'working' }
          ]
        }
      ]
    }
  ];

  const csv = generateWorkoutsCsv(workouts, 'kg', resolvedTz);
  assert.ok(csv.includes('2026-10-16'), 'Fallback to UTC puts workout on 2026-10-16');
  assert.ok(!csv.includes('2026-10-17'), 'Fallback to UTC must not land on next day');
});
