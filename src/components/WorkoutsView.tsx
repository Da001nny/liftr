import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Search, 
  Compass, 
  ListFilter, 
  Info, 
  BookOpen, 
  History as HistoryIcon,
  Play
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { ExerciseLibrary } from './ExerciseLibrary';
import { ReverseMuscleSearch } from './ReverseMuscleSearch';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { EnrichedExercise } from '../lib/exerciseService';
import { ActiveWorkoutSession } from '../types/database';
import { useWorkout } from '../context/WorkoutContext';
import { TemplatesSection } from './workout/TemplatesSection';
import { WorkoutHistoryView } from './workout/WorkoutHistoryView';

type WorkoutTab = 'routines' | 'catalog' | 'reverseSearch' | 'history';

interface WorkoutsViewProps {
  initialTab?: WorkoutTab;
  initialMuscleId?: string;
}

export const WorkoutsView: React.FC<WorkoutsViewProps> = ({ initialTab, initialMuscleId }) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();
  const { activeSession, setActiveSession, historyRefreshKey } = useWorkout();

  const [activeTab, setActiveTab] = useState<WorkoutTab>(initialTab || 'routines');
  const [selectedMuscleId, setSelectedMuscleId] = useState<string | undefined>(initialMuscleId);
  const [selectedExercise, setSelectedExercise] = useState<EnrichedExercise | null>(null);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
    if (initialMuscleId) {
      setSelectedMuscleId(initialMuscleId);
    }
  }, [initialTab, initialMuscleId]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('workouts.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('workouts.subtitle')}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 self-start sm:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('routines')}
            className={`px-3 py-2 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'routines'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>{t('workouts.routinesTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-3 py-2 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t('workouts.catalogTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('reverseSearch')}
            className={`px-3 py-2 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'reverseSearch'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t('workouts.reverseSearchTab')}</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-2 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === 'history'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>{t('workouts.historyTab')}</span>
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'routines' && (
        <TemplatesSection
          onStartWorkout={(session) => setActiveSession(session)}
          activeSession={activeSession}
        />
      )}

      {activeTab === 'catalog' && (
        <ExerciseLibrary onSelectExercise={setSelectedExercise} />
      )}

      {activeTab === 'reverseSearch' && (
        <ReverseMuscleSearch 
          onSelectExercise={setSelectedExercise} 
          initialMuscleId={selectedMuscleId}
        />
      )}

      {activeTab === 'history' && (
        <WorkoutHistoryView onRefreshTrigger={historyRefreshKey} />
      )}

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal 
        exercise={selectedExercise} 
        onClose={() => setSelectedExercise(null)} 
      />
    </div>
  );
};
