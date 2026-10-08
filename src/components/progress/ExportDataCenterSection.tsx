import React, { useState } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Scale, 
  Footprints,
  ExternalLink,
  Table
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  generateWorkoutsCsv, 
  generateBodyweightCsv, 
  generateStepsCsv 
} from '../../lib/calculations';
import { 
  fetchAllCompletedWorkouts, 
  fetchBodyweightEntries, 
  fetchAllStepEntries,
  triggerBrowserDownload 
} from '../../lib/progressService';

interface ExportDataCenterSectionProps {
  workouts: any[];
}

export const ExportDataCenterSection: React.FC<ExportDataCenterSectionProps> = ({ workouts }) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportWorkouts = async () => {
    if (!token) return;
    setDownloading('workouts');
    try {
      // Use loaded workouts or fetch freshest
      const list = workouts.length > 0 ? workouts : await fetchAllCompletedWorkouts(token);
      const csv = generateWorkoutsCsv(list);
      const filename = `liftr_workout_history_${new Date().toISOString().slice(0, 10)}.csv`;
      triggerBrowserDownload(filename, csv);
      setDownloadSuccess('workouts');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Workouts CSV export failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handleExportBodyweight = async () => {
    if (!token) return;
    setDownloading('bodyweight');
    try {
      const entries = await fetchBodyweightEntries(token);
      const csv = generateBodyweightCsv(entries);
      const filename = `liftr_bodyweight_${new Date().toISOString().slice(0, 10)}.csv`;
      triggerBrowserDownload(filename, csv);
      setDownloadSuccess('bodyweight');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Bodyweight CSV export failed:', err);
    } finally {
      setDownloading(null);
    }
  };

  const handleExportSteps = async () => {
    if (!token) return;
    setDownloading('steps');
    try {
      const entries = await fetchAllStepEntries(token);
      const csv = generateStepsCsv(entries);
      const filename = `liftr_steps_activity_${new Date().toISOString().slice(0, 10)}.csv`;
      triggerBrowserDownload(filename, csv);
      setDownloadSuccess('steps');
      setTimeout(() => setDownloadSuccess(null), 3000);
    } catch (err) {
      console.error('Steps CSV export failed:', err);
    } finally {
      setDownloading(null);
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
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-display uppercase tracking-wide">
                Data &amp; CSV Export Center
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-athletic uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Premium Infrastructure
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              RFC 4180 compliant CSV files with UTF-8 BOM encoding for Microsoft Excel &amp; Google Sheets
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Full Data Sovereignty</span>
        </div>
      </div>

      {/* 3 Export Cards */}
      <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Workouts History (Set-by-Set) */}
        <div 
          data-surface="secondary-flat"
          className="p-5 rounded-2xl bg-neutral-100/90 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <Layers className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                Set-by-Set
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                Workout Sets History
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-relaxed">
                One discrete row per set containing completed load, volume, and Epley estimated 1RM.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 space-y-1">
              <div className="font-bold text-neutral-700 dark:text-neutral-300">Schema Headers:</div>
              <div className="truncate text-neutral-400">
                Date, Workout, Exercise, Set Type, Weight, Reps, Volume, Estimated 1RM
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportWorkouts}
            disabled={downloading === 'workouts'}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold font-athletic uppercase text-xs tracking-wider transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {downloadSuccess === 'workouts' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Downloaded!</span>
              </>
            ) : downloading === 'workouts' ? (
              <span>Preparing CSV...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Workouts CSV</span>
              </>
            )}
          </button>
        </div>

        {/* Card 2: Bodyweight Entries */}
        <div 
          data-surface="secondary-flat"
          className="p-5 rounded-2xl bg-neutral-100/90 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                <Scale className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                Daily Weigh-ins
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                Bodyweight Ledger
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-relaxed">
                Complete historical record of scale weigh-ins with notes, timestamp, and source metadata.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 space-y-1">
              <div className="font-bold text-neutral-700 dark:text-neutral-300">Schema Headers:</div>
              <div className="truncate text-neutral-400">
                Date, Weight, Unit, Notes, Source
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportBodyweight}
            disabled={downloading === 'bodyweight'}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold font-athletic uppercase text-xs tracking-wider transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {downloadSuccess === 'bodyweight' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Downloaded!</span>
              </>
            ) : downloading === 'bodyweight' ? (
              <span>Preparing CSV...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Bodyweight CSV</span>
              </>
            )}
          </button>
        </div>

        {/* Card 3: Steps & Activity Entries */}
        <div 
          data-surface="secondary-flat"
          className="p-5 rounded-2xl bg-neutral-100/90 dark:bg-[#181818] border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                <Footprints className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                Daily Movement
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                Steps &amp; Activity
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-relaxed">
                Daily step logs, step goals, and synchronization source metadata.
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 space-y-1">
              <div className="font-bold text-neutral-700 dark:text-neutral-300">Schema Headers:</div>
              <div className="truncate text-neutral-400">
                Date, Steps, Goal, Source
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExportSteps}
            disabled={downloading === 'steps'}
            className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold font-athletic uppercase text-xs tracking-wider transition-all hover:opacity-90 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {downloadSuccess === 'steps' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
                <span>Downloaded!</span>
              </>
            ) : downloading === 'steps' ? (
              <span>Preparing CSV...</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Export Steps CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spreadsheet Compatibility Notice */}
      <div className="mt-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-400">
        <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-neutral-900 dark:text-white font-athletic uppercase tracking-wider block">
            Spreadsheet Compatibility &amp; Escaping
          </strong>
          <p className="leading-relaxed">
            All exported CSV files include a UTF-8 Byte Order Mark (<code className="font-mono text-[11px] px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800">U+FEFF</code>) to guarantee proper character rendering when opened directly in Microsoft Excel (Windows/Mac) and Google Sheets. All quotes, commas, and multiline notes follow strict RFC 4180 escaping rules.
          </p>
        </div>
      </div>
    </div>
  );
};
