import React, { useEffect } from 'react';
import { X, Video, Dumbbell, Award, Layers, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from '../i18n';
import { useTheme } from '../context/ThemeContext';
import { EnrichedExercise } from '../lib/exerciseService';
import { getRegionLabel, getEquipmentLabel, getDifficultyLabel, getMovementTypeLabel } from '../lib/labels';

interface ExerciseDetailModalProps {
  exercise: EnrichedExercise | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({ exercise, onClose }) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!exercise) return null;

  const primaryContribs = exercise.contributions.filter(c => c.role === 'Primary');
  const secondaryContribs = exercise.contributions.filter(c => c.role === 'Secondary');
  const stabilizerContribs = exercise.contributions.filter(c => c.role === 'Stabilizer');

  const regionName = getRegionLabel(exercise.targetRegionId, exercise.targetRegion?.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl my-8 bg-neutral-900 text-white border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden transition-all"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 sm:p-8 border-b border-neutral-800 bg-neutral-950/60">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label={t('exerciseLibrary.closeModal')}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span 
              className="px-2.5 py-0.5 rounded-full text-[11px] font-athletic uppercase tracking-wider font-bold text-white shadow-sm"
              style={{ backgroundColor: accentColor }}
            >
              {regionName}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-athletic uppercase tracking-wider font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              {getEquipmentLabel(exercise.equipment)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-athletic uppercase tracking-wider font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              {getDifficultyLabel(exercise.difficulty)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-athletic uppercase tracking-wider font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              {getMovementTypeLabel(exercise.movementType)}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
            {exercise.name}
          </h2>
          <p className="text-sm text-neutral-300 mt-1 font-medium leading-relaxed max-w-2xl">
            {exercise.description}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-8 max-h-[72vh] overflow-y-auto">
          
          {/* Step 5: Video Player / Video Coming Soon State */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-neutral-200 font-bold text-sm uppercase font-athletic tracking-wider">
              <Video className="w-4 h-4 text-amber-500" />
              <span>{t('exerciseLibrary.videoTitle')}</span>
            </div>

            {exercise.videoUrl ? (
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-lg">
                <iframe
                  src={exercise.videoUrl}
                  title={t('exerciseLibrary.videoTutorialTitle', { name: exercise.name })}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="rounded-xl p-6 bg-neutral-800/40 border border-neutral-800 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-12 h-12 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400">
                  <Video className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-neutral-200 uppercase tracking-wide font-display mt-1">
                  {t('exerciseLibrary.videoComingSoon')}
                </h4>
                <p className="text-xs text-neutral-400 max-w-md font-medium">
                  {t('exerciseLibrary.videoComingSoonDesc')}
                </p>
              </div>
            )}
          </div>

          {/* Step 1 & 5: Estimated Muscle Involvement Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-neutral-200 font-bold text-sm uppercase font-athletic tracking-wider">
                <Layers className="w-4 h-4 text-blue-400" />
                <span>{t('exerciseLibrary.estimatedInvolvement')}</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">
                {t('exerciseLibrary.agonistDistribution')}
              </span>
            </div>

            <p className="text-xs text-neutral-400 italic font-medium">
              {t('exerciseLibrary.estimatedDisclaimer')}
            </p>

            {/* Primary Muscles */}
            {primaryContribs.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold font-athletic uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  <span>{t('exerciseLibrary.primaryMuscles')}</span>
                </span>
                <div className="space-y-2">
                  {primaryContribs.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                        <span className="text-white font-bold">{c.muscleCommonName || c.muscleName}</span>
                        <span className="font-mono font-bold text-amber-400">
                          {t('exerciseLibrary.estimatedTag', { percent: c.percentage })}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${c.percentage}%`,
                            backgroundColor: accentColor
                          }}
                        />
                      </div>
                      {c.notes && (
                        <p className="text-[11px] text-neutral-400 mt-1.5 font-sans">
                          {c.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secondary Muscles */}
            {secondaryContribs.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold font-athletic uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5" />
                  <span>{t('exerciseLibrary.secondaryMuscles')}</span>
                </span>
                <div className="space-y-2">
                  {secondaryContribs.map(c => (
                    <div key={c.id} className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800">
                      <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
                        <span className="text-neutral-200 font-bold">{c.muscleCommonName || c.muscleName}</span>
                        <span className="font-mono font-bold text-blue-400">
                          {t('exerciseLibrary.estimatedTag', { percent: c.percentage })}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                        <div 
                          className="h-full rounded-full bg-blue-500/80 transition-all duration-500"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                      {c.notes && (
                        <p className="text-[11px] text-neutral-400 mt-1.5 font-sans">
                          {c.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stabilizers */}
            {stabilizerContribs.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold font-athletic uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{t('exerciseLibrary.stabilizerMuscles')}</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stabilizerContribs.map(c => (
                    <div key={c.id} className="p-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-neutral-200 block">
                          {c.muscleCommonName || c.muscleName}
                        </span>
                        {c.notes && (
                          <span className="text-[11px] text-neutral-400 block mt-0.5">
                            {c.notes}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Instructions */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-200 font-bold text-sm uppercase font-athletic tracking-wider">
                <Dumbbell className="w-4 h-4 text-purple-400" />
                <span>{t('exerciseLibrary.instructionsTitle')}</span>
              </div>

              <div className="space-y-2.5">
                {exercise.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-neutral-950/50 border border-neutral-800/80">
                    <span 
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-mono font-bold shrink-0 text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-xs text-neutral-200 leading-relaxed font-medium pt-0.5">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 border-t border-neutral-800 bg-neutral-950/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-bold font-athletic uppercase text-xs tracking-wider text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 transition-colors cursor-pointer"
          >
            {t('exerciseLibrary.closeModal')}
          </button>
        </div>
      </div>
    </div>
  );
};
