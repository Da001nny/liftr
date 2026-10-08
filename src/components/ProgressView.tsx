import React, { useState, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Activity, Award, ShieldCheck, Scale, Dumbbell, Layers, RefreshCw } from 'lucide-react';
import { ActivitySection } from './progress/ActivitySection';
import { BodyweightSection } from './progress/BodyweightSection';
import { ExerciseProgressSection } from './progress/ExerciseProgressSection';
import { MuscleExposureSection } from './progress/MuscleExposureSection';
import { RangeTrendSection } from './progress/RangeTrendSection';
import { CrossExerciseSection } from './progress/CrossExerciseSection';
import { ExportDataCenterSection } from './progress/ExportDataCenterSection';
import { fetchAllCompletedWorkouts } from '../lib/progressService';

export const ProgressView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [allWorkouts, setAllWorkouts] = useState<any[]>([]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  useEffect(() => {
    if (!token) return;
    fetchAllCompletedWorkouts(token).then(data => {
      setAllWorkouts(data);
    });
  }, [token, refreshKey]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('progress.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('progress.subtitle')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5 text-xs font-bold font-athletic uppercase"
          title="Refresh Progress Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync</span>
        </button>
      </div>

      {/* Step 2: Daily Activity & Step Tracking Section */}
      <section aria-labelledby="activity-section">
        <ActivitySection key={`act_${refreshKey}`} onRefresh={handleRefresh} />
      </section>

      {/* Step 3: Bodyweight Tracking Section */}
      <section aria-labelledby="bodyweight-section">
        <BodyweightSection key={`bw_${refreshKey}`} onRefresh={handleRefresh} />
      </section>

      {/* Step 4: Exercise Strength & 1RM Trajectory Curves */}
      <section aria-labelledby="exercise-curves-section">
        <ExerciseProgressSection key={`ex_${refreshKey}`} />
      </section>

      {/* Phase 6: Cross-Exercise Comparison (Synchronized Curves) */}
      <section aria-labelledby="cross-exercise-section">
        <CrossExerciseSection workouts={allWorkouts} key={`cross_${refreshKey}`} />
      </section>

      {/* Phase 6: Range Trend Comparisons (Custom Windows & Hand-Checked Math) */}
      <section aria-labelledby="range-trend-section">
        <RangeTrendSection workouts={allWorkouts} key={`trend_${refreshKey}`} />
      </section>

      {/* Step 5: Full Muscle Exposure Analytics (Data Layer Only) */}
      <section aria-labelledby="muscle-exposure-section">
        <MuscleExposureSection key={`exp_${refreshKey}`} />
      </section>

      {/* Phase 6: Data & CSV Export Center (RFC 4180 + Excel BOM Infrastructure) */}
      <section aria-labelledby="export-center-section">
        <ExportDataCenterSection workouts={allWorkouts} key={`export_${refreshKey}`} />
      </section>

      {/* PR Engine Reference Cards */}
      <section aria-labelledby="pr-categories-section" className="space-y-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: accentColor }} />
            <span>The 4 Authoritative Personal Record Categories (Strict &gt; Rule)</span>
          </h3>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 font-semibold hidden sm:inline-block">
            Strict tie !== PR
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* PR Category 1: Heaviest Weight */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-2xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                  <Award className="w-4 h-4 text-amber-500" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400">01</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1 font-display uppercase tracking-wide">
                1. Heaviest Weight
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Maximum absolute load successfully moved for at least 1 rep. Strict tie does not trigger PR.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[10px] font-mono text-neutral-400 font-semibold">
              max(weight) WHERE reps ≥ 1
            </div>
          </div>

          {/* PR Category 2: Best Estimated 1RM */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-2xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <TrendingUp className="w-4 h-4 text-blue-500" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400">02</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1 font-display uppercase tracking-wide">
                2. Best Estimated 1RM
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Epley formula: weight × (1 + reps/30). When reps === 1, returns weight exactly.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[10px] font-mono text-neutral-400 font-semibold">
              weight * (1 + reps / 30)
            </div>
          </div>

          {/* PR Category 3: Best Single-Set Volume */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-2xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                  <Layers className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400">03</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1 font-display uppercase tracking-wide">
                3. Single-Set Volume
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Maximal mechanical work output in one discrete set: weight × reps (not session volume).
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[10px] font-mono text-neutral-400 font-semibold">
              max(weight * reps)
            </div>
          </div>

          {/* PR Category 4: Rep PR at Specific Weight */}
          <div 
            data-surface="secondary-flat" 
            className="rounded-2xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <Activity className="w-4 h-4 text-purple-500" />
                </div>
                <span className="font-mono text-[11px] font-bold text-neutral-400">04</span>
              </div>
              <span className="text-base font-black text-neutral-900 dark:text-white block mb-1 font-display uppercase tracking-wide">
                4. Rep PR at Weight
              </span>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed">
                Most reps ever performed at a given discrete weight milestone. Tracked per load.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-neutral-200/80 dark:border-neutral-800/80 text-[10px] font-mono text-neutral-400 font-semibold">
              max(reps) AT weight
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
