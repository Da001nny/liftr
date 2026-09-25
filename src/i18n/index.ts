/**
 * liftr: Translation Engine
 * 
 * Provides typed string lookups using the en dictionary.
 * Guarantees zero raw hardcoded text strings in JSX/components.
 */

import { en, TranslationKeyPath } from './en';

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
      result = result.replace(new RegExp(`{${paramKey}}`, 'g'), String(paramValue));
    });
  }

  return result;
}

/**
 * React hook for consuming translations.
 */
export function useTranslation() {
  return { t, locale: 'en' as const };
}
