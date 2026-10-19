import React, { useEffect, useRef } from 'react';
import { Timer, X, Plus, Minus, Play, Pause, BellRing } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';

interface RestTimerBarProps {
  remainingSeconds: number;
  totalSeconds: number;
  isActive: boolean;
  onAdjustSeconds: (delta: number) => void;
  onTogglePause: () => void;
  onSkip: () => void;
}

export function playRestCompletionChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;
    
    // Pleasant 3-note harmonic chime (C5, E5, G5)
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.14);
      gain.gain.setValueAtTime(0.25, now + idx * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.14 + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.14);
      osc.stop(now + idx * 0.14 + 0.45);
    });
  } catch (err) {
    // Graceful fallback if audio is not permitted
  }

  // Haptic feedback alert with graceful fallback
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200]);
    } catch {}
  }
}

export const RestTimerBar: React.FC<RestTimerBarProps> = ({
  remainingSeconds,
  totalSeconds,
  isActive,
  onAdjustSeconds,
  onTogglePause,
  onSkip,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const prevRemaining = useRef(remainingSeconds);

  // Play chime and vibrate when timer reaches exactly 0
  useEffect(() => {
    if (prevRemaining.current > 0 && remainingSeconds === 0) {
      playRestCompletionChime();
    }
    prevRemaining.current = remainingSeconds;
  }, [remainingSeconds]);

  if (remainingSeconds <= 0 && !isActive) {
    return null;
  }

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = totalSeconds > 0 ? Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100) : 0;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-md animate-slideUp">
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-3 sm:p-4 bg-white/95 dark:bg-[#18181b]/95 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 shadow-2xl transition-all"
      >
        {/* Progress Bar Line */}
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div 
            className="h-full transition-all duration-300 rounded-full"
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: accentColor 
            }}
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
            >
              <Timer className="w-5 h-5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic">
                  {t('workoutLogger.restTimerTitle')}
                </span>
                {remainingSeconds === 0 && (
                  <BellRing className="w-3.5 h-3.5 text-emerald-500 animate-bounce" />
                )}
              </div>
              <span className="text-xl sm:text-2xl font-black font-stat tracking-tight text-neutral-900 dark:text-white">
                {timeFormatted}
              </span>
            </div>
          </div>

          {/* Quick Adjust & Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onAdjustSeconds(-15)}
              className="px-2 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 font-athletic transition-colors cursor-pointer"
              title={t('workoutLogger.minus15Sec')}
            >
              {t('workoutLogger.restTimerSub15')}
            </button>

            <button
              type="button"
              onClick={() => onAdjustSeconds(30)}
              className="px-2 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-300 font-athletic transition-colors cursor-pointer"
              title={t('workoutLogger.plus30Sec')}
            >
              {t('workoutLogger.restTimerAdd30')}
            </button>

            <button
              type="button"
              onClick={onTogglePause}
              className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
              title={isActive ? t('workoutLogger.restTimerPause') : t('workoutLogger.restTimerResume')}
            >
              {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onSkip}
              className="p-2 rounded-lg bg-neutral-200/80 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
              title={t('workoutLogger.restTimerSkip')}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
