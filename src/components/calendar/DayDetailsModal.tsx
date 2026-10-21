import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Dumbbell, 
  Trophy, 
  Moon, 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Play, 
  Edit3, 
  Flame,
  Sparkles
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { 
  CalendarDayData, 
  EnrichedScheduledWorkout, 
  CalendarNoteRow, 
  PersonalRecordRow, 
  WorkoutRow 
} from '../../types/database';
import { 
  setCalendarRestDay, 
  deleteCalendarRestDay, 
  createCalendarNote, 
  deleteCalendarNote 
} from '../../lib/calendarService';
import { formatLocalTimestamp } from '../../lib/calculations';
import { formatWeight, formatPRDisplay } from '../../lib/units';
import { getPRCategoryLabel, getNoteCategoryLabel, getScheduledStatusLabel } from '../../lib/labels';

interface DayDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayData: CalendarDayData | null;
  onRefresh: () => void;
  onEditScheduled: (scheduled: EnrichedScheduledWorkout) => void;
  onScheduleWorkoutOnDate: (dateStr: string) => void;
  onStartWorkoutNow?: (scheduled: EnrichedScheduledWorkout) => void;
}

export const DayDetailsModal: React.FC<DayDetailsModalProps> = ({
  isOpen,
  onClose,
  dayData,
  onRefresh,
  onEditScheduled,
  onScheduleWorkoutOnDate,
  onStartWorkoutNow,
}) => {
  const { t, tn } = useTranslation();
  const { accentColor, weightUnit } = useTheme();
  const { token } = useAuth();

  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteCategory, setNewNoteCategory] = useState<'general' | 'nutrition' | 'recovery'>('general');
  const [restDayNotes, setRestDayNotes] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isSavingRest, setIsSavingRest] = useState(false);

  React.useEffect(() => {
    if (dayData?.restDay) {
      setRestDayNotes(dayData.restDay.notes || '');
    } else {
      setRestDayNotes('');
    }
  }, [dayData]);

  if (!isOpen || !dayData) return null;

  const { dateStr, scheduledWorkouts, completedWorkouts, restDay, notes, personalRecords } = dayData;

  const handleToggleRestDay = async () => {
    if (!token || isSavingRest) return;
    setIsSavingRest(true);
    if (restDay) {
      await deleteCalendarRestDay(token, dateStr);
    } else {
      await setCalendarRestDay(token, dateStr, restDayNotes.trim() || undefined);
    }
    setIsSavingRest(false);
    onRefresh();
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !newNoteContent.trim() || isAddingNote) return;

    setIsAddingNote(true);
    await createCalendarNote(token, dateStr, newNoteContent.trim(), newNoteCategory);
    setNewNoteContent('');
    setIsAddingNote(false);
    onRefresh();
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!token) return;
    await deleteCalendarNote(token, noteId);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#161616] border border-neutral-300 dark:border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-neutral-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto"
        data-surface="primary-metallic"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div 
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide">
                {formatLocalTimestamp(`${dateStr}T12:00:00Z`, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                {dayData.isToday && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {t('calendar.today')}
                  </span>
                )}
                {restDay && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                    <Moon className="w-3 h-3" />
                    <span>{t('calendar.restDayBadge')}</span>
                  </span>
                )}
                {personalRecords.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    <span>{tn('calendar.prCountShort', personalRecords.length)}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action quick bar */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onScheduleWorkoutOnDate(dateStr);
            }}
            className="px-3.5 py-2 rounded-xl text-white text-xs font-bold font-athletic uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all cursor-pointer hover:opacity-90"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('calendar.scheduleWorkoutBtn')}</span>
          </button>

          <button
            type="button"
            onClick={handleToggleRestDay}
            disabled={isSavingRest}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold font-athletic uppercase tracking-wider border transition-colors cursor-pointer flex items-center gap-1.5 ${
              restDay
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700 hover:border-amber-500/40'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>{restDay ? t('calendar.unmarkRestDay') : t('calendar.markRestDay')}</span>
          </button>
        </div>

        {/* 1. Scheduled Workouts */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>{t('calendar.scheduledWorkoutsCount', { count: scheduledWorkouts.length })}</span>
            </span>
          </div>

          {scheduledWorkouts.length === 0 ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 italic py-2">
              {t('calendar.noSessionsScheduledOnDate')}
            </p>
          ) : (
            <div className="space-y-2">
              {scheduledWorkouts.map(sw => {
                const isMissed = sw.status === 'missed';
                const isCompleted = sw.status === 'completed';

                return (
                  <div
                    key={sw.id}
                    className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all hover:border-neutral-400 dark:hover:border-neutral-700"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                          {sw.name}
                        </span>
                        {sw.series_id && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold font-athletic uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            {t('calendar.recurringSeries')}
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : (isMissed
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30')
                        }`}>
                          {getScheduledStatusLabel(sw.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {sw.scheduled_time || '09:00'}
                        </span>
                        {sw.notes && (
                          <span className="truncate max-w-[200px]">· {sw.notes}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {onStartWorkoutNow && !isCompleted && (
                        <button
                          type="button"
                          onClick={() => {
                            onStartWorkoutNow(sw);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-athletic uppercase text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{t('common.start')}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onEditScheduled(sw);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold font-athletic uppercase text-xs flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{t('common.edit')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Completed Workouts */}
        {completedWorkouts.length > 0 && (
          <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-500 font-athletic flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" />
              <span>{t('calendar.completedWorkoutsCount', { count: completedWorkouts.length })}</span>
            </span>
            <div className="space-y-2">
              {completedWorkouts.map((w: any) => (
                <div 
                  key={w.id}
                  className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                      {w.name}
                    </span>
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      {formatWeight(w.total_volume, weightUnit)} {w.total_completed_sets !== undefined ? t('calendar.setsCompletedCount', { count: w.total_completed_sets }) : ''}
                    </span>
                  </div>
                  {w.workout_exercises && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {w.workout_exercises.map((we: any) => (
                        <span 
                          key={we.id}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold font-athletic uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                        >
                          {we.exercise_id?.replace(/^ex_/, '').replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Personal Records on this day */}
        {personalRecords.length > 0 && (
          <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-500 font-athletic flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" />
              <span>{t('calendar.personalRecordsAchieved')}</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {personalRecords.map(pr => (
                <div
                  key={pr.id}
                  className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-yellow-950 dark:text-yellow-200 block uppercase font-display">
                      {pr.exercise_id?.replace(/^ex_/, '').replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-yellow-800 dark:text-yellow-400/80 font-athletic uppercase tracking-wider">
                      {getPRCategoryLabel(pr.category)}
                    </span>
                  </div>
                  <span className="text-sm font-mono font-black text-yellow-900 dark:text-yellow-100">
                    {formatPRDisplay(pr, weightUnit)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Notes Section */}
        <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>{t('calendar.notesTitle')} ({notes.length})</span>
          </span>

          {notes.map(n => (
            <div 
              key={n.id}
              className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded text-[9px] font-bold font-athletic uppercase tracking-wider bg-neutral-200 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  {getNoteCategoryLabel(n.category)}
                </span>
                <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                  {n.content}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNote(n.id)}
                className="text-neutral-400 hover:text-red-400 p-1 transition-colors cursor-pointer"
                title={t('calendar.deleteNoteTitle')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {/* Add Note Form */}
          <form onSubmit={handleAddNote} className="space-y-2 pt-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                placeholder={t('calendar.noteContentPlaceholder')}
                className="flex-1 h-10 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={newNoteCategory}
                onChange={(e: any) => setNewNoteCategory(e.target.value)}
                className="h-10 px-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">{t('calendar.noteCategoryGeneral')}</option>
                <option value="nutrition">{t('calendar.noteCategoryNutrition')}</option>
                <option value="recovery">{t('calendar.noteCategoryRecovery')}</option>
              </select>
              <button
                type="submit"
                disabled={!newNoteContent.trim() || isAddingNote}
                className="px-4 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-40 text-neutral-900 dark:text-white font-bold font-athletic uppercase text-xs transition-colors cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
