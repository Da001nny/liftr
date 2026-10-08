import React, { useState, useEffect } from 'react';
import { Layers, Activity, Info, BarChart2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { MuscleExposureAnalytics, ExposureLevel, RegionExposureItem, MuscleExposureItem } from '../../types/database';
import { fetchMuscleExposureData } from '../../lib/progressService';

type TimeframeType = 'session' | 'week' | 'month' | 'all_time';

export const MuscleExposureSection: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [timeframe, setTimeframe] = useState<TimeframeType>('month');
  const [analytics, setAnalytics] = useState<MuscleExposureAnalytics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});

  const loadExposure = async () => {
    if (!token) return;
    setLoading(true);
    const data = await fetchMuscleExposureData(token, timeframe);
    setAnalytics(data);
    setLoading(false);
  };

  useEffect(() => {
    loadExposure();
  }, [token, timeframe]);

  const toggleRegion = (regionId: string) => {
    setExpandedRegions(prev => ({
      ...prev,
      [regionId]: !prev[regionId],
    }));
  };

  const getExposureBadge = (level: ExposureLevel) => {
    switch (level) {
      case 'high':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            {t('progress.exposureHigh')}
          </span>
        );
      case 'moderate':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            {t('progress.exposureModerate')}
          </span>
        );
      case 'low':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700">
            {t('progress.exposureLow')}
          </span>
        );
    }
  };

  return (
    <div 
      data-surface="primary-metallic"
      className="rounded-3xl p-6 sm:p-7 bg-white dark:bg-[#141414] border border-neutral-300 dark:border-white/10 shadow-sm transition-all text-neutral-900 dark:text-white"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center gap-3">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display uppercase tracking-wide">
              {t('progress.muscleExposureTitle')}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {t('progress.muscleExposureSubtitle')}
            </p>
          </div>
        </div>

        {/* Timeframe Selector (session, week, month, all_time) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          {[
            { id: 'session', label: t('progress.timeframeSession') },
            { id: 'week', label: t('progress.timeframeWeek') },
            { id: 'month', label: t('progress.timeframeMonth') },
            { id: 'all_time', label: t('progress.timeframeAll') },
          ].map(tf => (
            <button
              key={tf.id}
              type="button"
              onClick={() => setTimeframe(tf.id as TimeframeType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer ${
                timeframe === tf.id
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mandatory Methodology & Estimates Notice per Step 5 specification */}
      <div className="p-3.5 my-4 rounded-2xl bg-neutral-100/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-600 dark:text-neutral-400">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <span className="font-medium leading-relaxed">
          <strong>Taxonomy Estimation Model:</strong> Muscle exposure aggregates discrete volume (weight × completed reps) weighted by validated primary, secondary, and stabilizer contribution percentages. All scores are labeled strictly with neutral classifications ({t('progress.exposureHigh')}, {t('progress.exposureModerate')}, {t('progress.exposureLow')}) as mathematical estimates.
        </span>
      </div>

      {/* Aggregate High-Level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            Workouts Analyzed
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {analytics?.totalAnalyzedWorkouts || 0}
            </span>
            <span className="text-xs font-mono text-neutral-400">sessions</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            Total Distributed Volume
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {analytics?.totalVolume ? analytics.totalVolume.toLocaleString() : 0}
            </span>
            <span className="text-xs font-mono text-neutral-400">kg</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            Total Completed Sets
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {analytics?.totalSets || 0}
            </span>
            <span className="text-xs font-mono text-neutral-400">sets</span>
          </div>
        </div>
      </div>

      {/* Main Data Breakdown: Anatomical Regions & Muscles (Data View, Visual Body Deferred per Step 5) */}
      <div className="space-y-6 pt-4">
        
        {/* Section A: Exposure by Anatomical Region */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-400" />
            <span>{t('progress.regionExposureTitle')}</span>
          </h3>

          <div className="space-y-2.5">
            {analytics?.regions && analytics.regions.length > 0 ? (
              analytics.regions.map((region: RegionExposureItem) => {
                const isExpanded = expandedRegions[region.regionId];
                return (
                  <div 
                    key={region.regionId}
                    className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 transition-all space-y-3"
                  >
                    <div 
                      onClick={() => toggleRegion(region.regionId)}
                      className="flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-neutral-900 dark:text-white text-sm font-display uppercase tracking-wide group-hover:text-blue-500 transition-colors">
                          {region.regionName}
                        </span>
                        {getExposureBadge(region.exposureLevel)}
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono">
                        <span className="text-neutral-600 dark:text-neutral-300 font-bold">
                          {region.totalVolume.toLocaleString()} kg
                        </span>
                        <span className="text-neutral-400 text-[11px] hidden sm:inline">
                          ({region.percentageOfTotal}% of total)
                        </span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                      </div>
                    </div>

                    {/* Progress track */}
                    <div className="h-2 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(100, region.percentageOfTotal * 2)}%`,
                          backgroundColor: region.exposureLevel === 'high' ? '#10b981' : (region.exposureLevel === 'moderate' ? accentColor : '#94a3b8')
                        }}
                      />
                    </div>

                    {/* Expandable Breakdown of Individual Muscles in this Region */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200/80 dark:divide-neutral-800/80 text-xs">
                        <div className="grid grid-cols-4 pb-2 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-athletic">
                          <span>Muscle</span>
                          <span>Common Name</span>
                          <span>Exposure Level</span>
                          <span className="text-right">Estimated Volume</span>
                        </div>
                        {region.muscles.map((m: MuscleExposureItem) => (
                          <div key={m.muscleId} className="py-2 grid grid-cols-4 items-center">
                            <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate">
                              {m.muscleName}
                            </span>
                            <span className="text-neutral-500 truncate text-[11px]">
                              {m.commonName}
                            </span>
                            <div>{getExposureBadge(m.exposureLevel)}</div>
                            <span className="font-mono text-neutral-900 dark:text-white font-bold text-right text-[11px]">
                              {m.totalVolume.toLocaleString()} kg
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-neutral-500 font-medium">
                {t('progress.noExposureData')}
              </div>
            )}
          </div>
        </div>

        {/* Section B: Top Stimulated Muscles */}
        {analytics?.topMuscles && analytics.topMuscles.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{t('progress.topMusclesTitle')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analytics.topMuscles.slice(0, 9).map((m: MuscleExposureItem, idx: number) => (
                <div 
                  key={m.muscleId}
                  className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-neutral-400 text-[10px]">
                        0{idx + 1}
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white truncate">
                        {m.muscleName}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500 capitalize block truncate">
                      {m.commonName} · {m.regionId}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-neutral-900 dark:text-white text-xs block">
                      {m.totalVolume.toLocaleString()}kg
                    </span>
                    {getExposureBadge(m.exposureLevel)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
