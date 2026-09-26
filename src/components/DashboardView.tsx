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
      
      {/* Page Header (Clean, bold athletic typography) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('dashboard.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('workouts')}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer font-athletic"
            style={{ backgroundColor: accentColor }}
          >
            <Dumbbell className="w-4 h-4" />
            <span>{t('dashboard.startFirstWorkout')}</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          PRIMARY ELEVATED METALLIC CARD
          Dark: Cool silver/chrome brushed sheen against neutral near-black (#161616)
          Light: Airy, soft grey card with faint pearl/platinum specular sheen
          ========================================================================= */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              <Sparkles className="w-3.5 h-3.5 shrink-0" style={{ color: accentColor }} />
              <span className="text-neutral-800 dark:text-neutral-200">
                {t('dashboard.heroCardTitle')}
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">Phase 0 Baseline</span>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-6xl sm:text-7xl font-black tracking-tight text-neutral-900 dark:text-white font-stat">
                {totalVolume}
              </span>
              <span className="text-xl font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                {t('common.kg')}
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-md leading-relaxed font-medium">
              {t('dashboard.noWorkoutsDesc')}
            </p>
          </div>

          {/* Quick Readout & Circular Metallic Ring (Matching Fintech Card UI) */}
          <div className="flex items-center gap-6 sm:gap-8 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-4 md:pt-0 md:pl-8">
            <div className="space-y-0.5">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block font-athletic">
                {t('dashboard.completedSessionsLabel')}
              </span>
              <span className="text-4xl font-black text-neutral-900 dark:text-white font-stat">
                {sessionsCompleted}
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">
                Current cycle
              </span>
            </div>

            {/* Circular Metallic Progress Ring Gauge */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
                <svg className="w-16 h-16 transform -rotate-90 metallic-ring-svg" viewBox="0 0 64 64">
                  <defs>
                    <linearGradient id="metallicRingGradLight" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#71717a" />
                      <stop offset="35%" stopColor="#ffffff" />
                      <stop offset="70%" stopColor="#a1a1aa" />
                      <stop offset="100%" stopColor="#3f3f46" />
                    </linearGradient>
                    <linearGradient id="metallicRingGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#737373" />
                      <stop offset="30%" stopColor="#ffffff" />
                      <stop offset="65%" stopColor="#d4d4d4" />
                      <stop offset="100%" stopColor="#404040" />
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
                    className="text-neutral-200 dark:text-neutral-800"
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
                  <span className="text-xs font-black font-stat text-neutral-900 dark:text-white">
                    {consistencyPercent}%
                  </span>
                </div>
              </div>

              <div className="space-y-0.5 hidden sm:block">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block font-athletic">
                  {t('dashboard.consistencyLabel')}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 block font-medium">
                  Default: 100%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Metallic progress bar fill */}
        <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 relative z-10">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 mb-2 font-athletic">
            <span>Weekly Goal Progress</span>
            <span className="font-stat tabular-nums text-neutral-900 dark:text-white text-sm">0%</span>
          </div>
          <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full p-0.5 border border-neutral-300/50 dark:border-neutral-700/50 shadow-inner overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 metallic-progress-fill"
              style={{ width: '0%' }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECONDARY FLAT CARDS GRID
          Light: Soft light-grey cards (#f4f5f7) with delicate border
          Dark: Pure flat neutral charcoal (#141414)
          ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat Card 1: Volume */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-athletic">{t('dashboard.totalVolumeLabel')}</span>
            <TrendingUp className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-stat">
            {t('dashboard.totalVolumeEmpty')}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block font-medium">
            Across all completed sets
          </span>
        </div>

        {/* Stat Card 2: Sessions */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-athletic">{t('dashboard.completedSessionsLabel')}</span>
            <CheckCircle2 className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-stat">
            {t('dashboard.completedSessionsEmpty')}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block font-medium">
            Logged in current cycle
          </span>
        </div>

        {/* Stat Card 3: Consistency */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-athletic">{t('dashboard.consistencyLabel')}</span>
            <Flame className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-stat">
            {consistencyPercent}%
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block font-medium">
            Completed / Scheduled ratio
          </span>
        </div>

        {/* Stat Card 4: Active Split */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-athletic">{t('dashboard.activeSplitLabel')}</span>
            <Layers className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          </div>
          <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-1 font-athletic uppercase">
            {t('dashboard.activeSplitEmpty')}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block font-medium">
            Configurable in Calendar
          </span>
        </div>
      </div>

      {/* Lower Dual Section: Honest Empty States */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Sessions */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('dashboard.recentActivityTitle')}
            </h2>
          </div>

          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl premium-icon-container mx-auto mb-3">
              <Dumbbell className="w-5 h-5 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-athletic uppercase">
              {t('dashboard.noWorkoutsTitle')}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed font-medium">
              {t('dashboard.noRecentActivity')}
            </p>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="mt-4 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm font-athletic"
            >
              <span>{t('dashboard.startFirstWorkout')}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Anatomical Volume Share */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('dashboard.muscleDistributionTitle')}
            </h2>
          </div>

          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-xl premium-icon-container mx-auto mb-3">
              <Layers className="w-5 h-5 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-athletic uppercase">
              {t('common.emptyTitle')}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed font-medium">
              {t('dashboard.noMuscleData')}
            </p>
            <button
              onClick={() => onNavigateTab('body')}
              className="mt-4 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-sm font-athletic"
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
