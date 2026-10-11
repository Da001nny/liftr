import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  isDestructive = true,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const resolvedConfirmLabel = confirmLabel || t('common.save');
  const resolvedCancelLabel = cancelLabel || t('common.cancel');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-md rounded-2xl p-6 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 shadow-2xl space-y-4"
      >
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isDestructive 
              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20' 
              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1 flex-1 pr-6">
            <h3 id="confirm-modal-title" className="text-base font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onCancel}
            aria-label={t('common.closeDialog')}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-athletic font-bold uppercase tracking-wider rounded-xl bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            {resolvedCancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs font-athletic font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-500 text-white'
                : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'
            }`}
          >
            {resolvedConfirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
