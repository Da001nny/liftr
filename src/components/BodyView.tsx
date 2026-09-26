import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { User, Check, Layers, Flame, Database } from 'lucide-react';

export const BodyView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor, gender, setGender } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
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

        {/* Anatomical Model Sex Switcher */}
        <div className="flex items-center gap-1 p-1 bg-neutral-200/80 dark:bg-[#181818] rounded-xl border border-neutral-300 dark:border-neutral-800 shadow-inner">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-athletic flex items-center gap-1.5 ${
              gender === 'male'
                ? 'bg-neutral-900 text-white dark:bg-[#252525] shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            {gender === 'male' && <Check className="w-3.5 h-3.5" />}
            <span>{t('profile.male')}</span>
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-athletic flex items-center gap-1.5 ${
              gender === 'female'
                ? 'bg-neutral-900 text-white dark:bg-[#252525] shadow-sm'
                : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
            }`}
          >
            {gender === 'female' && <Check className="w-3.5 h-3.5" />}
            <span>{t('profile.female')}</span>
          </button>
        </div>
      </div>

      {/* Primary Elevated Metallic Card for Flagship Anatomical Feature */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex items-start gap-4 sm:gap-5 relative z-10">
          <div 
            className="w-14 h-14 rounded-2xl premium-icon-container-accent shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            <User className="w-7 h-7 text-white premium-icon-embedded" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                Phase 2 Flagship Feature
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="text-xs font-athletic uppercase tracking-wider font-bold text-neutral-500 dark:text-neutral-400">
                {gender === 'male' ? 'Male Anatomy Selected' : 'Female Anatomy Selected'}
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

      {/* Anatomy Preview & Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div 
          data-surface="secondary-flat" 
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl premium-icon-container mb-3">
              <Layers className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <span className="text-sm font-black text-neutral-900 dark:text-white block mb-1.5 font-display uppercase tracking-wide">
              Clickable Muscle Groups
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Pectorals, lats, deltoids (front/lateral/rear), biceps, triceps, quads, hamstrings, glutes, calves, and core.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-bold">
            Interactive SVG Mesh
          </div>
        </div>

        <div 
          data-surface="secondary-flat" 
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl premium-icon-container mb-3">
              <Flame className="w-4 h-4 text-orange-500 premium-icon-embedded" />
            </div>
            <span className="text-sm font-black text-neutral-900 dark:text-white block mb-1.5 font-display uppercase tracking-wide">
              Muscle Exposure Heatmap
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Real-time visual fatigue and volume exposure tracking based on completed session sets across 7-day and 14-day rolling windows.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-bold">
            Rolling Volume Analysis
          </div>
        </div>

        <div 
          data-surface="secondary-flat" 
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-9 h-9 rounded-xl premium-icon-container mb-3">
              <Database className="w-4 h-4 text-blue-500 premium-icon-embedded" />
            </div>
            <span className="text-sm font-black text-neutral-900 dark:text-white block mb-1.5 font-display uppercase tracking-wide">
              Persisted Preferences
            </span>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
              Your anatomical sex selection ({gender}) is saved directly to your Supabase <code className="bg-neutral-200 dark:bg-neutral-800 px-1 py-0.5 rounded font-mono font-bold text-neutral-900 dark:text-neutral-100">profiles</code> row.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-bold">
            RLS-Enforced Supabase Postgres
          </div>
        </div>

      </div>
    </div>
  );
};
