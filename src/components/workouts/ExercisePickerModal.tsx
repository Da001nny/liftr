import React, { useState, useMemo } from 'react';
import { Search, X, Dumbbell, Plus, Check, Filter } from 'lucide-react';
import { EXERCISES, MUSCLE_REGIONS, EnrichedExercise } from '../../lib/exerciseService';

interface ExercisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: EnrichedExercise) => void;
  alreadySelectedIds?: string[];
  accentColor?: string;
}

export const ExercisePickerModal: React.FC<ExercisePickerModalProps> = ({
  isOpen,
  onClose,
  onSelectExercise,
  alreadySelectedIds = [],
  accentColor = '#3b82f6',
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    return EXERCISES.filter(ex => {
      // Search filter
      const matchesSearch = 
        ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ex.equipment.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (ex.targetRegionName && ex.targetRegionName.toLowerCase().includes(searchTerm.toLowerCase()));

      // Region filter
      const matchesRegion = selectedRegion === 'all' || ex.target_region_id === selectedRegion;

      // Equipment filter
      const matchesEquipment = selectedEquipment === 'all' || ex.equipment === selectedEquipment;

      return matchesSearch && matchesRegion && matchesEquipment;
    });
  }, [searchTerm, selectedRegion, selectedEquipment]);

  const equipmentOptions = useMemo(() => {
    const set = new Set<string>();
    EXERCISES.forEach(e => {
      if (e.equipment) set.add(e.equipment);
    });
    return Array.from(set).sort();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        role="dialog"
        aria-modal="true"
        aria-label="Add Exercise"
        className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#f5f5f7] dark:bg-[#141414] text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-800 shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl premium-icon-container">
              <Dumbbell className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <div>
              <h2 className="text-base font-black font-display uppercase tracking-wide text-neutral-900 dark:text-white">
                Add Exercise
              </h2>
              <span className="text-[11px] text-neutral-500 font-medium">
                Select from {EXERCISES.length} cataloged movements
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 space-y-3 bg-neutral-100/50 dark:bg-neutral-900/50">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search exercise name, equipment, or muscle..."
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 rounded-xl text-xs font-medium text-neutral-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              aria-label="Filter by muscle region"
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 text-[11px] font-athletic font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 shadow-sm"
            >
              <option value="all">All Regions ({EXERCISES.length})</option>
              {MUSCLE_REGIONS.map(r => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>

            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              aria-label="Filter by equipment"
              className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 text-[11px] font-athletic font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 shadow-sm"
            >
              <option value="all">All Equipment</option>
              {equipmentOptions.map(eq => (
                <option key={eq} value={eq}>{eq}</option>
              ))}
            </select>

            <span className="text-[11px] font-mono text-neutral-500 ml-auto font-bold">
              {filteredExercises.length} matches
            </span>
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-neutral-200 dark:divide-neutral-800/80">
          {filteredExercises.length === 0 ? (
            <div className="py-12 text-center text-neutral-500">
              <Dumbbell className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="text-xs font-bold uppercase font-athletic">No exercises found</p>
              <span className="text-[11px] text-neutral-400">Try adjusting your search or filters</span>
            </div>
          ) : (
            filteredExercises.map(ex => {
              const isAlreadyAdded = alreadySelectedIds.includes(ex.id);
              return (
                <div 
                  key={ex.id}
                  className="py-3 flex items-center justify-between gap-4 hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50 px-2 rounded-xl transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm font-bold font-athletic uppercase tracking-wide text-neutral-900 dark:text-white block">
                      {ex.name}
                    </span>
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {ex.targetRegionName || 'Compound'}
                      </span>
                      <span>•</span>
                      <span>{ex.equipment}</span>
                      <span>•</span>
                      <span className="capitalize">{ex.difficulty}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectExercise(ex);
                      onClose();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-athletic font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                      isAlreadyAdded
                        ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                        : 'text-white hover:opacity-90'
                    }`}
                    style={{ backgroundColor: isAlreadyAdded ? undefined : accentColor }}
                  >
                    {isAlreadyAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </>
                    )}
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
