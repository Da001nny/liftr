/**
 * liftr: Failure Classification and Reporting
 * 
 * Maps HTTP/network errors to localized user-friendly action notifications.
 */

import { notify } from './notifier';
import { TranslationKeyPath } from '../i18n';

export type FailureCategory = 'network' | 'auth' | 'notFound' | 'server' | 'other';

export interface FailureInput {
  status?: number;
  networkError?: boolean;
}

/**
 * Pure function: Classifies HTTP status and network flags into semantic categories.
 * 401/403 -> 'auth'
 * 404 -> 'notFound'
 * 500-599 -> 'server'
 * networkError === true -> 'network'
 * everything else -> 'other'
 */
export function classifyFailure(input?: FailureInput): FailureCategory {
  if (!input) return 'other';
  if (input.networkError) {
    return 'network';
  }
  const { status } = input;
  if (typeof status === 'number') {
    if (status === 401 || status === 403) {
      return 'auth';
    }
    if (status === 404) {
      return 'notFound';
    }
    if (status >= 500 && status < 600) {
      return 'server';
    }
  }
  return 'other';
}

/**
 * Maps semantic category to authoritative i18n headline key.
 */
export function categoryToKey(category: FailureCategory): TranslationKeyPath {
  switch (category) {
    case 'network':
      return 'errors.networkError';
    case 'auth':
      return 'errors.unauthorized';
    case 'notFound':
      return 'errors.notFound';
    case 'server':
      return 'errors.serverError';
    case 'other':
    default:
      return 'errors.generic';
  }
}

export type SupportedActionKey =
  | 'completeWorkout'
  | 'createWorkout'
  | 'autosaveWorkout'
  | 'saveSteps'
  | 'saveBodyweight'
  | 'exportData';

export const ACTION_KEY_MAP: Record<SupportedActionKey, TranslationKeyPath> = {
  completeWorkout: 'errors.actions.completeWorkout',
  createWorkout: 'errors.actions.createWorkout',
  autosaveWorkout: 'errors.actions.autosaveWorkout',
  saveSteps: 'errors.actions.saveSteps',
  saveBodyweight: 'errors.actions.saveBodyweight',
  exportData: 'errors.actions.exportData',
};

/**
 * Shared error reporting helper for critical user-initiated paths.
 */
export function reportFailure(
  actionKey: SupportedActionKey,
  input: FailureInput,
  options?: { dedupeMs?: number }
): void {
  const category = classifyFailure(input);
  const categoryKey = categoryToKey(category);
  const actionPath = ACTION_KEY_MAP[actionKey];

  notify({
    kind: 'error',
    key: actionPath,
    categoryKey,
    dedupeMs: options?.dedupeMs,
  });
}
