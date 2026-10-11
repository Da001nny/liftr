/**
 * liftr: Authoritative Date Formatting Helper
 * 
 * Centralizes all date and time display formatting across the application.
 * Guarantees consistent locale rendering, UTC preservation, and zero inline date formatting.
 */

export function toUtcIsoString(date: Date = new Date()): string {
  return date.toISOString();
}

/**
 * Formats a UTC ISO timestamp for local display with customizable options.
 */
export function formatLocalTimestamp(
  utcIsoString: string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!utcIsoString) return '';
  try {
    const d = new Date(utcIsoString);
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, options ?? {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return '';
  }
}

/**
 * Formats a date or ISO string to Month and Year (e.g., "October 2026").
 */
export function formatMonthYear(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(d);
  } catch {
    return '';
  }
}

/**
 * Formats a date to full weekday and date string (e.g., "Saturday, Oct 10, 2026").
 */
export function formatFullDate(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
}

/**
 * Formats a date for short display (e.g., "Oct 10, 2026").
 */
export function formatDateOnly(date: Date | string): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return '';
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
}

/**
 * Formats a default workout name incorporating current date (e.g. "Workout Oct 10").
 */
export function formatWorkoutDateName(date: Date = new Date()): string {
  try {
    const formattedDate = new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
    }).format(date);
    return `Workout ${formattedDate}`;
  } catch {
    return 'Workout';
  }
}
