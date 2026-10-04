import React, { useState } from 'react';
import { 
  Play, 
  Plus, 
  Copy, 
  Trash2, 
  Edit3, 
  Clock, 
  Dumbbell, 
  Trophy, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Calendar,
  Layers,
  Repeat
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useWorkout } from '../../context/WorkoutContext';
import { WorkoutTemplateItem, LoggedWorkout } from '../../lib/workoutService';
import { TemplateEditorModal } from './TemplateEditorModal';
import { ConfirmModal } from '../common/ConfirmModal';

export const RoutinesView: React.FC = () => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const {
    startBlankWorkout,
    startWorkoutFromTemplate,
    startWorkoutFromPastWorkout,
    completedWorkouts,
    templates,
    saveTemplate,
    duplicateTemplate,
    deleteTemplate,
    deleteCompletedWorkout,
  } = useWorkout();

  // Template editor modal state
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(false);
  const [editingTemplate, setEditingTemplate] = useState<WorkoutTemplateItem | null>(null);

  // Deletion modals state
  const [deleteTemplateId, setDeleteTemplateId] = useState<string | null>(null);
  const [deleteWorkoutId, setDeleteWorkoutId] = useState<string | null>(null);

  // Expanded workout history cards: set of workout IDs
  const [expandedWorkouts, setExpandedWorkouts] = useState<Record<string, boolean>>({});

  const toggleWorkoutExpand = (id: string) => {
    setExpandedWorkouts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEditTemplate = (tmpl: WorkoutTemplateItem) => {
    setEditingTemplate(tmpl);
    setIsEditorOpen(true);
  };

  const handleCreateNewTemplate = () => {
    setEditingTemplate(null);
    setIsEditorOpen(true);
  };

  const handleConfirmDeleteTemplate = async () => {
    if (deleteTemplateId) {
      await deleteTemplate(deleteTemplateId);
      setDeleteTemplateId(null);
    }
  };

  const handleConfirmDeleteWorkout = async () => {
    if (deleteWorkoutId) {
      await deleteCompletedWorkout(deleteWorkoutId);
      setDeleteWorkoutId(null);
    }
  };

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-8">
      {/* Quick Launch Action Banner */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                Workout Logging & Progression
              </span>
              <span aria-hidden="true" className="text-neutral-400 dark:text-neutral-600">·</span>
              <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">Active Takeover Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              Start Training Session
            </h2>
            <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-xl font-medium">
              Log sets, weights, reps, and RIR with automated rest timers, previous-set suggestions, and strict 4-category PR detection.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => startBlankWorkout()}
              className="px-5 py-3 rounded-xl text-white font-athletic font-black uppercase tracking-wider text-xs shadow-lg flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start Blank Workout</span>
            </button>

            <button
              onClick={handleCreateNewTemplate}
              className="px-4 py-3 rounded-xl bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white font-athletic font-bold uppercase tracking-wider text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-neutral-300 dark:border-neutral-700"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          WORKOUT TEMPLATES SECTION (Step 7: create, edit, duplicate, delete, start)
          ========================================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg premium-icon-container">
              <Layers className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              Workout Templates ({templates.length})
            </h3>
          </div>

          <button
            onClick={handleCreateNewTemplate}
            className="text-xs font-athletic font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map(tmpl => (
            <div
              key={tmpl.id}
              data-surface="secondary-flat"
              className="rounded-2xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm flex flex-col justify-between transition-all hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-athletic uppercase font-bold text-neutral-500 tracking-wider block">
                      {tmpl.is_starter ? 'Starter Routine' : 'Custom Template'}
                    </span>
                    <h4 className="text-base font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                      {tmpl.name}
                    </h4>
                  </div>

                  {/* Actions for User Templates */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => duplicateTemplate(tmpl.id)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                      title="Duplicate Template"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {!tmpl.is_starter && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleEditTemplate(tmpl)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                          title="Edit Template"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTemplateId(tmpl.id)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                          title="Delete Template"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {tmpl.description && (
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium line-clamp-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                )}

                {/* Exercises Preview Tags */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-athletic uppercase font-bold text-neutral-500 tracking-wider block">
                    {tmpl.exercises.length} Exercises:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-hidden">
                    {tmpl.exercises.map((te, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-neutral-200/80 dark:bg-neutral-800 text-[11px] font-medium text-neutral-800 dark:text-neutral-300"
                      >
                        {te.exercise_name} ({te.target_sets}×{te.target_reps})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Start Template Button */}
              <div className="pt-5 mt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-[11px] font-mono text-neutral-500">
                  {tmpl.exercises.reduce((sum, e) => sum + e.target_sets, 0)} total sets
                </span>

                <button
                  type="button"
                  onClick={() => startWorkoutFromTemplate(tmpl)}
                  className="px-3.5 py-1.5 rounded-xl text-white font-athletic font-bold uppercase tracking-wider text-xs shadow-md flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                  style={{ backgroundColor: accentColor }}
                >
                  <Play className="w-3 h-3 fill-white" />
                  <span>Start Workout</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          WORKOUT HISTORY SECTION
          ========================================================================= */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg premium-icon-container">
              <Calendar className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              Workout History ({completedWorkouts.length})
            </h3>
          </div>
        </div>

        {completedWorkouts.length === 0 ? (
          <div 
            data-surface="secondary-flat"
            className="rounded-2xl p-12 text-center bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424]"
          >
            <div className="w-12 h-12 rounded-xl premium-icon-container mx-auto mb-3">
              <Dumbbell className="w-6 h-6 text-neutral-600 dark:text-neutral-400 premium-icon-embedded" />
            </div>
            <h4 className="text-base font-bold font-athletic uppercase text-neutral-900 dark:text-white">
              No Workouts Logged Yet
            </h4>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 leading-relaxed font-medium">
              Start a blank workout or launch a template above. Completed workouts with real sets, volume, and personal records will appear here.
            </p>
            <button
              type="button"
              onClick={() => startBlankWorkout()}
              className="mt-4 px-4 py-2 rounded-xl text-white font-athletic font-bold uppercase tracking-wider text-xs shadow-md inline-flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Start First Workout</span>
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {completedWorkouts.map(workout => {
              const isExpanded = Boolean(expandedWorkouts[workout.id]);
              const prs = workout.new_prs || [];

              return (
                <div
                  key={workout.id}
                  data-surface="secondary-flat"
                  className="rounded-2xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm space-y-4 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                          {workout.name}
                        </span>
                        {prs.length > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 font-athletic font-bold text-[10px] uppercase flex items-center gap-1">
                            <Trophy className="w-3 h-3" />
                            <span>{prs.length} PR{prs.length > 1 ? 's' : ''}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-neutral-500 dark:text-neutral-400">
                        <span>{new Date(workout.completed_at || workout.started_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <span>{formatDuration(workout.duration_seconds)}</span>
                        <span>•</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{workout.total_volume} kg</span>
                        <span>•</span>
                        <span>{workout.total_completed_sets} working sets</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => startWorkoutFromPastWorkout(workout)}
                        className="px-3 py-1.5 rounded-xl bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-white text-xs font-athletic font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                        title="Repeat this workout"
                      >
                        <Repeat className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Repeat</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeleteWorkoutId(workout.id)}
                        className="p-1.5 rounded-xl text-neutral-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Delete workout"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleWorkoutExpand(workout.id)}
                        className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-800 dark:hover:text-white transition-colors cursor-pointer"
                        title={isExpanded ? 'Collapse' : 'Expand Details'}
                      >
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Breakdown */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                      {/* PRs achieved in this workout */}
                      {prs.length > 0 && (
                        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs space-y-1.5">
                          <span className="font-bold text-amber-500 uppercase font-athletic tracking-wider flex items-center gap-1.5">
                            <Trophy className="w-3.5 h-3.5" />
                            <span>Personal Records Achieved in this Workout:</span>
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {prs.map(p => (
                              <span key={p.id} className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-[11px] font-medium font-mono">
                                {p.exercise_name}: {p.category === 'rep_pr' ? `${p.value} reps @ ${p.weight}kg` : `${p.value} kg (${p.category})`}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Exercises & Sets */}
                      <div className="space-y-3">
                        {workout.exercises.map(ex => (
                          <div key={ex.id} className="p-3 rounded-xl bg-neutral-200/50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs">
                            <span className="font-bold text-neutral-900 dark:text-white block mb-2 font-display uppercase tracking-wide">
                              {ex.exercise_name}
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-neutral-600 dark:text-neutral-400 font-mono">
                              {ex.sets.map((s, sIdx) => (
                                <div key={s.id} className={`p-2 rounded bg-neutral-100 dark:bg-neutral-800/80 border ${s.is_completed ? 'border-neutral-300 dark:border-neutral-700' : 'border-neutral-200 dark:border-neutral-800 opacity-60'}`}>
                                  <div className="text-[10px] font-athletic uppercase font-bold text-neutral-400">
                                    Set {sIdx + 1} ({s.set_type})
                                  </div>
                                  <div className="text-sm font-bold text-neutral-900 dark:text-white font-stat">
                                    {s.weight} kg × {s.reps}
                                  </div>
                                  <div className="text-[10px] text-neutral-500">
                                    1RM: {s.estimated_1rm}kg • Vol: {s.volume}kg
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Template Editor Modal */}
      <TemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={saveTemplate}
        initialTemplate={editingTemplate}
        accentColor={accentColor}
      />

      {/* Delete Template Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTemplateId)}
        title="Delete Workout Template?"
        message="Are you sure you want to permanently delete this workout template? This action cannot be undone."
        confirmLabel="Delete Template"
        cancelLabel="Keep Template"
        isDestructive={true}
        onConfirm={handleConfirmDeleteTemplate}
        onCancel={() => setDeleteTemplateId(null)}
      />

      {/* Delete Workout Confirmation Modal (Step 8: Reverses PRs, NO window.confirm) */}
      <ConfirmModal
        isOpen={Boolean(deleteWorkoutId)}
        title="Delete Completed Workout?"
        message="Are you sure you want to delete this workout? Any Personal Records generated by this workout will be automatically reversed and recalculated from remaining workouts to prevent phantom PRs."
        confirmLabel="Delete Workout"
        cancelLabel="Cancel"
        isDestructive={true}
        onConfirm={handleConfirmDeleteWorkout}
        onCancel={() => setDeleteWorkoutId(null)}
      />
    </div>
  );
};
