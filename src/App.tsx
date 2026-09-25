import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navigation, TabId } from './components/Navigation';
import { SupabaseMigrationBanner } from './components/SupabaseMigrationBanner';
import { AuthScreen } from './components/AuthScreen';
import { DashboardView } from './components/DashboardView';
import { WorkoutsView } from './components/WorkoutsView';
import { BodyView } from './components/BodyView';
import { ProgressView } from './components/ProgressView';
import { CalendarView } from './components/CalendarView';
import { ProfileView } from './components/ProfileView';

const MainApp: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-[#0b0d13]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-blue-500 animate-spin" />
          <span className="text-xs font-mono text-slate-700 dark:text-slate-400 font-bold">Connecting to liftr...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated view: Auth Screen (Sign in / Sign up)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#0b0d13] text-slate-900 dark:text-slate-100 flex flex-col">
        <SupabaseMigrationBanner />
        <main className="flex-1 flex items-center justify-center">
          <AuthScreen />
        </main>
      </div>
    );
  }

  // Authenticated Application Shell
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#0b0d13] text-slate-900 dark:text-slate-100 flex flex-col antialiased">
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
            {activeTab === 'workouts' && <WorkoutsView />}
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
        <MainApp />
      </ThemeProvider>
    </AuthProvider>
  );
}
