import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Layers, 
  Video, 
  ChevronRight, 
  Dumbbell, 
  Sparkles, 
  CheckCircle2, 
  X,
  Play,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Muscle, MuscleRegion, MUSCLES, REGION_MAP } from '../../data/exerciseCatalog';
import { 
  getMuscleLabel, 
  getMuscleCommonName, 
  getEquipmentLabel, 
  getDifficultyLabel, 
  getMovementTypeLabel, 
  getContributionRoleLabel 
} from '../../lib/labels';
import { 
  fetchReverseSearch, 
  ReverseSearchResult, 
  EnrichedExercise 
} from '../../lib/exerciseService';

interface MuscleDetailPanelProps {
  region: MuscleRegion | null;
  muscle: Muscle;
  onSelectMuscle: (muscleId: string) => void;
  onClose: () => void;
  onSelectExercise: (exercise: EnrichedExercise) => void;
}

export const MuscleDetailPanel: React.FC<MuscleDetailPanelProps> = ({
  region,
  muscle,
  onSelectMuscle,
  onClose,
  onSelectExercise,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();
  const { token } = useAuth();

  const [results, setResults] = useState<ReverseSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeInlineVideoId, setActiveInlineVideoId] = useState<string | null>(null);

  // Derive region record if not passed directly
  const activeRegion = region || REGION_MAP.get(muscle.regionId) || null;
  // Get all muscles in this region for Level 2/3 drill-down
  const regionMuscles = activeRegion 
    ? MUSCLES.filter(m => m.regionId === activeRegion.id) 
    : [muscle];

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setActiveInlineVideoId(null);

    fetchReverseSearch(muscle.id, token)
      .then(data => {
        if (!isCancelled) {
          setResults(data);
          setLoading(false);
          // If first exercise has a video, prepare it
          const firstWithVideo = data.find(item => Boolean(item.exercise.videoUrl));
          if (firstWithVideo) {
            setActiveInlineVideoId(firstWithVideo.exercise.id);
          }
        }
      })
      .catch(err => {
        if (!isCancelled) {
          console.error('Failed to load targeted exercises:', err);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [muscle.id, token]);

  const regionKey = `regions.${muscle.regionId}` as any;
  const activeVideoExercise = results.find(r => r.exercise.id === activeInlineVideoId)?.exercise;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* LEVEL 1: Broad Region Header Card */}
      {activeRegion && (
        <div 
          data-surface="primary-metallic"
          className="rounded-2xl p-5 sm:p-6 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span 
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-athletic uppercase tracking-wider font-bold text-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                >
                  {t(regionKey)} Region
                </span>
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono font-medium">
                  {regionMuscles.length} Sub-muscles
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-neutral-900 dark:text-white">
                {activeRegion.name}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-medium mt-1 leading-relaxed max-w-xl">
                {activeRegion.description}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors cursor-pointer shrink-0"
              aria-label={t('common.close')}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* LEVEL 2 & 3: List-Based Sub-Region & Muscle Drill-Down (Step 4) */}
          <div className="mt-5 pt-4 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                Select Sub-Region / Muscle
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Click to inspect biomechanics
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {regionMuscles.map(m => {
                const isSelected = m.id === muscle.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => onSelectMuscle(m.id)}
                    className={`p-3 rounded-xl text-left transition-all cursor-pointer flex items-center justify-between gap-3 border ${
                      isSelected
                        ? 'bg-neutral-900 text-white dark:bg-[#252528] dark:text-white border-neutral-700 shadow-md ring-1 ring-white/20'
                        : 'bg-white/80 hover:bg-white dark:bg-[#1a1a1c] dark:hover:bg-[#202022] text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-800'
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span 
                          className={`w-2 h-2 rounded-full ${isSelected ? 'animate-pulse' : 'opacity-40'}`}
                          style={{ backgroundColor: accentColor }}
                        />
                        <span className="text-[10px] font-athletic uppercase tracking-wider font-bold text-neutral-400">
                          {m.subregion}
                        </span>
                      </div>
                      <div className="text-sm font-bold font-display uppercase tracking-tight truncate">
                        {getMuscleCommonName(m.id, m.commonName)}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 truncate">
                        {getMuscleLabel(m.id, m.name)}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isSelected ? (
                        <span 
                          className="px-2 py-0.5 rounded text-[10px] font-athletic font-bold uppercase tracking-wider text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          Active
                        </span>
                      ) : (
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Muscle Deep Anatomical Details */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-5 sm:p-6 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span 
            className="px-2.5 py-0.5 rounded-full text-[11px] font-athletic uppercase tracking-wider font-bold text-white shadow-sm"
            style={{ backgroundColor: accentColor }}
          >
            {muscle.subregion}
          </span>
          <span className="font-mono text-[10px] text-neutral-500 dark:text-neutral-400 font-bold uppercase">
            ID: {muscle.id}
          </span>
        </div>

        <h3 className="text-2xl font-black font-display uppercase tracking-tight text-neutral-900 dark:text-white">
          {getMuscleCommonName(muscle.id, muscle.commonName)}
        </h3>
        <span className="text-xs font-mono font-semibold text-neutral-500 dark:text-neutral-400 block mb-3">
          {getMuscleLabel(muscle.id, muscle.name)}
        </span>

        {/* Biomechanical Function */}
        <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-bold font-athletic uppercase tracking-wider text-neutral-500 dark:text-neutral-400 block mb-1">
            {t('body.biomechanicalFunction')}
          </span>
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
            {muscle.description}
          </p>
        </div>
      </div>

      {/* Inline Video Player Section (Step 6) */}
      {activeVideoExercise && activeVideoExercise.videoUrl && (
        <div 
          data-surface="secondary-flat"
          className="rounded-2xl p-5 sm:p-6 bg-white dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] shadow-sm dark:shadow-md space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold font-athletic uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              <Video className="w-4 h-4 text-amber-500" />
              <span>{activeVideoExercise.name} — Technique Video</span>
            </div>
            <span className="text-[11px] font-mono text-neutral-500">
              Inline Player
            </span>
          </div>

          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-lg">
            <iframe
              src={activeVideoExercise.videoUrl}
              title={t('body.formGuideTitle', { exercise: activeVideoExercise.name })}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Explore Mode: Targeted Exercises List */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 px-1">
          <div>
            <h3 className="text-base font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-blue-500" />
              <span>{t('body.targetExercises', { count: results.length })}</span>
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              {t('body.exercisesRankedNotice')}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-neutral-500 dark:text-neutral-400">
            {t('common.loading')}
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 rounded-2xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
            <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
              {t('body.noExercisesFound')}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map(({ exercise, contribution }) => {
              const isPrimary = contribution.role === 'Primary';
              const isSecondary = contribution.role === 'Secondary';
              const roleBadgeClass = isPrimary
                ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30'
                : isSecondary
                ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30'
                : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';

              const roleLabel = getContributionRoleLabel(contribution.role);

              return (
                <div
                  key={`${exercise.id}-${contribution.id}`}
                  data-surface="secondary-flat"
                  className="rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] hover:border-neutral-400 dark:hover:border-neutral-600 shadow-sm dark:shadow-md transition-all flex flex-col justify-between gap-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-athletic uppercase tracking-wider font-bold border ${roleBadgeClass}`}>
                          {roleLabel}
                        </span>
                        <span className="font-mono font-bold text-xs text-neutral-900 dark:text-white">
                          {t('body.estimatedInvolvementLabel', { percent: contribution.percentage })}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                        {exercise.name}
                      </h4>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium leading-relaxed mt-0.5 max-w-xl">
                        {exercise.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
                      {exercise.videoUrl && (
                        <button
                          type="button"
                          onClick={() => setActiveInlineVideoId(exercise.id)}
                          className={`p-2 rounded-xl border text-xs font-athletic font-bold uppercase transition-all cursor-pointer flex items-center gap-1 ${
                            activeInlineVideoId === exercise.id
                              ? 'bg-amber-500 text-black border-amber-500 shadow-sm'
                              : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-300 dark:border-neutral-700'
                          }`}
                          title={t('body.watchVideoTitle')}
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span className="hidden sm:inline">{t('body.watchVideo')}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onSelectExercise(exercise)}
                        className="px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-neutral-900 text-xs font-athletic font-bold uppercase tracking-wider transition-all cursor-pointer shadow-sm flex items-center gap-1"
                      >
                        <span>{t('body.viewExerciseDetails')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                    <span className="capitalize">{getEquipmentLabel(exercise.equipment)}</span>
                    <span>•</span>
                    <span className="capitalize">{getDifficultyLabel(exercise.difficulty)}</span>
                    <span>•</span>
                    <span className="capitalize">{getMovementTypeLabel(exercise.movementType)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
