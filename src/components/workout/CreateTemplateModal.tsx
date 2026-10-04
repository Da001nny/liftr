import React, { useState } from 'react';
import { Dumbbell, X, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { createTemplate } from '../../lib/workoutService';
import { ExercisePickerModal } from './ExercisePickerModal';
import { Exercise } from '../../data/exerciseCatalog';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTemplateCreated: () => void;
}

export const CreateTemplateModal: React.FC<CreateTemplateModalProps> = ({
  isOpen,
  onClose,
  onTemplateCreated,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [exercises, setExercises] = useState<Array<{
    exerciseId: string;
    exerciseName: string;
    defaultSets: number;
    targetReps: number;
    restTimerSeconds: number;
    notes: string;
  }>>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddExercise = (exercise: Exercise) => {
    setExercises(prev => [
      ...prev,
      {
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        defaultSets: 3,
        targetReps: 10,
        restTimerSeconds: 90,
        notes: '',
      },
    ]);
  };

  const handleRemoveExercise = (index: number) => {
    setExercises(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateExercise = (index: number, field: string, value: any) => {
    setExercises(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !name.trim()) return;

    setIsSubmitting(true);
    const res = await createTemplate(token, {
      name: name.trim(),
      description: description.trim(),
      exercises: exercises.map(ex => ({
        exerciseId: ex.exerciseId,
        defaultSets: ex.defaultSets,
        targetReps: ex.targetReps,
        restTimerSeconds: ex.restTimerSeconds,
        notes: ex.notes,
      })),
    });
    setIsSubmitting(false);

    if (res) {
      onTemplateCreated();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-900 dark:text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display uppercase tracking-wide">
                {t('workouts.createTemplate')}
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                Save routines for quick 1-tap workout initiation
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Template Details */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1">
                Routine Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Upper Body Hypertrophy, Push Day A..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm font-semibold focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any}
              />
            </div>

            <div>
              <label className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-600 dark:text-neutral-400 block mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Target focus, RPE guidelines, warm-up notes..."
                className="w-full px-4 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': accentColor } as any}
              />
            </div>
          </div>

          {/* Exercises list */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                Routine Exercises ({exercises.length})
              </label>

              <button
                type="button"
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold font-athletic uppercase tracking-wider bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Movement</span>
              </button>
            </div>

            {exercises.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400 space-y-2">
                <Dumbbell className="w-8 h-8 mx-auto text-neutral-400" />
                <p className="text-xs font-medium">No exercises added yet. Click &quot;Add Movement&quot; to pick exercises.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {exercises.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold font-display uppercase tracking-wide">
                        {idx + 1}. {ex.exerciseName}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExercise(idx)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold font-athletic block mb-1">
                          Default Sets
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={ex.defaultSets}
                          onChange={(e) => handleUpdateExercise(idx, 'defaultSets', parseInt(e.target.value, 10) || 1)}
                          className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold font-athletic block mb-1">
                          Target Reps
                        </span>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={ex.targetReps}
                          onChange={(e) => handleUpdateExercise(idx, 'targetReps', parseInt(e.target.value, 10) || 1)}
                          className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center font-mono font-bold"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold font-athletic block mb-1">
                          Rest Timer (s)
                        </span>
                        <input
                          type="number"
                          step="15"
                          min="0"
                          value={ex.restTimerSeconds}
                          onChange={(e) => handleUpdateExercise(idx, 'restTimerSeconds', parseInt(e.target.value, 10) || 0)}
                          className="w-full px-2 py-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center font-mono font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold font-athletic uppercase tracking-wider rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="px-5 py-2 text-xs font-bold font-athletic uppercase tracking-wider rounded-xl text-white shadow-md transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              style={{ backgroundColor: accentColor }}
            >
              {isSubmitting ? 'Saving...' : 'Save Routine'}
            </button>
          </div>
        </form>

        <ExercisePickerModal
          isOpen={isPickerOpen}
          onClose={() => setIsPickerOpen(false)}
          onSelectExercise={handleAddExercise}
        />
      </div>
    </div>
  );
};
