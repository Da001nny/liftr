import React from 'react';
import { Minus, Plus } from 'lucide-react';

interface NumericStepperProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
}

/**
 * Robust numeric stepper satisfying Phase 4 Step 7:
 * - Proper numeric stepper with increment/decrement controls.
 * - Allows typing single digits (e.g. '1', '2', '3') naturally without jumping or defaulting to double digits.
 * - Graceful clamp on blur.
 */
export const NumericStepper: React.FC<NumericStepperProps> = ({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  label,
  unit,
}) => {
  const [textValue, setTextValue] = React.useState<string>(String(value));

  // Sync internal text state with external numeric value when external value changes
  React.useEffect(() => {
    setTextValue(String(value));
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty string while typing so user can delete and type single digit
    if (raw === '') {
      setTextValue('');
      return;
    }
    // Only accept numeric digits
    if (/^\d*$/.test(raw)) {
      setTextValue(raw);
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed)) {
        onChange(parsed);
      }
    }
  };

  const handleBlur = () => {
    let parsed = parseInt(textValue, 10);
    if (isNaN(parsed) || parsed < min) {
      parsed = min;
    } else if (parsed > max) {
      parsed = max;
    }
    setTextValue(String(parsed));
    onChange(parsed);
  };

  const handleDecrement = () => {
    const next = Math.max(min, value - step);
    setTextValue(String(next));
    onChange(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, value + step);
    setTextValue(String(next));
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
          {label}
        </span>
      )}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label="Decrease interval"
          className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-900 dark:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        <div className="relative flex-1 max-w-[120px]">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={textValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-full h-10 px-3 text-center rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label="Increase interval"
          className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-900 dark:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        {unit && (
          <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 ml-1">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
