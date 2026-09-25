import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Award, Activity, BarChart3 } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('progress.title')}
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            {t('progress.subtitle')}
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
            <TrendingUp className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Phase 3 Roadmap
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('progress.comingSoonTitle')}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
              {t('progress.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* 4 PR Categories Specification Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
          The 4 Authoritative Personal Record Categories (Strict &gt; rule)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div data-surface="secondary-flat" className="rounded-xl p-4">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              1. Heaviest Weight
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Maximum absolute load successfully moved for at least 1 rep. Strict tie does not trigger PR.
            </p>
          </div>

          <div data-surface="secondary-flat" className="rounded-xl p-4">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              2. Best Estimated 1RM
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Calculated via Epley formula: weight × (1 + reps/30), with reps===1 returning exact weight.
            </p>
          </div>

          <div data-surface="secondary-flat" className="rounded-xl p-4">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              3. Best Single-Set Volume
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Weight × reps for ONE isolated set, not the session total.
            </p>
          </div>

          <div data-surface="secondary-flat" className="rounded-xl p-4">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
              4. Rep PR at Weight
            </span>
            <p className="text-[11px] text-slate-700 dark:text-slate-300 font-medium">
              Greatest number of repetitions ever completed at a given specific load.
            </p>
          </div>

        </div>
      </div>

      {/* Activity Sub-section Note */}
      <div data-surface="secondary-flat" className="rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2 text-slate-900 dark:text-white font-bold text-sm">
          <Activity className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <span>Activity History</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
          {t('progress.activityTabNote')}
        </p>
      </div>

    </div>
  );
};
