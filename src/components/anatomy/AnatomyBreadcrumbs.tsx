import React from 'react';
import { ChevronRight, ArrowLeft, Layers } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { Muscle, MuscleRegion } from '../../data/exerciseCatalog';

interface AnatomyBreadcrumbsProps {
  selectedRegion: MuscleRegion | null;
  selectedSubregion: string | null;
  selectedMuscle: Muscle | null;
  onSelectRoot: () => void;
  onSelectRegion: (region: MuscleRegion) => void;
  onSelectSubregion: (subregion: string) => void;
  onBack: () => void;
}

export const AnatomyBreadcrumbs: React.FC<AnatomyBreadcrumbsProps> = ({
  selectedRegion,
  selectedSubregion,
  selectedMuscle,
  onSelectRoot,
  onSelectRegion,
  onSelectSubregion,
  onBack,
}) => {
  const { t } = useTranslation();

  const hasSelection = Boolean(selectedRegion || selectedSubregion || selectedMuscle);

  let backTargetName = t('body.breadcrumbsRoot');
  if (selectedMuscle && selectedSubregion) {
    backTargetName = selectedSubregion;
  } else if (selectedSubregion && selectedRegion) {
    const regKey = `regions.${selectedRegion.id}` as any;
    backTargetName = t(regKey);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl bg-white/80 dark:bg-[#141414]/90 border border-neutral-200/90 dark:border-neutral-800/90 shadow-sm backdrop-blur-sm">
      {/* Breadcrumb Trail */}
      <nav aria-label="Anatomical hierarchy" className="flex flex-wrap items-center gap-1.5 text-xs font-athletic font-bold uppercase tracking-wider">
        <button
          onClick={onSelectRoot}
          className={`flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
            !hasSelection
              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
              : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('body.breadcrumbsRoot')}</span>
        </button>

        {selectedRegion && (
          <>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <button
              onClick={() => onSelectRegion(selectedRegion)}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                !selectedSubregion && !selectedMuscle
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
              }`}
            >
              <span>{selectedRegion.name}</span>
            </button>
          </>
        )}

        {selectedSubregion && (
          <>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <button
              onClick={() => onSelectSubregion(selectedSubregion)}
              className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                !selectedMuscle
                  ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white'
                  : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800/50'
              }`}
            >
              <span>{selectedSubregion}</span>
            </button>
          </>
        )}

        {selectedMuscle && (
          <>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="px-2 py-1 rounded-md bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-white">
              {selectedMuscle.commonName}
            </span>
          </>
        )}
      </nav>

      {/* Back Control */}
      {hasSelection && (
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-athletic font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-800/70 hover:bg-neutral-200 dark:hover:bg-neutral-700/80 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t('body.backTo', { target: backTargetName })}</span>
        </button>
      )}
    </div>
  );
};
