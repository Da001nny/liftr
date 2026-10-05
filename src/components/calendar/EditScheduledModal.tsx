import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Trash2, Check, AlertCircle, Layers } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { updateScheduledWorkout, deleteScheduledWorkout } from '../../lib/calendarService';
import { EnrichedScheduledWorkout, EditingScope } from '../../types/database';

interface EditScheduledModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledWorkout: EnrichedScheduledWorkout | null;
  onSaved: () => void;
  onStartWorkoutNow?: (scheduled: EnrichedScheduledWorkout) => void;
}

export const EditScheduledModal: React.FC<EditScheduledModalProps> = ({
  isOpen,
  onClose,
  scheduledWorkout,
  onSaved,
  onStartWorkoutNow,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const isRecurring = Boolean(scheduledWorkout?.series_id);

  const [name, setName] = useState<string>(scheduledWorkout?.name || '');
  const [scheduledDate, setScheduledDate] = useState<string>(scheduledWorkout?.scheduled_date || '');
  const [scheduledTime, setScheduledTime] = useState<string>(scheduledWorkout?.scheduled_time || '09:00');
  const [status, setStatus] = useState<any>(scheduledWorkout?.status || 'scheduled');
  const [notes, setNotes] = useState<string>(scheduledWorkout?.notes || '');
  const [scope, setScope] = useState<EditingScope>('this_occurrence');

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  React.useEffect(() => {
    if (scheduledWorkout) {
      setName(scheduledWorkout.name);
      setScheduledDate(scheduledWorkout.scheduled_date);
      setScheduledTime(scheduledWorkout.scheduled_time || '09:00');
      setStatus(scheduledWorkout.status);
      setNotes(scheduledWorkout.notes || '');
      setScope('this_occurrence');
    }
  }, [scheduledWorkout]);

  if (!isOpen || !scheduledWorkout) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isSubmitting) return;

    setIsSubmitting(true);
    const ok = await updateScheduledWorkout(token, scheduledWorkout.id, {
      name: name.trim(),
      scheduledDate,
      scheduledTime,
      status,
      notes: notes.trim(),
      scope: isRecurring ? scope : 'this_occurrence',
    });
    setIsSubmitting(false);

    if (ok) {
      onSaved();
      onClose();
    }
  };

  const handleDelete = async (deleteScope: EditingScope) => {
    if (!token || isDeleting) return;

    setIsDeleting(true);
    const ok = await deleteScheduledWorkout(token, scheduledWorkout.id, deleteScope);
    setIsDeleting(false);

    if (ok) {
      onSaved();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#161616] border border-neutral-300 dark:border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-neutral-900 dark:text-white my-8 max-h-[90vh] overflow-y-auto"
        data-surface="primary-metallic"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black font-display uppercase tracking-wide">
                {t('calendar.editScheduleModalTitle')}
              </h3>
              {isRecurring && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                  Recurring Series
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
              {scheduledWorkout.scheduled_date} · {scheduledWorkout.scheduled_time}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Start Workout Banner if scheduled / pending */}
        {onStartWorkoutNow && scheduledWorkout.status !== 'completed' && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between gap-4">
            <div>
              <span className="font-bold text-emerald-950 dark:text-emerald-300 text-xs block">
                Ready to train?
              </span>
              <span className="text-[11px] text-emerald-800 dark:text-emerald-400/90 font-medium">
                Launch this session into the active workout takeover tracker.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onStartWorkoutNow(scheduledWorkout);
                onClose();
              }}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-athletic uppercase tracking-wider text-xs transition-colors shrink-0 cursor-pointer shadow-md"
            >
              {t('calendar.startWorkoutNow')}
            </button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Workout Name */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              {t('calendar.workoutNameLabel')} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date & Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>{t('calendar.dateLabel')} *</span>
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{t('calendar.timeLabel')}</span>
              </label>
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              Session Status
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 'scheduled', label: t('calendar.scheduledBadge'), color: 'border-blue-500/40 text-blue-400' },
                { val: 'completed', label: t('calendar.completedBadge'), color: 'border-emerald-500/40 text-emerald-400' },
                { val: 'cancelled', label: 'Cancelled', color: 'border-neutral-600 text-neutral-400' },
              ].map(s => (
                <button
                  key={s.val}
                  type="button"
                  onClick={() => setStatus(s.val)}
                  className={`py-2 px-3 rounded-xl font-bold font-athletic uppercase text-xs border transition-all cursor-pointer ${
                    status === s.val
                      ? 'bg-neutral-200 dark:bg-neutral-800 border-white/40 shadow-sm'
                      : 'border-neutral-300 dark:border-neutral-800 text-neutral-500 hover:text-neutral-300'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recurrence Scope Selector (Step 4 Requirement: test all 3 scopes) */}
          {isRecurring && (
            <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="flex items-center gap-2 text-neutral-900 dark:text-white font-bold text-xs">
                <Layers className="w-4 h-4 text-purple-400" />
                <span>{t('calendar.scopeModalTitle')}</span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                {t('calendar.scopeModalDesc')}
              </p>

              <div className="space-y-2">
                {[
                  {
                    key: 'this_occurrence',
                    title: t('calendar.scopeThisOnly'),
                    desc: t('calendar.scopeThisOnlyDesc'),
                  },
                  {
                    key: 'this_and_future',
                    title: t('calendar.scopeThisAndFuture'),
                    desc: t('calendar.scopeThisAndFutureDesc'),
                  },
                  {
                    key: 'entire_series',
                    title: t('calendar.scopeEntireSeries'),
                    desc: t('calendar.scopeEntireSeriesDesc'),
                  },
                ].map(opt => (
                  <label
                    key={opt.key}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      scope === opt.key
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="editing_scope"
                      checked={scope === opt.key}
                      onChange={() => setScope(opt.key as EditingScope)}
                      className="mt-0.5 text-purple-600 focus:ring-purple-500 cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block text-xs">
                        {opt.title}
                      </span>
                      <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        {opt.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              {t('calendar.notesLabel')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Session notes or observations..."
              className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions & Deletion */}
          <div className="pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            {/* Delete button (with popover / sub-actions if recurring) */}
            {isRecurring ? (
              <div className="relative group">
                <button
                  type="button"
                  className="px-3 py-2 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-athletic uppercase tracking-wider"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('calendar.deleteBtn')}</span>
                </button>
                <div className="hidden group-hover:block group-focus-within:block absolute bottom-full left-0 mb-2 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl z-20 space-y-1">
                  <span className="text-[10px] font-bold text-neutral-400 px-2 py-1 block uppercase font-athletic">
                    {t('calendar.deleteScopeTitle')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete('this_occurrence')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    {t('calendar.deleteThisOnly')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete('this_and_future')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                  >
                    {t('calendar.deleteThisAndFuture')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete('entire_series')}
                    className="w-full text-left px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-500/30 rounded-lg transition-colors cursor-pointer font-bold"
                  >
                    {t('calendar.deleteEntireSeries')}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleDelete('this_occurrence')}
                className="px-3 py-2 text-xs font-bold text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 font-athletic uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t('calendar.deleteBtn')}</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer font-bold font-athletic uppercase tracking-wider"
              >
                {t('common.cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-white font-bold font-athletic uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                style={{ backgroundColor: accentColor }}
              >
                <Check className="w-4 h-4" />
                <span>{isSubmitting ? 'Updating...' : 'Update Session'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
