import React from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { 
  Dumbbell, 
  Flame, 
  Calendar as CalendarIcon, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { TabId } from './Navigation';
import { calculateCalendarConsistency } from '../lib/calculations';

interface DashboardViewProps {
  onNavigateTab: (tab: TabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { t } = useTranslation();
  const { accentColor, effectiveTheme } = useTheme();

  // Authoritative empty state data (no mock or fabricated numbers)
  const totalVolume = 0;
  const sessionsCompleted = 0;
  const scheduledSessions = 0;
  const activeSplit = null;

  // Authoritative calculation: 0 scheduled sessions = 100% intentional default
  const consistencyPercent = calculateCalendarConsistency(sessionsCompleted, scheduledSessions);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      
      {/* Page Header (Clean typography, no pill badges) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('workouts')}
            className="px-4 py-2 text-xs font-semibold text-white rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            <Dumbbell className="w-4 h-4" />
            <span>{t('dashboard.startFirstWorkout')}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRIMARY ELEVATED METALLIC CARD
          Metallic gradient sheen ONLY on elevated surfaces per Section 2.2 of PRD
          Brushed platinum (light) / Liquid titanium (dark) with specular corner beam
          ========================================================================= */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 transition-all"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
              <span className="tracking-wide uppercase text-[11px] font-bold text-slate-800 dark:text-slate-200">
                {t('dashboard.heroCardTitle')}
              </span>
              <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">·</span>
              <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">Phase 0 Baseline</span>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono tabular-nums">
                {totalVolume}
              </span>
              <span className="text-lg font-bold text-slate-700 dark:text-slate-300">
                {t('common.kg')}
              </span>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 max-w-md leading-relaxed">
              {t('dashboard.noWorkoutsDesc')}
            </p>
          </div>

          {/* Quick Readout & Circular Metallic Ring (Inspired by Reference UI) */}
          <div className="flex items-center gap-6 sm:gap-8 border-t md:border-t-0 md:border-l border-slate-300/80 dark:border-white/10 pt-4 md:pt-0 md:pl-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                {t('dashboard.completedSessionsLabel')}
              </span>
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
                {sessionsCompleted}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                Current cycle
              </span>
            </div>

            {/* Circular Metallic Progress Ring Gauge */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90 metallic-ring-svg" viewBox="0 0 64 64">
                  <defs>
                    <linearGradient id="metallicRingGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#475569" />
                      <stop offset="35%" stopColor="#ffffff" />
                      <stop offset="70%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#334155" />
                    </linearGradient>
                    <linearGradient id="metallicRingGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="30%" stopColor="#ffffff" />
                      <stop offset="65%" stopColor="#cbd5e1" />
                      <stop offset="100%" stopColor="#64748b" />
                    </linearGradient>
                  </defs>
                  {/* Track */}
                  <circle
                    cx="32"
                    cy="32"
                    r="25"
                    stroke="currentColor"
                    strokeWidth="4.5"
                    fill="transparent"
                    className="text-slate-200 dark:text-white/10"
                  />
                  {/* Metallic Brushed Arc */}
                  <circle
                    cx="32"
                    cy="32"
                    r="25"
                    stroke={effectiveTheme === 'dark' ? 'url(#metallicRingGradDark)' : 'url(#metallicRingGradLight)'}
                    strokeWidth="5"
                    strokeDasharray={157}
                    strokeDashoffset={0}
                    strokeLinecap="round"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-xs font-bold font-mono text-slate-900 dark:text-white">
                    {consistencyPercent}%
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 hidden sm:block">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  {t('dashboard.consistencyLabel')}
                </span>
                <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                  Default: 100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metallic progress bar fill */}
        <div className="mt-6 pt-5 border-t border-slate-300/80 dark:border-white/10 relative z-10">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            <span>Weekly Goal Progress</span>
            <span className="font-mono tabular-nums text-slate-900 dark:text-white">0%</span>
          </div>
          <div className="h-3 w-full bg-slate-200/90 dark:bg-slate-900/90 rounded-full p-0.5 border border-slate-300/80 dark:border-white/10 shadow-inner overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 metallic-progress-fill"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECONDARY FLAT CARDS GRID (Pure flat plain background, clean typography)
          Zero gradient sheen on secondary surfaces
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat Card 1: Volume */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">{t('dashboard.totalVolumeLabel')}</span>
            <TrendingUp className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {t('dashboard.totalVolumeEmpty')}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block font-medium">
            Across all completed sets
          </span>
        </div>

        {/* Stat Card 2: Sessions */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">{t('dashboard.completedSessionsLabel')}</span>
            <CheckCircle2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {t('dashboard.completedSessionsEmpty')}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block font-medium">
            Logged in current cycle
          </span>
        </div>

        {/* Stat Card 3: Consistency */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">{t('dashboard.consistencyLabel')}</span>
            <Flame className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white font-mono tabular-nums">
            {consistencyPercent}%
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block font-medium">
            Completed / Scheduled ratio
          </span>
        </div>

        {/* Stat Card 4: Active Split */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 transition-all"
        >
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">{t('dashboard.activeSplitLabel')}</span>
            <Layers className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">
            {t('dashboard.activeSplitEmpty')}
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 block font-medium">
            Configurable in Calendar
          </span>
        </div>
      </div>

      {/* Lower Dual Section: Honest Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Sessions (Honest empty state) */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-6 transition-all"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('dashboard.recentActivityTitle')}
            </h2>
          </div>

          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 mx-auto flex items-center justify-center text-slate-600 dark:text-slate-400 mb-3 border border-slate-200 dark:border-slate-700">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('dashboard.noWorkoutsTitle')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {t('dashboard.noRecentActivity')}
            </p>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>{t('dashboard.startFirstWorkout')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Anatomical Volume Share (Honest empty state) */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-6 transition-all"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {t('dashboard.muscleDistributionTitle')}
            </h2>
          </div>

          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 mx-auto flex items-center justify-center text-slate-600 dark:text-slate-400 mb-3 border border-slate-200 dark:border-slate-700">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              {t('common.emptyTitle')}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              {t('dashboard.noMuscleData')}
            </p>
            <button
              onClick={() => onNavigateTab('body')}
              className="mt-4 px-3.5 py-1.5 text-xs font-semibold rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Explore Anatomical Body</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
