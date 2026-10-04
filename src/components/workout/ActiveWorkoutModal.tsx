import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Dumbbell, 
  X, 
  Check, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Minimize2, 
  Maximize2, 
  Flame, 
  Clock, 
  Trophy, 
  Timer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  ActiveWorkoutSession, 
  ActiveWorkoutExercise, 
  ActiveWorkoutSet,
  SetType,
  PersonalRecordRow
} from '../../types/database';
import { 
  calculateEstimated1RM, 
  calculateSingleSetVolume, 
  calculateTotalSessionVolume 
} from '../../lib/calculations';
import { 
  updateWorkoutSession, 
  completeWorkoutSession, 
  deleteWorkoutSession 
} from '../../lib/workoutService';
import { ExercisePickerModal } from './ExercisePickerModal';
import { RestTimerBar } from './RestTimerBar';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { Exercise } from '../../data/exerciseCatalog';

interface ActiveWorkoutModalProps {
  session: ActiveWorkoutSession;
  onSessionUpdated: (session: ActiveWorkoutSession) => void;
  onSessionClosed: () => void;
  onWorkoutCompleted?: (workout: any, newPRs: PersonalRecordRow[]) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  session,
  onSessionUpdated,
  onSessionClosed,
  onWorkoutCompleted,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [isMinimized, setIsMinimized] = useState(false);
  const [workoutName, setWorkoutName] = useState(session.name);
  const [notes, setNotes] = useState(session.notes || '');
  const [exercises, setExercises] = useState<ActiveWorkoutExercise[]>(session.exercises || []);
  const [elapsedSeconds, setElapsedSeconds] = useState(session.duration_seconds || 0);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isDiscardDialogOpen, setIsDiscardDialogOpen] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [completionResult, setCompletionResult] = useState<{ workout: any; newPRs: PersonalRecordRow[] } | null>(null);

  // Rest Timer State
  const defaultRest = 90;
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTotal, setRestTotal] = useState(defaultRest);
  const [isRestActive, setIsRestActive] = useState(false);

  // Elapsed Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rest Countdown effect
  useEffect(() => {
    if (!isRestActive || restRemaining <= 0) return;

    const interval = setInterval(() => {
      setRestRemaining(prev => {
        if (prev <= 1) {
          setIsRestActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRestActive, restRemaining]);

  // Periodic Auto-save in progress workout every 15 seconds
  const autoSaveRef = useRef({ workoutName, notes, exercises, elapsedSeconds });
  autoSaveRef.current = { workoutName, notes, exercises, elapsedSeconds };

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      const current = autoSaveRef.current;
      updateWorkoutSession(token, session.id, {
        name: current.workoutName,
        notes: current.notes,
        durationSeconds: current.elapsedSeconds,
        exercises: current.exercises,
      }).catch(err => console.warn('[AutoSave] failed:', err));
    }, 15000);

    return () => clearInterval(interval);
  }, [token, session.id]);

  // Calculate live session statistics using authoritative engine
  const liveStats = useMemo(() => {
    let completedSetsCount = 0;
    const completedWorkingSets: Array<{ weight: number; reps: number }> = [];

    exercises.forEach(ex => {
      ex.sets.forEach(s => {
        if (s.completed) {
          completedSetsCount++;
          if (s.set_type !== 'warmup' && s.weight > 0 && s.reps > 0) {
            completedWorkingSets.push({ weight: s.weight, reps: s.reps });
          }
        }
      });
    });

    const totalVolume = calculateTotalSessionVolume(completedWorkingSets);
    return {
      completedSetsCount,
      totalVolume,
    };
  }, [exercises]);

  const handleStartRestTimer = (seconds?: number | null) => {
    const duration = seconds || defaultRest;
    setRestTotal(duration);
    setRestRemaining(duration);
    setIsRestActive(true);
  };

  const handleToggleSetCompleted = (exerciseIndex: number, setIndex: number) => {
    setExercises(prev => {
      const next = [...prev];
      const targetEx = { ...next[exerciseIndex] };
      const nextSets = [...targetEx.sets];
      const targetSet = { ...nextSets[setIndex] };

      const willBeCompleted = !targetSet.completed;
      targetSet.completed = willBeCompleted;
      targetSet.completed_at = willBeCompleted ? new Date().toISOString() : null;

      nextSets[setIndex] = targetSet;
      targetEx.sets = nextSets;
      next[exerciseIndex] = targetEx;

      // Trigger Rest timer if set was marked completed
      if (willBeCompleted) {
        handleStartRestTimer(targetEx.rest_timer_seconds);
      }

      return next;
    });
  };

  const handleUpdateSet = (
    exerciseIndex: number, 
    setIndex: number, 
    field: keyof ActiveWorkoutSet, 
    value: any
  ) => {
    setExercises(prev => {
      const next = [...prev];
      const targetEx = { ...next[exerciseIndex] };
      const nextSets = [...targetEx.sets];
      nextSets[setIndex] = {
        ...nextSets[setIndex],
        [field]: value,
      };
      targetEx.sets = nextSets;
      next[exerciseIndex] = targetEx;
      return next;
    });
  };

  const handleAddSet = (exerciseIndex: number) => {
    setExercises(prev => {
      const next = [...prev];
      const targetEx = { ...next[exerciseIndex] };
      const lastSet = targetEx.sets[targetEx.sets.length - 1];

      const newSet: ActiveWorkoutSet = {
        id: `temp_set_${Date.now()}_${Math.random()}`,
        workout_exercise_id: targetEx.id,
        set_number: targetEx.sets.length + 1,
        set_type: lastSet ? lastSet.set_type : 'working',
        weight: lastSet ? lastSet.weight : 0,
        reps: lastSet ? lastSet.reps : 10,
        rir: null,
        completed: false,
        completed_at: null,
        created_at: new Date().toISOString(),
      };

      targetEx.sets = [...targetEx.sets, newSet];
      next[exerciseIndex] = targetEx;
      return next;
    });
  };

  const handleDeleteSet = (exerciseIndex: number, setIndex: number) => {
    setExercises(prev => {
      const next = [...prev];
      const targetEx = { ...next[exerciseIndex] };
      targetEx.sets = targetEx.sets
        .filter((_, idx) => idx !== setIndex)
        .map((s, idx) => ({ ...s, set_number: idx + 1 }));
      next[exerciseIndex] = targetEx;
      return next;
    });
  };

  const handleAddExercise = (exercise: Exercise) => {
    const newEx: ActiveWorkoutExercise = {
      id: `temp_we_${Date.now()}_${Math.random()}`,
      workout_id: session.id,
      exercise_id: exercise.id,
      exerciseName: exercise.name,
      exerciseTargetRegion: exercise.targetRegionId,
      order_index: exercises.length,
      notes: '',
      rest_timer_seconds: defaultRest,
      created_at: new Date().toISOString(),
      sets: [
        {
          id: `temp_set_${Date.now()}_1`,
          workout_exercise_id: '',
          set_number: 1,
          set_type: 'working',
          weight: 0,
          reps: 10,
          rir: null,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
        },
        {
          id: `temp_set_${Date.now()}_2`,
          workout_exercise_id: '',
          set_number: 2,
          set_type: 'working',
          weight: 0,
          reps: 10,
          rir: null,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
        },
        {
          id: `temp_set_${Date.now()}_3`,
          workout_exercise_id: '',
          set_number: 3,
          set_type: 'working',
          weight: 0,
          reps: 10,
          rir: null,
          completed: false,
          completed_at: null,
          created_at: new Date().toISOString(),
        },
      ],
    };

    setExercises(prev => [...prev, newEx]);
  };

  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === exercises.length - 1) return;

    setExercises(prev => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const next = [...prev];
      const temp = next[index];
      next[index] = next[targetIndex];
      next[targetIndex] = temp;
      return next.map((ex, idx) => ({ ...ex, order_index: idx }));
    });
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, idx) => idx !== index));
  };

  // Finish Workout
  const handleFinishWorkout = async () => {
    if (!token) return;
    setIsFinishing(true);

    const result = await completeWorkoutSession(token, session.id, {
      durationSeconds: elapsedSeconds,
      notes,
      exercises,
    });

    setIsFinishing(false);

    if (result) {
      setCompletionResult(result);
      if (onWorkoutCompleted) {
        onWorkoutCompleted(result.workout, result.newPRs);
      }
    } else {
      onSessionClosed();
    }
  };

  // Discard Workout (via in-app confirmation modal)
  const handleConfirmDiscard = async () => {
    if (!token) return;
    await deleteWorkoutSession(token, session.id);
    setIsDiscardDialogOpen(false);
    onSessionClosed();
  };

  // Format elapsed time HH:MM:SS
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // --------------------------------------------------------------------------
  // MINIMIZED FLOATING BANNER
  // Allows user to navigate tabs without losing workout session
  // --------------------------------------------------------------------------
  if (isMinimized) {
    return (
      <>
        <div 
          onClick={() => setIsMinimized(false)}
          className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl p-3 sm:p-4 rounded-2xl bg-[#161616] border border-white/20 shadow-2xl text-white flex items-center justify-between gap-4 cursor-pointer hover:border-white/30 transition-all animate-slideUp group"
          data-surface="primary-metallic"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 relative"
              style={{ backgroundColor: accentColor }}
            >
              <Dumbbell className="w-5 h-5 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#161616]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-400">
                  {t('workoutLogger.minimizedBanner')}
                </span>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {formatTime(elapsedSeconds)}
                </span>
              </div>
              <h4 className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs font-display uppercase tracking-wide">
                {workoutName}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right pr-2">
              <span className="text-xs font-mono font-bold block text-neutral-300">
                {liveStats.totalVolume} kg
              </span>
              <span className="text-[10px] text-neutral-500 font-athletic uppercase tracking-wider">
                {liveStats.completedSetsCount} sets done
              </span>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(false);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center gap-1.5"
            >
              <span>{t('workoutLogger.resumeWorkout')}</span>
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Floating Rest Timer Bar if active */}
        <RestTimerBar
          remainingSeconds={restRemaining}
          totalSeconds={restTotal}
          isActive={isRestActive}
          onAdjustSeconds={(delta) => setRestRemaining(prev => Math.max(0, prev + delta))}
          onTogglePause={() => setIsRestActive(prev => !prev)}
          onSkip={() => {
            setRestRemaining(0);
            setIsRestActive(false);
          }}
        />
      </>
    );
  }

  // --------------------------------------------------------------------------
  // WORKOUT COMPLETION CELEBRATION MODAL
  // --------------------------------------------------------------------------
  if (completionResult) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
        <div 
          className="w-full max-w-lg bg-[#161616] border border-white/20 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-white text-center"
          data-surface="primary-metallic"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
            <Trophy className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide">
              {t('workoutLogger.completionModalTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium">
              {t('workoutLogger.completionModalSubtitle')}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3 py-2 border-y border-neutral-800">
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-athletic">
                {t('workouts.durationLabel')}
              </span>
              <p className="text-lg font-black font-stat">
                {formatTime(completionResult.workout.duration_seconds)}
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-athletic">
                {t('workouts.volumeLabel')}
              </span>
              <p className="text-lg font-black font-stat text-emerald-400">
                {completionResult.workout.total_volume} kg
              </p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-athletic">
                {t('workouts.setsCountLabel')}
              </span>
              <p className="text-lg font-black font-stat">
                {liveStats.completedSetsCount}
              </p>
            </div>
          </div>

          {/* New PRs Awarded */}
          {completionResult.newPRs.length > 0 ? (
            <div className="space-y-2 text-left bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold font-athletic uppercase tracking-wider text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t('workoutLogger.newPRsTitle')} ({completionResult.newPRs.length})</span>
              </div>
              <div className="space-y-1.5 divide-y divide-neutral-800/60">
                {completionResult.newPRs.map((pr, idx) => (
                  <div key={idx} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-300 font-display">
                      {pr.exercise_id.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono font-bold text-amber-300">
                      {pr.value} {pr.category === 'rep_pr' ? `reps @ ${pr.reps}kg` : 'kg'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-neutral-500 font-medium italic">
              {t('workoutLogger.noPRsInSession')}
            </p>
          )}

          <button
            type="button"
            onClick={onSessionClosed}
            className="w-full py-3 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider text-white shadow-lg transition-transform active:scale-[0.98] cursor-pointer"
            style={{ backgroundColor: accentColor }}
          >
            {t('workoutLogger.closeCompletion')}
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // FULL WORKOUT TAKEOVER MODAL
  // --------------------------------------------------------------------------
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/90 backdrop-blur-md overflow-hidden animate-fadeIn">
      {/* Top Bar Header */}
      <div 
        className="w-full bg-[#121214] border-b border-neutral-800 px-4 sm:px-6 py-3.5 flex items-center justify-between shrink-0 shadow-lg text-white"
        data-surface="primary-metallic"
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ backgroundColor: accentColor }}
          >
            <Dumbbell className="w-5 h-5" />
          </div>

          <div>
            <input
              type="text"
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="text-base sm:text-lg font-black font-display uppercase tracking-wide bg-transparent border-b border-transparent hover:border-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
            />
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-medium">
              <span className="flex items-center gap-1 font-mono text-emerald-400 font-bold">
                <Clock className="w-3.5 h-3.5" />
                {formatTime(elapsedSeconds)}
              </span>
              <span>·</span>
              <span className="font-mono text-neutral-300">
                {liveStats.totalVolume} kg vol
              </span>
              <span>·</span>
              <span>{liveStats.completedSetsCount} sets</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Minimize Button */}
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            title="Minimize to background"
          >
            <Minimize2 className="w-5 h-5" />
          </button>

          {/* Discard Button */}
          <button
            type="button"
            onClick={() => setIsDiscardDialogOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            {t('workoutLogger.discardWorkout')}
          </button>

          {/* Finish Button */}
          <button
            type="button"
            onClick={handleFinishWorkout}
            disabled={isFinishing}
            className="px-4 py-2 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            style={{ backgroundColor: accentColor }}
          >
            {isFinishing ? 'Saving...' : t('workoutLogger.finishWorkout')}
          </button>
        </div>
      </div>

      {/* Exercises Canvas (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-4xl w-full mx-auto space-y-6 pb-32">
        {/* Notes input */}
        <div className="bg-[#18181b] border border-neutral-800 rounded-2xl p-3.5">
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('workoutLogger.workoutNotesPlaceholder')}
            className="w-full bg-transparent text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none font-medium"
          />
        </div>

        {/* Exercise Cards */}
        {exercises.map((ex, exIdx) => {
          return (
            <div 
              key={ex.id}
              className="bg-[#18181b] border border-neutral-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-md text-white transition-all"
            >
              {/* Exercise Card Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold font-display uppercase tracking-wide text-neutral-100">
                    {ex.exerciseName || ex.exercise_id}
                  </h3>
                  {ex.exerciseTargetRegion && (
                    <span className="text-[10px] font-bold font-athletic uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400">
                      {ex.exerciseTargetRegion}
                    </span>
                  )}
                </div>

                {/* Reorder and Delete Controls */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleMoveExercise(exIdx, 'up')}
                    disabled={exIdx === 0}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                    title={t('workoutLogger.reorderUp')}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveExercise(exIdx, 'down')}
                    disabled={exIdx === exercises.length - 1}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
                    title={t('workoutLogger.reorderDown')}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveExercise(exIdx)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer ml-1"
                    title={t('workoutLogger.removeExercise')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sets Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-neutral-400 font-athletic uppercase tracking-wider text-[11px] border-b border-neutral-800/80">
                      <th className="py-2 px-2 w-12 text-center">{t('workoutLogger.setCol')}</th>
                      <th className="py-2 px-2 w-28 text-center">{t('workoutLogger.weightCol', { unit: 'kg' })}</th>
                      <th className="py-2 px-2 w-20 text-center">{t('workoutLogger.repsCol')}</th>
                      <th className="py-2 px-2 w-16 text-center">{t('workoutLogger.rirCol')}</th>
                      <th className="py-2 px-2 w-14 text-center">{t('workoutLogger.checkCol')}</th>
                      <th className="py-2 px-1 w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/40">
                    {ex.sets.map((set, setIdx) => {
                      const est1RM = calculateEstimated1RM(set.weight, set.reps);
                      return (
                        <tr 
                          key={set.id || setIdx}
                          className={`transition-colors ${set.completed ? 'bg-emerald-950/20' : 'hover:bg-neutral-800/30'}`}
                        >
                          {/* Set Number & Type Toggle */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => {
                                const types: SetType[] = ['working', 'warmup', 'drop', 'failure'];
                                const nextIdx = (types.indexOf(set.set_type) + 1) % types.length;
                                handleUpdateSet(exIdx, setIdx, 'set_type', types[nextIdx]);
                              }}
                              className={`w-7 h-7 rounded-lg text-[11px] font-bold font-athletic transition-colors cursor-pointer ${
                                set.set_type === 'warmup' 
                                  ? 'bg-amber-500/20 text-amber-400' 
                                  : set.set_type === 'drop'
                                  ? 'bg-purple-500/20 text-purple-400'
                                  : set.set_type === 'failure'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-neutral-800 text-neutral-300'
                              }`}
                              title="Click to toggle set type"
                            >
                              {set.set_type === 'warmup' ? 'W' : set.set_type === 'drop' ? 'D' : set.set_type === 'failure' ? 'F' : set.set_number}
                            </button>
                          </td>

                          {/* Weight */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              step="0.5"
                              value={set.weight === 0 ? '' : set.weight}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'weight', parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              className="w-20 px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </td>

                          {/* Reps */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              value={set.reps === 0 ? '' : set.reps}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'reps', parseInt(e.target.value, 10) || 0)}
                              placeholder="0"
                              className="w-16 px-2 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-center font-mono font-bold text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </td>

                          {/* RIR (Optional) */}
                          <td className="py-2.5 px-2 text-center">
                            <input
                              type="number"
                              step="0.5"
                              value={set.rir === null || set.rir === undefined ? '' : set.rir}
                              onChange={(e) => handleUpdateSet(exIdx, setIdx, 'rir', e.target.value === '' ? null : parseFloat(e.target.value))}
                              placeholder="-"
                              className="w-12 px-1 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-center font-mono text-xs text-neutral-300 focus:outline-none focus:border-blue-500"
                              title="Reps in reserve"
                            />
                          </td>

                          {/* Completed Checkbox */}
                          <td className="py-2.5 px-2 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSetCompleted(exIdx, setIdx)}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                set.completed 
                                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30' 
                                  : 'bg-neutral-800 text-neutral-500 hover:text-white hover:bg-neutral-700'
                              }`}
                            >
                              <Check className="w-4 h-4 stroke-[3]" />
                            </button>
                          </td>

                          {/* Delete Set */}
                          <td className="py-2.5 px-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteSet(exIdx, setIdx)}
                              className="text-neutral-600 hover:text-red-400 p-1 transition-colors cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add Set Button */}
              <button
                type="button"
                onClick={() => handleAddSet(exIdx)}
                className="w-full py-2 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('workoutLogger.addSet')}</span>
              </button>
            </div>
          );
        })}

        {/* Add Exercise Trigger Button */}
        <button
          type="button"
          onClick={() => setIsPickerOpen(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed border-neutral-700 hover:border-neutral-500 bg-neutral-900/40 hover:bg-neutral-900/80 text-neutral-300 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer font-bold font-athletic uppercase tracking-wider text-xs"
        >
          <Plus className="w-4 h-4" />
          <span>{t('workoutLogger.addExercise')}</span>
        </button>
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelectExercise={handleAddExercise}
      />

      {/* Discard Confirmation Dialog (In-app, no window.confirm) */}
      <ConfirmDialog
        isOpen={isDiscardDialogOpen}
        title={t('workoutLogger.confirmDiscardTitle')}
        message={t('workoutLogger.confirmDiscardMessage')}
        confirmLabel={t('workoutLogger.discardBtn')}
        cancelLabel={t('workoutLogger.cancelBtn')}
        isDestructive={true}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setIsDiscardDialogOpen(false)}
      />

      {/* Integrated Rest Timer Bar */}
      <RestTimerBar
        remainingSeconds={restRemaining}
        totalSeconds={restTotal}
        isActive={isRestActive}
        onAdjustSeconds={(delta) => setRestRemaining(prev => Math.max(0, prev + delta))}
        onTogglePause={() => setIsRestActive(prev => !prev)}
        onSkip={() => {
          setRestRemaining(0);
          setIsRestActive(false);
        }}
      />
    </div>
  );
};
