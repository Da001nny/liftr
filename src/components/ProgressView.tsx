import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { TrendingUp, Award, Activity, BarChart3, Repeat, ShieldCheck } from 'lucide-react';

export const ProgressView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('progress.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('progress.subtitle')}
          </p>
        </div>
      </div>

      {/* Primary Elevated Metallic Card with genuine depth */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
          {/* Replaced flat square with tactile container with specular highlight & embedded icon */}
          <div 
            className="w-14 h-14 rounded-2xl premium-icon-container-accent shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <TrendingUp className="w-7 h-7 text-white premium-icon-embedded" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                Phase 3 Roadmap
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">PR Engine Specification</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('progress.comingSoonTitle')}
            </h2>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-2xl font-medium">
              {t('progress.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* 4 PR Categories Specification Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>The 4 Authoritative Personal Record Categories (Strict &gt; rule)</span>
          </h3>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold hidden sm:inline-block">
            Strict tie !== PR
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* PR Category 1: Heaviest Weight */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl premium-icon-container">
                  <Award className="w-5 h-5 text-amber-500 premium-icon-embedded" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400 dark:text-neutral-600">01</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1.5 font-display uppercase tracking-wide">
                1. Heaviest Weight
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Maximum absolute load successfully moved for at least 1 rep. Strict tie does not trigger PR.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
              max(weight) WHERE reps ≥ 1
            </div>
          </div>

          {/* PR Category 2: Best Estimated 1RM */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl premium-icon-container">
                  <TrendingUp className="w-5 h-5 text-blue-500 premium-icon-embedded" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400 dark:text-neutral-600">02</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1.5 font-display uppercase tracking-wide">
                2. Best Estimated 1RM
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Calculated via Epley formula: weight × (1 + reps/30), with reps===1 returning exact weight.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
              w × (1 + r/30) [r=1 → w]
            </div>
          </div>

          {/* PR Category 3: Best Single-Set Volume */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl premium-icon-container">
                  <BarChart3 className="w-5 h-5 text-emerald-500 premium-icon-embedded" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400 dark:text-neutral-600">03</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1.5 font-display uppercase tracking-wide">
                3. Best Single-Set Volume
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Weight × reps for ONE isolated set, never confounded with the session total.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
              max(set_weight × set_reps)
            </div>
          </div>

          {/* PR Category 4: Rep PR at Weight */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between group hover:border-neutral-300 dark:hover:border-neutral-700"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl premium-icon-container">
                  <Repeat className="w-5 h-5 text-violet-500 premium-icon-embedded" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400 dark:text-neutral-600">04</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1.5 font-display uppercase tracking-wide">
                4. Rep PR at Weight
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Greatest number of repetitions ever completed at a given specific benchmark load.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold">
              max(reps) @ exact_load
            </div>
          </div>

        </div>
      </div>

      {/* Activity Sub-section Note */}
      <div 
        data-surface="secondary-flat" 
        className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
      >
        <div className="flex items-center gap-3 mb-2 text-neutral-900 dark:text-white font-black text-base font-display uppercase tracking-wide">
          <div className="w-9 h-9 rounded-xl premium-icon-container">
            <Activity className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
          </div>
          <span>Activity History &amp; Trend Graphs</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium pl-11">
          {t('progress.activityTabNote')}
        </p>
      </div>

    </div>
  );
};
