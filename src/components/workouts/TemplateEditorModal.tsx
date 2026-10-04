import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, MoveUp, MoveDown, Dumbbell, Clock, Check } from 'lucide-react';
import { WorkoutTemplateItem, TemplateExerciseItem, generateUUID } from '../../lib/workoutService';
import { ExercisePickerModal } from './ExercisePickerModal';
import { EnrichedExercise } from '../../lib/exerciseService';
import { useAuth } from '../../context/AuthContext';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: Omit<WorkoutTemplateItem, 'created_at' | 'updated_at'> & { created_at?: string }) => Promise<WorkoutTemplateItem>;
  initialTemplate?: WorkoutTemplateItem | null;
  accentColor?: string;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTemplate,
  accentColor = '#3b82f6',
}) => {
  const { user } = useAuth();
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [exercises, setExercises] = useState<TemplateExerciseItem[]>([]);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTemplate) {
      setName(initialTemplate.name || '');
      setDescription(initialTemplate.description || '');
      setExercises(initialTemplate.exercises || []);
    } else {
      setName('');
      setDescription('');
      setExercises([]);
    }
    setError(null);
  }, [initialTemplate, isOpen]);

  if (!isOpen) return null;

  const handleAddExercise = (exercise: EnrichedExercise) => {
    const isCompound = exercise.movement_type === 'Compound';
    const newTe: TemplateExerciseItem = {
      id: generateUUID(),
      template_id: initialTemplate?.id || '',
      exercise_id: exercise.id,
      exercise_name: exercise.name,
      order_index: exercises.length,
      target_sets: 3,
      target_reps: 10,
      rest_timer_seconds: isCompound ? 180 : 90,
      notes: '',
    };
    setExercises(prev => [...prev, newTe]);
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= exercises.length) return;
    const copy = [...exercises];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    setExercises(copy.map((e, idx) => ({ ...e, order_index: idx })));
  };

  const handleRemove = (index: number) => {
    setExercises(prev => prev.filter((_, idx) => idx !== index).map((e, idx) => ({ ...e, order_index: idx })));
  };

  const handleUpdateExercise = (index: number, updates: Partial<TemplateExerciseItem>) => {
    setExercises(prev => prev.map((e, idx) => (idx === index ? { ...e, ...updates } : e)));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a template name.');
      return;
    }
    if (exercises.length === 0) {
      setError('Please add at least one exercise to the template.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await onSave({
        id: initialTemplate?.id || generateUUID(),
        user_id: user?.id || 'guest',
        name: name.trim(),
        description: description.trim() || null,
        notes: null,
        exercises,
        is_starter: false,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
        <div className="bg-[#f5f5f7] dark:bg-[#161616] border border-neutral-300 dark:border-neutral-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: accentColor }}
              >
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                  {initialTemplate ? 'Edit Template' : 'Create Workout Template'}
                </h2>
                <p className="text-xs text-neutral-500 font-medium">
                  Define your routine movements, target sets, reps, and rest timers.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto py-4 space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-medium">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-athletic font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Template Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Upper Body Strength A"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-athletic font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Chest, shoulders, and triceps focus"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 text-sm font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Exercises List */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-athletic font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Exercises ({exercises.length})
                </span>
                <button
                  type="button"
                  onClick={() => setIsExercisePickerOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-athletic font-bold uppercase tracking-wider text-white flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Exercise</span>
                </button>
              </div>

              {exercises.length === 0 ? (
                <div className="p-8 text-center rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 text-neutral-500 text-xs font-medium">
                  No exercises in this template yet. Click &quot;Add Exercise&quot; to pick from the 203 validated catalog movements.
                </div>
              ) : (
                <div className="space-y-2">
                  {exercises.map((ex, idx) => (
                    <div
                      key={ex.id || idx}
                      className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-xs font-bold flex items-center justify-center font-mono">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-neutral-900 dark:text-white">
                            {ex.exercise_name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(idx, 'down')}
                            disabled={idx === exercises.length - 1}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-700 dark:hover:text-white disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemove(idx)}
                            className="p-1 rounded text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                            title="Remove Exercise"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-1 border-t border-neutral-100 dark:border-neutral-800 text-xs">
                        <div>
                          <label className="text-[10px] font-athletic uppercase font-bold text-neutral-500 block mb-1">
                            Target Sets
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value={ex.target_sets}
                            onChange={(e) => handleUpdateExercise(idx, { target_sets: parseInt(e.target.value, 10) || 1 })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-stat font-bold text-neutral-900 dark:text-white text-center"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-athletic uppercase font-bold text-neutral-500 block mb-1">
                            Target Reps
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={ex.target_reps}
                            onChange={(e) => handleUpdateExercise(idx, { target_reps: parseInt(e.target.value, 10) || 1 })}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 font-stat font-bold text-neutral-900 dark:text-white text-center"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-athletic uppercase font-bold text-neutral-500 block mb-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Rest (sec)</span>
                          </label>
                          <select
                            value={ex.rest_timer_seconds || 90}
                            onChange={(e) => handleUpdateExercise(idx, { rest_timer_seconds: parseInt(e.target.value, 10) })}
                            className="w-full px-2 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white font-mono"
                          >
                            <option value="45">45s</option>
                            <option value="60">60s</option>
                            <option value="90">90s</option>
                            <option value="120">120s (2m)</option>
                            <option value="180">180s (3m)</option>
                            <option value="240">240s (4m)</option>
                            <option value="300">300s (5m)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-athletic font-bold uppercase tracking-wider rounded-xl bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-athletic font-bold uppercase tracking-wider rounded-xl text-white transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                style={{ backgroundColor: accentColor }}
              >
                <Check className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Template'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Exercise Picker */}
      <ExercisePickerModal
        isOpen={isExercisePickerOpen}
        onClose={() => setIsExercisePickerOpen(false)}
        onSelectExercise={handleAddExercise}
        alreadySelectedIds={exercises.map(e => e.exercise_id)}
        accentColor={accentColor}
      />
    </>
  );
};
