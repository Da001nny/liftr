import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Play, 
  Pause, 
  Check, 
  X, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  Maximize2, 
  Minimize2, 
  Timer, 
  Dumbbell, 
  Flame, 
  Sparkles, 
  Award, 
  ArrowUpRight,
  MoveUp,
  MoveDown,
  RotateCcw,
  Clock,
  Layers,
  HelpCircle
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { 
  LoggedWorkout, 
  LoggedExercise, 
  LoggedSet, 
  generateUUID, 
  completeAndSaveWorkout,
  saveActiveWorkoutSession,
  getPreviousExerciseSets
} from '../../lib/workoutService';
import { 
  calculateEstimated1RM, 
  calculateSingleSetVolume, 
  calculateTotalSessionVolume,
  calculateCompletedWorkingSetsCount,
  calculateCompletedWorkingRepsCount
} from '../../lib/calculations';
import { ExercisePickerModal } from './ExercisePickerModal';
import { RestTimerBar } from './RestTimerBar';
import { ConfirmModal } from '../common/ConfirmModal';
import { EnrichedExercise } from '../../lib/exerciseService';
import { SetType, PersonalRecordRow } from '../../types/database';

interface ActiveWorkoutModalProps {
  isOpen: boolean;
  isMinimized: boolean;
  onMinimize: () => void;
  onMaximize: () => void;
  onClose: () => void;
  onWorkoutCompleted: (saved: LoggedWorkout, prs: PersonalRecordRow[]) => void;
  workout: LoggedWorkout;
  onUpdateWorkout: (updated: LoggedWorkout) => void;
}

