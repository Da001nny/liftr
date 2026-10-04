import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Dumbbell, 
  Flame, 
  Layers, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Trophy,
  Clock
} from 'lucide-react';
import { TabId } from './Navigation';
import { calculateCalendarConsistency, formatLocalTimestamp } from '../lib/calculations';
import { fetchDashboardSummary, DashboardSummaryData } from '../lib/workoutService';
import { useWorkout } from '../context/WorkoutContext';

interface DashboardViewProps {
  onNavigateTab: (tab: TabId) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();
  const { historyRefreshKey } = useWorkout();

  const [summary, setSummary] = useState<DashboardSummaryData>({
    totalVolume: 0,
    sessionsCompleted: 0,
    scheduledSessions: 0,
    consistencyPercent: 100,
    recentWorkout: null,
    recentPRs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    fetchDashboardSummary(token).then(data => {
      setSummary(data);
      setLoading(false);
    });
  }, [token, historyRefreshKey]);

  const { totalVolume, sessionsCompleted, consistencyPercent, recentWorkout, recentPRs } = summary;

  const formatDuration = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remainingMins = mins % 60;
      return `${hrs}h ${remainingMins}m`;
    }
    return `${mins}m ${s}s`;
  };

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
            <span>{sessionsCompleted > 0 ? 'Log Workout' : t('dashboard.startFirstWorkout')}</span>
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
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
                {sessionsCompleted > 0 ? `${sessionsCompleted} Logged Sessions` : 'Phase 3 Ready'}
              </span>
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
              {sessionsCompleted > 0 
                ? 'Total accumulated volume across completed, non-warmup working sets.'
                : t('dashboard.noWorkoutsDesc')}
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
                {sessionsCompleted > 0 ? 'Verified in Supabase' : 'Zero sessions logged'}
              </span>
            </div>

            {/* Consistency Ring */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center p-1 bg-neutral-200 dark:bg-neutral-800 shadow-inner">
                <div 
                  className="w-full h-full rounded-full flex items-center justify-center metallic-ring-glow border-2"
                  style={{ borderColor: accentColor }}
                >
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
            <span>Weekly Training Consistency</span>
            <span className="font-stat tabular-nums text-neutral-900 dark:text-white text-sm">{consistencyPercent}%</span>
          </div>
          <div className="h-2.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full p-0.5 border border-neutral-300/50 dark:border-neutral-700/50 shadow-inner overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 metallic-progress-fill"
              style={{ width: `${consistencyPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECONDARY FLAT CARDS GRID
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
            {totalVolume > 0 ? `${totalVolume} kg` : t('dashboard.totalVolumeEmpty')}
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
            {sessionsCompleted}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block font-medium">
            {sessionsCompleted > 0 ? 'Completed workouts' : t('dashboard.completedSessionsEmpty')}
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

        {/* Stat Card 4: PRs Count */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
        >
          <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider font-athletic">Personal Records</span>
            <Trophy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white font-stat">
            {recentPRs.length}
          </div>
          <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 block font-medium">
            Strict &gt; tie rule
          </span>
        </div>
      </div>

      {/* Lower Dual Section: Recent Sessions & PRs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Sessions */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <h2 className="text-lg font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('dashboard.recentActivityTitle')}
            </h2>
            {recentWorkout && (
              <button
                onClick={() => onNavigateTab('workouts')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 font-athletic uppercase tracking-wider hover:underline"
              >
                View History
              </button>
            )}
          </div>

          {recentWorkout ? (
            <div className="py-4 space-y-4">
              <div className="p-4 rounded-xl bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700/80 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display uppercase tracking-wide">
                    {recentWorkout.name}
                  </h3>
                  <span className="text-xs font-bold font-athletic text-neutral-500">
                    {formatLocalTimestamp(recentWorkout.completed_at || recentWorkout.started_at)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono text-neutral-600 dark:text-neutral-300 font-bold pt-1">
                  <span className="text-emerald-500">{recentWorkout.total_volume} kg vol</span>
                  <span>·</span>
                  <span>{formatDuration(recentWorkout.duration_seconds)}</span>
                </div>
              </div>
            </div>
          ) : (
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
          )}

          <div className="pt-2 text-[11px] text-neutral-500 font-athletic uppercase font-bold tracking-wider">
            {recentWorkout ? 'Most recent logged workout' : 'No workouts logged'}
          </div>
        </div>

        {/* Recent Personal Records Card */}
        <div 
          data-surface="secondary-flat"
          className="rounded-xl p-6 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all flex flex-col justify-between"
        >
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <h2 className="text-lg font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                Recent Personal Records
              </h2>
            </div>
          </div>

          {recentPRs.length > 0 ? (
            <div className="py-2 space-y-2">
              {recentPRs.map((pr, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs"
                >
                  <div>
                    <span className="font-bold block capitalize font-display">
                      {pr.exercise_id.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-neutral-500 uppercase font-athletic font-bold">
                      {pr.category.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="font-mono font-black text-amber-500 text-sm">
                    {pr.value} {pr.category === 'rep_pr' ? `reps @ ${pr.reps}kg` : 'kg'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="w-12 h-12 rounded-xl premium-icon-container mx-auto mb-3">
                <Trophy className="w-5 h-5 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-athletic uppercase">
                No PRs Recorded Yet
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 max-w-xs mx-auto leading-relaxed font-medium">
                Log completed working sets to automatically detect heaviest weight, 1RM, volume, and rep PRs.
              </p>
            </div>
          )}

          <div className="pt-2 text-[11px] text-neutral-500 font-athletic uppercase font-bold tracking-wider">
            All 4 PR categories strictly enforced
          </div>
        </div>

      </div>

    </div>
  );
};
