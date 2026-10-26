import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  toLocalDateKey, 
  todayLocalDateKey,
  isValidTimeZone, 
  formatDisplayDate, 
  formatDisplayDateTime,
  resolveTimeZoneOrUtc 
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

test('Dates: America/New_York DST boundary timestamps resolve accurately', () => {
  const tz = 'America/New_York';

  // 1. Spring forward transition boundary: March 8, 2026 (UTC-5 before 2:00 AM)
  assert.strictEqual(toLocalDateKey('2026-03-08T04:59:00Z', tz), '2026-03-07', '04:59Z is 23:59 EST on 2026-03-07');
  assert.strictEqual(toLocalDateKey('2026-03-08T05:00:00Z', tz), '2026-03-08', '05:00Z is 00:00 EST on 2026-03-08');

  // 2. Fall back transition boundary: November 1, 2026 (UTC-4 before 2:00 AM)
  assert.strictEqual(toLocalDateKey('2026-11-01T03:59:00Z', tz), '2026-10-31', '03:59Z is 23:59 EDT on 2026-10-31');
  assert.strictEqual(toLocalDateKey('2026-11-01T04:00:00Z', tz), '2026-11-01', '04:00Z is 00:00 EDT on 2026-11-01');

  // 3. Post fall-back boundary: November 2, 2026 (UTC-5 after 2:00 AM fallback)
  assert.strictEqual(toLocalDateKey('2026-11-02T04:59:00Z', tz), '2026-11-01', '04:59Z is 23:59 EST on 2026-11-01');
  assert.strictEqual(toLocalDateKey('2026-11-02T05:00:00Z', tz), '2026-11-02', '05:00Z is 00:00 EST on 2026-11-02');
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

test('Dates: resolveTimeZoneOrUtc("Not/AZone") returns UTC and generateWorkoutsCsv uses it cleanly', () => {
  assert.strictEqual(isValidTimeZone('Not/AZone'), false);
  assert.strictEqual(isValidTimeZone(''), false);
  assert.strictEqual(isValidTimeZone(null), false);
  assert.strictEqual(isValidTimeZone('UTC'), true);
  assert.strictEqual(isValidTimeZone('Asia/Karachi'), true);

  // Directly call authoritative helper without re-implementing fallback logic
  const resolvedTz = resolveTimeZoneOrUtc('Not/AZone');
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

test('Dates: formatDisplayDate with { weekday: "short" } returns only short weekday without extra fields', () => {
  // Calendar reality: 2026-10-16 is Friday ('Fri'), 2026-10-17 is Saturday ('Sat').
  // Verified that only the requested field is output, with no extraneous year/month/day/time fields.
  const fri = formatDisplayDate('2026-10-16', null, { weekday: 'short' });
  assert.strictEqual(fri, 'Fri', '2026-10-16 produces standalone "Fri"');

  const sat = formatDisplayDate('2026-10-17', null, { weekday: 'short' });
  assert.strictEqual(sat, 'Sat', '2026-10-17 produces standalone "Sat"');
  assert.ok(!sat.includes('2026'), 'Must not include year');
  assert.ok(!sat.includes('Oct'), 'Must not include month');
});

test('Dates: formatDisplayDate with full date options contains no ":" and no "AM"/"PM"', () => {
  const result = formatDisplayDate('2026-10-17', null, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  assert.strictEqual(result, 'Saturday, Oct 17, 2026');
  assert.ok(!result.includes(':'), 'Must contain no ":"');
  assert.ok(!result.includes('AM'), 'Must contain no "AM"');
  assert.ok(!result.includes('PM'), 'Must contain no "PM"');
});

test('Dates: formatDisplayDateTime("2026-10-17T12:00:00Z", "UTC") still includes a time', () => {
  const result = formatDisplayDateTime('2026-10-17T12:00:00Z', 'UTC');
  assert.strictEqual(result, 'Oct 17, 2026, 12:00 PM');
  assert.ok(result.includes('12:00'), 'Must include 12:00');
  assert.ok(result.includes('PM'), 'Must include PM');
});

test('Dates: formatDisplayDate("2026-10-17", "Pacific/Kiritimati") equals exact string "Oct 17, 2026"', () => {
  const formatted = formatDisplayDate('2026-10-17', 'Pacific/Kiritimati');
  assert.strictEqual(formatted, 'Oct 17, 2026');
});

test('Dates: PR day for achieved_at "2026-10-16T21:30:00Z" in Asia/Karachi equals "2026-10-17"', () => {
  const pr = {
    id: 'pr_bench_1',
    exercise_id: 'ex_barbell_bench_press',
    achieved_at: '2026-10-16T21:30:00Z',
    weight: 100,
    reps: 5,
  };
  const prDayKey = toLocalDateKey(pr.achieved_at, 'Asia/Karachi');
  assert.strictEqual(prDayKey, '2026-10-17', 'PR at 21:30 UTC lands on 2026-10-17 in Asia/Karachi');
});

test('Dates: todayLocalDateKey("Asia/Karachi") for a fixed Date matches toLocalDateKey of the same Date', () => {
  const fixedDate = new Date('2026-10-16T21:30:00Z');
  const fromTodayHelper = todayLocalDateKey('Asia/Karachi', fixedDate);
  const fromLocalDateHelper = toLocalDateKey(fixedDate, 'Asia/Karachi');
  assert.strictEqual(fromTodayHelper, '2026-10-17');
  assert.strictEqual(fromTodayHelper, fromLocalDateHelper, 'Both helpers return identical local date key for fixed Date');
});

