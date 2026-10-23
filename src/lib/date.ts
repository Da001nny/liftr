/**
 * liftr: Authoritative Date Formatting Helper
 * 
 * Centralizes all date and time display formatting across the application.
 * Re-exports core timezone-aware functions from ./dates.
 */

import { APP_LOCALE } from '../i18n';
import { 
  formatDisplayDateTime,
  formatDisplayDate,
  formatLocalTimestamp,
  toUtcIsoString,
  toLocalDateKey,
  todayLocalDateKey,
  getUserTimeZone,
  isValidTimeZone
} from './dates';

export {
  formatDisplayDateTime,
  formatDisplayDate,
  formatLocalTimestamp,
  toUtcIsoString,
  toLocalDateKey,
  todayLocalDateKey,
  getUserTimeZone,
  isValidTimeZone
};

/**
 * Formats a date or ISO string to Month and Year (e.g., "October 2026").
 */
export function formatMonthYear(date: Date | string, timeZone?: string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(APP_LOCALE, { month: 'long', year: 'numeric', timeZone }).format(d);
  } catch {
    return '';
  }
}

/**
 * Formats a date to full weekday and date string (e.g., "Saturday, Oct 10, 2026").
 */
export function formatFullDate(date: Date | string, timeZone?: string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(APP_LOCALE, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone,
    }).format(d);
  } catch {
    return '';
  }
}

/**
 * Formats a date for short display (e.g., "Oct 10, 2026").
 */
export function formatDateOnly(date: Date | string, timeZone?: string): string {
  return formatDisplayDate(date, timeZone);
}

/**
 * Formats a default workout name incorporating current date (e.g. "Workout Oct 10").
 */
export function formatWorkoutDateName(date: Date = new Date(), timeZone?: string): string {
  try {
    const formattedDate = new Intl.DateTimeFormat(APP_LOCALE, {
      month: 'short',
      day: 'numeric',
      timeZone,
    }).format(date);
    return `Workout ${formattedDate}`;
  } catch {
    return 'Workout';
  }
}
