import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { User, Sparkles, Check } from 'lucide-react';
import { GenderModel } from '../types/database';

export const BodyView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor, gender, setGender } = useTheme();

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('body.title')}
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            {t('body.subtitle')}
          </p>
        </div>

        {/* Anatomical Model Sex Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              gender === 'male'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {gender === 'male' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            <span>{t('profile.male')}</span>
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              gender === 'female'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            {gender === 'female' && <Check className="w-3.5 h-3.5 text-blue-500" />}
            <span>{t('profile.female')}</span>
          </button>
        </div>
      </div>

      {/* Primary Elevated Metallic Card for Flagship Anatomical Feature */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-start gap-4 relative z-10">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <User className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Phase 2 Flagship Feature
              </span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
              <span className="text-xs font-mono font-bold text-slate-600 dark:text-slate-400">
                {gender === 'male' ? 'Male Anatomy Selected' : 'Female Anatomy Selected'}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {t('body.comingSoonTitle')}
            </h2>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
              {t('body.comingSoonDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Anatomy Preview & Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div data-surface="secondary-flat" className="rounded-xl p-5">
          <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
            Clickable Muscle Groups
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Pectorals, lats, deltoids (front/lateral/rear), biceps, triceps, quads, hamstrings, glutes, calves, and core.
          </p>
        </div>

        <div data-surface="secondary-flat" className="rounded-xl p-5">
          <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
            Muscle Exposure Heatmap
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Real-time visual fatigue and volume exposure tracking based on completed session sets across 7-day and 14-day rolling windows.
          </p>
        </div>

        <div data-surface="secondary-flat" className="rounded-xl p-5">
          <span className="text-xs font-bold text-slate-900 dark:text-white block mb-1">
            Persisted Preferences
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            Your anatomical sex selection ({gender}) is saved directly to your Supabase <code className="bg-slate-200/90 dark:bg-slate-800 px-1 py-0.5 rounded font-mono font-bold text-slate-900 dark:text-slate-100">profiles</code> row.
          </p>
        </div>

      </div>
    </div>
  );
};
