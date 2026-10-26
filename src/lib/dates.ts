/**
 * liftr: Authoritative Timezone-Aware Date Helper
 * 
 * Centralizes all date parsing, key generation, and display formatting.
 * Uses Intl.DateTimeFormat with zero manual offset math.
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
 * Resolves a valid IANA time zone string, or falls back strictly to 'UTC'.
 * Validates untrusted input (e.g. from query parameters or request bodies).
 */
export function resolveTimeZoneOrUtc(raw: unknown): string {
  if (typeof raw === 'string' && isValidTimeZone(raw)) {
    return raw;
  }
  return 'UTC';
}

/**
 * Resolves a safe, validated IANA time zone, defaulting to the runtime user time zone or 'UTC'.
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
 * Zero manual offset math: delegates strictly to Intl.DateTimeFormat with a fixed locale
 * ('en-US'), calendar 'gregory', and numberingSystem 'latn' so keys never depend on APP_LOCALE.
 */
export function toLocalDateKey(isoTimestamp?: string | Date | null, timeZone?: string | null): string {
  if (!isoTimestamp) return '';
  const d = typeof isoTimestamp === 'string' ? new Date(isoTimestamp) : isoTimestamp;
  if (isNaN(d.getTime())) return '';

  const tz = resolveSafeTimeZone(timeZone);
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    calendar: 'gregory',
    numberingSystem: 'latn',
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
 * Accepts an optional Date instance (defaults to new Date()).
 */
export function todayLocalDateKey(timeZone?: string | null, date: Date = new Date()): string {
  return toLocalDateKey(date, timeZone);
}

const EXPLICIT_FIELD_KEYS: (keyof Intl.DateTimeFormatOptions)[] = [
  'weekday',
  'era',
  'year',
  'month',
  'day',
  'hour',
  'minute',
  'second',
  'dateStyle',
  'timeStyle',
  'dayPeriod',
  'fractionalSecondDigits',
  'timeZoneName',
];

function hasAnyExplicitField(options?: Intl.DateTimeFormatOptions): boolean {
  if (!options) return false;
  return EXPLICIT_FIELD_KEYS.some(k => options[k] !== undefined);
}

/**
 * Formats an ISO string or 'YYYY-MM-DD' dateKey for display in the target time zone.
 * When input is a 'YYYY-MM-DD' dateKey, uses timeZone 'UTC' to prevent day shifting across timezones.
 * If options contains any explicit fields or styles, default year/month/day fields are not applied.
 */
export function formatDisplayDate(
  isoOrDateKey?: string | Date | null,
  timeZone?: string | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!isoOrDateKey) return '';
  const isDateKey = typeof isoOrDateKey === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(isoOrDateKey);
  let d: Date;
  if (isDateKey) {
    d = new Date(`${isoOrDateKey}T12:00:00Z`);
  } else if (typeof isoOrDateKey === 'string') {
    d = new Date(isoOrDateKey);
  } else {
    d = isoOrDateKey;
  }
  if (isNaN(d.getTime())) return '';

  const tz = isDateKey ? 'UTC' : resolveSafeTimeZone(timeZone);
  const defaultFields: Intl.DateTimeFormatOptions = hasAnyExplicitField(options)
    ? {}
    : { year: 'numeric', month: 'short', day: 'numeric' };

  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: tz,
    ...defaultFields,
    ...options,
  }).format(d);
}

/**
 * Formats an ISO timestamp for display including date and time in the target time zone.
 * If options contains any explicit fields or styles, default fields are not applied.
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
  const defaultFields: Intl.DateTimeFormatOptions = hasAnyExplicitField(options)
    ? {}
    : { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };

  return new Intl.DateTimeFormat(APP_LOCALE, {
    timeZone: tz,
    ...defaultFields,
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
 * Maintained for backward-compatibility with re-exports in src/lib/date.ts and src/lib/calculations.ts.
 */
export function toUtcIsoString(date: Date = new Date()): string {
  return date.toISOString();
}
