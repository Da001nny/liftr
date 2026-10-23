/**
 * liftr: Authoritative Timezone-Aware Date Helper
 * 
 * Centralizes all date parsing, key generation, and display formatting.
 * Uses Intl.DateTimeFormat and APP_LOCALE with zero manual offset math.
 */

import { APP_LOCALE } from '../i18n';

/**
 * Returns the user's IANA time zone from Intl runtime, falling back to 'UTC'.
 */
export function getUserTimeZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Returns true only if the provided string is an IANA time zone accepted by Intl.
 */
export function isValidTimeZone(tz?: string | null): boolean {
  if (!tz || typeof tz !== 'string') return false;
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolves a safe, validated IANA time zone.
 */
function resolveSafeTimeZone(timeZone?: string | null): string {
  if (timeZone && isValidTimeZone(timeZone)) {
    return timeZone;
  }
  const userTz = getUserTimeZone();
  return isValidTimeZone(userTz) ? userTz : 'UTC';
}

/**
 * Converts an ISO timestamp or Date to 'YYYY-MM-DD' calendar date in the target time zone.
 * Zero manual offset math: delegates strictly to Intl.DateTimeFormat with APP_LOCALE.
 */
export function toLocalDateKey(isoTimestamp?: string | Date | null, timeZone?: string | null): string {
  if (!isoTimestamp) return '';
  const d = typeof isoTimestamp === 'string' ? new Date(isoTimestamp) : isoTimestamp;
  if (isNaN(d.getTime())) return '';

  const tz = resolveSafeTimeZone(timeZone);
  const formatter = new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: tz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(d);
  let year = '';
  let month = '';
  let day = '';
  for (const part of parts) {
    if (part.type === 'year') year = part.value;
    else if (part.type === 'month') month = part.value;
    else if (part.type === 'day') day = part.value;
  }
  return `${year}-${month}-${day}`;
}

/**
 * Returns today's 'YYYY-MM-DD' calendar date in the target time zone.
 */
export function todayLocalDateKey(timeZone?: string | null): string {
  return toLocalDateKey(new Date(), timeZone);
}

/**
 * Formats an ISO string or 'YYYY-MM-DD' dateKey for display in the target time zone.
 * E.g., 'Oct 17, 2026'.
 */
export function formatDisplayDate(
  isoOrDateKey?: string | Date | null,
  timeZone?: string | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!isoOrDateKey) return '';
  let d: Date;
  if (typeof isoOrDateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(isoOrDateKey)) {
    d = new Date(`${isoOrDateKey}T12:00:00Z`);
  } else {
    d = typeof isoOrDateKey === 'string' ? new Date(isoOrDateKey) : isoOrDateKey;
  }
  if (isNaN(d.getTime())) return '';

  const tz = resolveSafeTimeZone(timeZone);
  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(d);
}

/**
 * Formats an ISO timestamp for display including date and time in the target time zone.
 * E.g., 'Oct 17, 2026, 02:00 AM'.
 */
export function formatDisplayDateTime(
  isoTimestamp?: string | Date | null,
  timeZone?: string | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!isoTimestamp) return '';
  const d = typeof isoTimestamp === 'string' ? new Date(isoTimestamp) : isoTimestamp;
  if (isNaN(d.getTime())) return '';

  const tz = resolveSafeTimeZone(timeZone);
  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: tz,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }).format(d);
}

/**
 * Consolidated single formatLocalTimestamp helper reusing formatDisplayDateTime.
 */
export function formatLocalTimestamp(
  utcIsoString?: string | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  timeZone?: string | null
): string {
  return formatDisplayDateTime(utcIsoString, timeZone, options);
}

/**
 * Canonical UTC ISO string producer.
 */
export function toUtcIsoString(date: Date = new Date()): string {
  return date.toISOString();
}
