import React, { useState, useEffect } from 'react';
import { Footprints, Target, Plus, Check, TrendingUp, Calendar as CalendarIcon, X } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { StepEntryRow } from '../../types/database';
import { fetchStepEntry, saveStepEntry } from '../../lib/progressService';

interface ActivitySectionProps {
  onRefresh?: () => void;
}

export const ActivitySection: React.FC<ActivitySectionProps> = ({ onRefresh }) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [stepData, setStepData] = useState<StepEntryRow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [inputSteps, setInputSteps] = useState<string>('');
  const [inputGoal, setInputGoal] = useState<string>('10000');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const loadSteps = async (date: string) => {
    if (!token) return;
    setLoading(true);
    const data = await fetchStepEntry(token, date);
    setStepData(data);
    if (data) {
      setInputSteps(String(data.step_count));
      setInputGoal(String(data.goal));
    } else {
      setInputSteps('');
      setInputGoal('10000');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSteps(selectedDate);
  }, [token, selectedDate]);

  const handleSaveSteps = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isSubmitting) return;

    const count = parseInt(inputSteps, 10);
    const goalVal = parseInt(inputGoal, 10) || 10000;
    if (isNaN(count) || count < 0) return;

    setIsSubmitting(true);
    const result = await saveStepEntry(token, {
      date: selectedDate,
      stepCount: count,
      goal: goalVal,
      source: 'manual',
    });
    setIsSubmitting(false);

    if (result) {
      setStepData(result);
      setIsModalOpen(false);
      if (onRefresh) onRefresh();
    }
  };

  const steps = stepData?.step_count || 0;
  const goal = stepData?.goal || 10000;
  const progressPercent = Math.min(100, Math.round((steps / goal) * 100));
  const isGoalReached = steps >= goal && goal > 0;

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
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black font-display uppercase tracking-wide">
              {t('progress.activitySectionTitle')}
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Architected for future wearable integrations with manual daily tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="h-9 px-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => {
              setInputSteps(String(steps));
              setInputGoal(String(goal));
              setIsModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer font-athletic"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-4 h-4" />
            <span>{t('progress.logStepsBtn')}</span>
          </button>
        </div>
      </div>

      {/* Main Activity Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center">
        
        {/* Metric 1: Step Count */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
            <Footprints className="w-3.5 h-3.5 text-blue-500" />
            <span>{selectedDate === todayStr ? t('progress.todayStepsLabel') : `Steps for ${selectedDate}`}</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
              {loading ? '...' : steps.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
              steps
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block">
            {isGoalReached 
              ? 'Goal achieved! Exceptional daily energy output.' 
              : `${Math.max(0, goal - steps).toLocaleString()} steps remaining to hit target.`}
          </span>
        </div>

        {/* Metric 2: Target Goal */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-purple-500" />
            <span>{t('progress.stepGoalLabel')}</span>
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-neutral-800 dark:text-neutral-200">
              {goal.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
              daily target
            </span>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium block">
            Source: <span className="font-mono uppercase font-bold text-[10px] text-neutral-700 dark:text-neutral-300">{stepData?.source || 'manual'}</span>
          </span>
        </div>

        {/* Metric 3: Visual Progress Ring / Bar */}
        <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold font-athletic uppercase">
            <span className="text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>{t('progress.stepProgressLabel')}</span>
            </span>
            <span className="font-mono text-neutral-900 dark:text-white text-sm">
              {progressPercent}%
            </span>
          </div>

          {/* Progress Track */}
          <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${progressPercent}%`,
                backgroundColor: isGoalReached ? '#10b981' : accentColor 
              }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
            <span>0</span>
            <span>{Math.round(goal / 2).toLocaleString()}</span>
            <span>{goal.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Log Steps Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-[#161616] border border-neutral-300 dark:border-white/15 rounded-3xl shadow-2xl p-6 sm:p-7 space-y-5 text-neutral-900 dark:text-white">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white"
                  style={{ backgroundColor: accentColor }}
                >
                  <Footprints className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-black font-display uppercase tracking-wide">
                  {t('progress.logStepsModalTitle')}
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

            <form onSubmit={handleSaveSteps} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5" />
                  <span>Step Count *</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  required
                  autoFocus
                  placeholder={t('progress.stepsPlaceholder')}
                  value={inputSteps}
                  onChange={(e) => setInputSteps(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5" />
                  <span>Daily Goal</span>
                </label>
                <input
                  type="number"
                  min="1000"
                  step="500"
                  required
                  placeholder={t('progress.goalPlaceholder')}
                  value={inputGoal}
                  onChange={(e) => setInputGoal(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-bold font-athletic uppercase text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl text-white font-bold font-athletic uppercase tracking-wider text-xs shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                  style={{ backgroundColor: accentColor }}
                >
                  <Check className="w-4 h-4" />
                  <span>{isSubmitting ? 'Saving...' : t('progress.saveSteps')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
