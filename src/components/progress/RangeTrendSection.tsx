import React, { useState, useMemo } from 'react';
import { 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  Filter, 
  AlertCircle, 
  Dumbbell, 
  Compass, 
  BarChart3,
  CheckCircle2
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { EXERCISES, MUSCLE_REGIONS } from '../../data/exerciseCatalog';
import { 
  calculateRangeTrendComparison, 
  getPresetComparisonPeriods,
  TrendFilter, 
  TrendPeriodSpec,
  TrendPeriodPresetId
} from '../../lib/calculations';
import { formatWeight, formatWeightValue } from '../../lib/units';
import { getEquipmentLabel, getRegionLabel } from '../../lib/labels';

interface RangeTrendSectionProps {
  workouts: any[];
}

type PresetType = 'this_month_vs_last_month' | 'last_30_days' | 'last_7_days' | 'custom';
type FilterTypeOption = 'total_volume' | 'exercise' | 'region';

export const RangeTrendSection: React.FC<RangeTrendSectionProps> = ({ workouts }) => {
  const { t } = useTranslation();
  const { accentColor, weightUnit } = useTheme();

  const [preset, setPreset] = useState<PresetType>('this_month_vs_last_month');
  const [filterType, setFilterType] = useState<FilterTypeOption>('total_volume');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('ex_barbell_bench_press');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('chest');

  // Custom date state (fallback default to current 30 days)
  const defaultPresets = useMemo(() => getPresetComparisonPeriods('last_30_days'), []);
  const [customPeriodA, setCustomPeriodA] = useState<TrendPeriodSpec>(defaultPresets.periodA);
  const [customPeriodB, setCustomPeriodB] = useState<TrendPeriodSpec>(defaultPresets.periodB);

  // Active periods based on preset
  const { activePeriodA, activePeriodB } = useMemo(() => {
    if (preset === 'custom') {
      return { activePeriodA: customPeriodA, activePeriodB: customPeriodB };
    }
    const p = getPresetComparisonPeriods(preset);
    return { activePeriodA: p.periodA, activePeriodB: p.periodB };
  }, [preset, customPeriodA, customPeriodB]);

  // Active filter
  const activeFilter: TrendFilter = useMemo(() => {
    if (filterType === 'exercise') {
      return { type: 'exercise', exerciseId: selectedExerciseId };
    }
    if (filterType === 'region') {
      return { type: 'region', regionId: selectedRegionId };
    }
    return { type: 'total_volume' };
  }, [filterType, selectedExerciseId, selectedRegionId]);

  // Authoritative calculation
  const trendResult = useMemo(() => {
    return calculateRangeTrendComparison(workouts, activePeriodA, activePeriodB, activeFilter);
  }, [workouts, activePeriodA, activePeriodB, activeFilter]);

  const isPositive = trendResult.percentageChange !== null && trendResult.percentageChange >= 0;
  const isNegative = trendResult.percentageChange !== null && trendResult.percentageChange < 0;
  const displayTarget = trendResult.targetName || t('workouts.volumeLabel');

  const getTrendStatusText = (): string => {
    switch (trendResult.status.code) {
      case 'insufficientDataBoth':
        return t('progress.trendStatusInsufficientDataBoth');
      case 'insufficientDataComparison':
        return t('progress.trendStatusInsufficientDataComparison');
      case 'insufficientDataSelected':
        return t('progress.trendStatusInsufficientDataSelected');
      case 'success':
        return trendResult.percentageChange !== null
          ? (trendResult.percentageChange >= 0 ? `+${trendResult.percentageChange}%` : `${trendResult.percentageChange}%`)
          : '';
      default: {
        const _exhaustiveCheck: never = trendResult.status.code;
        return _exhaustiveCheck;
      }
    }
  };

  const getPresetPeriodLabel = (presetId?: TrendPeriodPresetId, fallbackKey?: 'progress.periodACurrent' | 'progress.periodBBaseline'): string => {
    if (!presetId) return fallbackKey ? t(fallbackKey) : '';
    switch (presetId) {
      case 'thisMonth':
        return t('progress.periodThisMonth');
      case 'lastMonth':
        return t('progress.periodLastMonth');
      case 'last30':
        return t('progress.periodLast30');
      case 'prior30':
        return t('progress.periodPrior30');
      case 'last7':
        return t('progress.periodLast7');
      case 'prior7':
        return t('progress.periodPrior7');
      default: {
        const _exhaustiveCheck: never = presetId;
        return _exhaustiveCheck;
      }
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
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-display uppercase tracking-wide">
                {t('progress.trendRangeComparisonsTitle')}
              </h2>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {t('progress.trendRangeComparisonsSubtitle')}
            </p>
          </div>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          {[
            { id: 'this_month_vs_last_month', label: t('progress.presetThisVsLastMonth') },
            { id: 'last_30_days', label: t('progress.preset30dVsPrior') },
            { id: 'last_7_days', label: t('progress.preset7dVsPrior') },
            { id: 'custom', label: t('progress.presetCustom') },
          ].map(p => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPreset(p.id as PresetType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer ${
                preset === p.id
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Pickers (if Custom is chosen) */}
      {preset === 'custom' && (
        <div className="py-4 px-4 my-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-[11px] font-bold font-athletic uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              {t('progress.periodATargetWindow')}
            </span>
            <div className="flex items-center gap-2">
              <input 
                type="date"
                value={customPeriodA.startDate}
                onChange={(e) => setCustomPeriodA(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
              />
              <span className="text-xs text-neutral-400 font-bold">{t('progress.dateRangeSeparator')}</span>
              <input 
                type="date"
                value={customPeriodA.endDate}
                onChange={(e) => setCustomPeriodA(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-bold font-athletic uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
              {t('progress.periodBComparisonWindow')}
            </span>
            <div className="flex items-center gap-2">
              <input 
                type="date"
                value={customPeriodB.startDate}
                onChange={(e) => setCustomPeriodB(prev => ({ ...prev, startDate: e.target.value }))}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
              />
              <span className="text-xs text-neutral-400 font-bold">{t('progress.dateRangeSeparator')}</span>
              <input 
                type="date"
                value={customPeriodB.endDate}
                onChange={(e) => setCustomPeriodB(prev => ({ ...prev, endDate: e.target.value }))}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-mono"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filter Target Selector: Total Volume | Specific Exercise | Muscle Region */}
      <div className="py-4 border-b border-neutral-200 dark:border-neutral-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-500">
            {t('progress.compareTargetLabel')}
          </span>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            {[
              { id: 'total_volume', label: t('progress.targetTotalVolume'), icon: Layers },
              { id: 'exercise', label: t('progress.targetExercise'), icon: Dumbbell },
              { id: 'region', label: t('progress.targetRegion'), icon: Compass },
            ].map(f => {
              const Icon = f.icon;
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilterType(f.id as FilterTypeOption)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                    filterType === f.id
                      ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic target pickers */}
        {filterType === 'exercise' && (
          <div className="flex items-center gap-2 min-w-[260px]">
            <select
              value={selectedExerciseId}
              onChange={(e) => setSelectedExerciseId(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold font-athletic uppercase text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EXERCISES.map(ex => (
                <option key={ex.id} value={ex.id}>
                  {ex.name} ({getEquipmentLabel(ex.equipment)})
                </option>
              ))}
            </select>
          </div>
        )}

        {filterType === 'region' && (
          <div className="flex items-center gap-2 min-w-[220px]">
            <select
              value={selectedRegionId}
              onChange={(e) => setSelectedRegionId(e.target.value)}
              className="w-full h-9 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold font-athletic uppercase text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {MUSCLE_REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>
                  {getRegionLabel(reg.id, reg.name)} {t('progress.regionSuffix')}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Results Display */}
      <div className="pt-6 space-y-6">
        {/* Comparison Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Period A Card */}
          <div 
            data-surface="secondary-flat"
            className="p-5 rounded-2xl bg-neutral-100/90 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                {getPresetPeriodLabel(trendResult.periodA.presetId, 'progress.periodACurrent')}
              </span>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">
                {trendResult.periodA.startDate} → {trendResult.periodA.endDate}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-athletic uppercase font-bold block">
                {t('progress.targetVolumeHeading', { target: displayTarget })}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-display tracking-tight text-neutral-900 dark:text-white">
                  {formatWeightValue(trendResult.periodA.volume, weightUnit).toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">{weightUnit}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80 text-neutral-500 font-medium">
              <span>{t('progress.workoutsCount')} <strong className="text-neutral-900 dark:text-white font-mono">{trendResult.periodA.workoutCount}</strong></span>
              <span>{t('progress.workingSetsCount')} <strong className="text-neutral-900 dark:text-white font-mono">{trendResult.periodA.workingSetsCount}</strong></span>
            </div>
          </div>

          {/* Period B Card */}
          <div 
            data-surface="secondary-flat"
            className="p-5 rounded-2xl bg-neutral-100/90 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-300 dark:border-neutral-700">
                {getPresetPeriodLabel(trendResult.periodB.presetId, 'progress.periodBBaseline')}
              </span>
              <span className="text-[11px] font-mono text-neutral-500 font-semibold">
                {trendResult.periodB.startDate} → {trendResult.periodB.endDate}
              </span>
            </div>
            <div>
              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-athletic uppercase font-bold block">
                {t('progress.targetVolumeHeading', { target: displayTarget })}
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-black font-display tracking-tight text-neutral-900 dark:text-white">
                  {formatWeightValue(trendResult.periodB.volume, weightUnit).toLocaleString()}
                </span>
                <span className="text-xs font-mono font-bold text-neutral-500">{weightUnit}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-200/80 dark:border-neutral-800/80 text-neutral-500 font-medium">
              <span>{t('progress.workoutsCount')} <strong className="text-neutral-900 dark:text-white font-mono">{trendResult.periodB.workoutCount}</strong></span>
              <span>{t('progress.workingSetsCount')} <strong className="text-neutral-900 dark:text-white font-mono">{trendResult.periodB.workingSetsCount}</strong></span>
            </div>
          </div>
        </div>

        {/* Change Banner / Empty State */}
        {trendResult.hasEnoughData ? (
          <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isPositive
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
              : isNegative
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
              : 'bg-neutral-100 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isPositive ? 'bg-emerald-500 text-white' : isNegative ? 'bg-rose-500 text-white' : 'bg-neutral-500 text-white'
              }`}>
                {(() => {
                  if (isPositive) return <ArrowUpRight className="w-5 h-5" />;
                  if (isNegative) return <ArrowDownRight className="w-5 h-5" />;
                  return <Layers className="w-5 h-5" />;
                })()}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider block font-athletic">
                  {t('progress.comparativeDeltaHeading', { target: displayTarget })}
                </span>
                <p className="text-xs font-medium opacity-90 mt-0.5">
                  {isPositive
                    ? t('progress.deltaPositiveNotice', {
                        change: formatWeight(trendResult.absoluteChange, weightUnit),
                        percent: String(trendResult.percentageChange)
                      })
                    : isNegative
                    ? t('progress.deltaNegativeNotice', {
                        change: formatWeight(trendResult.absoluteChange, weightUnit),
                        percent: String(trendResult.percentageChange)
                      })
                    : t('progress.deltaEqualNotice')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-end sm:self-auto">
              <span className="text-lg font-black font-mono">
                {trendResult.absoluteChange !== null && trendResult.absoluteChange >= 0 ? '+' : ''}{formatWeight(trendResult.absoluteChange, weightUnit)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-black font-mono ${
                isPositive ? 'bg-emerald-500 text-white' : isNegative ? 'bg-rose-500 text-white' : 'bg-neutral-600 text-white'
              }`}>
                {getTrendStatusText()}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div className="text-xs font-medium">
              <strong className="font-bold block font-athletic uppercase tracking-wider">
                {t('progress.notEnoughDataYet')}
              </strong>
              <span>
                {t('progress.notEnoughDataDesc', { status: getTrendStatusText() })}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
