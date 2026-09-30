import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, X, ChevronLeft, ChevronRight, Video, Dumbbell, Layers, RefreshCw } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  fetchExercises, 
  fetchMuscleRegions, 
  EnrichedExercise 
} from '../lib/exerciseService';
import { MuscleRegion } from '../data/exerciseCatalog';

interface ExerciseLibraryProps {
  onSelectExercise: (exercise: EnrichedExercise) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({ onSelectExercise }) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [regions, setRegions] = useState<MuscleRegion[]>([]);
  const [exercises, setExercises] = useState<EnrichedExercise[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters state
  const [search, setSearch] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [equipmentFilter, setEquipmentFilter] = useState<string>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');
  const [movementFilter, setMovementFilter] = useState<string>('all');
  const [page, setPage] = useState<number>(1);
  const limit = 12;

  // Load regions
  useEffect(() => {
    fetchMuscleRegions(token).then(data => setRegions(data));
  }, [token]);

  // Load exercises when filters change
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetchExercises(
      {
        search: search.trim(),
        region: regionFilter,
        equipment: equipmentFilter,
        difficulty: difficultyFilter,
        movementType: movementFilter,
        page,
        limit,
      },
      token
    ).then(res => {
      if (!isCancelled) {
        setExercises(res.items);
        setTotalCount(res.total);
        setLoading(false);
      }
    }).catch(err => {
      if (!isCancelled) {
        console.error('Failed to load exercises:', err);
        setLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [search, regionFilter, equipmentFilter, difficultyFilter, movementFilter, page, token]);

  // Reset page when filters change
  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (val: string) => {
    setter(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setRegionFilter('all');
    setEquipmentFilter('all');
    setDifficultyFilter('all');
    setMovementFilter('all');
    setPage(1);
  };

  const hasActiveFilters = search !== '' || regionFilter !== 'all' || equipmentFilter !== 'all' || difficultyFilter !== 'all' || movementFilter !== 'all';
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const fromIndex = totalCount === 0 ? 0 : (page - 1) * limit + 1;
  const toIndex = Math.min(page * limit, totalCount);

  return (
    <div className="space-y-6">
      {/* Search & Filters Toolbar */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-5 sm:p-6 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-xl transition-all"
      >
        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t('exerciseLibrary.searchPlaceholder')}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-medium placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {search && (
            <button
              onClick={() => {
                setSearch('');
                setPage(1);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Region */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic block mb-1">
              {t('exerciseLibrary.regionLabel')}
            </label>
            <select
              value={regionFilter}
              onChange={e => handleFilterChange(setRegionFilter)(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">{t('exerciseLibrary.allRegions')}</option>
              {regions.map(r => {
                const regKey = `regions.${r.id}` as any;
                return <option key={r.id} value={r.id}>{t(regKey)}</option>;
              })}
            </select>
          </div>

          {/* Equipment */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic block mb-1">
              {t('exerciseLibrary.equipmentLabel')}
            </label>
            <select
              value={equipmentFilter}
              onChange={e => handleFilterChange(setEquipmentFilter)(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">{t('exerciseLibrary.allEquipment')}</option>
              <option value="barbell">{t('equipment.barbell')}</option>
              <option value="dumbbell">{t('equipment.dumbbell')}</option>
              <option value="cable">{t('equipment.cable')}</option>
              <option value="machine">{t('equipment.machine')}</option>
              <option value="bodyweight">{t('equipment.bodyweight')}</option>
              <option value="kettlebell">{t('equipment.kettlebell')}</option>
              <option value="smith_machine">{t('equipment.smith_machine')}</option>
              <option value="band">{t('equipment.band')}</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic block mb-1">
              {t('exerciseLibrary.difficultyLabel')}
            </label>
            <select
              value={difficultyFilter}
              onChange={e => handleFilterChange(setDifficultyFilter)(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">{t('exerciseLibrary.allDifficulties')}</option>
              <option value="beginner">{t('difficulty.beginner')}</option>
              <option value="intermediate">{t('difficulty.intermediate')}</option>
              <option value="advanced">{t('difficulty.advanced')}</option>
            </select>
          </div>

          {/* Movement Type */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-athletic block mb-1">
              {t('exerciseLibrary.movementLabel')}
            </label>
            <select
              value={movementFilter}
              onChange={e => handleFilterChange(setMovementFilter)(e.target.value)}
              className="w-full px-2.5 py-2 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">{t('exerciseLibrary.allMovements')}</option>
              <option value="compound">{t('movementType.compound')}</option>
              <option value="isolation">{t('movementType.isolation')}</option>
            </select>
          </div>
        </div>

        {/* Active Filter Bar & Reset */}
        {hasActiveFilters && (
          <div className="mt-4 pt-3 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              Filters active
            </span>
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 cursor-pointer font-athletic uppercase tracking-wider"
            >
              <RefreshCw className="w-3 h-3" />
              <span>{t('exerciseLibrary.clearFilters')}</span>
            </button>
          </div>
        )}
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 font-mono">
          {t('exerciseLibrary.showingCount', { from: fromIndex, to: toIndex, total: totalCount })}
        </span>
        <span className="text-xs font-athletic font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('exerciseLibrary.pageIndicator', { page, pages: totalPages })}
        </span>
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs font-mono text-neutral-500 dark:text-neutral-400">
          {t('common.loading')}
        </div>
      ) : exercises.length === 0 ? (
        <div className="rounded-2xl p-10 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
          <Dumbbell className="w-8 h-8 text-neutral-400 mx-auto" />
          <h4 className="text-base font-bold text-neutral-800 dark:text-neutral-200 font-display uppercase tracking-wide">
            {t('exerciseLibrary.noExercisesFound')}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            {t('exerciseLibrary.noExercisesHint')}
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm font-athletic uppercase tracking-wider cursor-pointer mt-2"
            style={{ backgroundColor: accentColor }}
          >
            {t('exerciseLibrary.clearFilters')}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {exercises.map(exercise => {
            const primaryContribs = exercise.contributions.filter(c => c.role === 'Primary');
            const regionKey = `regions.${exercise.targetRegionId}` as any;
            const equipKey = `equipment.${exercise.equipment}` as any;
            const diffKey = `difficulty.${exercise.difficulty}` as any;

            return (
              <div
                key={exercise.id}
                onClick={() => onSelectExercise(exercise)}
                data-surface="secondary-flat"
                className="group rounded-2xl p-5 bg-white dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] hover:border-neutral-400 dark:hover:border-neutral-600 shadow-sm dark:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span 
                      className="px-2 py-0.5 rounded-full text-[10px] font-athletic uppercase tracking-wider font-bold text-white shadow-sm"
                      style={{ backgroundColor: accentColor }}
                    >
                      {t(regionKey)}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {exercise.videoUrl && (
                        <span className="p-1 rounded-md bg-amber-500/15 text-amber-500" title="Video Guide Available">
                          <Video className="w-3 h-3" />
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-athletic uppercase tracking-wider font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                        {t(equipKey)}
                      </span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-base font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide group-hover:text-blue-500 transition-colors line-clamp-1">
                    {exercise.name}
                  </h3>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1 font-medium line-clamp-2 leading-relaxed">
                    {exercise.description}
                  </p>

                  {/* Primary Drivers Preview */}
                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-1.5">
                    <span className="text-[10px] font-bold font-athletic uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block">
                      {t('exerciseLibrary.primaryMuscles')}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {primaryContribs.slice(0, 2).map(c => (
                        <span 
                          key={c.id}
                          className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800 flex items-center gap-1"
                        >
                          <span className="truncate max-w-[120px]">{c.muscleCommonName || c.muscleName}</span>
                          <span className="font-mono font-bold text-amber-500 text-[10px]">
                            {t('exerciseLibrary.estimatedTag', { percent: c.percentage })}
                          </span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-athletic uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">
                    {t(diffKey)}
                  </span>
                  <span className="font-bold text-neutral-900 dark:text-white group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    <span>{t('exerciseLibrary.viewDetails')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-900 disabled:opacity-40 text-neutral-900 dark:text-white text-xs font-athletic font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-800"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t('exerciseLibrary.previousPage')}</span>
          </button>

          <span className="px-4 py-2 font-mono text-xs font-bold text-neutral-600 dark:text-neutral-400">
            {t('exerciseLibrary.pageIndicator', { page, pages: totalPages })}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-900 disabled:opacity-40 text-neutral-900 dark:text-white text-xs font-athletic font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors hover:bg-neutral-300 dark:hover:bg-neutral-800"
          >
            <span>{t('exerciseLibrary.nextPage')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
