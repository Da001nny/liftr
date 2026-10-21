import React, { useState, useEffect } from 'react';
import { Search, Compass, ChevronRight, Award, Layers, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  fetchMuscleRegions, 
  fetchMuscles, 
  fetchReverseSearch, 
  EnrichedExercise,
  ReverseSearchResult 
} from '../lib/exerciseService';
import { Muscle, MuscleRegion } from '../data/exerciseCatalog';
import { 
  getRegionLabel, 
  getMuscleCommonName, 
  getMuscleRoleLabel, 
  getEquipmentLabel, 
  getDifficultyLabel 
} from '../lib/labels';

interface ReverseMuscleSearchProps {
  onSelectExercise: (exercise: EnrichedExercise) => void;
  initialMuscleId?: string;
}

export const ReverseMuscleSearch: React.FC<ReverseMuscleSearchProps> = ({ onSelectExercise, initialMuscleId }) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [regions, setRegions] = useState<MuscleRegion[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [muscles, setMuscles] = useState<Muscle[]>([]);
  const [selectedMuscleId, setSelectedMuscleId] = useState<string>(initialMuscleId || 'm_latissimus_dorsi');
  const [results, setResults] = useState<ReverseSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (initialMuscleId) {
      setSelectedMuscleId(initialMuscleId);
    }
  }, [initialMuscleId]);

  // Load regions on mount
  useEffect(() => {
    fetchMuscleRegions(token).then(data => {
      setRegions(data);
    });
  }, [token]);

  // Load muscles when region selection changes
  useEffect(() => {
    fetchMuscles(selectedRegion, token).then(data => {
      setMuscles(data);
      // If current selected muscle is not in the new filtered list, pick the first one
      if (data.length > 0 && !data.some(m => m.id === selectedMuscleId)) {
        setSelectedMuscleId(data[0].id);
      }
    });
  }, [selectedRegion, token]);

  // Perform reverse search when selectedMuscleId changes
  useEffect(() => {
    if (!selectedMuscleId) {
      setResults([]);
      return;
    }
    setLoading(true);
    fetchReverseSearch(selectedMuscleId, token)
      .then(data => {
        setResults(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedMuscleId, token]);

  const selectedMuscleObj = muscles.find(m => m.id === selectedMuscleId);

  return (
    <div className="space-y-6">
      {/* Search Header Card */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-7 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex items-start gap-4">
          <div 
            className="w-12 h-12 rounded-2xl premium-icon-container-accent shrink-0 hidden sm:flex"
            style={{ backgroundColor: accentColor }}
          >
            <Compass className="w-6 h-6 text-white premium-icon-embedded" />
          </div>

          <div className="space-y-1.5 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 font-athletic">
              {t('reverseSearch.title')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {selectedMuscleObj ? getMuscleCommonName(selectedMuscleObj.id, selectedMuscleObj.commonName) : t('reverseSearch.title')}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium max-w-2xl">
              {selectedMuscleObj?.description || t('reverseSearch.subtitle')}
            </p>
          </div>
        </div>

        {/* Region & Muscle Selectors */}
        <div className="mt-6 pt-5 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Step 1: Filter Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              {t('reverseSearch.selectRegion')}
            </label>
            <select
              value={selectedRegion}
              onChange={e => setSelectedRegion(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">{t('exerciseLibrary.allRegions')}</option>
              {regions.map(r => (
                <option key={r.id} value={r.id}>
                  {getRegionLabel(r.id, r.name)}
                </option>
              ))}
            </select>
          </div>

          {/* Step 2: Select Muscle */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
              {t('reverseSearch.selectMuscle')}
            </label>
            <select
              value={selectedMuscleId}
              onChange={e => setSelectedMuscleId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {muscles.map(m => (
                <option key={m.id} value={m.id}>
                  {getMuscleCommonName(m.id, m.commonName)} — {m.subregion}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-white font-display uppercase tracking-wide">
            {t('reverseSearch.resultsTitle', { muscle: selectedMuscleObj ? getMuscleCommonName(selectedMuscleObj.id, selectedMuscleObj.commonName) : '' })}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {t('reverseSearch.rankedByWeight')}
          </p>
        </div>
        <span className="text-xs font-mono font-bold text-neutral-600 dark:text-neutral-400">
          {t('reverseSearch.totalExercisesFound', { count: results.length })}
        </span>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-neutral-500 dark:text-neutral-400 font-mono">
          {t('common.loading')}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl p-8 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
          <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
            {t('reverseSearch.noResultsFound')}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t('reverseSearch.noSelectionPrompt')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {results.map(({ exercise, contribution }) => {
            const isPrimary = contribution.role === 'Primary';
            const isSecondary = contribution.role === 'Secondary';
            const roleBadgeClass = isPrimary
              ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
              : isSecondary
              ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
              : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';

            const roleLabel = getMuscleRoleLabel(contribution.role);

            return (
              <div
                key={`${exercise.id}-${contribution.id}`}
                onClick={() => onSelectExercise(exercise)}
                data-surface="secondary-flat"
                className="group rounded-xl p-4 sm:p-5 bg-white dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] hover:border-neutral-400 dark:hover:border-neutral-600 shadow-sm dark:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-athletic uppercase tracking-wider font-bold border ${roleBadgeClass}`}>
                      {roleLabel}
                    </span>
                    <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white">
                      {t('reverseSearch.estimatedContribution', { percent: contribution.percentage })}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide group-hover:text-blue-500 transition-colors">
                    {exercise.name}
                  </h4>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium line-clamp-2 mt-1 leading-relaxed">
                    {exercise.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 font-athletic uppercase tracking-wider">
                    <span>{getEquipmentLabel(exercise.equipment)}</span>
                    <span aria-hidden="true">·</span>
                    <span>{getDifficultyLabel(exercise.difficulty)}</span>
                  </div>

                  <span className="flex items-center gap-1 font-bold text-neutral-700 dark:text-neutral-300 group-hover:translate-x-0.5 transition-transform">
                    <span>{t('exerciseLibrary.viewDetails')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
