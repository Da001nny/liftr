import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { subscribe, dismiss, ToastItem } from '../lib/notifier';
import { useTranslation } from '../i18n';

function getAriaRole(kind: ToastItem['kind']): 'alert' | 'status' {
  if (kind === 'error') return 'alert';
  return 'status';
}

function getAriaLive(kind: ToastItem['kind']): 'assertive' | 'polite' {
  if (kind === 'error') return 'assertive';
  return 'polite';
}

export const ToastHost: React.FC = () => {
  const { t } = useTranslation();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    return subscribe(newToasts => {
      setToasts(newToasts);
    });
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed z-[120] bottom-[calc(4.75rem+env(safe-area-inset-bottom,0px))] md:bottom-6 right-0 left-0 md:left-auto md:right-6 md:max-w-md pointer-events-none p-4 flex flex-col gap-2.5 transition-all"
    >
      {toasts.map(toast => {
        const isError = toast.kind === 'error';
        const isSuccess = toast.kind === 'success';

        const colorClasses = isError
          ? 'bg-red-50 dark:bg-red-950/90 border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 shadow-red-950/10'
          : isSuccess
            ? 'bg-emerald-50 dark:bg-emerald-950/90 border-emerald-200 dark:border-emerald-900/60 text-emerald-900 dark:text-emerald-200 shadow-emerald-950/10'
            : 'bg-neutral-50 dark:bg-[#161616] border-neutral-200 dark:border-[#2a2a2a] text-neutral-900 dark:text-neutral-100 shadow-neutral-950/10';

        const iconColor = isError
          ? 'text-red-600 dark:text-red-400'
          : isSuccess
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-neutral-600 dark:text-neutral-400';

        return (
          <div
            key={toast.id}
            role={getAriaRole(toast.kind)}
            aria-live={getAriaLive(toast.kind)}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${colorClasses}`}
          >
            <div className={`mt-0.5 shrink-0 ${iconColor}`}>
              {isError && <AlertCircle className="w-5 h-5" />}
              {isSuccess && <CheckCircle2 className="w-5 h-5" />}
              {!isError && !isSuccess && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              {toast.categoryKey && (
                <div className="text-[11px] font-bold uppercase tracking-wider opacity-90 font-athletic mb-0.5">
                  {t(toast.categoryKey)}
                </div>
              )}
              <div className="text-xs leading-relaxed font-medium">
                {t(toast.key, toast.params)}
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label={t('errors.dismiss')}
              className="shrink-0 p-1 rounded-lg opacity-70 hover:opacity-100 transition-opacity cursor-pointer -mr-1 -mt-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
