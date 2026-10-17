import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  X, 
  Check, 
  Clock, 
  Flame, 
  Trophy, 
  Moon, 
  Layers, 
  Sparkles,
  Info,
  CalendarDays,
  Columns,
  Square,
  Dumbbell
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useWorkout } from '../context/WorkoutContext';
import { 
  fetchCalendarMonth, 
  CalendarMonthDataResponse, 
  addDaysUtc,
  getDayOfWeekUtc,
  utcIsoToLocalDate
} from '../lib/calendarService';
import { 
  EnrichedScheduledWorkout, 
  CalendarDayData, 
  CalendarRestDayRow, 
  CalendarNoteRow 
} from '../types/database';
import { MUSCLES, EXERCISES, CONTRIBUTIONS_BY_EXERCISE } from '../data/exerciseCatalog';
import { formatLocalTimestamp } from '../lib/calculations';
import { formatMonthYear, formatFullDate } from '../lib/date';
import { getMuscleLabel, getMuscleCommonName } from '../lib/labels';
import { formatWeight } from '../lib/units';
import { ScheduleWorkoutModal } from './calendar/ScheduleWorkoutModal';
import { EditScheduledModal } from './calendar/EditScheduledModal';
import { DayDetailsModal } from './calendar/DayDetailsModal';

type CalendarViewMode = 'month' | 'week' | 'day';

