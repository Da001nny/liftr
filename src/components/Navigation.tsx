import React from 'react';
import { 
  LayoutDashboard, 
  Dumbbell, 
  User as UserIcon, 
  TrendingUp, 
  Calendar as CalendarIcon,
  Settings
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
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  onOpenProfile,
  isProfileOpen,
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
      <header className="sticky top-0 z-30 h-14 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('dashboard')}
              className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2 group cursor-pointer"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full inline-block transition-transform group-hover:scale-125"
                style={{ backgroundColor: accentColor }}
              />
              <span className="font-display tracking-wider">liftr</span>
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
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-slate-200/80 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                  style={isActive ? { borderBottom: `2px solid ${accentColor}` } : {}}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Persistent Avatar Icon leading to Profile / Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenProfile}
              aria-label={t('nav.profile')}
              title={t('nav.profile')}
              className={`min-h-[44px] min-w-[44px] p-1.5 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isProfileOpen
                  ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-offset-slate-950'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800'
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
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 h-16 bg-white/95 dark:bg-slate-950/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 pb-safe transition-colors"
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
                    ? 'text-slate-900 dark:text-white font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
                <span className="text-[10px] tracking-tight mt-1 truncate max-w-[60px]">
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
