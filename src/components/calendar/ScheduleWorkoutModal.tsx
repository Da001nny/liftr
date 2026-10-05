import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Clock, Dumbbell, Repeat, Check } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { fetchTemplates, EnrichedWorkoutTemplate } from '../../lib/workoutService';
import { createScheduledWorkout, CreateScheduledPayload } from '../../lib/calendarService';
import { RecurrenceType } from '../../types/database';
import { NumericStepper } from './NumericStepper';

interface ScheduleWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string; // YYYY-MM-DD
  onSaved: () => void;
}

const DAYS_OF_WEEK = [
  { day: 0, label: 'Sun', short: 'S' },
  { day: 1, label: 'Mon', short: 'M' },
  { day: 2, label: 'Tue', short: 'T' },
  { day: 3, label: 'Wed', short: 'W' },
  { day: 4, label: 'Thu', short: 'T' },
  { day: 5, label: 'Fri', short: 'F' },
  { day: 6, label: 'Sat', short: 'S' },
];

export const ScheduleWorkoutModal: React.FC<ScheduleWorkoutModalProps> = ({
  isOpen,
  onClose,
  initialDate,
  onSaved,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const todayStr = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState('');
  const [templateId, setTemplateId] = useState<string>('');
  const [scheduledDate, setScheduledDate] = useState<string>(initialDate || todayStr);
  const [scheduledTime, setScheduledTime] = useState<string>('09:00');
  const [notes, setNotes] = useState<string>('');

  // Recurrence states
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>('weekly');
  const [recurrenceInterval, setRecurrenceInterval] = useState<number>(1);
  const [selectedDays, setSelectedDays] = useState<number[]>([new Date().getDay()]);
  const [endDate, setEndDate] = useState<string>('');
  const [templates, setTemplates] = useState<EnrichedWorkoutTemplate[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (initialDate) {
      setScheduledDate(initialDate);
      const [y, m, d] = initialDate.split('-').map(Number);
      const dayOfWeek = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
      setSelectedDays([dayOfWeek]);
    }
  }, [initialDate]);

  useEffect(() => {
    if (!token || !isOpen) return;
    fetchTemplates(token).then(tpls => {
      setTemplates(tpls);
    });
  }, [token, isOpen]);

  if (!isOpen) return null;

  const handleTemplateChange = (tplId: string) => {
    setTemplateId(tplId);
    if (tplId) {
      const selected = templates.find(t => t.id === tplId);
      if (selected && !name) {
        setName(selected.name);
      }
    }
  };

  const toggleDay = (day: number) => {
    setSelectedDays(prev => {
      if (prev.includes(day)) {
        if (prev.length === 1) return prev; // Keep at least one day
        return prev.filter(d => d !== day);
      }
      return [...prev, day].sort((a, b) => a - b);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || isSubmitting) return;

    const finalName = name.trim() || (templateId ? templates.find(t => t.id === templateId)?.name : 'Scheduled Workout') || 'Scheduled Workout';

    const payload: CreateScheduledPayload = {
      name: finalName,
      templateId: templateId || null,
      scheduledDate,
      scheduledTime,
      notes: notes.trim() || undefined,
      isRecurring,
      recurrenceType: isRecurring ? recurrenceType : undefined,
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
      daysOfWeek: isRecurring && (recurrenceType === 'weekly' || recurrenceType === 'custom') ? selectedDays : undefined,
      endDate: isRecurring && endDate ? endDate : undefined,
      userTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    };

    setIsSubmitting(true);
    const result = await createScheduledWorkout(token, payload);
    setIsSubmitting(false);

    if (result) {
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
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black font-display uppercase tracking-wide">
                {t('calendar.scheduleModalTitle')}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                {scheduledDate} · {scheduledTime}
              </p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Template Selection */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              {t('calendar.selectTemplateLabel')}
            </label>
            <select
              value={templateId}
              onChange={(e) => handleTemplateChange(e.target.value)}
              className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('calendar.customWorkoutOption')}</option>
              {templates.map(tpl => (
                <option key={tpl.id} value={tpl.id}>
                  {tpl.name} ({tpl.exercises.length} exercises)
                </option>
              ))}
            </select>
          </div>

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
              placeholder="e.g. Upper Body Power, Heavy Squats..."
              className="w-full h-11 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Recurrence Toggle Box */}
          <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-neutral-900 dark:text-white block text-xs">
                    {t('calendar.recurringToggle')}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    Automatically generate upcoming occurrences across weeks
                  </span>
                </div>
              </div>

              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
            </div>

            {isRecurring && (
              <div className="space-y-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 animate-fadeIn">
                {/* Pattern selector */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                    {t('calendar.recurrenceLabel')}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {(['daily', 'weekly', 'biweekly', 'custom'] as RecurrenceType[]).map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setRecurrenceType(type);
                          if (type === 'biweekly') setRecurrenceInterval(2);
                          else if (type === 'weekly' || type === 'daily') setRecurrenceInterval(1);
                        }}
                        className={`py-2 px-2 rounded-xl font-bold font-athletic uppercase tracking-wider text-[11px] transition-all cursor-pointer ${
                          recurrenceType === type
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                        }`}
                      >
                        {type === 'daily' && t('calendar.recurrenceDaily')}
                        {type === 'weekly' && t('calendar.recurrenceWeekly')}
                        {type === 'biweekly' && t('calendar.recurrenceBiweekly')}
                        {type === 'custom' && t('calendar.recurrenceCustom')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recurrence Interval Stepper (Step 7 requirement: single & multi digit typing) */}
                {(recurrenceType === 'daily' || recurrenceType === 'custom' || recurrenceType === 'weekly') && (
                  <NumericStepper
                    label={`${t('calendar.intervalLabel')} (${recurrenceType === 'daily' ? 'Days' : 'Weeks'})`}
                    value={recurrenceInterval}
                    onChange={setRecurrenceInterval}
                    min={1}
                    max={52}
                    unit={recurrenceType === 'daily' ? 'day(s)' : 'week(s)'}
                  />
                )}

                {/* Days of Week (Weekly / Custom) */}
                {(recurrenceType === 'weekly' || recurrenceType === 'biweekly' || recurrenceType === 'custom') && (
                  <div className="space-y-1.5">
                    <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                      {t('calendar.daysOfWeekLabel')}
                    </label>
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                      {DAYS_OF_WEEK.map(d => {
                        const isSelected = selectedDays.includes(d.day);
                        return (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => toggleDay(d.day)}
                            className={`w-9 h-9 rounded-xl font-bold font-athletic uppercase text-xs flex items-center justify-center transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-sm scale-105'
                                : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-700'
                            }`}
                          >
                            {d.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* End Date (Optional) */}
                <div className="space-y-1.5">
                  <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
                    {t('calendar.seriesEndDateLabel')}
                  </label>
                  <input
                    type="date"
                    min={scheduledDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              {t('calendar.notesLabel')}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Focus on deep pause reps, remember mobility warmup..."
              className="w-full p-3 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
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
              className="px-6 py-2.5 rounded-xl text-white font-bold font-athletic uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
              style={{ backgroundColor: accentColor }}
            >
              <Check className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : t('calendar.saveScheduleBtn')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
