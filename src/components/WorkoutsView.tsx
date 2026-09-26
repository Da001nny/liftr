import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { Dumbbell, ListFilter, Info } from 'lucide-react';

export const WorkoutsView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('workouts.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('workouts.subtitle')}
          </p>
        </div>
      </div>

      {/* Primary Elevated Metallic Card for Phase 1 Overview */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
          <div 
            className="w-14 h-14 rounded-2xl premium-icon-container-accent shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <Dumbbell className="w-7 h-7 text-white premium-icon-embedded" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                Phase 1 Roadmap
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">Execution Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('workouts.comingSoonTitle')}
            </h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl font-medium">
              {t('workouts.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Secondary Flat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Sub-section: Exercises */}
        <div 
          data-surface="secondary-flat" 
          className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2.5 text-neutral-900 dark:text-white font-black text-base font-display uppercase tracking-wide">
            <div className="w-9 h-9 rounded-xl premium-icon-container">
              <ListFilter className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <span>Exercise Database &amp; Taxonomies</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium pl-11">
            {t('workouts.exercisesTabNote')}
          </p>
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-athletic uppercase tracking-wider font-bold pl-11">
            <span>Primary Muscle Groups</span>
            <span aria-hidden="true">·</span>
            <span>Equipment Tags</span>
            <span aria-hidden="true">·</span>
            <span>Custom Exercises</span>
          </div>
        </div>

        {/* Sub-section: Live Logger */}
        <div 
          data-surface="secondary-flat" 
          className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center gap-3 mb-2.5 text-neutral-900 dark:text-white font-black text-base font-display uppercase tracking-wide">
            <div className="w-9 h-9 rounded-xl premium-icon-container">
              <Info className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <span>Authoritative Calculation Rules</span>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium pl-11">
            All sets will compute single-set volume (weight × reps) and session total volume through liftr's centralized calculation engine.
          </p>
          <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-athletic uppercase tracking-wider font-bold pl-11">
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