export const CalendarView: React.FC = () => {
  const { t, tn } = useTranslation();
  const { accentColor, weightUnit } = useTheme();
  const { token } = useAuth();
  const { startBlankWorkout, startWorkoutFromTemplate, setActiveSession } = useWorkout();

  // Navigation State
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');

  // Month Data State
  const [monthData, setMonthData] = useState<CalendarMonthDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter State (Step 6: Filter by muscle & exercise)
  const [selectedMuscleFilter, setSelectedMuscleFilter] = useState<string>('');
  const [selectedExerciseFilter, setSelectedExerciseFilter] = useState<string>('');

  // Modals
  const [isScheduleOpen, setIsScheduleOpen] = useState<boolean>(false);
  const [scheduleInitialDate, setScheduleInitialDate] = useState<string>('');
  const [selectedScheduled, setSelectedScheduled] = useState<EnrichedScheduledWorkout | null>(null);
  const [selectedDayDetails, setSelectedDayDetails] = useState<CalendarDayData | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1; // 1-indexed (1..12)

  const loadCalendarData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    const data = await fetchCalendarMonth(token, year, month);
    setMonthData(data);
    setLoading(false);
  }, [token, year, month]);

  useEffect(() => {
    loadCalendarData();
  }, [loadCalendarData]);

  // Navigation Handlers
  const handlePrev = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month - 2, 1));
    } else if (viewMode === 'week') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() - 7);
      setCurrentDate(next);
    } else {
      const next = new Date(currentDate);
      next.setDate(next.getDate() - 1);
      setCurrentDate(next);
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      setCurrentDate(new Date(year, month, 1));
    } else if (viewMode === 'week') {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 7);
      setCurrentDate(next);
    } else {
      const next = new Date(currentDate);
      next.setDate(next.getDate() + 1);
      setCurrentDate(next);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Launch Workout from Calendar
  const handleStartWorkoutNow = async (scheduled: EnrichedScheduledWorkout) => {
    if (scheduled.template_id) {
      // Find template or start blank with name
      await startBlankWorkout(scheduled.name);
    } else {
      await startBlankWorkout(scheduled.name);
    }
  };

  // Map month items by YYYY-MM-DD for fast cell rendering
  const calendarMap = useMemo(() => {
    const map = new Map<string, {
      scheduled: EnrichedScheduledWorkout[];
      completed: any[];
      restDay: CalendarRestDayRow | null;
      notes: CalendarNoteRow[];
      prs: any[];
      trainedMuscles: Set<string>;
      performedExercises: Set<string>;
    }>();

    if (!monthData) return map;

    // 1. Scheduled
    monthData.scheduledWorkouts.forEach(sw => {
      const dateKey = sw.scheduled_date;
      if (!map.has(dateKey)) {
        map.set(dateKey, { scheduled: [], completed: [], restDay: null, notes: [], prs: [], trainedMuscles: new Set(), performedExercises: new Set() });
      }
      map.get(dateKey)!.scheduled.push(sw);
    });

    // 2. Completed Workouts
    monthData.completedWorkouts.forEach(w => {
      const dateKey = w.completed_at ? w.completed_at.slice(0, 10) : w.started_at.slice(0, 10);
      if (!map.has(dateKey)) {
        map.set(dateKey, { scheduled: [], completed: [], restDay: null, notes: [], prs: [], trainedMuscles: new Set(), performedExercises: new Set() });
      }
      const day = map.get(dateKey)!;
      day.completed.push(w);

      if (w.workout_exercises) {
        w.workout_exercises.forEach((we: any) => {
          day.performedExercises.add(we.exercise_id);
          // Look up contributions
          const contribs = CONTRIBUTIONS_BY_EXERCISE.get(we.exercise_id) || [];
          contribs.forEach(c => day.trainedMuscles.add(c.muscleId));
        });
      }
    });

    // 3. Rest Days
    monthData.restDays.forEach(r => {
      if (!map.has(r.date)) {
        map.set(r.date, { scheduled: [], completed: [], restDay: null, notes: [], prs: [], trainedMuscles: new Set(), performedExercises: new Set() });
      }
      map.get(r.date)!.restDay = r;
    });

    // 4. Notes
    monthData.notes.forEach(n => {
      if (!map.has(n.date)) {
        map.set(n.date, { scheduled: [], completed: [], restDay: null, notes: [], prs: [], trainedMuscles: new Set(), performedExercises: new Set() });
      }
      map.get(n.date)!.notes.push(n);
    });

    // 5. PRs
    monthData.personalRecords.forEach(pr => {
      const dateKey = pr.achieved_at ? pr.achieved_at.slice(0, 10) : '';
      if (dateKey) {
        if (!map.has(dateKey)) {
          map.set(dateKey, { scheduled: [], completed: [], restDay: null, notes: [], prs: [], trainedMuscles: new Set(), performedExercises: new Set() });
        }
        map.get(dateKey)!.prs.push(pr);
      }
    });

    return map;
  }, [monthData]);

  // Generate Month Grid (42 cells: 6 weeks × 7 days)
  const monthGridDays = useMemo(() => {
    const days: CalendarDayData[] = [];
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sun .. 6 = Sat
    const daysInMonth = new Date(year, month, 0).getDate();

    const todayStr = new Date().toISOString().slice(0, 10);

    // Days before month
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, -i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayDetails = calendarMap.get(dateStr);
      days.push({
        dateStr,
        dayNumber: d.getDate(),
        isToday: dateStr === todayStr,
        isCurrentMonth: false,
        scheduledWorkouts: dayDetails?.scheduled || [],
        completedWorkouts: dayDetails?.completed || [],
        restDay: dayDetails?.restDay || null,
        notes: dayDetails?.notes || [],
        personalRecords: dayDetails?.prs || [],
        trainedMuscles: Array.from(dayDetails?.trainedMuscles || []),
        performedExercises: Array.from(dayDetails?.performedExercises || []),
      });
    }

    // Days of current month
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      const dayDetails = calendarMap.get(dateStr);
      days.push({
        dateStr,
        dayNumber: dayNum,
        isToday: dateStr === todayStr,
        isCurrentMonth: true,
        scheduledWorkouts: dayDetails?.scheduled || [],
        completedWorkouts: dayDetails?.completed || [],
        restDay: dayDetails?.restDay || null,
        notes: dayDetails?.notes || [],
        personalRecords: dayDetails?.prs || [],
        trainedMuscles: Array.from(dayDetails?.trainedMuscles || []),
        performedExercises: Array.from(dayDetails?.performedExercises || []),
      });
    }

    // Trailing days to fill 35 or 42 cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month, i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayDetails = calendarMap.get(dateStr);
      days.push({
        dateStr,
        dayNumber: d.getDate(),
        isToday: dateStr === todayStr,
        isCurrentMonth: false,
        scheduledWorkouts: dayDetails?.scheduled || [],
        completedWorkouts: dayDetails?.completed || [],
        restDay: dayDetails?.restDay || null,
        notes: dayDetails?.notes || [],
        personalRecords: dayDetails?.prs || [],
        trainedMuscles: Array.from(dayDetails?.trainedMuscles || []),
        performedExercises: Array.from(dayDetails?.performedExercises || []),
      });
    }

    return days;
  }, [year, month, calendarMap]);

  // Week View Days (7 days for the current selected week)
  const weekViewDays = useMemo(() => {
    const days: CalendarDayData[] = [];
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay(); // 0 = Sun
    const startOfWeek = new Date(curr);
    startOfWeek.setDate(curr.getDate() - dayOfWeek);

    const todayStr = new Date().toISOString().slice(0, 10);

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const dateStr = d.toISOString().slice(0, 10);
      const dayDetails = calendarMap.get(dateStr);
      days.push({
        dateStr,
        dayNumber: d.getDate(),
        isToday: dateStr === todayStr,
        isCurrentMonth: d.getMonth() === currentDate.getMonth(),
        scheduledWorkouts: dayDetails?.scheduled || [],
        completedWorkouts: dayDetails?.completed || [],
        restDay: dayDetails?.restDay || null,
        notes: dayDetails?.notes || [],
        personalRecords: dayDetails?.prs || [],
        trainedMuscles: Array.from(dayDetails?.trainedMuscles || []),
        performedExercises: Array.from(dayDetails?.performedExercises || []),
      });
    }
    return days;
  }, [currentDate, calendarMap]);

  // Day View Data
  const dayViewData = useMemo(() => {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const dayDetails = calendarMap.get(dateStr);
    const todayStr = new Date().toISOString().slice(0, 10);
    return {
      dateStr,
      dayNumber: currentDate.getDate(),
      isToday: dateStr === todayStr,
      isCurrentMonth: true,
      scheduledWorkouts: dayDetails?.scheduled || [],
      completedWorkouts: dayDetails?.completed || [],
      restDay: dayDetails?.restDay || null,
      notes: dayDetails?.notes || [],
      personalRecords: dayDetails?.prs || [],
      trainedMuscles: Array.from(dayDetails?.trainedMuscles || []),
      performedExercises: Array.from(dayDetails?.performedExercises || []),
    };
  }, [currentDate, calendarMap]);

  // Title formatting
  const formattedTitle = useMemo(() => {
    if (viewMode === 'month') {
      return formatMonthYear(currentDate);
    } else if (viewMode === 'week') {
      const first = weekViewDays[0]?.dateStr;
      const last = weekViewDays[6]?.dateStr;
      return `Week of ${first} – ${last}`;
    } else {
      return formatFullDate(currentDate);
    }
  }, [viewMode, currentDate, weekViewDays]);

  const stats = monthData?.stats || { totalScheduled: 0, completedScheduled: 0, consistencyPercent: 100 };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-24 md:pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('calendar.title')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('calendar.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setScheduleInitialDate(new Date().toISOString().slice(0, 10));
              setIsScheduleOpen(true);
            }}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center gap-1.5 cursor-pointer font-athletic"
            style={{ backgroundColor: accentColor }}
          >
            <Plus className="w-4 h-4" />
            <span>{t('calendar.scheduleWorkoutBtn')}</span>
          </button>
        </div>
      </div>

      {/* Consistency Metric Card (Authoritative: completed scheduled / explicitly scheduled, 0 -> 100%) */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-7 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
              style={{ backgroundColor: accentColor }}
            >
              <Flame className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
                {t('calendar.consistencyTitle')}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-neutral-900 dark:text-white">
                  {stats.consistencyPercent}%
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  ({stats.completedScheduled} of {stats.totalScheduled} scheduled sessions completed)
                </span>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                {t('calendar.consistencyDesc')}
              </p>
            </div>
          </div>

          {/* Quick Legend Indicators */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">{t('calendar.scheduledBadge')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">{t('calendar.completedBadge')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">{t('calendar.missedBadge')}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="text-neutral-600 dark:text-neutral-400 font-medium">{t('calendar.restDayBadge')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar (Step 6: Filter by Muscle & Exercise to highlight trained dates) */}
      <div className="p-4 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-neutral-500 font-bold font-athletic uppercase">
            <Filter className="w-3.5 h-3.5" />
            <span>{t('calendar.highlights')}</span>
          </div>

          {/* Muscle filter */}
          <select
            value={selectedMuscleFilter}
            onChange={(e) => setSelectedMuscleFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">{t('calendar.allMuscles')}</option>
            {MUSCLES.map(m => (
              <option key={m.id} value={m.id}>{getMuscleLabel(m.id, m.name)} ({getMuscleCommonName(m.id, m.commonName)})</option>
            ))}
          </select>

          {/* Exercise filter */}
          <select
            value={selectedExerciseFilter}
            onChange={(e) => setSelectedExerciseFilter(e.target.value)}
            className="h-9 px-3 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[220px] truncate"
          >
            <option value="">{t('calendar.allExercises')}</option>
            {EXERCISES.map(ex => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>

          {(selectedMuscleFilter || selectedExerciseFilter) && (
            <button
              type="button"
              onClick={() => {
                setSelectedMuscleFilter('');
                setSelectedExerciseFilter('');
              }}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-bold font-athletic uppercase text-[10px]"
            >
              <X className="w-3 h-3" />
              <span>{t('calendar.clearFilter')}</span>
            </button>
          )}
        </div>

        {/* View Switcher (Month / Week / Day) */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-200/80 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 rounded-lg font-bold font-athletic uppercase text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'month'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{t('calendar.monthView')}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 rounded-lg font-bold font-athletic uppercase text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'week'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>{t('calendar.weekView')}</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('day')}
            className={`px-3 py-1.5 rounded-lg font-bold font-athletic uppercase text-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'day'
                ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span>{t('calendar.dayView')}</span>
          </button>
        </div>
      </div>

      {/* Navigation Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={t('calendar.prevPeriod')}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleToday}
            className="px-3.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-neutral-900 dark:text-white font-bold font-athletic uppercase tracking-wider text-xs transition-colors cursor-pointer"
          >
            {t('calendar.today')}
          </button>

          <button
            type="button"
            onClick={handleNext}
            aria-label={t('calendar.nextPeriod')}
            className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white text-right">
          {formattedTitle}
        </h2>
      </div>

      {/* 1. MONTH VIEW */}
      {viewMode === 'month' && (
        <div className="rounded-3xl border border-neutral-300 dark:border-neutral-800 overflow-hidden bg-white dark:bg-[#121212] shadow-sm">
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-center py-2.5 text-xs font-bold font-athletic uppercase tracking-wider text-neutral-500">
            <span>{t('calendar.daysShort.sun')}</span>
            <span>{t('calendar.daysShort.mon')}</span>
            <span>{t('calendar.daysShort.tue')}</span>
            <span>{t('calendar.daysShort.wed')}</span>
            <span>{t('calendar.daysShort.thu')}</span>
            <span>{t('calendar.daysShort.fri')}</span>
            <span>{t('calendar.daysShort.sat')}</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200 dark:divide-neutral-800/80">
            {monthGridDays.map((day) => {
              const isFilteredMuscle = selectedMuscleFilter && day.trainedMuscles.includes(selectedMuscleFilter);
              const isFilteredExercise = selectedExerciseFilter && day.performedExercises.includes(selectedExerciseFilter);
              const isHighlighted = isFilteredMuscle || isFilteredExercise;

              return (
                <div
                  key={day.dateStr}
                  onClick={() => setSelectedDayDetails(day)}
                  className={`min-h-[105px] sm:min-h-[120px] p-2 flex flex-col justify-between transition-all cursor-pointer relative group ${
                    day.isCurrentMonth
                      ? 'bg-white dark:bg-[#121212] hover:bg-neutral-50 dark:hover:bg-neutral-900/50'
                      : 'bg-neutral-50/50 dark:bg-neutral-950/40 opacity-45'
                  } ${isHighlighted ? 'ring-2 ring-inset ring-amber-400 bg-amber-50/30 dark:bg-amber-950/20' : ''}`}
                >
                  {/* Cell Top: Day number + indicators */}
                  <div className="flex items-center justify-between">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      day.isToday
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}>
                      {day.dayNumber}
                    </span>

                    <div className="flex items-center gap-1">
                      {day.restDay && (
                        <span title={t('calendar.restDayTitle')} className="text-amber-500">
                          <Moon className="w-3 h-3 fill-amber-500/20" />
                        </span>
                      )}
                      {day.personalRecords.length > 0 && (
                        <span title={tn('calendar.prCountShort', day.personalRecords.length)} className="text-yellow-500">
                          <Trophy className="w-3 h-3 fill-yellow-500/20" />
                        </span>
                      )}
                      {day.notes.length > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      )}
                    </div>
                  </div>

                  {/* Cell Center: Scheduled & Completed Workouts */}
                  <div className="space-y-1 my-1 overflow-hidden">
                    {/* Scheduled Workouts */}
                    {day.scheduledWorkouts.slice(0, 2).map(sw => {
                      const isMissed = sw.status === 'missed';
                      const isCompleted = sw.status === 'completed';

                      return (
                        <div
                          key={sw.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheduled(sw);
                          }}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold font-athletic uppercase truncate border flex items-center justify-between transition-colors ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30'
                              : (isMissed
                                ? 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/30'
                                : 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/30')
                          }`}
                        >
                          <span className="truncate">{sw.name}</span>
                          <span className="font-mono text-[9px] opacity-75 shrink-0 ml-1">
                            {sw.scheduled_time || '09:00'}
                          </span>
                        </div>
                      );
                    })}

                    {/* Completed Workouts */}
                    {day.completedWorkouts.slice(0, 1).map(w => (
                      <div
                        key={w.id}
                        className="px-1.5 py-0.5 rounded text-[10px] font-bold font-athletic uppercase truncate bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 flex items-center justify-between"
                      >
                        <span className="truncate">{w.name}</span>
                        <span className="font-mono text-[9px] opacity-75">{formatWeight(w.total_volume, weightUnit)}</span>
                      </div>
                    ))}

                    {day.scheduledWorkouts.length + day.completedWorkouts.length > 3 && (
                      <span className="text-[9px] font-bold text-neutral-400 pl-1 block">
                        {t('calendar.moreWorkouts', { count: day.scheduledWorkouts.length + day.completedWorkouts.length - 2 })}
                      </span>
                    )}
                  </div>

                  {/* Cell Bottom: Highlight tag if matched filter */}
                  {isHighlighted && (
                    <span className="text-[9px] font-bold text-amber-500 font-athletic uppercase tracking-wider truncate">
                      {isFilteredMuscle ? t('calendar.muscleHit') : t('calendar.exerciseHit')}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
          {weekViewDays.map(day => (
            <div
              key={day.dateStr}
              onClick={() => setSelectedDayDetails(day)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between min-h-[220px] ${
                day.isToday
                  ? 'bg-neutral-50 dark:bg-neutral-900 border-blue-500 shadow-md'
                  : 'bg-white dark:bg-[#121212] border-neutral-300 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                  <div className="text-left">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-athletic block">
                      {formatLocalTimestamp(`${day.dateStr}T12:00:00Z`, { weekday: 'short' })}
                    </span>
                    <span className="text-xl font-black font-mono text-neutral-900 dark:text-white">
                      {day.dayNumber}
                    </span>
                  </div>
                  {day.restDay && (
                    <span className="text-amber-500">
                      <Moon className="w-4 h-4 fill-amber-500/20" />
                    </span>
                  )}
                </div>

                <div className="space-y-2 mt-3">
                  {day.scheduledWorkouts.map(sw => (
                    <div
                      key={sw.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedScheduled(sw);
                      }}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-bold font-athletic uppercase space-y-0.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{sw.name}</span>
                        <span className="text-[10px] font-mono opacity-70">{sw.scheduled_time}</span>
                      </div>
                      <span className={`text-[9px] font-athletic uppercase px-1.5 py-0.2 rounded-full inline-block ${
                        sw.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : (sw.status === 'missed' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400')
                      }`}>
                        {sw.status}
                      </span>
                    </div>
                  ))}

                  {day.completedWorkouts.map(w => (
                    <div
                      key={w.id}
                      className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-950 dark:text-emerald-300 font-athletic uppercase"
                    >
                      <span className="block truncate">{w.name}</span>
                      <span className="text-[10px] font-mono opacity-80">{formatWeight(w.total_volume, weightUnit)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setScheduleInitialDate(day.dateStr);
                    setIsScheduleOpen(true);
                  }}
                  className="text-[11px] font-bold font-athletic uppercase tracking-wider text-neutral-500 hover:text-blue-500 transition-colors flex items-center justify-end gap-1 ml-auto"
                >
                  <Plus className="w-3 h-3" />
                  <span>{t('calendar.scheduleBtnShort')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. DAY VIEW */}
      {viewMode === 'day' && (
        <div 
          data-surface="primary-metallic"
          className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-[#141414] border border-neutral-300 dark:border-white/15 shadow-xl space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h3 className="text-2xl font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                {formatLocalTimestamp(`${dayViewData.dateStr}T12:00:00Z`, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
                {dayViewData.scheduledWorkouts.length} scheduled · {dayViewData.completedWorkouts.length} completed · {dayViewData.notes.length} notes
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setScheduleInitialDate(dayViewData.dateStr);
                  setIsScheduleOpen(true);
                }}
                className="px-4 py-2 rounded-xl text-white text-xs font-bold font-athletic uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                style={{ backgroundColor: accentColor }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('calendar.scheduleWorkoutBtn')}</span>
              </button>
            </div>
          </div>

          {/* Day View Timeline List */}
          <div className="space-y-4">
            {dayViewData.scheduledWorkouts.length === 0 && dayViewData.completedWorkouts.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <Dumbbell className="w-8 h-8 text-neutral-400 mx-auto" />
                <h4 className="text-base font-bold text-neutral-900 dark:text-white font-display uppercase">
                  {t('calendar.noWorkoutsOnDate')}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Tap Schedule Workout to plan an upcoming session.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {dayViewData.scheduledWorkouts.map(sw => (
                  <div
                    key={sw.id}
                    className="p-5 rounded-2xl bg-neutral-100/90 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                          {sw.name}
                        </span>
                        {sw.series_id && (
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold font-athletic uppercase tracking-wider bg-purple-500/20 text-purple-400 border border-purple-500/30">
                            Recurring Series
                          </span>
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-athletic uppercase tracking-wider ${
                          sw.status === 'completed'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : (sw.status === 'missed' ? 'bg-rose-500/20 text-rose-400' : 'bg-blue-500/20 text-blue-400')
                        }`}>
                          {sw.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-neutral-500 font-medium">
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {sw.scheduled_time}
                        </span>
                        {sw.notes && <span>· {sw.notes}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {sw.status !== 'completed' && (
                        <button
                          type="button"
                          onClick={() => handleStartWorkoutNow(sw)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold font-athletic uppercase text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                        >
                          <span>{t('calendar.startWorkoutNow')}</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedScheduled(sw)}
                        className="px-3.5 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold font-athletic uppercase text-xs transition-colors cursor-pointer"
                      >
                        {t('calendar.editBtn')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <ScheduleWorkoutModal
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        initialDate={scheduleInitialDate}
        onSaved={loadCalendarData}
      />

      <EditScheduledModal
        isOpen={Boolean(selectedScheduled)}
        onClose={() => setSelectedScheduled(null)}
        scheduledWorkout={selectedScheduled}
        onSaved={loadCalendarData}
        onStartWorkoutNow={handleStartWorkoutNow}
      />

      <DayDetailsModal
        isOpen={Boolean(selectedDayDetails)}
        onClose={() => setSelectedDayDetails(null)}
        dayData={selectedDayDetails}
        onRefresh={loadCalendarData}
        onEditScheduled={(sw) => setSelectedScheduled(sw)}
        onScheduleWorkoutOnDate={(dateStr) => {
          setScheduleInitialDate(dateStr);
          setIsScheduleOpen(true);
        }}
        onStartWorkoutNow={handleStartWorkoutNow}
      />
    </div>
  );
};
