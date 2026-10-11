import React from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  User as UserIcon, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Settings,
  Search
} from 'lucide-react';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export type TabId = 'dashboard' | 'workouts' | 'body' | 'progress' | 'calendar';

interface NavigationProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  onOpenProfile: () => void;
  isProfileOpen: boolean;
  onOpenSearch: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfile,
  isProfileOpen,
  onOpenSearch,
}) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { accentColor } = useTheme();

  const tabs: Array<{ id: TabId; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'workouts', label: t('nav.workouts'), icon: Dumbbell },
    { id: 'body', label: t('nav.body'), icon: UserIcon },
    { id: 'progress', label: t('nav.progress'), icon: TrendingUp },
    { id: 'calendar', label: t('nav.calendar'), icon: CalendarIcon },
  ];

  // User avatar initials
  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'LF';

  return (
    <>
      {/* =========================================================================
          TOP APP BAR (Strict 3-Zone Contract per Frontend Design Skill)
          Zone 1: Brand title
          Zone 2: Desktop clean nav links
          Zone 3: Persistent avatar / settings button
          ========================================================================= */}
      <header className="sticky top-0 z-30 h-14 bg-[#fafafa]/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md border-b border-neutral-200 dark:border-[#222222] transition-colors">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark with athletic energy */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-2xl font-black tracking-widest uppercase text-neutral-900 dark:text-white flex items-center gap-2 group cursor-pointer font-display"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block transition-transform group-hover:scale-125"
                style={{ backgroundColor: accentColor }}
              />
              <span>{t('common.appName')}</span>
            </button>
          </div>

          {/* Zone 2: Desktop Nav Links (4-6 links, clean unboxed typography) */}
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id && !isProfileOpen;
              return (
                <button
                  key={tab.id}
                  onClick={() => onSelectTab(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all flex items-center gap-2 cursor-pointer font-athletic ${
                    isActive
                      ? 'bg-neutral-200 dark:bg-[#202020] text-neutral-900 dark:text-white shadow-sm'
                      : 'text-neutral-700 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#1a1a1a]'
                  }`}
                  style={isActive ? { borderBottom: `2px solid ${accentColor}` } : {}}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Persistent Avatar Icon + Global Search Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenSearch}
              aria-label={t('nav.globalSearch')}
              title={t('nav.searchShortcut')}
              className="h-9 px-2.5 rounded-xl bg-neutral-100 dark:bg-[#1a1a1a] hover:bg-neutral-200 dark:hover:bg-[#252525] border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center gap-2 transition-all cursor-pointer text-xs font-medium"
            >
              <Search className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden sm:inline">{t('nav.search')}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-[10px] font-mono font-bold text-neutral-400">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={onOpenProfile}
              aria-label={t('nav.profile')}
              title={t('nav.profile')}
              className={`min-h-[44px] min-w-[44px] p-1.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isProfileOpen
                  ? 'ring-2 ring-offset-2 ring-neutral-400 dark:ring-offset-[#0c0c0c]'
                  : 'hover:bg-neutral-100 dark:hover:bg-[#1a1a1a]'
              }`}
            >
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: accentColor }}
              >
                {initials}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          BOTTOM TAB BAR (Mobile & Tablet Fixed Navigation Anchor)
          Exactly 5 tabs: Dashboard, Workouts, Body, Progress, Calendar
          Touch target >= 44px
          ========================================================================= */}
      <nav 
        aria-label={t('nav.mobileNav')}
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-[#fafafa]/95 dark:bg-[#0c0c0c]/95 backdrop-blur-lg border-t border-neutral-200 dark:border-[#222222] pb-safe transition-colors"
      >
        <div className="grid grid-cols-5 h-full max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && !isProfileOpen;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors cursor-pointer ${
                  isActive
                    ? 'text-neutral-900 dark:text-white font-black'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5 transition-transform" />
                  {isActive && (
                    <span 
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ backgroundColor: accentColor }}
                    />
                  )}
                </div>
                <span className="text-[11px] font-athletic uppercase tracking-wider mt-1 truncate max-w-[60px]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
