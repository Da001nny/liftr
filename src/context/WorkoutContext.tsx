import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  ActiveWorkoutSession, 
  PersonalRecordRow, 
  WorkoutRow 
} from '../types/database';
import { 
  fetchActiveWorkout, 
  createWorkout, 
  EnrichedWorkoutTemplate 
} from '../lib/workoutService';
import { ActiveWorkoutModal } from '../components/workout/ActiveWorkoutModal';

export interface WorkoutContextType {
  activeSession: ActiveWorkoutSession | null;
  setActiveSession: React.Dispatch<React.SetStateAction<ActiveWorkoutSession | null>>;
  startBlankWorkout: (name?: string) => Promise<ActiveWorkoutSession | null>;
  startWorkoutFromTemplate: (template: EnrichedWorkoutTemplate) => Promise<ActiveWorkoutSession | null>;
  historyRefreshKey: number;
  triggerHistoryRefresh: () => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export const WorkoutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user } = useAuth();
  const [activeSession, setActiveSession] = useState<ActiveWorkoutSession | null>(null);
  const [historyRefreshKey, setHistoryRefreshKey] = useState<number>(0);

  const triggerHistoryRefresh = useCallback(() => {
    setHistoryRefreshKey(prev => prev + 1);
  }, []);

  // Restore any active in-progress workout on auth change
  useEffect(() => {
    if (!token) {
      setActiveSession(null);
      return;
    }

    let isMounted = true;
    fetchActiveWorkout(token).then(session => {
      if (isMounted && session) {
        setActiveSession(session);
      }
    }).catch(err => {
      console.warn('[WorkoutContext] Could not restore active workout:', err);
    });

    return () => {
      isMounted = false;
    };
  }, [token]);

  const startBlankWorkout = useCallback(async (customName?: string): Promise<ActiveWorkoutSession | null> => {
    if (!token) return null;
    const name = customName || `Workout ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
    const session = await createWorkout(token, { name });
    if (session) {
      setActiveSession(session);
    }
    return session;
  }, [token]);

  const startWorkoutFromTemplate = useCallback(async (tpl: EnrichedWorkoutTemplate): Promise<ActiveWorkoutSession | null> => {
    if (!token) return null;
    const session = await createWorkout(token, {
      name: tpl.name,
      templateId: tpl.id,
      exercises: tpl.exercises.map(e => ({
        exerciseId: e.exerciseId,
        restTimerSeconds: e.restTimerSeconds,
        notes: e.notes,
      })),
    });
    if (session) {
      setActiveSession(session);
    }
    return session;
  }, [token]);

  const handleWorkoutCompleted = useCallback((workout: WorkoutRow, newPRs: PersonalRecordRow[]) => {
    setActiveSession(null);
    triggerHistoryRefresh();
  }, [triggerHistoryRefresh]);

  const handleSessionClosed = useCallback(() => {
    setActiveSession(null);
    triggerHistoryRefresh();
  }, [triggerHistoryRefresh]);

  return (
    <WorkoutContext.Provider
      value={{
        activeSession,
        setActiveSession,
        startBlankWorkout,
        startWorkoutFromTemplate,
        historyRefreshKey,
        triggerHistoryRefresh,
      }}
    >
      {children}

      {/* Persistent global ActiveWorkoutModal: takeover modal with dimmed backdrop, dockable/minimizable */}
      {user && activeSession && (
        <ActiveWorkoutModal
          session={activeSession}
          onSessionUpdated={setActiveSession}
          onSessionClosed={handleSessionClosed}
          onWorkoutCompleted={handleWorkoutCompleted}
        />
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
