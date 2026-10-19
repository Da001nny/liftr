import React, { useState, useEffect, useMemo } from 'react';
import { Scale, TrendingUp, TrendingDown, Plus, Trash2, Calendar as CalendarIcon, Check, X, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { BodyweightEntryRow, BodyweightStats } from '../../types/database';
import { fetchBodyweightEntries, saveBodyweightEntry, deleteBodyweightEntry } from '../../lib/progressService';
import { calculateBodyweightStats } from '../../lib/calculations';
import { formatWeight, formatWeightValue, parseWeightInput } from '../../lib/units';

interface BodyweightSectionProps {
  onRefresh?: () => void;
}

export const BodyweightSection: React.FC<BodyweightSectionProps> = ({ onRefresh }) => {
  const { t } = useTranslation();
  const { accentColor, weightUnit } = useTheme();
  const { token } = useAuth();

  const [entries, setEntries] = useState<BodyweightEntryRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputDate, setInputDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [inputWeight, setInputWeight] = useState<string>('');
  const [inputUnit, setInputUnit] = useState<'kg' | 'lbs'>(weightUnit);
  const [inputNotes, setInputNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    setInputUnit(weightUnit);
  }, [weightUnit]);

  const loadData = async () => {
    if (!token) return;
    setLoading(true);
    const data = await fetchBodyweightEntries(token);
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const stats: BodyweightStats = useMemo(() => {
    return calculateBodyweightStats(entries);
  }, [entries]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isSubmitting) return;

    const canonicalKg = parseWeightInput(inputWeight, inputUnit);
    if (canonicalKg <= 0) return;

    setIsSubmitting(true);
    const res = await saveBodyweightEntry(token, {
      date: inputDate,
      weight: canonicalKg,
      unit: 'kg',
      notes: inputNotes.trim() || undefined,
      source: 'manual',
    });
    setIsSubmitting(false);

    if (res) {
      await loadData();
      setIsModalOpen(false);
      setInputWeight('');
      setInputNotes('');
      if (onRefresh) onRefresh();
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    const ok = await deleteBodyweightEntry(token, id);
    if (ok) {
      await loadData();
      if (onRefresh) onRefresh();
    }
  };

  // Chart coordinate calculations
  const chartPoints = useMemo(() => {
    if (stats.entries.length < 2) return [];
    const values = stats.entries.map(e => formatWeightValue(Number(e.weight), weightUnit));
    const minWeight = Math.min(...values);
    const maxWeight = Math.max(...values);
    const range = Math.max(1, maxWeight - minWeight);
    const padding = range * 0.15;
    const yMin = minWeight - padding;
    const yMax = maxWeight + padding;
    const yRange = Math.max(1, yMax - yMin);

    const width = 600;
    const height = 180;

    return stats.entries.map((entry, index) => {
      const val = formatWeightValue(Number(entry.weight), weightUnit);
      const x = (index / (stats.entries.length - 1)) * (width - 40) + 20;
      const y = height - 20 - ((val - yMin) / yRange) * (height - 40);
      return { x, y, weight: val, date: entry.date };
    });
  }, [stats.entries, weightUnit]);

  const svgPath = useMemo(() => {
    if (chartPoints.length < 2) return '';
    return chartPoints.reduce((acc, curr, idx) => {
      return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [chartPoints]);

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
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display uppercase tracking-wide">
              {t('progress.bodyweightSectionTitle')}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {t('progress.bodyweightSectionDesc')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setInputDate(new Date().toISOString().slice(0, 10));
            setInputWeight(stats.currentWeight ? String(stats.currentWeight) : '');
            setIsModalOpen(true);
          }}
          className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer font-athletic self-start sm:self-auto"
          style={{ backgroundColor: accentColor }}
        >
          <Plus className="w-4 h-4" />
          <span>{t('progress.logWeightBtn')}</span>
        </button>
      </div>

      {/* 5 Authoritative Metrics Row (Step 3: Current, Starting, Net Change, 7-day Avg, 30-day Trend) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 py-6">
        
        {/* Metric 1: Current Weight */}
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            {t('progress.currentWeightLabel')}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {stats.currentWeight !== null ? formatWeightValue(stats.currentWeight, weightUnit) : '—'}
            </span>
            <span className="text-xs font-mono text-neutral-400">{weightUnit}</span>
          </div>
        </div>

        {/* Metric 2: Starting Weight */}
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            {t('progress.startingWeightLabel')}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-800 dark:text-neutral-200">
              {stats.startingWeight !== null ? formatWeightValue(stats.startingWeight, weightUnit) : '—'}
            </span>
            <span className="text-xs font-mono text-neutral-400">{weightUnit}</span>
          </div>
        </div>

        {/* Metric 3: Net Change */}
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            {t('progress.netChangeLabel')}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
              stats.netChange === null 
                ? 'text-neutral-500' 
                : (stats.netChange > 0 
                  ? 'text-amber-500 dark:text-amber-400' 
                  : (stats.netChange < 0 ? 'text-blue-500 dark:text-blue-400' : 'text-neutral-800 dark:text-neutral-200'))
            }`}>
              {stats.netChange !== null 
                ? (stats.netChange > 0 ? `+${formatWeightValue(stats.netChange, weightUnit)}` : `${formatWeightValue(stats.netChange, weightUnit)}`)
                : '—'}
            </span>
            <span className="text-xs font-mono text-neutral-400">{weightUnit}</span>
          </div>
        </div>

        {/* Metric 4: 7-Day Average */}
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            {t('progress.sevenDayAvgLabel')}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {stats.sevenDayAverage !== null ? formatWeightValue(stats.sevenDayAverage, weightUnit) : '—'}
            </span>
            <span className="text-xs font-mono text-neutral-400">{weightUnit}</span>
          </div>
        </div>

        {/* Metric 5: 30-Day Trend */}
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-1 col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
            {t('progress.thirtyDayTrendLabel')}
          </span>
          <div className="flex items-baseline gap-1.5">
            {stats.thirtyDayTrend !== null ? (
              <>
                <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                  stats.thirtyDayTrend > 0 
                    ? 'text-amber-500 dark:text-amber-400' 
                    : (stats.thirtyDayTrend < 0 ? 'text-blue-500 dark:text-blue-400' : 'text-neutral-800 dark:text-neutral-200')
                }`}>
                  {stats.thirtyDayTrend > 0 ? `+${formatWeightValue(stats.thirtyDayTrend, weightUnit)}` : `${formatWeightValue(stats.thirtyDayTrend, weightUnit)}`}
                </span>
                <span className="text-xs font-mono text-neutral-400">{weightUnit}</span>
              </>
            ) : (
              <span className="text-xs sm:text-sm font-medium text-neutral-400 dark:text-neutral-500">
                {t('progress.notEnoughDataYet')}
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Bodyweight Trend Chart */}
      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs font-bold font-athletic uppercase text-neutral-500">
          <span>{t('progress.bodyweightTrendLine')}</span>
          <span className="font-mono text-[10px]">{stats.entries.length} {t('progress.dataPointsSuffix')}</span>
        </div>

        {chartPoints.length >= 2 ? (
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 600 180" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="bwGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="20" y1="30" x2="580" y2="30" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
              <line x1="20" y1="90" x2="580" y2="90" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />
              <line x1="20" y1="150" x2="580" y2="150" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3 3" />

              {/* Trend Path */}
              <path
                d={svgPath}
                fill="none"
                stroke={accentColor}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Circles */}
              {chartPoints.map((pt, i) => (
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
                    {pt.weight}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {stats.entries.length === 1 
              ? `Logged ${formatWeight(stats.entries[0].weight, weightUnit)} on ${stats.entries[0].date}. Add at least 2 entries to render the trend line.` 
              : t('progress.noWeightEntries')}
          </div>
        )}
      </div>

      {/* Logged Entries Table / History */}
      {stats.entries.length > 0 && (
        <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold font-athletic uppercase text-neutral-500">
            <span>{t('progress.recentWeighIns')}</span>
            <span>{stats.entries.length} {t('progress.totalSuffix')}</span>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-neutral-800 max-h-48 overflow-y-auto">
            {stats.entries.slice().reverse().map((entry) => (
              <div key={entry.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-neutral-500 text-[11px] font-semibold">{entry.date}</span>
                  <span className="font-mono font-bold text-neutral-900 dark:text-white">
                    {formatWeight(entry.weight, weightUnit)}
                  </span>
                  {entry.notes && (
                    <span className="text-neutral-500 truncate max-w-[200px] text-[11px]">
                      · {entry.notes}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  title={t('progress.deleteWeight')}
                  className="p-1 rounded text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Log Weight Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#161616] border border-neutral-300 dark:border-white/15 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 text-neutral-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <Scale className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black font-display uppercase tracking-wide">
                  {t('progress.logWeightModalTitle')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{t('progress.dateRequired')}</span>
                </label>
                <input
                  type="date"
                  required
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5" />
                    <span>{t('progress.weightRequired')}</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    min="1"
                    max="1000"
                    required
                    autoFocus
                    placeholder={t('progress.weightPlaceholder')}
                    value={inputWeight}
                    onChange={(e) => setInputWeight(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                    {t('progress.unitLabel')}
                  </label>
                  <select
                    value={inputUnit}
                    onChange={(e) => setInputUnit(e.target.value as 'kg' | 'lbs')}
                    className="w-full h-11 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                  {t('progress.notesLabel')}
                </label>
                <input
                  type="text"
                  placeholder={t('progress.bodyweightPlaceholder')}
                  value={inputNotes}
                  onChange={(e) => setInputNotes(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold font-athletic uppercase text-xs cursor-pointer"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-white font-bold font-athletic uppercase tracking-wider text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  style={{ backgroundColor: accentColor }}
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : t('progress.saveWeight')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
