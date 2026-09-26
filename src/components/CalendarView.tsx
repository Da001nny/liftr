import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { Calendar as CalendarIcon, Clock, Flame } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('calendar.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('calendar.subtitle')}
          </p>
        </div>
      </div>

      {/* Primary Elevated Metallic Card */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
          <div 
            className="w-14 h-14 rounded-2xl premium-icon-container-accent shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <CalendarIcon className="w-7 h-7 text-white premium-icon-embedded" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                Phase 4 Roadmap
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">Scheduling &amp; Consistency</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('calendar.comingSoonTitle')}
            </h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl font-medium">
              {t('calendar.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div 
          data-surface="secondary-flat" 
          className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2.5 text-neutral-900 dark:text-white font-black text-base font-display uppercase tracking-wide">
            <div className="w-9 h-9 rounded-xl premium-icon-container">
              <Flame className="w-4 h-4 text-orange-500 premium-icon-embedded" />
            </div>
            <span>Consistency % Authoritative Calculation</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium pl-11">
            Completed scheduled sessions ÷ explicitly scheduled sessions. Unscheduled workouts are excluded from the denominator entirely. 0 scheduled sessions defaults to 100%.
          </p>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-bold pl-11">
            scheduled === 0 ? 100% : round((completed_sched / scheduled) * 100)
          </div>
        </div>

        <div 
          data-surface="secondary-flat" 
          className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2.5 text-neutral-900 dark:text-white font-black text-base font-display uppercase tracking-wide">
            <div className="w-9 h-9 rounded-xl premium-icon-container">
              <Clock className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <span>UTC Recurrence &amp; Local Display</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium pl-11">
            Timestamps are stored in UTC; converted to local timezone only for display. Recurrence date-walking happens in UTC to avoid daylight saving time drift.
          </p>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-bold pl-11">
            ISO-8601 UTC timestamp storage · Local client hydration
          </div>
        </div>

      </div>
    </div>
  );
};
