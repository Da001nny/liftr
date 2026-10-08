import React, { useState, useEffect, useMemo } from 'react';
import { Dumbbell, TrendingUp, Trophy, Calendar, Filter, ChevronDown, Award } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { EXERCISES } from '../../data/exerciseCatalog';
import { ExerciseProgressPoint } from '../../types/database';
import { fetchExerciseProgressData } from '../../lib/progressService';

type MetricType = 'estimated1RM' | 'heaviestWeight' | 'maxReps' | 'totalVolume';
type RangeType = '7d' | '30d' | '3m' | '6m' | '1y' | 'all';

export const ExerciseProgressSection: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  // Selected Exercise (defaults to first popular exercise like Barbell Bench Press)
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(EXERCISES[0]?.id || '');
  const [metric, setMetric] = useState<MetricType>('estimated1RM');
  const [range, setRange] = useState<RangeType>('all');
  const [points, setPoints] = useState<ExerciseProgressPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchFilter, setSearchFilter] = useState<string>('');

  const selectedExercise = useMemo(() => {
    return EXERCISES.find(ex => ex.id === selectedExerciseId);
  }, [selectedExerciseId]);

  const loadData = async () => {
    if (!token || !selectedExerciseId) return;
    setLoading(true);
    const data = await fetchExerciseProgressData(token, selectedExerciseId, range);
    setPoints(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [token, selectedExerciseId, range]);

  // Max / Best value across the points
  const bestMetricValue = useMemo(() => {
    if (points.length === 0) return 0;
    return Math.max(...points.map(p => Number(p[metric])));
  }, [points, metric]);

  const latestPoint = points[points.length - 1];

  // SVG Chart points
  const chartCoordinates = useMemo(() => {
    if (points.length < 2) return [];
    const values = points.map(p => Number(p[metric]));
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const valRange = Math.max(1, maxVal - minVal);
    const padding = valRange * 0.15;
    const yMin = Math.max(0, minVal - padding);
    const yMax = maxVal + padding;
    const yRange = yMax - yMin;

    const width = 600;
    const height = 180;

    return points.map((p, index) => {
      const x = (index / (points.length - 1)) * (width - 40) + 20;
      const y = height - 25 - ((Number(p[metric]) - yMin) / yRange) * (height - 50);
      return {
        x,
        y,
        val: Number(p[metric]),
        date: p.date,
        workoutName: p.workoutName,
      };
    });
  }, [points, metric]);

  const svgPath = useMemo(() => {
    if (chartCoordinates.length < 2) return '';
    return chartCoordinates.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [chartCoordinates]);

  const filteredExercises = useMemo(() => {
    if (!searchFilter.trim()) return EXERCISES.slice(0, 50);
    const q = searchFilter.toLowerCase();
    return EXERCISES.filter(ex => ex.name.toLowerCase().includes(q) || ex.targetRegionId.includes(q)).slice(0, 50);
  }, [searchFilter]);

  const metricLabel = useMemo(() => {
    switch (metric) {
      case 'estimated1RM': return t('progress.metricEstimated1RM');
      case 'heaviestWeight': return t('progress.metricHeaviestWeight');
      case 'maxReps': return t('progress.metricMaxReps');
      case 'totalVolume': return t('progress.metricVolume');
    }
  }, [metric, t]);

  const metricUnit = useMemo(() => {
    switch (metric) {
      case 'estimated1RM':
      case 'heaviestWeight':
      case 'totalVolume':
        return 'kg';
      case 'maxReps':
        return 'reps';
    }
  }, [metric]);

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
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display uppercase tracking-wide">
              {t('progress.exerciseChartsSectionTitle')}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Epley 1RM trajectory, heaviest load, max reps, and session volume
            </p>
          </div>
        </div>

        {/* Exercise Selector */}
        <div className="flex items-center gap-2 max-w-xs w-full">
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="w-full h-10 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-bold font-athletic uppercase text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 truncate"
          >
            {filteredExercises.map(ex => (
              <option key={ex.id} value={ex.id}>
                {ex.name} ({ex.equipment})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Controls Bar: Metric Selector + Range Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-5 border-b border-neutral-200 dark:border-neutral-800/80">
        {/* Metric Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start">
          {[
            { id: 'estimated1RM', label: '1RM (Epley)' },
            { id: 'heaviestWeight', label: 'Heaviest Load' },
            { id: 'maxReps', label: 'Max Reps' },
            { id: 'totalVolume', label: 'Volume' },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMetric(tab.id as MetricType)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer ${
                metric === tab.id
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Range Filters: 7d, 30d, 3m, 6m, 1y, all */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 self-start">
          {[
            { id: '7d', label: '7D' },
            { id: '30d', label: '30D' },
            { id: '3m', label: '3M' },
            { id: '6m', label: '6M' },
            { id: '1y', label: '1Y' },
            { id: 'all', label: 'ALL' },
          ].map(r => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id as RangeType)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer ${
                range === r.id
                  ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Stats Callout */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5">
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            Current / Latest Value
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {latestPoint ? latestPoint[metric] : '—'}
            </span>
            <span className="text-xs font-mono text-neutral-400">{metricUnit}</span>
          </div>
          <span className="text-[11px] text-neutral-400 block truncate">
            {latestPoint ? `${latestPoint.date} · ${latestPoint.workoutName}` : 'No sessions recorded'}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic flex items-center gap-1">
            <Trophy className="w-3 h-3 text-yellow-500" />
            <span>Peak Milestone in Window</span>
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {bestMetricValue > 0 ? bestMetricValue : '—'}
            </span>
            <span className="text-xs font-mono text-neutral-400">{metricUnit}</span>
          </div>
          <span className="text-[11px] text-neutral-400 block">
            {points.length} logged sessions in timeframe
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            Exercise Classification
          </span>
          <div className="text-sm font-bold text-neutral-800 dark:text-neutral-200 truncate">
            {selectedExercise?.name}
          </div>
          <span className="text-xs text-neutral-500 capitalize block">
            {selectedExercise?.targetRegionId} · {selectedExercise?.movementType} · {selectedExercise?.equipment}
          </span>
        </div>
      </div>

      {/* Strength Curve SVG Chart */}
      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold font-athletic uppercase text-neutral-500">
          <span>{metricLabel} Curve</span>
          <span className="font-mono text-[10px]">{points.length} sessions logged</span>
        </div>

        {chartCoordinates.length >= 2 ? (
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 180" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="exGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1="20" y1="30" x2="580" y2="30" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
              <line x1="20" y1="90" x2="580" y2="90" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
              <line x1="20" y1="150" x2="580" y2="150" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />

              <path
                d={svgPath}
                fill="none"
                stroke={accentColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {chartCoordinates.map((pt, i) => (
                <g key={i}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    className="fill-white dark:fill-neutral-900 stroke-2 cursor-pointer transition-transform hover:scale-150"
                    stroke={accentColor}
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 10}
                    textAnchor="middle"
                    className="text-[9px] font-mono fill-neutral-600 dark:fill-neutral-300 font-bold"
                  >
                    {pt.val}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {points.length === 1 
              ? `Logged 1 session on ${points[0].date} (${points[0][metric]} ${metricUnit}). Complete additional workouts to render the trajectory curve.`
              : t('progress.noDataForExercise')}
          </div>
        )}
      </div>

      {/* Session Breakdown History */}
      {points.length > 0 && (
        <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold font-athletic uppercase text-neutral-500">
            <span>Logged Performance Entries</span>
            <span>{points.length} entries</span>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 max-h-52 overflow-y-auto">
            {points.slice().reverse().map((pt) => (
              <div key={pt.workoutId} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-neutral-500 text-[11px] font-semibold">{pt.date}</span>
                  <span className="font-bold text-neutral-900 dark:text-white truncate max-w-[160px] sm:max-w-none">
                    {pt.workoutName}
                  </span>
                </div>

                <div className="flex items-center gap-4 font-mono text-[11px]">
                  <span><strong className="text-neutral-400 font-normal">1RM:</strong> {pt.estimated1RM}kg</span>
                  <span><strong className="text-neutral-400 font-normal">Load:</strong> {pt.heaviestWeight}kg</span>
                  <span><strong className="text-neutral-400 font-normal">Reps:</strong> {pt.maxReps}</span>
                  <span className="hidden sm:inline"><strong className="text-neutral-400 font-normal">Vol:</strong> {pt.totalVolume}kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
