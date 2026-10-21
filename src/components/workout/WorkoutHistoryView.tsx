import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Flame, 
  Dumbbell, 
  Trash2, 
  Trophy, 
  ChevronDown, 
  ChevronUp,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { WorkoutRow, PersonalRecordRow } from '../../types/database';
import { fetchWorkouts, deleteWorkoutSession, fetchPersonalRecords } from '../../lib/workoutService';
import { formatLocalTimestamp } from '../../lib/calculations';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatWeight, formatPRDisplay } from '../../lib/units';
import { getExerciseName } from '../../lib/labels';

interface WorkoutHistoryViewProps {
  onRefreshTrigger?: number;
}

export const WorkoutHistoryView: React.FC<WorkoutHistoryViewProps> = ({ onRefreshTrigger }) => {
  const { t, tn } = useTranslation();
  const { accentColor, weightUnit } = useTheme();
  const { token } = useAuth();

  const [workouts, setWorkouts] = useState<WorkoutRow[]>([]);
  const [prs, setPrs] = useState<PersonalRecordRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedWorkoutId, setExpandedWorkoutId] = useState<string | null>(null);
  const [workoutToDelete, setWorkoutToDelete] = useState<WorkoutRow | null>(null);

  const loadHistory = async () => {
    if (!token) return;
    setLoading(true);
    const [workoutsRes, prsRes] = await Promise.all([
      fetchWorkouts(token, 1, 50),
      fetchPersonalRecords(token),
    ]);
    // Filter to completed workouts
    setWorkouts(workoutsRes.items.filter(w => w.status === 'completed'));
    setPrs(prsRes);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, [token, onRefreshTrigger]);

  const handleDeleteWorkout = async () => {
    if (!token || !workoutToDelete) return;
    const ok = await deleteWorkoutSession(token, workoutToDelete.id);
    if (ok) {
      setWorkouts(prev => prev.filter(w => w.id !== workoutToDelete.id));
      // Reload PRs to reflect retroactive PR recalculation!
      const refreshedPRs = await fetchPersonalRecords(token);
      setPrs(refreshedPRs);
    }
    setWorkoutToDelete(null);
  };

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

  if (loading) {
    return (
      <div className="py-16 text-center text-neutral-500 space-y-2">
        <Dumbbell className="w-8 h-8 animate-spin mx-auto text-neutral-400" />
        <p className="text-xs font-medium font-athletic uppercase tracking-wider">
          {t('workouts.loadingHistory')}
        </p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return (
      <div 
        data-surface="secondary-flat"
        className="rounded-2xl p-10 text-center bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-500 space-y-3"
      >
        <div className="w-12 h-12 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold font-display uppercase tracking-wide text-neutral-900 dark:text-white">
            {t('workouts.noHistory')}
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            {t('workouts.noHistoryDesc')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
            {t('workouts.historyTitle')}
          </h2>
          <span className="text-xs text-neutral-500 font-medium font-athletic uppercase tracking-wider">
            {tn('workouts.completedSessionsCount', workouts.length)}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {workouts.map(workout => {
          const isExpanded = expandedWorkoutId === workout.id;
          const workoutPRs = prs.filter(pr => pr.workout_id === workout.id);

          return (
            <div
              key={workout.id}
              data-surface="primary-metallic"
              className="rounded-2xl bg-[#f5f5f7] dark:bg-[#161616] border border-neutral-200/90 dark:border-white/10 p-4 sm:p-5 text-neutral-900 dark:text-white shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-500">
                      {formatLocalTimestamp(workout.completed_at || workout.started_at)}
                    </span>
                    {workoutPRs.length > 0 && (
                      <span className="flex items-center gap-1 text-[10px] font-black font-athletic uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        <Trophy className="w-3 h-3" />
                        <span>{tn('workouts.prsCount', workoutPRs.length)}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide">
                    {workout.name}
                  </h3>
                </div>

                {/* Right side metrics & actions */}
                <div className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto">
                  <div className="flex items-center gap-4 font-stat">
                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold font-athletic block">
                        {t('workouts.volumeLabel')}
                      </span>
                      <span className="text-sm sm:text-base font-black text-neutral-900 dark:text-emerald-400">
                        {formatWeight(workout.total_volume, weightUnit)}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 uppercase font-bold font-athletic block">
                        {t('workouts.durationLabel')}
                      </span>
                      <span className="text-sm sm:text-base font-black text-neutral-900 dark:text-white">
                        {formatDuration(workout.duration_seconds)}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setWorkoutToDelete(workout)}
                    className="p-2 rounded-xl text-neutral-400 hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title={t('workouts.deleteWorkout')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Workout PR list preview if any */}
              {workoutPRs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 font-athletic flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>{t('workouts.recordsLabel')}</span>
                  </span>
                  {workoutPRs.map((pr, idx) => (
                    <span 
                      key={idx} 
                      className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                    >
                      {getExerciseName(pr.exercise_id)}: {formatPRDisplay(pr, weightUnit)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* In-App Delete Workout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={workoutToDelete !== null}
        title={t('workoutLogger.confirmDeleteWorkoutTitle')}
        message={t('workoutLogger.confirmDeleteWorkoutMessage')}
        confirmLabel={t('workoutLogger.deleteBtn')}
        cancelLabel={t('workoutLogger.cancelBtn')}
        isDestructive={true}
        onConfirm={handleDeleteWorkout}
        onCancel={() => setWorkoutToDelete(null)}
      />
    </div>
  );
};
