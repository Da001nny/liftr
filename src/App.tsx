import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { Navigation, TabId } from './components/Navigation';
import { SupabaseMigrationBanner } from './components/SupabaseMigrationBanner';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { WorkoutsView } from './components/WorkoutsView';
import { BodyView } from './components/BodyView';
import { ProgressView } from './components/ProgressView';
import { CalendarView } from './components/CalendarView';
import { ProfileView } from './components/ProfileView';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [workoutsNav, setWorkoutsNav] = useState<{
    subtab?: 'routines' | 'catalog' | 'reverseSearch' | 'history';
    muscleId?: string;
  } | undefined>();

  // Global Keyboard Shortcut: Cmd+K or Ctrl+K opens search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa] dark:bg-[#0c0c0c]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-900 dark:border-t-white animate-spin" />
          <span className="text-xs font-athletic uppercase tracking-widest text-neutral-600 dark:text-neutral-400 font-bold">Connecting to liftr...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated view: Auth Screen (Sign in / Sign up)
  if (!user) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0c0c] text-neutral-900 dark:text-neutral-100 flex flex-col">
        <SupabaseMigrationBanner />
        <main className="flex-1 flex items-center justify-center">
          <AuthScreen />
        </main>
      </div>
    );
  }

  // Authenticated Application Shell
  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-[#0c0c0c] text-neutral-900 dark:text-neutral-100 flex flex-col antialiased">
      {/* Schema Migration Notice if needed */}
      <SupabaseMigrationBanner />

      {/* Top Bar + Bottom Navigation */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsProfileOpen(false);
        }}
        onOpenProfile={() => setIsProfileOpen(!isProfileOpen)}
        isProfileOpen={isProfileOpen}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Global Search Modal Overlay (Phase 5 Step 6) */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigateTab={(tab, meta) => {
          setActiveTab(tab);
          if (tab === 'workouts' && meta?.targetSubtab) {
            setWorkoutsNav({ subtab: meta.targetSubtab, muscleId: meta.muscleId });
          }
          setIsProfileOpen(false);
        }}
      />

      {/* Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 md:p-8">
        {isProfileOpen ? (
          <ProfileView onClose={() => setIsProfileOpen(false)} />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <DashboardView onNavigateTab={(tab) => setActiveTab(tab)} />
            )}
            {activeTab === 'workouts' && (
              <WorkoutsView 
                initialTab={workoutsNav?.subtab} 
                initialMuscleId={workoutsNav?.muscleId} 
              />
            )}
            {activeTab === 'body' && <BodyView />}
            {activeTab === 'progress' && <ProgressView />}
            {activeTab === 'calendar' && <CalendarView />}
          </>
        )}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <WorkoutProvider>
          <MainApp />
        </WorkoutProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
