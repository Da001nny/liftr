import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, Layers, X, Sparkles } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { MUSCLES, MUSCLE_REGIONS, Muscle, MuscleRegion } from '../../data/exerciseCatalog';

interface AnatomyDirectoryProps {
  onSelectMuscle: (muscle: Muscle) => void;
  selectedMuscleId: string | null;
}

export const AnatomyDirectory: React.FC<AnatomyDirectoryProps> = ({
  onSelectMuscle,
  selectedMuscleId,
}) => {
  const { t } = useTranslation();
  const { accentColor } = useTheme();

  const [query, setQuery] = useState<string>('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('all');

  const filteredMuscles = useMemo(() => {
    let list = MUSCLES;
    if (selectedRegionId !== 'all') {
      list = list.filter(m => m.regionId === selectedRegionId);
    }
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.commonName.toLowerCase().includes(q) ||
        m.subregion.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [selectedRegionId, query]);

  // Group by region
  const groupedByRegion = useMemo(() => {
    const map = new Map<string, Muscle[]>();
    filteredMuscles.forEach(m => {
      const arr = map.get(m.regionId) || [];
      arr.push(m);
      map.set(m.regionId, arr);
    });
    return map;
  }, [filteredMuscles]);

  return (
    <div className="space-y-6">
      {/* Search & Region Filter Bar */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-5 sm:p-6 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-xl transition-all"
      >
        <div className="relative mb-3.5">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('body.searchMusclesPlaceholder')}
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white text-sm font-medium placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Region Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setSelectedRegionId('all')}
            className={`px-3 py-1 rounded-lg text-xs font-athletic uppercase tracking-wider font-bold transition-all cursor-pointer ${
              selectedRegionId === 'all'
                ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-sm'
                : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            {t('body.allRegions')}
          </button>
          {MUSCLE_REGIONS.map(r => {
            const regKey = `regions.${r.id}` as any;
            const isSelected = selectedRegionId === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setSelectedRegionId(r.id)}
                className={`px-3 py-1 rounded-lg text-xs font-athletic uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'text-white shadow-sm'
                    : 'bg-neutral-200/80 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
                style={isSelected ? { backgroundColor: accentColor } : undefined}
              >
                {t(regKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grouped Muscle Cards */}
      {filteredMuscles.length === 0 ? (
        <div className="rounded-2xl p-10 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-2">
          <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
            {t('body.noExercisesFound')}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Array.from(groupedByRegion.entries()).map(([regionId, muscles]) => {
            const reg = MUSCLE_REGIONS.find(r => r.id === regionId);
            const regKey = `regions.${regionId}` as any;

            return (
              <div key={regionId} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <span 
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: accentColor }}
                  />
                  <h3 className="text-base font-black text-neutral-900 dark:text-white font-display uppercase tracking-wider">
                    {t(regKey)} ({muscles.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {muscles.map(m => {
                    const isSelected = selectedMuscleId === m.id;

                    return (
                      <div
                        key={m.id}
                        onClick={() => onSelectMuscle(m)}
                        data-surface="secondary-flat"
                        className={`rounded-2xl p-4 sm:p-5 bg-white dark:bg-[#141414] border shadow-sm dark:shadow-md transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-500 ring-2 ring-blue-500/20'
                            : 'border-neutral-200/90 dark:border-[#242424] hover:border-neutral-400 dark:hover:border-neutral-600'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-athletic uppercase tracking-wider font-bold bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                              {m.subregion}
                            </span>
                            <span className="font-mono text-[10px] text-neutral-400 uppercase">
                              {m.id}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
                            {m.commonName}
                          </h4>
                          <span className="text-xs font-mono font-medium text-neutral-500 dark:text-neutral-400 block mb-2">
                            {m.name}
                          </span>

                          <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium line-clamp-2 leading-relaxed">
                            {m.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between text-xs">
                          <span className="text-[11px] font-athletic uppercase tracking-wider text-neutral-500 dark:text-neutral-400 font-bold">
                            {reg?.name}
                          </span>
                          <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                            <span>Explore Action</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
