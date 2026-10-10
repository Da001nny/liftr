import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Dumbbell, 
  ArrowLeftRight, 
  Calendar, 
  Layers, 
  Info, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { EXERCISES } from '../../data/exerciseCatalog';
import { 
  calculateCrossExerciseComparison,
  CrossExerciseComparison
} from '../../lib/calculations';
import { formatWeight, formatWeightValue } from '../../lib/units';

interface CrossExerciseSectionProps {
  workouts: any[];
}

type RangeOption = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';
type MetricChoice = 'estimated1RM' | 'totalVolume';

export const CrossExerciseSection: React.FC<CrossExerciseSectionProps> = ({ workouts }) => {
  const { t } = useTranslation();
  const { accentColor, weightUnit } = useTheme();

  // Exercise selection
  const [exerciseAId, setExerciseAId] = useState<string>(EXERCISES[0]?.id || 'ex_barbell_bench_press');
  const [exerciseBId, setExerciseBId] = useState<string>(EXERCISES[1]?.id || 'ex_dumbbell_incline_press');
  const [metric, setMetric] = useState<MetricChoice>('estimated1RM');
  const [range, setRange] = useState<RangeOption>('all');
  const [activeTooltip, setActiveTooltip] = useState<{
    date: string;
    valA: number | null;
    valB: number | null;
    x: number;
    y: number;
  } | null>(null);

  // Authoritative comparison calculation (strictly reuses Epley formula)
  const comparison: CrossExerciseComparison = useMemo(() => {
    return calculateCrossExerciseComparison(workouts, exerciseAId, exerciseBId, range);
  }, [workouts, exerciseAId, exerciseBId, range]);

  // Unified dates across both exercises
  const unifiedDates = useMemo(() => {
    const set = new Set<string>();
    comparison.exerciseA.points.forEach(p => set.add(p.date));
    comparison.exerciseB.points.forEach(p => set.add(p.date));
    return Array.from(set).sort();
  }, [comparison]);

  // Color tokens
  const colorA = '#3b82f6'; // Bright Blue
  const colorB = '#10b981'; // Emerald Green

  // SVG Multi-line coordinates
  const chartData = useMemo(() => {
    if (unifiedDates.length === 0) return null;

    // Collect all values to find global min & max
    const allVals: number[] = [];
    comparison.exerciseA.points.forEach(p => allVals.push(p[metric]));
    comparison.exerciseB.points.forEach(p => allVals.push(p[metric]));

    if (allVals.length === 0) return null;

    const minVal = Math.min(...allVals);
    const maxVal = Math.max(...allVals);
    const valRange = Math.max(1, maxVal - minVal);
    const padding = valRange * 0.15;
    const yMin = Math.max(0, minVal - padding);
    const yMax = maxVal + padding;
    const yRange = Math.max(1, yMax - yMin);

    const width = 640;
    const height = 200;

    // Maps date to X
    const getX = (date: string) => {
      if (unifiedDates.length === 1) return width / 2;
      const idx = unifiedDates.indexOf(date);
      return (idx / (unifiedDates.length - 1)) * (width - 60) + 30;
    };

    const getY = (val: number) => {
      return height - 30 - ((val - yMin) / yRange) * (height - 60);
    };

    // Series A points & path
    const pointsA = comparison.exerciseA.points.map(p => ({
      x: getX(p.date),
      y: getY(p[metric]),
      date: p.date,
      val: p[metric],
      name: p.workoutName,
    }));

    const pathA = pointsA.length >= 2 
      ? pointsA.reduce((acc, curr, idx) => idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`, '')
      : '';

    // Series B points & path
    const pointsB = comparison.exerciseB.points.map(p => ({
      x: getX(p.date),
      y: getY(p[metric]),
      date: p.date,
      val: p[metric],
      name: p.workoutName,
    }));

    const pathB = pointsB.length >= 2
      ? pointsB.reduce((acc, curr, idx) => idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`, '')
      : '';

    return {
      width,
      height,
      pointsA,
      pointsB,
      pathA,
      pathB,
      yMin: Math.round(yMin),
      yMax: Math.round(yMax),
    };
  }, [unifiedDates, comparison, metric]);

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
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-display uppercase tracking-wide">
                Cross-Exercise Comparison
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-athletic uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                Phase 6
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Overlay estimated 1RM (Epley) and volume curves across any two exercises
            </p>
          </div>
        </div>

        {/* Metric Selector Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setMetric('estimated1RM')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer ${
              metric === 'estimated1RM'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Estimated 1RM
          </button>
          <button
            type="button"
            onClick={() => setMetric('totalVolume')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer ${
              metric === 'totalVolume'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Session Volume
          </button>
        </div>
      </div>

      {/* Dual Exercise Pickers */}
      <div className="py-4 border-b border-neutral-200 dark:border-neutral-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Exercise A Picker */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorA }} />
            <span className="text-[11px] font-bold font-athletic uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Exercise A (Primary Series)
            </span>
          </div>
          <select
            value={exerciseAId}
            onChange={(e) => setExerciseAId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold font-athletic uppercase text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
          >
            {EXERCISES.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.equipment})
              </option>
            ))}
          </select>
        </div>

        {/* Exercise B Picker */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorB }} />
            <span className="text-[11px] font-bold font-athletic uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Exercise B (Comparison Series)
            </span>
          </div>
          <select
            value={exerciseBId}
            onChange={(e) => setExerciseBId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold font-athletic uppercase text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 truncate"
          >
            {EXERCISES.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.equipment})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 border-b border-neutral-200 dark:border-neutral-800/80">
        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <span className="text-[10px] font-bold font-athletic uppercase text-blue-600 dark:text-blue-400 block truncate">
            {comparison.exerciseA.name} Best 1RM
          </span>
          <span className="text-xl font-black font-display text-neutral-900 dark:text-white mt-0.5 block">
            {comparison.exerciseA.best1RM > 0 ? formatWeight(comparison.exerciseA.best1RM, weightUnit) : '—'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
          <span className="text-[10px] font-bold font-athletic uppercase text-blue-600 dark:text-blue-400 block truncate">
            {comparison.exerciseA.name} Sessions
          </span>
          <span className="text-xl font-black font-display text-neutral-900 dark:text-white mt-0.5 block">
            {comparison.exerciseA.points.length}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <span className="text-[10px] font-bold font-athletic uppercase text-emerald-600 dark:text-emerald-400 block truncate">
            {comparison.exerciseB.name} Best 1RM
          </span>
          <span className="text-xl font-black font-display text-neutral-900 dark:text-white mt-0.5 block">
            {comparison.exerciseB.best1RM > 0 ? formatWeight(comparison.exerciseB.best1RM, weightUnit) : '—'}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
          <span className="text-[10px] font-bold font-athletic uppercase text-emerald-600 dark:text-emerald-400 block truncate">
            {comparison.exerciseB.name} Sessions
          </span>
          <span className="text-xl font-black font-display text-neutral-900 dark:text-white mt-0.5 block">
            {comparison.exerciseB.points.length}
          </span>
        </div>
      </div>

      {/* Chart Canvas & Empty State Handling */}
      <div className="pt-6">
        {chartData && comparison.hasDataAtLeastOne ? (
          <div className="space-y-4">
            {/* Visual SVG Chart */}
            <div className="relative w-full overflow-x-auto">
              <svg 
                viewBox={`0 0 ${chartData.width} ${chartData.height}`} 
                className="w-full h-56 select-none"
              >
                {/* Horizontal Guide Lines */}
                <line x1="20" y1="20" x2={chartData.width - 20} y2="20" stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1="20" y1={chartData.height / 2} x2={chartData.width - 20} y2={chartData.height / 2} stroke="currentColor" strokeOpacity="0.08" strokeDasharray="3 3" />
                <line x1="20" y1={chartData.height - 30} x2={chartData.width - 20} y2={chartData.height - 30} stroke="currentColor" strokeOpacity="0.15" />

                {/* Series A Path & Area */}
                {chartData.pathA && (
                  <path
                    d={chartData.pathA}
                    fill="none"
                    stroke={colorA}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Series A Points */}
                {chartData.pointsA.map((pt, i) => (
                  <circle
                    key={`ptA_${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill={colorA}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                  />
                ))}

                {/* Series B Path & Area */}
                {chartData.pathB && (
                  <path
                    d={chartData.pathB}
                    fill="none"
                    stroke={colorB}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )}

                {/* Series B Points */}
                {chartData.pointsB.map((pt, i) => (
                  <circle
                    key={`ptB_${i}`}
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill={colorB}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="cursor-pointer hover:r-6 transition-all"
                  />
                ))}
              </svg>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorA }} />
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {comparison.exerciseA.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colorB }} />
                  <span className="font-bold text-neutral-800 dark:text-neutral-200">
                    {comparison.exerciseB.name}
                  </span>
                </div>
              </div>

              <span className="text-[11px] font-mono text-neutral-400 font-semibold">
                Metric: {metric === 'estimated1RM' ? `Estimated 1RM (${weightUnit})` : `Volume (${weightUnit})`}
              </span>
            </div>

            {/* Partial Empty State Notice (if only one has history) */}
            {!comparison.hasDataBoth && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 flex items-center gap-3">
                <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-xs font-medium">
                  {comparison.statusMessage}. Log workouts with this movement to render both progression curves simultaneously.
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="py-12 px-4 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <AlertCircle className="w-8 h-8 text-neutral-400 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 font-athletic uppercase tracking-wider">
              No History Recorded Yet
            </h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Neither {comparison.exerciseA.name} nor {comparison.exerciseB.name} has completed workout sets logged yet. Complete workouts in the Workouts tab to begin generating comparison curves.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