export const ActiveWorkoutModal: React.FC<ActiveWorkoutModalProps> = ({
  isOpen,
  isMinimized,
  onMinimize,
  onMaximize,
  onClose,
  onWorkoutCompleted,
  workout,
  onUpdateWorkout,
}) => {
  const { t } = useTranslation();
  const { accentColor, restTimerDefaults } = useTheme();

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(workout.duration_seconds || 0);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState<boolean>(false);
  
  // Rest Timer State
  const [restTimerSeconds, setRestTimerSeconds] = useState<number>(0);
  const [restTimerActive, setRestTimerActive] = useState<boolean>(false);
  const [currentRestExerciseName, setCurrentRestExerciseName] = useState<string>('');

  // Confirmation Modals State (Strict rule: In-app confirmation dialog, NO window.confirm)
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Historical previous values cache: exerciseId -> LoggedSet[]
  const [previousSetsMap, setPreviousSetsMap] = useState<Record<string, LoggedSet[]>>({});

  // Elapsed timer ticker
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        const next = prev + 1;
        // Periodically sync duration to workout
        if (next % 5 === 0) {
          onUpdateWorkout({
            ...workout,
            duration_seconds: next,
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onUpdateWorkout, workout]);

  // Load previous suggestions for exercises in this workout
  useEffect(() => {
    if (!isOpen || !workout.user_id) return;
    const loadSuggestions = async () => {
      const map: Record<string, LoggedSet[]> = {};
      for (const ex of workout.exercises) {
        if (!previousSetsMap[ex.exercise_id]) {
          const sets = await getPreviousExerciseSets(ex.exercise_id, workout.user_id);
          map[ex.exercise_id] = sets;
        }
      }
      if (Object.keys(map).length > 0) {
        setPreviousSetsMap(prev => ({ ...prev, ...map }));
      }
    };
    loadSuggestions();
  }, [isOpen, workout.exercises, workout.user_id, previousSetsMap]);

  // Format elapsed time as HH:MM:SS or MM:SS
  const formattedDuration = useMemo(() => {
    const hrs = Math.floor(elapsedSeconds / 3600);
    const mins = Math.floor((elapsedSeconds % 3600) / 60);
    const secs = elapsedSeconds % 60;
    if (hrs > 0) {
      return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, [elapsedSeconds]);

  // Live client-side totals
  const allSets = useMemo(() => workout.exercises.flatMap(e => e.sets), [workout.exercises]);
  const liveVolume = useMemo(() => calculateTotalSessionVolume(allSets), [allSets]);
  const liveCompletedSets = useMemo(() => calculateCompletedWorkingSetsCount(allSets), [allSets]);
  const liveCompletedReps = useMemo(() => calculateCompletedWorkingRepsCount(allSets), [allSets]);

  // Handle adding an exercise
  const handleAddExercise = (exercise: EnrichedExercise) => {
    // Default rest timer for compound vs isolation
    const isCompound = exercise.movement_type === 'Compound';
    const defaultRest = isCompound 
      ? (restTimerDefaults?.compoundRestSeconds || 180)
      : (restTimerDefaults?.defaultRestSeconds || 90);

    const prevSets = previousSetsMap[exercise.id] || [];

    const newExercise: LoggedExercise = {
      id: generateUUID(),
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      target_region_id: exercise.target_region_id,
      order_index: workout.exercises.length,
      rest_timer_seconds: defaultRest,
      notes: '',
      sets: [
        {
          id: generateUUID(),
          set_number: 1,
          set_type: 'working',
          weight: prevSets[0]?.weight || 0,
          reps: prevSets[0]?.reps || 10,
          is_completed: false,
          estimated_1rm: 0,
          volume: 0,
        },
        {
          id: generateUUID(),
          set_number: 2,
          set_type: 'working',
          weight: prevSets[1]?.weight || prevSets[0]?.weight || 0,
          reps: prevSets[1]?.reps || 10,
          is_completed: false,
          estimated_1rm: 0,
          volume: 0,
        },
        {
          id: generateUUID(),
          set_number: 3,
          set_type: 'working',
          weight: prevSets[2]?.weight || prevSets[0]?.weight || 0,
          reps: prevSets[2]?.reps || 10,
          is_completed: false,
          estimated_1rm: 0,
          volume: 0,
        }
      ]
    };

    const updated: LoggedWorkout = {
      ...workout,
      exercises: [...workout.exercises, newExercise],
    };
    onUpdateWorkout(updated);
    saveActiveWorkoutSession(updated);
  };

  // Reorder exercises
  const handleMoveExercise = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= workout.exercises.length) return;

    const copy = [...workout.exercises];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;

    const updated = {
      ...workout,
      exercises: copy.map((e, idx) => ({ ...e, order_index: idx })),
    };
    onUpdateWorkout(updated);
    saveActiveWorkoutSession(updated);
  };

  // Remove exercise
  const handleRemoveExercise = (exerciseId: string) => {
    const updated = {
      ...workout,
      exercises: workout.exercises.filter(e => e.id !== exerciseId).map((e, idx) => ({ ...e, order_index: idx })),
    };
    onUpdateWorkout(updated);
    saveActiveWorkoutSession(updated);
  };

  // Add set to exercise
  const handleAddSet = (exerciseId: string) => {
    const ex = workout.exercises.find(e => e.id === exerciseId);
    if (!ex) return;

    const lastSet = ex.sets[ex.sets.length - 1];
    const prevSets = previousSetsMap[ex.exercise_id] || [];
    const nextSetNumber = ex.sets.length + 1;
    const suggestedPrev = prevSets[nextSetNumber - 1];

    const newSet: LoggedSet = {
      id: generateUUID(),
      set_number: nextSetNumber,
      set_type: 'working',
      weight: lastSet ? lastSet.weight : (suggestedPrev?.weight || 0),
      reps: lastSet ? lastSet.reps : (suggestedPrev?.reps || 10),
      is_completed: false,
      estimated_1rm: 0,
      volume: 0,
    };

    const updated: LoggedWorkout = {
      ...workout,
      exercises: workout.exercises.map(e => {
        if (e.id === exerciseId) {
          return {
            ...e,
            sets: [...e.sets, newSet],
          };
        }
        return e;
      }),
    };
    onUpdateWorkout(updated);
    saveActiveWorkoutSession(updated);
  };

  // Delete set
  const handleDeleteSet = (exerciseId: string, setId: string) => {
    const updated: LoggedWorkout = {
      ...workout,
      exercises: workout.exercises.map(e => {
        if (e.id === exerciseId) {
          const remaining = e.sets.filter(s => s.id !== setId);
          return {
            ...e,
            sets: remaining.map((s, idx) => ({ ...s, set_number: idx + 1 })),
          };
        }
        return e;
      }),
    };
    onUpdateWorkout(updated);
    saveActiveWorkoutSession(updated);
  };

  // Update set details (weight, reps, rir, set_type)
  const handleUpdateSet = (
    exerciseId: string, 
    setId: string, 
    updates: Partial<LoggedSet>
  ) => {
    const updated: LoggedWorkout = {
      ...workout,
      exercises: workout.exercises.map(e => {
        if (e.id === exerciseId) {
          return {
            ...e,
            sets: e.sets.map(s => {
              if (s.id === setId) {
                const merged = { ...s, ...updates };
                // Calculate live estimated 1RM & set volume
                if (merged.weight > 0 && merged.reps > 0) {
                  merged.estimated_1rm = calculateEstimated1RM(merged.weight, merged.reps);
                  merged.volume = calculateSingleSetVolume(merged.weight, merged.reps);
                } else {
                  merged.estimated_1rm = 0;
                  merged.volume = 0;
                }
                return merged;
              }
              return s;
            }),
          };
        }
        return e;
      }),
    };
    onUpdateWorkout(updated);
    saveActiveWorkoutSession(updated);
  };

  // Toggle set completion + Trigger Rest Timer!
  const handleToggleCompleteSet = (exercise: LoggedExercise, setItem: LoggedSet) => {
    const willBeCompleted = !setItem.is_completed;

    handleUpdateSet(exercise.id, setItem.id, {
      is_completed: willBeCompleted,
      completed_at: willBeCompleted ? new Date().toISOString() : null,
    });

    // Step 6: Rest timer auto-starts on set completion
    if (willBeCompleted) {
      const restDuration = exercise.rest_timer_seconds || restTimerDefaults?.defaultRestSeconds || 90;
      setRestTimerSeconds(restDuration);
      setCurrentRestExerciseName(exercise.exercise_name);
      setRestTimerActive(true);
    }
  };

  // Discard workout handler
  const handleConfirmDiscard = () => {
    setIsDiscardModalOpen(false);
    saveActiveWorkoutSession(null);
    onClose();
  };

  // Finish & complete workout handler
  const handleConfirmFinish = async () => {
    setIsSaving(true);
    try {
      const finalized = {
        ...workout,
        duration_seconds: elapsedSeconds,
      };
      const { workout: saved, newPRs } = await completeAndSaveWorkout(finalized);
      setIsFinishModalOpen(false);
      onWorkoutCompleted(saved, newPRs);
    } catch (err) {
      console.error('[ActiveWorkoutModal] Error completing workout:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  // =========================================================================
  // MINIMIZED DOCKED INDICATOR (Step 5: dockable, re-expandable without losing data)
  // =========================================================================
  if (isMinimized) {
    return (
      <>
        {/* Floating Rest Timer (if running) */}
        {restTimerActive && (
          <RestTimerBar
            initialSeconds={restTimerSeconds}
            exerciseName={currentRestExerciseName}
            isActive={restTimerActive}
            onClose={() => setRestTimerActive(false)}
            accentColor={accentColor}
          />
        )}

        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-40 animate-in slide-in-from-bottom-5 duration-200">
          <div 
            data-surface="primary-metallic"
            className="rounded-2xl p-4 bg-neutral-950/95 text-white border border-neutral-700 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 ring-1 ring-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div>
                <span className="text-xs font-bold font-athletic uppercase tracking-wider block text-white line-clamp-1">
                  {workout.name}
                </span>
                <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                  <span className="text-white font-bold">{formattedDuration}</span>
                  <span>•</span>
                  <span>{liveCompletedSets} sets</span>
                  <span>•</span>
                  <span>{liveVolume} kg</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onMaximize}
                className="px-3 py-1.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-athletic font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // =========================================================================
  // FULL ACTIVE TAKEOVER MODAL (Step 5: Large overlay with dimmed backdrop)
  // =========================================================================
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
        
        {/* Top Sticky Action Bar */}
        <header className="sticky top-0 z-30 bg-[#0e0e11]/95 backdrop-blur-xl border-b border-neutral-800 text-white px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onMinimize}
              className="p-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 transition-colors cursor-pointer border border-neutral-800"
              title="Minimize to dock"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            <div>
              <input
                type="text"
                value={workout.name}
                onChange={(e) => onUpdateWorkout({ ...workout, name: e.target.value })}
                className="bg-transparent text-base sm:text-lg font-black font-display uppercase tracking-wide text-white border-b border-transparent hover:border-neutral-700 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Workout Name..."
              />
              <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-bold text-emerald-400">{formattedDuration}</span>
                <span>•</span>
                <span>Started {new Date(workout.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsDiscardModalOpen(true)}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-neutral-900 hover:bg-rose-950/60 text-neutral-400 hover:text-rose-400 transition-colors cursor-pointer border border-neutral-800 flex items-center gap-1.5 text-xs font-athletic font-bold uppercase"
              title="Discard Workout"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">Discard</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFinishModalOpen(true)}
              className="px-4 py-2 rounded-xl text-white text-xs font-athletic font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <Check className="w-4 h-4" />
              <span>Finish Workout</span>
            </button>
          </div>
        </header>

        {/* Live Metrics Summary Strip */}
        <section className="bg-neutral-900/60 border-b border-neutral-800/80 px-4 sm:px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-around sm:justify-start sm:gap-8 text-xs font-athletic uppercase font-bold tracking-wider">
            <div>
              <span className="text-neutral-500 block text-[10px]">Volume</span>
              <span className="text-sm sm:text-base font-black text-white font-stat">
                {liveVolume} <span className="text-[10px] text-neutral-400">kg</span>
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Working Sets</span>
              <span className="text-sm sm:text-base font-black text-white font-stat">
                {liveCompletedSets}
              </span>
            </div>
            <div>
              <span className="text-neutral-500 block text-[10px]">Total Reps</span>
              <span className="text-sm sm:text-base font-black text-white font-stat">
                {liveCompletedReps}
              </span>
            </div>
            {workout.template_id && (
              <div className="hidden md:block ml-auto text-[10px] text-neutral-400 font-mono">
                Template Applied
              </div>
            )}
          </div>
        </section>

        {/* Main Workout Content (Exercises & Sets) */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
          {workout.exercises.length === 0 ? (
            <div className="py-20 text-center space-y-4 rounded-2xl border-2 border-dashed border-neutral-800 p-8">
              <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto text-neutral-400 border border-neutral-800">
                <Dumbbell className="w-8 h-8 opacity-40" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black font-display uppercase tracking-wide text-white">
                  Workout is Empty
                </h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-medium">
                  Add your first exercise to begin logging weight and reps.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExercisePickerOpen(true)}
                className="px-5 py-2.5 rounded-xl text-white text-xs font-athletic font-black uppercase tracking-wider shadow-lg inline-flex items-center gap-2 cursor-pointer transition-all hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                <Plus className="w-4 h-4" />
                <span>Add First Exercise</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {workout.exercises.map((exercise, exIndex) => {
                const prevSets = previousSetsMap[exercise.exercise_id] || [];

                return (
                  <div
                    key={exercise.id}
                    data-surface="primary-metallic"
                    className="rounded-2xl p-4 sm:p-6 bg-[#161618] text-white border border-neutral-800 shadow-xl space-y-4"
                  >
                    {/* Exercise Card Header */}
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-neutral-800">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                          Exercise #{exIndex + 1}
                        </span>
                        <h3 className="text-base sm:text-lg font-black font-display uppercase tracking-wide text-white">
                          {exercise.exercise_name}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-neutral-400 mt-0.5">
                          <label className="flex items-center gap-1.5 cursor-pointer">
                            <Timer className="w-3.5 h-3.5 text-neutral-500" />
                            <span className="text-[11px] font-mono">Rest:</span>
                            <select
                              value={exercise.rest_timer_seconds || 90}
                              onChange={(e) => {
                                const newSec = parseInt(e.target.value, 10);
                                const updated = {
                                  ...workout,
                                  exercises: workout.exercises.map(e => e.id === exercise.id ? { ...e, rest_timer_seconds: newSec } : e),
                                };
                                onUpdateWorkout(updated);
                              }}
                              className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-0.5 text-[11px] font-mono font-bold text-neutral-300 focus:outline-none"
                            >
                              <option value={30}>30s</option>
                              <option value={60}>60s</option>
                              <option value={90}>90s</option>
                              <option value={120}>120s</option>
                              <option value={180}>180s (3m)</option>
                              <option value={240}>240s (4m)</option>
                            </select>
                          </label>
                        </div>
                      </div>

                      {/* Exercise Actions: Reorder & Remove */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveExercise(exIndex, 'up')}
                          disabled={exIndex === 0}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 text-neutral-400 cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveExercise(exIndex, 'down')}
                          disabled={exIndex === workout.exercises.length - 1}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 disabled:opacity-30 text-neutral-400 cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemoveExercise(exercise.id)}
                          className="p-1.5 rounded-lg bg-neutral-900 hover:bg-rose-950 text-neutral-400 hover:text-rose-400 cursor-pointer ml-1"
                          title="Remove Exercise"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Sets Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-neutral-800 text-[10px] font-athletic uppercase tracking-wider text-neutral-500">
                            <th className="py-2 px-1 text-center w-12">Set</th>
                            <th className="py-2 px-2 min-w-[90px]">Previous</th>
                            <th className="py-2 px-2 w-28">Weight (kg)</th>
                            <th className="py-2 px-2 w-20">Reps</th>
                            <th className="py-2 px-2 w-16 text-center">Type</th>
                            <th className="py-2 px-2 w-12 text-center">Done</th>
                            <th className="py-2 px-1 w-8 text-center"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 font-mono">
                          {exercise.sets.map((set, setIndex) => {
                            const prev = prevSets[setIndex];

                            return (
                              <tr 
                                key={set.id}
                                className={`transition-colors ${
                                  set.is_completed ? 'bg-emerald-500/5' : 'hover:bg-neutral-900/50'
                                }`}
                              >
                                {/* Set Number */}
                                <td className="py-2.5 px-1 text-center">
                                  <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs ${
                                    set.is_completed 
                                      ? 'bg-emerald-500/20 text-emerald-400' 
                                      : 'bg-neutral-800 text-neutral-400'
                                  }`}>
                                    {set.set_number}
                                  </span>
                                </td>

                                {/* Previous Suggestion (Click to use, never overwrites automatically) */}
                                <td className="py-2.5 px-2 text-[11px] text-neutral-400 font-medium">
                                  {prev ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (!set.is_completed) {
                                          handleUpdateSet(exercise.id, set.id, {
                                            weight: prev.weight,
                                            reps: prev.reps,
                                          });
                                        }
                                      }}
                                      className="hover:text-white transition-colors cursor-pointer text-left"
                                      title="Click to apply previous weight & reps"
                                    >
                                      <span>{prev.weight}kg × {prev.reps}</span>
                                    </button>
                                  ) : (
                                    <span className="text-neutral-600">—</span>
                                  )}
                                </td>

                                {/* Weight Input */}
                                <td className="py-2.5 px-2">
                                  <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={set.weight || ''}
                                    onChange={(e) => handleUpdateSet(exercise.id, set.id, {
                                      weight: parseFloat(e.target.value) || 0,
                                    })}
                                    placeholder="0"
                                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-bold text-white text-center focus:outline-none focus:border-blue-500"
                                  />
                                </td>

                                {/* Reps Input */}
                                <td className="py-2.5 px-2">
                                  <input
                                    type="number"
                                    step="1"
                                    min="0"
                                    value={set.reps || ''}
                                    onChange={(e) => handleUpdateSet(exercise.id, set.id, {
                                      reps: parseInt(e.target.value, 10) || 0,
                                    })}
                                    placeholder="0"
                                    className="w-full px-2.5 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs font-bold text-white text-center focus:outline-none focus:border-blue-500"
                                  />
                                </td>

                                {/* Set Type (Working, Warmup, Drop, Failure) */}
                                <td className="py-2.5 px-2 text-center">
                                  <select
                                    value={set.set_type}
                                    onChange={(e) => handleUpdateSet(exercise.id, set.id, {
                                      set_type: e.target.value as SetType,
                                    })}
                                    className="bg-neutral-900 border border-neutral-700 rounded px-1.5 py-1 text-[10px] font-athletic uppercase font-bold text-neutral-300"
                                  >
                                    <option value="working">Work</option>
                                    <option value="warmup">Warm</option>
                                    <option value="drop">Drop</option>
                                    <option value="failure">Fail</option>
                                  </select>
                                </td>

                                {/* Complete Set Checkbox Button */}
                                <td className="py-2.5 px-2 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleCompleteSet(exercise, set)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                                      set.is_completed
                                        ? 'bg-emerald-500 text-black shadow-md ring-2 ring-emerald-400/40'
                                        : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 border border-neutral-700'
                                    }`}
                                    title={set.is_completed ? 'Mark incomplete' : 'Complete set & trigger rest timer'}
                                  >
                                    <Check className="w-4 h-4 font-bold" />
                                  </button>
                                </td>

                                {/* Delete Set */}
                                <td className="py-2.5 px-1 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSet(exercise.id, set.id)}
                                    className="p-1 rounded text-neutral-600 hover:text-rose-400 transition-colors cursor-pointer"
                                    title="Delete set"
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
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleAddSet(exercise.id)}
                        className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-athletic font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Set</span>
                      </button>

                      {/* Manual Rest Timer Button */}
                      <button
                        type="button"
                        onClick={() => {
                          setRestTimerSeconds(exercise.rest_timer_seconds || 90);
                          setCurrentRestExerciseName(exercise.exercise_name);
                          setRestTimerActive(true);
                        }}
                        className="text-neutral-500 hover:text-neutral-300 text-xs font-athletic font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Timer className="w-3.5 h-3.5" />
                        <span>Start Rest Timer</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Add Exercise Floating / Bottom Button */}
              <div className="pt-4 flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsExercisePickerOpen(true)}
                  className="px-6 py-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-athletic font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-xl hover:border-neutral-600"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Exercise</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Exercise Picker Modal */}
      <ExercisePickerModal
        isOpen={isExercisePickerOpen}
        onClose={() => setIsExercisePickerOpen(false)}
        onSelectExercise={handleAddExercise}
        alreadySelectedIds={workout.exercises.map(e => e.exercise_id)}
        accentColor={accentColor}
      />

      {/* Floating Rest Timer Bar (Step 6) */}
      <RestTimerBar
        initialSeconds={restTimerSeconds}
        exerciseName={currentRestExerciseName}
        isActive={restTimerActive}
        onClose={() => setRestTimerActive(false)}
        accentColor={accentColor}
      />

      {/* In-App Confirmation Modal: Discard Workout (Step 8: NO window.confirm) */}
      <ConfirmModal
        isOpen={isDiscardModalOpen}
        title="Discard Workout?"
        message="Are you sure you want to discard this in-progress workout? All logged sets and volume for this session will be deleted."
        confirmLabel="Discard Workout"
        cancelLabel="Keep Logging"
        isDestructive={true}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setIsDiscardModalOpen(false)}
      />

      {/* In-App Confirmation Modal: Finish Workout */}
      <ConfirmModal
        isOpen={isFinishModalOpen}
        title="Finish & Save Workout?"
        message={`You logged ${liveCompletedSets} working sets and ${liveVolume} kg total volume over ${formattedDuration}. Ready to save and check for new Personal Records?`}
        confirmLabel={isSaving ? "Saving..." : "Finish Workout"}
        cancelLabel="Continue Logging"
        isDestructive={false}
        onConfirm={handleConfirmFinish}
        onCancel={() => setIsFinishModalOpen(false)}
      />
    </>
  );
};
