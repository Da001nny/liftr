import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { 
  Activity, 
  Layers, 
  Dumbbell, 
  ShieldCheck, 
  Flame, 
  TrendingUp,
  Sparkles,
  Compass
} from 'lucide-react';
import { MUSCLE_REGIONS } from '../data/exerciseCatalog';
import { getRegionLabel } from '../lib/labels';

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

      {/* Primary Elevated Metallic Card with tactile container */}
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
                Future Phase Roadmap
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">
                Recovery Engine Specification
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

      {/* Architected Capabilities Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>{t('body.plannedFeaturesTitle')}</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: 36-Muscle Taxonomy & 8 Regions */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl premium-icon-container">
                  <Layers className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Database Ready
                </span>
              </div>
              <h4 className="text-sm font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                8 Broad Regions &amp; 36-Muscle Taxonomy
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                The validated Phase 1 muscle database structure remains fully active and intact. All 8 broad muscular regions and 36 sub-muscles are cataloged and ready for future visual mapping.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex flex-wrap gap-1">
                {MUSCLE_REGIONS.slice(0, 6).map(r => (
                  <span 
                    key={r.id} 
                    className="px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800/80 text-[10px] font-athletic uppercase font-bold text-neutral-700 dark:text-neutral-300"
                  >
                    {getRegionLabel(r.id, r.name)}
                  </span>
                ))}
                <span className="px-2 py-0.5 rounded bg-neutral-200/70 dark:bg-neutral-800/80 text-[10px] font-athletic uppercase font-bold text-neutral-500">
                  +{MUSCLE_REGIONS.length - 6} more
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Rolling 7-Day Recovery Stimulus */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl premium-icon-container">
                  <Flame className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Volume Engine
                </span>
              </div>
              <h4 className="text-sm font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                Rolling 7-Day Stimulus &amp; Fatigue
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                Completed working sets logged during workouts will automatically accumulate per target muscle group over a rolling 7-day window to calculate systemic recovery and readiness.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-500 font-bold block">
                Metric: Hypertrophy volume (sets/wk)
              </span>
            </div>
          </div>

          {/* Card 3: Reverse Muscle Search */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-xl p-5 sm:p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl premium-icon-container">
                  <Dumbbell className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  Targeted Movements
                </span>
              </div>
              <h4 className="text-sm font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                Targeted Exercise Discovery
              </h4>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                Biomechanical muscle-to-exercise linking maps individual muscles to primary drivers, secondary synergists, and dynamic stabilizers across the exercise library.
              </p>
            </div>

            <div className="pt-4 mt-3 border-t border-neutral-200 dark:border-neutral-800">
              <span className="text-[11px] font-mono text-neutral-500 font-bold block">
                Catalog: Primary, Synergist &amp; Stabilizer roles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
