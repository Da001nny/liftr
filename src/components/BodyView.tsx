import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { Activity } from 'lucide-react';

export const BodyView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('body.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('body.subtitle')}
          </p>
        </div>
      </div>


      {/* Generic Coming Soon block */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
          <div 
            className="w-14 h-14 rounded-2xl premium-icon-container-accent shrink-0 flex items-center justify-center shadow-lg"
            style={{ backgroundColor: accentColor }}
          >
            <Activity className="w-7 h-7 text-white premium-icon-embedded" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                {t('body.comingSoonBadge')}
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">
                {t('body.databaseReady')}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('body.comingSoonTitle')}
            </h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl font-medium">
              {t('body.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
