import React, { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Play, 
  Copy, 
  Trash2, 
  Sparkles,
  Layers
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  EnrichedWorkoutTemplate, 
  fetchTemplates, 
  duplicateTemplate, 
  deleteTemplate,
  createWorkout
} from '../../lib/workoutService';
import { CreateTemplateModal } from './CreateTemplateModal';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { ActiveWorkoutSession } from '../../types/database';

interface TemplatesSectionProps {
  onStartWorkout: (session: ActiveWorkoutSession) => void;
  activeSession: ActiveWorkoutSession | null;
}

export const TemplatesSection: React.FC<TemplatesSectionProps> = ({
  onStartWorkout,
  activeSession,
}) => {
  const { t, tn } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [templates, setTemplates] = useState<EnrichedWorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<EnrichedWorkoutTemplate | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const loadTemplates = async () => {
    if (!token) return;
    setLoading(true);
    const data = await fetchTemplates(token);
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTemplates();
  }, [token]);

  const handleStartBlank = async () => {
    if (!token || isStarting) return;
    setIsStarting(true);
    const todayIso = new Date().toISOString().slice(0, 10);
    const workoutName = `Workout ${todayIso}`;
    const session = await createWorkout(token, {
      name: workoutName,
    });
    setIsStarting(false);
    if (session) {
      onStartWorkout(session);
    }
  };

  const handleStartFromTemplate = async (tpl: EnrichedWorkoutTemplate) => {
    if (!token || isStarting) return;
    setIsStarting(true);
    const session = await createWorkout(token, {
      name: tpl.name,
      templateId: tpl.id,
      exercises: tpl.exercises.map(e => ({
        exerciseId: e.exerciseId,
        restTimerSeconds: e.restTimerSeconds,
        notes: e.notes,
      })),
    });
    setIsStarting(false);
    if (session) {
      onStartWorkout(session);
    }
  };

  const handleDuplicate = async (tplId: string) => {
    if (!token) return;
    const duplicated = await duplicateTemplate(token, tplId);
    if (duplicated) {
      loadTemplates();
    }
  };

  const handleDelete = async () => {
    if (!token || !templateToDelete) return;
    const ok = await deleteTemplate(token, templateToDelete.id);
    if (ok) {
      setTemplates(prev => prev.filter(t => t.id !== templateToDelete.id));
    }
    setTemplateToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* Quick Launch Hero */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              <Sparkles className="w-3.5 h-3.5" style={{ color: accentColor }} />
              <span>{t('workouts.initiationBadge')}</span>
              <span>·</span>
              <span className="font-mono text-[11px] text-neutral-500">{t('workouts.liveEngineBadge')}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-wide">
              {activeSession ? t('workouts.workoutActiveTitle') : t('workouts.startTrainingTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 max-w-xl font-medium leading-relaxed">
              {activeSession 
                ? t('workouts.activeSessionDesc')
                : t('workouts.startTrainingDesc')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {activeSession ? (
              <button
                type="button"
                onClick={() => onStartWorkout(activeSession)}
                className="px-5 py-3 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider text-white shadow-lg transition-transform active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <Dumbbell className="w-4 h-4 animate-pulse" />
                <span>{t('workouts.resumeActiveSession')}</span>
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleStartBlank}
                  disabled={isStarting}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider text-white shadow-md transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('workouts.startEmptyWorkout')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t('workouts.createTemplate')}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Routine Templates Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-display uppercase tracking-wide text-neutral-900 dark:text-white">
              {t('workouts.templatesTitle')}
            </h3>
            <span className="text-xs text-neutral-500 font-medium font-athletic uppercase tracking-wider">
              {tn('workouts.savedRoutinesCount', templates.length)}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="text-xs font-bold font-athletic uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('workouts.newRoutine')}</span>
          </button>
        </div>

        {templates.length === 0 ? (
          <div 
            data-surface="secondary-flat"
            className="rounded-2xl p-8 text-center bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-500 space-y-3"
          >
            <Dumbbell className="w-8 h-8 mx-auto text-neutral-400" />
            <p className="text-xs font-medium max-w-sm mx-auto">
              {t('workouts.noTemplates')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map(tpl => (
              <div
                key={tpl.id}
                data-surface="secondary-flat"
                className="rounded-2xl p-5 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm flex flex-col justify-between gap-4 transition-all hover:border-neutral-400 dark:hover:border-neutral-700"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-base font-bold font-display uppercase tracking-wide">
                      {tpl.name}
                    </h4>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(tpl.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                        title={t('workouts.duplicateTemplate')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTemplateToDelete(tpl)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 transition-colors cursor-pointer"
                        title={t('workouts.deleteTemplate')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {tpl.description && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2">
                      {tpl.description}
                    </p>
                  )}

                  {/* Exercises badges list */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tpl.exercises.slice(0, 4).map((ex, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-white/80 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                      >
                        {ex.exerciseName}
                      </span>
                    ))}
                    {tpl.exercises.length > 4 && (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-500">
                        +{tpl.exercises.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-500 font-athletic uppercase font-bold tracking-wider">
                    {tpl.exercises.length} Exercises
                  </span>

                  <button
                    type="button"
                    onClick={() => handleStartFromTemplate(tpl)}
                    disabled={isStarting}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider text-white shadow-sm transition-transform active:scale-[0.98] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    style={{ backgroundColor: accentColor }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{t('workouts.startWorkoutFromTemplate')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Routine Creation Modal */}
      <CreateTemplateModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onTemplateCreated={loadTemplates}
      />

      {/* Routine Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={templateToDelete !== null}
        title={t('workoutLogger.confirmDeleteTemplateTitle')}
        message={t('workoutLogger.confirmDeleteTemplateMessage')}
        confirmLabel={t('workoutLogger.deleteBtn')}
        cancelLabel={t('workoutLogger.cancelBtn')}
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setTemplateToDelete(null)}
      />
    </div>
  );
};
