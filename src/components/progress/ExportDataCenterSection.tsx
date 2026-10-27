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
import { getUserTimeZone, todayLocalDateKey } from '../../lib/dates';
import { 
  fetchAllCompletedWorkouts, 
  fetchBodyweightEntries, 
  fetchAllStepEntries,
  triggerBrowserDownload 
} from '../../lib/progressService';
import { reportFailure } from '../../lib/failure';

import {
  getWorkoutsCsvHeaderPreview,
  getBodyweightCsvHeaderPreview,
  STEPS_CSV_HEADER_PREVIEW
} from '../../constants/csvHeaders';

interface ExportDataCenterSectionProps {
  workouts: any[];
}

export async function performWorkoutsExport(
  token: string,
  workouts: any[],
  weightUnit: 'kg' | 'lbs',
  options: {
    fetchWorkouts: (token: string) => Promise<any>;
    download: (filename: string, content: string) => void;
    reportError: (action: any, input: any) => void;
    timeZone?: string;
  }
): Promise<boolean> {
  const userTz = options.timeZone || getUserTimeZone();
  let list = workouts;
  if (list.length === 0) {
    const result = await options.fetchWorkouts(token);
    if (result.data === null) {
      options.reportError('exportData', { status: result.status, networkError: result.networkError });
      return false;
    }
    list = result.data;
  }
  const csv = generateWorkoutsCsv(list, weightUnit, userTz);
  const filename = `liftr_workout_history_${todayLocalDateKey(userTz)}.csv`;
  options.download(filename, csv);
  return true;
}

export const ExportDataCenterSection: React.FC<ExportDataCenterSectionProps> = ({ workouts }) => {
  const { t } = useTranslation();
  const { accentColor, weightUnit } = useTheme();
  const { token } = useAuth();

  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleExportWorkouts = async () => {
    if (!token) return;
    setDownloading('workouts');
    try {
      const success = await performWorkoutsExport(token, workouts, weightUnit, {
        fetchWorkouts: fetchAllCompletedWorkouts,
        download: triggerBrowserDownload,
        reportError: reportFailure,
      });
      if (success) {
        setDownloadSuccess('workouts');
        setTimeout(() => setDownloadSuccess(null), 3000);
      }
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
      const csv = generateBodyweightCsv(entries, weightUnit);
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
                {t('progress.exportDataCenterTitle')}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold font-athletic uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {t('progress.exportInfrastructureBadge')}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {t('progress.exportSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 font-semibold self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{t('progress.fullDataSovereignty')}</span>
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
                {t('progress.exportCardWorkoutsBadge')}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                {t('progress.exportCardWorkoutsTitle')}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-relaxed">
                {t('progress.exportCardWorkoutsDesc')}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 space-y-1">
              <div className="font-bold text-neutral-700 dark:text-neutral-300">{t('progress.schemaHeaders')}</div>
              <div className="truncate text-neutral-400">
                {getWorkoutsCsvHeaderPreview(weightUnit)}
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
                <span>{t('progress.downloaded')}</span>
              </>
            ) : downloading === 'workouts' ? (
              <span>{t('progress.preparingCsv')}</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('progress.exportWorkoutsCsv')}</span>
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
                {t('progress.exportCardBodyweightBadge')}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                {t('progress.exportCardBodyweightTitle')}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-relaxed">
                {t('progress.exportCardBodyweightDesc')}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 space-y-1">
              <div className="font-bold text-neutral-700 dark:text-neutral-300">{t('progress.schemaHeaders')}</div>
              <div className="truncate text-neutral-400">
                {getBodyweightCsvHeaderPreview(weightUnit)}
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
                <span>{t('progress.downloaded')}</span>
              </>
            ) : downloading === 'bodyweight' ? (
              <span>{t('progress.preparingCsv')}</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('progress.exportBodyweightCsv')}</span>
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
                {t('progress.exportCardStepsBadge')}
              </span>
            </div>

            <div>
              <h3 className="text-sm font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                {t('progress.exportCardStepsTitle')}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-relaxed">
                {t('progress.exportCardStepsDesc')}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-[10px] font-mono text-neutral-500 space-y-1">
              <div className="font-bold text-neutral-700 dark:text-neutral-300">{t('progress.schemaHeaders')}</div>
              <div className="truncate text-neutral-400">
                {STEPS_CSV_HEADER_PREVIEW}
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
                <span>{t('progress.downloaded')}</span>
              </>
            ) : downloading === 'steps' ? (
              <span>{t('progress.preparingCsv')}</span>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>{t('progress.exportStepsCsv')}</span>
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
            {t('progress.spreadsheetCompatibilityTitle')}
          </strong>
          <p className="leading-relaxed">
            {t('progress.spreadsheetCompatibilityNotice', { bom: 'U+FEFF' })}
          </p>
        </div>
      </div>
    </div>
  );
};
