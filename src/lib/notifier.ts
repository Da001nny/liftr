/**
 * liftr: Unified Notification & Toast Store
 * 
 * Rules:
 * 1. No React imports (framework-agnostic state machine).
 * 2. 4-second deduplication: identical notification keys within 4000ms are ignored.
 * 3. Max capacity 3: at most 3 toasts displayed concurrently (oldest dropped).
 * 4. Lifespan: errors auto-dismiss after 7000ms, others after 4000ms.
 * 5. Injectable clock for fully deterministic timer-free testing.
 */

import { TranslationKeyPath } from '../i18n';

export type ToastKind = 'error' | 'success' | 'info';

export interface ToastPayload {
  kind: ToastKind;
  key: TranslationKeyPath;
  categoryKey?: TranslationKeyPath;
  params?: Record<string, string | number>;
  dedupeMs?: number;
}

export interface ToastItem extends ToastPayload {
  id: string;
  createdAt: number;
}

export interface Clock {
  now(): number;
  setTimeout(fn: () => void, ms: number): unknown;
  clearTimeout(id: unknown): void;
}

const defaultClock: Clock = {
  now: () => Date.now(),
  setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
  clearTimeout: (id) => globalThis.clearTimeout(id as any),
};

export class NotifierStore {
  private toasts: ToastItem[] = [];
  private listeners = new Set<(toasts: ToastItem[]) => void>();
  private lastNotifiedAt = new Map<string, number>();
  private timers = new Map<string, unknown>();
  private idCounter = 0;
  private clock: Clock;

  constructor(clock: Clock = defaultClock) {
    this.clock = clock;
  }

  public subscribe(listener: (toasts: ToastItem[]) => void): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public notify(payload: ToastPayload): string | null {
    const now = this.clock.now();
    const dedupeKey = payload.categoryKey ? `${payload.key}:${payload.categoryKey}` : payload.key;
    const lastTime = this.lastNotifiedAt.get(dedupeKey);
    const dedupeWindow = payload.dedupeMs ?? 4000;

    // Dedupe: ignore identical key + categoryKey within dedupe window
    if (lastTime !== undefined && now - lastTime < dedupeWindow) {
      return null;
    }
    this.lastNotifiedAt.set(dedupeKey, now);

    this.idCounter += 1;
    const id = `toast_${now}_${this.idCounter}`;
    const newToast: ToastItem = {
      ...payload,
      id,
      createdAt: now,
    };

    // Max 3 toasts: drop oldest if at limit
    if (this.toasts.length >= 3) {
      const oldest = this.toasts[0];
      this.clearAutoDismiss(oldest.id);
      this.toasts = this.toasts.slice(1);
    }

    this.toasts = [...this.toasts, newToast];

    // Auto-dismiss: 7 seconds for errors, 4 seconds for success/info
    const lifespan = payload.kind === 'error' ? 7000 : 4000;
    const timerId = this.clock.setTimeout(() => {
      this.dismiss(id);
    }, lifespan);
    this.timers.set(id, timerId);

    this.emit();
    return id;
  }

  public dismiss(id: string): void {
    const exists = this.toasts.some(t => t.id === id);
    if (!exists) return;

    this.clearAutoDismiss(id);
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.emit();
  }

  public clear(): void {
    for (const timer of this.timers.values()) {
      this.clock.clearTimeout(timer);
    }
    this.timers.clear();
    this.toasts = [];
    this.lastNotifiedAt.clear();
    this.emit();
  }

  public getToasts(): ToastItem[] {
    return [...this.toasts];
  }

  private clearAutoDismiss(id: string): void {
    const timer = this.timers.get(id);
    if (timer !== undefined) {
      this.clock.clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private emit(): void {
    const current = [...this.toasts];
    for (const listener of this.listeners) {
      try {
        listener(current);
      } catch (err) {
        console.error('[NotifierStore] listener error:', err);
      }
    }
  }
}

// Authoritative default singleton
export const defaultNotifier = new NotifierStore();

export const notify = (payload: ToastPayload): string | null => defaultNotifier.notify(payload);
export const subscribe = (listener: (toasts: ToastItem[]) => void): () => void => defaultNotifier.subscribe(listener);
export const dismiss = (id: string): void => defaultNotifier.dismiss(id);
export const getToasts = (): ToastItem[] => defaultNotifier.getToasts();
export const clear = (): void => defaultNotifier.clear();
