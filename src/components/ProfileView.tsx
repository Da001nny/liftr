import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Moon, 
  Sun, 
  Monitor, 
  Clock, 
  LogOut, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Save,
  Scale,
  Gauge
} from 'lucide-react';

import { formatDateOnly } from '../lib/date';

interface ProfileViewProps {
  onClose: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { 
    themeMode, 
    setThemeMode, 
    accentColor, 
    gender,
    setGender,
    restTimerDefaults,
    setRestTimerDefaults,
    weightUnit,
    distanceUnit,
    setWeightUnit,
    setDistanceUnit,
    isSavingProfile,
  } = useTheme();

  const [restDefaults, setRestDefaultsLocal] = useState(restTimerDefaults);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleSaveRestDefaults = async (e: React.FormEvent) => {
    e.preventDefault();
    await setRestTimerDefaults(restDefaults);
    setSaveStatus(t('profile.saveSuccess'));
    setTimeout(() => setSaveStatus(null), 3500);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-24 md:pb-12 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white font-display uppercase">
            {t('profile.title')}
          </h1>
          <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-0.5">
            {t('profile.subtitle')}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="px-3.5 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold uppercase tracking-wider font-athletic flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{t('auth.signOut')}</span>
        </button>
      </div>

      {/* Supabase Persistence Confirmation Callout */}
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-950 dark:text-blue-200 text-xs leading-relaxed flex items-start gap-3 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-blue-900 dark:text-blue-100">
            {t('profile.supabaseNoticeTitle')}
          </span>
          <p className="text-blue-900/80 dark:text-blue-300/80 font-medium">
            {t('profile.supabaseNoticeDesc')} Every preference persists directly to Supabase Postgres with RLS scoped to <code className="bg-blue-500/20 px-1 py-0.5 rounded font-mono text-[11px] font-bold">{user?.id || 'auth.uid()'}</code>.
          </p>
          <a
            href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline pt-1"
          >
            <span>{t('common.openTableEditor')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Primary Elevated Metallic Card: Simplified Theme Switcher (Dark / Light / System) */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-7 space-y-4 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
      >
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl premium-icon-container">
              <Sparkles className="w-4 h-4 shrink-0 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <h2 className="text-base font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('profile.themeSettingsTitle')}
            </h2>
          </div>
          {isSavingProfile && (
            <span className="text-[11px] font-mono text-neutral-600 dark:text-neutral-400 font-bold animate-pulse">
              Syncing to Supabase...
            </span>
          )}
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium relative z-10">
          Switch between neutral dark fintech titanium mode and airy minimal light mode.
        </p>

        {/* Theme Mode Toggle: Dark / Light / System */}
        <div className="relative z-10">
          <div className="grid grid-cols-3 gap-2 p-1 bg-neutral-200/80 dark:bg-[#181818] rounded-xl border border-neutral-300/80 dark:border-neutral-800 shadow-inner">
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer font-athletic ${
                themeMode === 'dark'
                  ? 'bg-neutral-900 text-white dark:bg-[#252525] shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t('profile.themeDark')}</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer font-athletic ${
                themeMode === 'light'
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t('profile.themeLight')}</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('system')}
              className={`py-2 px-3 text-xs font-bold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer font-athletic ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-[#252525] text-neutral-900 dark:text-white shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t('profile.themeSystem')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Flat Card: Flagship Anatomical Model Preference */}
      <div 
        data-surface="secondary-flat" 
        className="rounded-xl p-5 sm:p-6 space-y-4 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl premium-icon-container">
            <User className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
          </div>
          <h3 className="text-sm font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
            {t('profile.anatomicalSexLabel')}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider font-athletic flex items-center justify-center gap-2 transition-all cursor-pointer ${
              gender === 'male'
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-neutral-800 shadow-sm'
                : 'border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {gender === 'male' && <Check className="w-3.5 h-3.5" />}
            <span>{t('profile.male')}</span>
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider font-athletic flex items-center justify-center gap-2 transition-all cursor-pointer ${
              gender === 'female'
                ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-neutral-800 shadow-sm'
                : 'border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {gender === 'female' && <Check className="w-3.5 h-3.5" />}
            <span>{t('profile.female')}</span>
          </button>
        </div>
      </div>

      {/* Unit Preferences Card (Weight: kg/lbs, Distance: km/mi) */}
      <div 
        data-surface="secondary-flat" 
        className="rounded-xl p-5 sm:p-6 space-y-4 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl premium-icon-container">
            <Scale className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('profile.unitsTitle')}
            </h3>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
              {t('profile.unitsDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Weight Unit */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block uppercase font-athletic">
              {t('profile.weightUnitLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setWeightUnit('kg')}
                className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider font-athletic flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  weightUnit === 'kg'
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-neutral-800 shadow-sm'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {weightUnit === 'kg' && <Check className="w-3.5 h-3.5" />}
                <span>{t('profile.unitKg')}</span>
              </button>
              <button
                type="button"
                onClick={() => setWeightUnit('lbs')}
                className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider font-athletic flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  weightUnit === 'lbs'
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-neutral-800 shadow-sm'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {weightUnit === 'lbs' && <Check className="w-3.5 h-3.5" />}
                <span>{t('profile.unitLbs')}</span>
              </button>
            </div>
          </div>

          {/* Distance Unit */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block uppercase font-athletic">
              {t('profile.distanceUnitLabel')}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDistanceUnit('km')}
                className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider font-athletic flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  distanceUnit === 'km'
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-neutral-800 shadow-sm'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {distanceUnit === 'km' && <Check className="w-3.5 h-3.5" />}
                <span>{t('profile.unitKm')}</span>
              </button>
              <button
                type="button"
                onClick={() => setDistanceUnit('mi')}
                className={`p-3 rounded-lg border text-xs font-bold uppercase tracking-wider font-athletic flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  distanceUnit === 'mi'
                    ? 'border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-neutral-800 shadow-sm'
                    : 'border-neutral-300 dark:border-neutral-800 text-neutral-700 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                }`}
              >
                {distanceUnit === 'mi' && <Check className="w-3.5 h-3.5" />}
                <span>{t('profile.unitMi')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Flat Card: Rest Timer Defaults */}
      <form 
        onSubmit={handleSaveRestDefaults} 
        data-surface="secondary-flat" 
        className="rounded-xl p-5 sm:p-6 space-y-4 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl premium-icon-container">
              <Clock className="w-4 h-4 text-neutral-700 dark:text-neutral-300 premium-icon-embedded" />
            </div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
              {t('profile.restTimerDefaultsTitle')}
            </h3>
          </div>
          {saveStatus && (
            <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">
              {saveStatus}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1 uppercase font-athletic">
              {t('profile.defaultRestLabel')}
            </label>
            <input
              type="number"
              min={10}
              max={600}
              value={restDefaults.defaultRestSeconds}
              onChange={(e) => setRestDefaultsLocal({
                ...restDefaults,
                defaultRestSeconds: parseInt(e.target.value, 10) || 90,
              })}
              className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 shadow-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1 uppercase font-athletic">
              {t('profile.warmupRestLabel')}
            </label>
            <input
              type="number"
              min={10}
              max={600}
              value={restDefaults.warmupRestSeconds}
              onChange={(e) => setRestDefaultsLocal({
                ...restDefaults,
                warmupRestSeconds: parseInt(e.target.value, 10) || 60,
              })}
              className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 shadow-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 block mb-1 uppercase font-athletic">
              {t('profile.compoundRestLabel')}
            </label>
            <input
              type="number"
              min={10}
              max={600}
              value={restDefaults.compoundRestSeconds}
              onChange={(e) => setRestDefaultsLocal({
                ...restDefaults,
                compoundRestSeconds: parseInt(e.target.value, 10) || 180,
              })}
              className="w-full px-3 py-2 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 rounded-lg text-xs font-mono font-bold text-neutral-900 dark:text-neutral-100 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md font-athletic"
          style={{ backgroundColor: accentColor }}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{t('common.save')}</span>
        </button>
      </form>

      {/* Account Info (Metadata display) */}
      <div 
        data-surface="secondary-flat" 
        className="rounded-xl p-5 sm:p-6 space-y-3 bg-neutral-100/90 dark:bg-[#141414] border border-neutral-200/90 dark:border-[#242424] text-neutral-900 dark:text-white shadow-sm dark:shadow-md transition-all"
      >
        <h3 className="text-sm font-black text-neutral-900 dark:text-white font-display uppercase tracking-wide">
          {t('profile.userHeader')}
        </h3>
        
        <div className="space-y-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t('profile.emailLabel')}:</span>
            <span className="font-bold text-neutral-900 dark:text-white">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t('profile.userIdLabel')}:</span>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">{user?.id || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t('profile.createdAtLabel')}:</span>
            <span className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400 font-bold">
              {user?.created_at ? formatDateOnly(user.created_at) : 'N/A'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
