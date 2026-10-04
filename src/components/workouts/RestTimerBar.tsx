import React, { useEffect, useState, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  X, 
  Volume2, 
  Sparkles,
  FastForward
} from 'lucide-react';
import { playRestTimerAlert } from '../../lib/soundAlert';

interface RestTimerBarProps {
  initialSeconds: number;
  exerciseName?: string;
  isActive: boolean;
  onClose: () => void;
  onComplete?: () => void;
  accentColor?: string;
}

export const RestTimerBar: React.FC<RestTimerBarProps> = ({
  initialSeconds,
  exerciseName,
  isActive,
  onClose,
  onComplete,
  accentColor = '#3b82f6',
}) => {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(initialSeconds);
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const hasTriggeredAlertRef = useRef<boolean>(false);

  useEffect(() => {
    setRemainingSeconds(initialSeconds);
    setTotalSeconds(initialSeconds);
    setIsPaused(false);
    hasTriggeredAlertRef.current = false;
  }, [initialSeconds]);

  useEffect(() => {
    if (!isActive || isPaused) return;

    if (remainingSeconds <= 0) {
      if (!hasTriggeredAlertRef.current) {
        hasTriggeredAlertRef.current = true;
        playRestTimerAlert();
        onComplete?.();
      }
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!hasTriggeredAlertRef.current) {
            hasTriggeredAlertRef.current = true;
            playRestTimerAlert();
            onComplete?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, isPaused, remainingSeconds, onComplete]);

  if (!isActive) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  const progressPercent = totalSeconds > 0 
    ? Math.max(0, Math.min(100, ((totalSeconds - remainingSeconds) / totalSeconds) * 100))
    : 100;

  const handleAdjustTime = (deltaSeconds: number) => {
    setRemainingSeconds(prev => {
      const next = Math.max(0, prev + deltaSeconds);
      if (next > totalSeconds) setTotalSeconds(next);
      return next;
    });
    hasTriggeredAlertRef.current = false;
  };

  const handleRestart = () => {
    setRemainingSeconds(totalSeconds);
    setIsPaused(false);
    hasTriggeredAlertRef.current = false;
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 animate-in slide-in-from-bottom-5 duration-200">
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-4 sm:p-5 bg-neutral-950 text-white border border-neutral-700 shadow-2xl backdrop-blur-xl max-w-sm w-[340px] space-y-3 ring-1 ring-white/10"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span 
              className={`w-2.5 h-2.5 rounded-full ${remainingSeconds === 0 ? 'bg-emerald-400 animate-ping' : 'animate-pulse'}`}
              style={{ backgroundColor: remainingSeconds > 0 ? accentColor : undefined }}
            />
            <span className="text-[11px] font-athletic font-bold uppercase tracking-wider text-neutral-400">
              Rest Interval {exerciseName && `• ${exerciseName}`}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            title="Dismiss Timer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Big Digital Display + Progress */}
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className={`text-3xl font-black font-stat tracking-tight ${remainingSeconds === 0 ? 'text-emerald-400 animate-pulse' : 'text-white'}`}>
              {formattedTime}
            </span>
            <span className="text-[10px] font-mono text-neutral-400 block">
              {remainingSeconds === 0 ? 'Rest complete! Ready for next set.' : `${totalSeconds}s target`}
            </span>
          </div>

          {/* Quick adjust buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleAdjustTime(-15)}
              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-neutral-300 transition-colors cursor-pointer"
              title="-15 seconds"
            >
              -15s
            </button>
            <button
              type="button"
              onClick={() => handleAdjustTime(30)}
              className="px-2 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono font-bold text-neutral-300 transition-colors cursor-pointer"
              title="+30 seconds"
            >
              +30s
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300"
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: remainingSeconds === 0 ? '#10b981' : accentColor 
            }}
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-athletic font-bold uppercase"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
              title="Restart Interval"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-athletic font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Skip</span>
            <FastForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
