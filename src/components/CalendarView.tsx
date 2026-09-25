import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { Calendar as CalendarIcon, Clock, Flame, ShieldCheck } from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('calendar.title')}
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            {t('calendar.subtitle')}
          </p>
        </div>
      </div>

      {/* Primary Elevated Metallic Card */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-start gap-4 relative z-10">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <CalendarIcon className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Phase 4 Roadmap
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('calendar.comingSoonTitle')}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
              {t('calendar.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Calendar Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div data-surface="secondary-flat" className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold text-sm">
            <Flame className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Consistency % Authoritative Calculation</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Completed scheduled sessions ÷ explicitly scheduled sessions. Unscheduled workouts are excluded from the denominator entirely. 0 scheduled sessions defaults to 100%.
          </p>
        </div>

        <div data-surface="secondary-flat" className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold text-sm">
            <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>UTC Recurrence &amp; Local Display</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Timestamps are stored in UTC; converted to local timezone only for display. Recurrence date-walking happens in UTC to avoid daylight saving time drift.
          </p>
        </div>

      </div>
    </div>
  );
};
