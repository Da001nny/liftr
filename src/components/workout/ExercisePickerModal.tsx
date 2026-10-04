import React, { useState, useMemo } from 'react';
import { Search, X, Dumbbell, Plus } from 'lucide-react';
import { EXERCISES, REGION_MAP, Exercise } from '../../data/exerciseCatalog';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
}

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const [search, setSearch] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    let result = EXERCISES;
    if (selectedRegion !== 'all') {
      result = result.filter(ex => ex.targetRegionId === selectedRegion);
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(q) || 
        ex.equipment.toLowerCase().includes(q) ||
        ex.targetRegionId.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, selectedRegion]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[80] flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-2xl max-h-[85vh] flex flex-col bg-white dark:bg-[#161616] border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
              style={{ backgroundColor: accentColor }}
            >
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                {t('workoutLogger.addExercise')}
              </h2>
              <span className="text-xs text-neutral-500 font-medium">
                {filteredExercises.length} movements available
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-500 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3 shrink-0 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercise name, equipment..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2"
              style={{ '--tw-ring-color': accentColor } as any}
              autoFocus
            />
          </div>

          {/* Region Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-athletic font-bold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => setSelectedRegion('all')}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                selectedRegion === 'all'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              All
            </button>
            {Array.from(REGION_MAP.values()).map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedRegion(r.id)}
                className={`px-3 py-1.5 rounded-lg shrink-0 transition-colors cursor-pointer ${
                  selectedRegion === r.id
                    ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                    : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Exercises List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {filteredExercises.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 space-y-2">
              <Dumbbell className="w-8 h-8 mx-auto text-neutral-400" />
              <p className="text-sm font-medium">No exercises found</p>
            </div>
          ) : (
            filteredExercises.map(ex => {
              const region = REGION_MAP.get(ex.targetRegionId);
              return (
                <div
                  key={ex.id}
                  onClick={() => {
                    onSelectExercise(ex);
                    onClose();
                  }}
                  className="pt-2 first:pt-0 flex items-center justify-between p-3 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800/60 transition-colors cursor-pointer group"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors font-display">
                      {ex.name}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 font-athletic uppercase tracking-wider font-semibold">
                      <span>{region?.name || ex.targetRegionId}</span>
                      <span>·</span>
                      <span>{ex.equipment}</span>
                      <span>·</span>
                      <span className="capitalize">{ex.difficulty}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-8 h-8 rounded-lg flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
