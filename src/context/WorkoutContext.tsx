import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  LoggedWorkout, 
  WorkoutTemplateItem, 
  LoggedExercise, 
  LoggedSet, 
  generateUUID, 
  getCompletedWorkouts, 
  getPersonalRecords, 
  getWorkoutTemplates, 
  saveActiveWorkoutSession, 
  loadActiveWorkoutSession, 
  deleteWorkout, 
  saveWorkoutTemplate, 
  duplicateWorkoutTemplate, 
  deleteWorkoutTemplate,
  STARTER_TEMPLATES
} from '../lib/workoutService';
import { PersonalRecordRow } from '../types/database';
import { ActiveWorkoutModal } from '../components/workouts/ActiveWorkoutModal';
import { Sparkles, Trophy, X } from 'lucide-react';

interface WorkoutContextType {
  activeWorkout: LoggedWorkout | null;
  isTakeoverOpen: boolean;
  isMinimized: boolean;
  startBlankWorkout: (name?: string) => void;
  startWorkoutFromTemplate: (template: WorkoutTemplateItem) => void;
  startWorkoutFromPastWorkout: (pastWorkout: LoggedWorkout) => void;
  updateActiveWorkout: (workout: LoggedWorkout) => void;
  minimizeWorkout: () => void;
  maximizeWorkout: () => void;
  closeActiveWorkout: () => void;
  completedWorkouts: LoggedWorkout[];
  personalRecords: PersonalRecordRow[];
  templates: WorkoutTemplateItem[];
  loading: boolean;
  refreshData: () => Promise<void>;
  deleteCompletedWorkout: (id: string) => Promise<boolean>;
  saveTemplate: (template: Omit<WorkoutTemplateItem, 'created_at' | 'updated_at'> & { created_at?: string }) => Promise<WorkoutTemplateItem>;
  duplicateTemplate: (templateId: string) => Promise<WorkoutTemplateItem | null>;
  deleteTemplate: (templateId: string) => Promise<boolean>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [activeWorkout, setActiveWorkout] = useState<LoggedWorkout | null>(null);
  const [isTakeoverOpen, setIsTakeoverOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const [completedWorkouts, setCompletedWorkouts] = useState<LoggedWorkout[]>([]);
  const [personalRecords, setPersonalRecords] = useState<PersonalRecordRow[]>([]);
  const [templates, setTemplates] = useState<WorkoutTemplateItem[]>(STARTER_TEMPLATES);
  const [loading, setLoading] = useState<boolean>(true);

  // New PRs celebration toast state
  const [celebrationPRs, setCelebrationPRs] = useState<PersonalRecordRow[]>([]);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState<boolean>(false);

  // Load active session from cache on mount
  useEffect(() => {
    const saved = loadActiveWorkoutSession();
    if (saved && saved.status === 'in_progress') {
      setActiveWorkout(saved);
      setIsTakeoverOpen(true);
      setIsMinimized(true); // Default to minimized if restoring from prior session
    }
  }, []);

  // Fetch workouts, PRs, and templates
  const refreshData = useCallback(async () => {
    if (!user) {
      setCompletedWorkouts([]);
      setPersonalRecords([]);
      setTemplates(STARTER_TEMPLATES);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [workouts, prs, tmpls] = await Promise.all([
        getCompletedWorkouts(user.id),
        getPersonalRecords(user.id),
        getWorkoutTemplates(user.id),
      ]);
      setCompletedWorkouts(workouts);
      setPersonalRecords(prs);
      setTemplates(tmpls);
    } catch (err) {
      console.warn('[WorkoutContext] Error loading workout data:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Start Blank Workout
  const startBlankWorkout = useCallback((name?: string) => {
    const newWorkout: LoggedWorkout = {
      id: generateUUID(),
      user_id: user?.id || 'guest',
      name: name || `Workout ${new Date().toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}`,
      template_id: null,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      duration_seconds: 0,
      total_volume: 0,
      total_completed_sets: 0,
      total_completed_reps: 0,
      notes: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      exercises: [],
    };

    setActiveWorkout(newWorkout);
    setIsTakeoverOpen(true);
    setIsMinimized(false);
    saveActiveWorkoutSession(newWorkout);
  }, [user]);

  // Start Workout From Template
  const startWorkoutFromTemplate = useCallback((template: WorkoutTemplateItem) => {
    const newWorkout: LoggedWorkout = {
      id: generateUUID(),
      user_id: user?.id || 'guest',
      name: template.name,
      template_id: template.id,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      duration_seconds: 0,
      total_volume: 0,
      total_completed_sets: 0,
      total_completed_reps: 0,
      notes: template.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      exercises: template.exercises.map((te, exIdx) => ({
        id: generateUUID(),
        exercise_id: te.exercise_id,
        exercise_name: te.exercise_name,
        target_region_id: null,
        order_index: exIdx,
        rest_timer_seconds: te.rest_timer_seconds,
        notes: te.notes || '',
        sets: Array.from({ length: te.target_sets || 3 }).map((_, sIdx) => ({
          id: generateUUID(),
          set_number: sIdx + 1,
          set_type: 'working',
          weight: 0,
          reps: te.target_reps || 10,
          is_completed: false,
          estimated_1rm: 0,
          volume: 0,
        })),
      })),
    };

    setActiveWorkout(newWorkout);
    setIsTakeoverOpen(true);
    setIsMinimized(false);
    saveActiveWorkoutSession(newWorkout);
  }, [user]);

  // Start Workout From Past Workout
  const startWorkoutFromPastWorkout = useCallback((pastWorkout: LoggedWorkout) => {
    const newWorkout: LoggedWorkout = {
      id: generateUUID(),
      user_id: user?.id || 'guest',
      name: `${pastWorkout.name}`,
      template_id: pastWorkout.template_id,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      duration_seconds: 0,
      total_volume: 0,
      total_completed_sets: 0,
      total_completed_reps: 0,
      notes: pastWorkout.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      exercises: pastWorkout.exercises.map((pe, exIdx) => ({
        id: generateUUID(),
        exercise_id: pe.exercise_id,
        exercise_name: pe.exercise_name,
        target_region_id: pe.target_region_id,
        order_index: exIdx,
        rest_timer_seconds: pe.rest_timer_seconds,
        notes: pe.notes || '',
        sets: pe.sets.map((ps, sIdx) => ({
          id: generateUUID(),
          set_number: sIdx + 1,
          set_type: ps.set_type,
          weight: ps.weight,
          reps: ps.reps,
          is_completed: false,
          estimated_1rm: 0,
          volume: 0,
        })),
      })),
    };

    setActiveWorkout(newWorkout);
    setIsTakeoverOpen(true);
    setIsMinimized(false);
    saveActiveWorkoutSession(newWorkout);
  }, [user]);

  // Update active workout
  const updateActiveWorkout = useCallback((updated: LoggedWorkout) => {
    setActiveWorkout(updated);
    saveActiveWorkoutSession(updated);
  }, []);

  // Minimize active takeover modal
  const minimizeWorkout = useCallback(() => {
    setIsMinimized(true);
  }, []);

  // Maximize active takeover modal
  const maximizeWorkout = useCallback(() => {
    setIsMinimized(false);
  }, []);

  // Close active workout
  const closeActiveWorkout = useCallback(() => {
    setIsTakeoverOpen(false);
    setActiveWorkout(null);
    saveActiveWorkoutSession(null);
  }, []);

  // On workout completed
  const handleWorkoutCompleted = useCallback((saved: LoggedWorkout, prs: PersonalRecordRow[]) => {
    setIsTakeoverOpen(false);
    setActiveWorkout(null);
    saveActiveWorkoutSession(null);
    
    // Refresh local lists
    setCompletedWorkouts(prev => [saved, ...prev.filter(w => w.id !== saved.id)]);
    if (prs.length > 0) {
      setPersonalRecords(prev => [...prs, ...prev]);
      setCelebrationPRs(prs);
      setIsCelebrationOpen(true);
    }
  }, []);

  // Delete completed workout
  const handleDeleteCompletedWorkout = useCallback(async (workoutId: string) => {
    if (!user) return false;
    const ok = await deleteWorkout(workoutId, user.id);
    if (ok) {
      await refreshData();
    }
    return ok;
  }, [user, refreshData]);

  // Save template
  const handleSaveTemplate = useCallback(async (
    template: Omit<WorkoutTemplateItem, 'created_at' | 'updated_at'> & { created_at?: string }
  ) => {
    const saved = await saveWorkoutTemplate(template);
    await refreshData();
    return saved;
  }, [refreshData]);

  // Duplicate template
  const handleDuplicateTemplate = useCallback(async (templateId: string) => {
    if (!user) return null;
    const duplicated = await duplicateWorkoutTemplate(templateId, user.id);
    if (duplicated) {
      await refreshData();
    }
    return duplicated;
  }, [user, refreshData]);

  // Delete template
  const handleDeleteTemplate = useCallback(async (templateId: string) => {
    if (!user) return false;
    const ok = await deleteWorkoutTemplate(templateId, user.id);
    if (ok) {
      await refreshData();
    }
    return ok;
  }, [user, refreshData]);

  return (
    <WorkoutContext.Provider
      value={{
        activeWorkout,
        isTakeoverOpen,
        isMinimized,
        startBlankWorkout,
        startWorkoutFromTemplate,
        startWorkoutFromPastWorkout,
        updateActiveWorkout,
        minimizeWorkout,
        maximizeWorkout,
        closeActiveWorkout,
        completedWorkouts,
        personalRecords,
        templates,
        loading,
        refreshData,
        deleteCompletedWorkout: handleDeleteCompletedWorkout,
        saveTemplate: handleSaveTemplate,
        duplicateTemplate: handleDuplicateTemplate,
        deleteTemplate: handleDeleteTemplate,
      }}
    >
      {children}

      {/* Persistent Active Workout Takeover Modal (Minimizable, dockable, re-expandable across all tabs) */}
      {activeWorkout && isTakeoverOpen && (
        <ActiveWorkoutModal
          isOpen={isTakeoverOpen}
          isMinimized={isMinimized}
          onMinimize={minimizeWorkout}
          onMaximize={maximizeWorkout}
          onClose={closeActiveWorkout}
          onWorkoutCompleted={handleWorkoutCompleted}
          workout={activeWorkout}
          onUpdateWorkout={updateActiveWorkout}
        />
      )}

      {/* PR Celebration Banner / Modal */}
      {isCelebrationOpen && celebrationPRs.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl p-6 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-white border border-amber-500/40 shadow-2xl space-y-4">
            <button
              onClick={() => setIsCelebrationOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <Trophy className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-bold font-athletic uppercase tracking-wider text-amber-500 block">
                  New Personal Records!
                </span>
                <h3 className="text-xl font-black font-display uppercase tracking-wide">
                  Strength Breakthrough
                </h3>
              </div>
            </div>

            <div className="space-y-2 py-2 max-h-60 overflow-y-auto">
              {celebrationPRs.map((pr) => (
                <div 
                  key={pr.id}
                  className="p-3 rounded-xl bg-neutral-200/70 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 flex items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white block">
                      {pr.exercise_name}
                    </span>
                    <span className="text-[10px] font-athletic uppercase text-amber-500 font-bold">
                      {pr.category === 'heaviest_weight' && 'Heaviest Weight PR'}
                      {pr.category === 'best_estimated_1rm' && 'Best 1RM PR'}
                      {pr.category === 'best_volume' && 'Best Single-Set Volume PR'}
                      {pr.category === 'rep_pr' && 'Rep PR'}
                    </span>
                  </div>
                  <div className="text-right font-stat">
                    <span className="text-base font-black text-neutral-900 dark:text-white">
                      {pr.value} {pr.category === 'rep_pr' ? 'reps' : 'kg'}
                    </span>
                    <span className="block text-[10px] text-neutral-500 font-medium">
                      {pr.weight} kg × {pr.reps} reps
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsCelebrationOpen(false)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-athletic font-bold uppercase tracking-wider text-xs transition-colors cursor-pointer shadow-lg"
            >
              Continue Training
            </button>
          </div>
        </div>
      )}
    </WorkoutContext.Provider>
  );
};

export const useWorkout = (): WorkoutContextType => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkout must be used within a WorkoutProvider');
  }
  return context;
};
