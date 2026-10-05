/**
 * liftr: Calendar, Scheduling & Recurrence Engine (Phase 4)
 * 
 * Non-negotiable rules:
 * 1. All timestamps are stored in UTC (ISO 8601).
 * 2. Recurrence date-walking occurs purely on UTC calendar dates (YYYY-MM-DD)
 *    so that Daylight Saving Time (DST) never leaks into the date-walking loop.
 * 3. Local-to-UTC conversion happens strictly at the point of computing each occurrence
 *    using an iterative guess-and-correct approach with Intl.DateTimeFormat.
 * 4. Consistency % formula: completed scheduled ÷ explicitly scheduled (0 scheduled -> 100%).
 */

import { ApiResponse } from './api-response.ts';
import { 
  WorkoutSeriesRow, 
  ScheduledWorkoutRow, 
  CalendarNoteRow, 
  CalendarRestDayRow, 
  EnrichedScheduledWorkout,
  RecurrenceType,
  EditingScope
} from '../types/database';

// ============================================================================
// 1. DATE & TIME UTILITIES (UTC-FIRST, DST-SAFE)
// ============================================================================

/**
 * Adds an integer number of days to a 'YYYY-MM-DD' calendar date strictly in UTC.
 * Ensures the date-walking loop advances exactly one calendar day without DST distortion.
 */
