import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { Dumbbell, ListFilter, Plus, Info } from 'lucide-react';

export const WorkoutsView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('workouts.title')}
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            {t('workouts.subtitle')}
          </p>
        </div>
      </div>

      {/* Primary Elevated Metallic Card for Phase 1 Overview */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-start gap-4 relative z-10">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <Dumbbell className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Phase 1 Roadmap
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('workouts.comingSoonTitle')}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
              {t('workouts.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Flat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Sub-section: Exercises */}
        <div data-surface="secondary-flat" className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold text-sm">
            <ListFilter className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Exercise Database</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {t('workouts.exercisesTabNote')}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
            <span>Primary Muscle Groups</span>
            <span aria-hidden="true">·</span>
            <span>Equipment Tags</span>
            <span aria-hidden="true">·</span>
            <span>Custom Exercises</span>
          </div>
        </div>

        {/* Sub-section: Live Logger */}
        <div data-surface="secondary-flat" className="rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold text-sm">
            <Info className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <span>Authoritative Calculation Rules</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            All sets will compute single-set volume (weight × reps) and session total volume through liftr's centralized calculation engine.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400 font-mono font-semibold">
            <span>Rest Timer</span>
            <span aria-hidden="true">·</span>
            <span>RPE / Weight</span>
            <span aria-hidden="true">·</span>
            <span>Strict PR Check</span>
          </div>
        </div>

      </div>
    </div>
  );
};
