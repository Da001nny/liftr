/**
 * liftr: Translation Engine
 * 
 * Provides typed string lookups using the en dictionary.
 * Guarantees zero raw hardcoded text strings in JSX/components.
 */

import { en, TranslationKeyPath } from './en';

export type { TranslationKeyPath };

/**
 * Extracts base keys that have matching _one and _other plural variants in TranslationKeyPath.
 * A key without _one/_other will fail typechecking when passed to tn().
 */
export type BasePluralKey = {
  [K in TranslationKeyPath]: K extends `${infer Base}_one`
    ? `${Base}_other` extends TranslationKeyPath
      ? Base
      : never
    : never;
}[TranslationKeyPath];

export const APP_LOCALE = 'en';

const pluralRules = new Intl.PluralRules(APP_LOCALE);

/**
 * Authoritative translation lookup function.
 * 
 * Example: t('dashboard.title') -> "Dashboard"
 * Example: t('common.loading') -> "Loading..."
 */
export function t(key: TranslationKeyPath, params?: Record<string, string | number>): string {
  const parts = key.split('.');
  let current: any = en;

  for (const part of parts) {
    if (current && typeof current === 'object' && part in current) {
      current = current[part];
    } else {
      console.warn(`[i18n] Missing translation key: "${key}"`);
      return key;
    }
  }

  if (typeof current !== 'string') {
    return key;
  }

  let result = current;
  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      result = result.split(`{${paramKey}}`).join(String(paramValue));
    });
  }

  return result;
}

/**
 * Plural translation lookup helper that selects '_one' or '_other' based on count using Intl.PluralRules.
 * The key parameter is strictly typed as BasePluralKey so missing plural variants fail tsc.
 * 
 * Example: tn('workouts.savedRoutinesCount', 1) -> looks up 'workouts.savedRoutinesCount_one'
 * Example: tn('workouts.savedRoutinesCount', 3) -> looks up 'workouts.savedRoutinesCount_other'
 */
export function tn(key: BasePluralKey, count: number, params?: Record<string, string | number>): string {
  const rule = pluralRules.select(count);
  const suffix = rule === 'one' ? '_one' : '_other';
  const fullKey = `${key}${suffix}` as TranslationKeyPath;
  return t(fullKey, { count, ...params });
}

/**
 * React hook for consuming translations.
 */
export function useTranslation() {
  return { t, tn, locale: APP_LOCALE };
}