export function addDaysUtc(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/**
 * Returns the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * for a 'YYYY-MM-DD' string in UTC.
 */
export function getDayOfWeekUtc(dateStr: string): number {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/**
 * Authoritative Local-to-UTC Conversion Engine:
 * Converts a local calendar date ("YYYY-MM-DD") and target time ("HH:mm")
 * in a specified IANA timezone into the exact UTC instant (ISO string)
 * using an iterative guess-and-correct approach with Intl.DateTimeFormat.
 * 
 * WHY THIS PATTERN:
 * Standard JS `new Date(year, month, day, hour, minute)` always runs in the
 * client's current runtime timezone, which fails when scheduling for a different
 * or fixed timezone. Furthermore, standard Date arithmetic across DST transitions
 * drops or repeats an hour.
 * 
 * BY USING ITERATIVE GUESS-AND-CORRECT:
 * 1. Start with an initial guess treating local Y-M-D H:m as UTC.
 * 2. Format the guess in the target `timeZone` via Intl.DateTimeFormat.
 * 3. Measure the error between desired local wall-clock time and formatted time.
 * 4. Adjust the guess by the exact difference until convergence (1-2 iterations).
 * 5. Returns a rock-solid, DST-accurate UTC ISO string.
 */
export function localTimeToUtcIso(
  dateStr: string, // 'YYYY-MM-DD'
  timeStr: string = '09:00', // 'HH:mm'
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hours, minutes] = timeStr.split(':').map(Number);

  let guessTime = Date.UTC(year, month - 1, day, hours, minutes, 0, 0);

  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  for (let i = 0; i < 3; i++) {
    const parts = dtf.formatToParts(new Date(guessTime));
    const partMap: Record<string, number> = {};
    for (const p of parts) {
      if (p.type !== 'literal') {
        partMap[p.type] = Number(p.value);
      }
    }
    const formattedHour = partMap.hour === 24 ? 0 : partMap.hour;
    const formattedUtcTime = Date.UTC(
      partMap.year,
      partMap.month - 1,
      partMap.day,
      formattedHour,
      partMap.minute,
      partMap.second || 0
    );

    const desiredUtcTime = Date.UTC(year, month - 1, day, hours, minutes, 0);
    const diff = desiredUtcTime - formattedUtcTime;
    if (diff === 0) {
      break;
    }
    guessTime += diff;
  }

  return new Date(guessTime).toISOString();
}

/**
 * Formats a UTC ISO string into the user's local 'YYYY-MM-DD' string.
 */
export function utcIsoToLocalDate(
  utcIso: string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
): string {
  try {
    const d = new Date(utcIso);
    const dtf = new Intl.DateTimeFormat('en-CA', { // en-CA formats YYYY-MM-DD
      timeZone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return dtf.format(d);
  } catch {
    return utcIso.slice(0, 10);
  }
}

/**
 * Formats a UTC ISO string into the user's local 'HH:mm' string.
 */
export function utcIsoToLocalTime(
  utcIso: string,
  timeZone: string = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
): string {
  try {
    const d = new Date(utcIso);
    const dtf = new Intl.DateTimeFormat('en-GB', { // en-GB formats 24h HH:mm
      timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return dtf.format(d);
  } catch {
    return '09:00';
  }
}

// ============================================================================
// 2. RECURRENCE GENERATION (WALKS DATES IN UTC)
// ============================================================================

export interface OccurrenceSeed {
  scheduled_date: string; // YYYY-MM-DD
  scheduled_time: string; // HH:mm
  scheduled_at: string;   // UTC ISO string
}

/**
 * Generates occurrence dates for a recurring series.
 * Walks calendar dates purely in UTC; converts to local-time-equivalent UTC only
 * at the point of computing each occurrence.
 */
export function generateOccurrencesForSeries(params: {
  recurrenceType: RecurrenceType;
  recurrenceInterval: number; // e.g. 1, 2, 3
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  startDate: string; // YYYY-MM-DD
  endDate?: string | null; // YYYY-MM-DD
  targetTime: string; // HH:mm
  userTimezone: string;
  maxOccurrences?: number;
  horizonDays?: number; // default 90 days if no end date
}): OccurrenceSeed[] {
  const {
    recurrenceType,
    recurrenceInterval = 1,
    daysOfWeek = [],
    startDate,
    endDate,
    targetTime = '09:00',
    userTimezone = 'UTC',
    maxOccurrences = 120,
    horizonDays = 90,
  } = params;

  const results: OccurrenceSeed[] = [];
  const safeInterval = Math.max(1, recurrenceInterval);

  // Determine boundary cutoff date in UTC
  const finalEndDate = endDate || addDaysUtc(startDate, horizonDays);

  let currentDate = startDate;
  let occurrenceIndex = 0;

  if (recurrenceType === 'daily') {
    while (currentDate <= finalEndDate && occurrenceIndex < maxOccurrences) {
      results.push({
        scheduled_date: currentDate,
        scheduled_time: targetTime,
        scheduled_at: localTimeToUtcIso(currentDate, targetTime, userTimezone),
      });
      occurrenceIndex++;
      currentDate = addDaysUtc(currentDate, safeInterval);
    }
  } else if (recurrenceType === 'weekly' || recurrenceType === 'biweekly' || recurrenceType === 'custom') {
    const effectiveIntervalWeeks = recurrenceType === 'biweekly' ? 2 : safeInterval;
    const activeDays = daysOfWeek.length > 0 ? daysOfWeek : [getDayOfWeekUtc(startDate)];

    // We step through weeks using UTC calendar dates
    let currentWeekStartDate = startDate;
    let weeksProcessed = 0;

    while (currentWeekStartDate <= finalEndDate && occurrenceIndex < maxOccurrences && weeksProcessed < 52) {
      // For each day in the current week (7 days)
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const candidateDate = addDaysUtc(currentWeekStartDate, dayOffset);
        if (candidateDate > finalEndDate) break;
        if (candidateDate < startDate) continue;

        const dow = getDayOfWeekUtc(candidateDate);
        if (activeDays.includes(dow)) {
          results.push({
            scheduled_date: candidateDate,
            scheduled_time: targetTime,
            scheduled_at: localTimeToUtcIso(candidateDate, targetTime, userTimezone),
          });
          occurrenceIndex++;
          if (occurrenceIndex >= maxOccurrences) break;
        }
      }

      currentWeekStartDate = addDaysUtc(currentWeekStartDate, 7 * effectiveIntervalWeeks);
      weeksProcessed++;
    }
  }

  return results;
}

// ============================================================================
// 3. API SERVICE METHODS (COMMUNICATES WITH SERVER & SUPABASE)
// ============================================================================

function getAuthHeaders(token?: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export interface CreateScheduledPayload {
  name: string;
  templateId?: string | null;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime?: string; // HH:mm
  notes?: string;
  isRecurring?: boolean;
  recurrenceType?: RecurrenceType;
  recurrenceInterval?: number;
  daysOfWeek?: number[];
  endDate?: string | null;
  userTimezone?: string;
}

export interface UpdateScheduledPayload {
  name?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status?: 'scheduled' | 'completed' | 'missed' | 'cancelled';
  notes?: string;
  templateId?: string | null;
  scope?: EditingScope; // 'this_occurrence' | 'this_and_future' | 'entire_series'
}

export interface CalendarMonthDataResponse {
  scheduledWorkouts: EnrichedScheduledWorkout[];
  completedWorkouts: any[];
  restDays: CalendarRestDayRow[];
  notes: CalendarNoteRow[];
  personalRecords: any[];
  stats: {
    totalScheduled: number;
    completedScheduled: number;
    consistencyPercent: number;
  };
}

/**
 * Fetches all calendar items for a given year and month (1-indexed: 1 = Jan, 12 = Dec).
 */
export async function fetchCalendarMonth(
  token: string,
  year: number,
  month: number
): Promise<CalendarMonthDataResponse> {
  try {
    const res = await fetch(`/api/calendar/month?year=${year}&month=${month}`, {
      headers: getAuthHeaders(token),
    });
    if (res.ok) {
      const json = await res.json();
      return json.data.items[0] || getEmptyCalendarData();
    }
  } catch (err) {
    console.error('[calendarService] fetchCalendarMonth failed:', err);
  }
  return getEmptyCalendarData();
}

/**
 * Creates a scheduled workout or recurring series.
 */
export async function createScheduledWorkout(
  token: string,
  payload: CreateScheduledPayload
): Promise<ScheduledWorkoutRow[] | null> {
  try {
    const res = await fetch('/api/calendar/scheduled', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const json: ApiResponse<ScheduledWorkoutRow> = await res.json();
      return json.data.items;
    }
  } catch (err) {
    console.error('[calendarService] createScheduledWorkout failed:', err);
  }
  return null;
}

/**
 * Updates a scheduled workout with support for editing scope:
 * - 'this_occurrence': changes only this occurrence (is_override = true)
 * - 'this_and_future': splits series at this date and updates future
 * - 'entire_series': updates all occurrences in this series
 */
export async function updateScheduledWorkout(
  token: string,
  id: string,
  payload: UpdateScheduledPayload
): Promise<boolean> {
  try {
    const res = await fetch(`/api/calendar/scheduled/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.error('[calendarService] updateScheduledWorkout failed:', err);
    return false;
  }
}

/**
 * Deletes a scheduled workout with support for editing scope.
 */
export async function deleteScheduledWorkout(
  token: string,
  id: string,
  scope: EditingScope = 'this_occurrence'
): Promise<boolean> {
  try {
    const res = await fetch(`/api/calendar/scheduled/${id}?scope=${scope}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok;
  } catch (err) {
    console.error('[calendarService] deleteScheduledWorkout failed:', err);
    return false;
  }
}

/**
 * Toggles or sets a rest day on a date.
 */
export async function setCalendarRestDay(
  token: string,
  date: string,
  notes?: string
): Promise<CalendarRestDayRow | null> {
  try {
    const res = await fetch('/api/calendar/rest-days', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ date, notes }),
    });
    if (res.ok) {
      const json: ApiResponse<CalendarRestDayRow> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[calendarService] setCalendarRestDay failed:', err);
  }
  return null;
}

/**
 * Removes a rest day from a date.
 */
export async function deleteCalendarRestDay(token: string, date: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/calendar/rest-days/${date}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok;
  } catch (err) {
    console.error('[calendarService] deleteCalendarRestDay failed:', err);
    return false;
  }
}

/**
 * Adds a calendar note on a date.
 */
export async function createCalendarNote(
  token: string,
  date: string,
  content: string,
  category: string = 'general'
): Promise<CalendarNoteRow | null> {
  try {
    const res = await fetch('/api/calendar/notes', {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify({ date, content, category }),
    });
    if (res.ok) {
      const json: ApiResponse<CalendarNoteRow> = await res.json();
      return json.data.items[0] || null;
    }
  } catch (err) {
    console.error('[calendarService] createCalendarNote failed:', err);
  }
  return null;
}

/**
 * Deletes a calendar note by ID.
 */
export async function deleteCalendarNote(token: string, noteId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/calendar/notes/${noteId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok;
  } catch (err) {
    console.error('[calendarService] deleteCalendarNote failed:', err);
    return false;
  }
}

function getEmptyCalendarData(): CalendarMonthDataResponse {
  return {
    scheduledWorkouts: [],
    completedWorkouts: [],
    restDays: [],
    notes: [],
    personalRecords: [],
    stats: {
      totalScheduled: 0,
      completedScheduled: 0,
      consistencyPercent: 100,
    },
  };
}
