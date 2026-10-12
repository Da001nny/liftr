import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Dumbbell, Activity, Compass, Calendar, Clock, ChevronRight } from 'lucide-react';
import { useTranslation } from '../../i18n';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { GlobalSearchResult, GlobalSearchResultType } from '../../types/database';
import { executeGlobalSearch } from '../../lib/progressService';
import { formatWeight } from '../../lib/units';
import { TabId } from '../Navigation';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: TabId, meta?: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const { t } = useTranslation();
  const { accentColor, weightUnit } = useTheme();
  const { token } = useAuth();

  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !token) return;
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const items = await executeGlobalSearch(token, trimmed);
      setResults(items);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query, token, isOpen]);

  if (!isOpen) return null;

  const handleSelectResult = (item: GlobalSearchResult) => {
    onNavigateTab(item.targetTab, item.payload);
    onClose();
  };

  const getBadgeStyle = (type: GlobalSearchResultType) => {
    switch (type) {
      case 'exercise':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'muscle':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'region':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
      case 'workout':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
      case 'date':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
    }
  };

  const getTypeIcon = (type: GlobalSearchResultType) => {
    switch (type) {
      case 'exercise': return <Dumbbell className="w-4 h-4 text-blue-500" />;
      case 'muscle': return <Activity className="w-4 h-4 text-purple-500" />;
      case 'region': return <Compass className="w-4 h-4 text-amber-500" />;
      case 'workout': return <Clock className="w-4 h-4 text-emerald-500" />;
      case 'date': return <Calendar className="w-4 h-4 text-rose-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center p-4 pt-16 sm:pt-24 animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-[#161616] border border-neutral-300 dark:border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col text-neutral-900 dark:text-white max-h-[80vh]"
        data-surface="primary-metallic"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('globalSearch.searchPlaceholder')}
            className="flex-1 bg-transparent border-none text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none text-sm font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono text-neutral-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/80 p-2">
          {loading ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-mono">
              Searching taxonomy & workout history...
            </div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelectResult(item)}
                className="p-3 rounded-2xl hover:bg-neutral-100 dark:hover:bg-neutral-900/80 transition-colors flex items-center justify-between gap-3 cursor-pointer group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-800">
                    {getTypeIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-neutral-900 dark:text-white text-sm truncate group-hover:text-blue-500 transition-colors">
                        {item.title}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-athletic uppercase tracking-wider border ${getBadgeStyle(item.type)}`}>
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5 font-medium">
                      {item.type === 'workout' && item.payload?.totalVolume !== undefined
                        ? `${item.payload.date || item.subtitle} · ${formatWeight(item.payload.totalVolume, weightUnit)} total volume`
                        : item.subtitle}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors shrink-0" />
              </div>
            ))
          ) : query.trim() ? (
            <div className="py-12 text-center text-xs text-neutral-500 font-medium">
              No matching exercises, muscles, regions, or workouts found for "{query}".
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-neutral-400 font-medium space-y-2">
              <span className="block">{t('globalSearch.typeToSearch')}</span>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono">{t('globalSearch.exercisesCount')}</span>
                <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono">{t('globalSearch.musclesCount')}</span>
                <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono">{t('globalSearch.regionsCount')}</span>
                <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono">{t('globalSearch.workoutHistory')}</span>
                <span className="px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono">{t('globalSearch.calendarDates')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900/60 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-500">
          <span>{t('globalSearch.navigateHint')}</span>
          <button
            type="button"
            onClick={onClose}
            className="hover:text-neutral-900 dark:hover:text-white cursor-pointer font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
