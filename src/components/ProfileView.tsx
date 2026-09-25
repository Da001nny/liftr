import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useTheme, PREDEFINED_ACCENTS } from '../context/ThemeContext';
import { ThemeMode, SurfaceIntensity, GenderModel } from '../types/database';
import { 
  User, 
  Moon, 
  Sun, 
  Monitor, 
  Sliders, 
  Palette, 
  Clock, 
  LogOut, 
  Check, 
  ShieldCheck, 
  Sparkles,
  ExternalLink,
  Save
} from 'lucide-react';

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
    setAccentColor, 
    surfaceIntensity, 
    setSurfaceIntensity,
    gender,
    setGender,
    restTimerDefaults,
    setRestTimerDefaults,
    isSavingProfile,
  } = useTheme();

  const [customHex, setCustomHex] = useState(accentColor);
  const [restDefaults, setRestDefaultsLocal] = useState(restTimerDefaults);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleCustomHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomHex(val);
    if (/^#([0-9A-F]{3}){1,2}$/i.test(val)) {
      setAccentColor(val);
    }
  };

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
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
            {t('profile.title')}
          </h1>
          <p className="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
            {t('profile.subtitle')}
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="px-3 py-1.5 rounded-lg border border-rose-300 dark:border-rose-900/60 text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
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
            {t('profile.supabaseNoticeDesc')} Every preference below persists directly to Supabase Postgres with RLS scoped to <code className="bg-blue-500/20 px-1 py-0.5 rounded font-mono text-[11px] font-bold">{user?.id || 'auth.uid()'}</code>.
          </p>
          <a
            href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/editor"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 dark:text-blue-400 hover:underline pt-1"
          >
            <span>Open Supabase Table Editor</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Primary Elevated Metallic Card: Styling & Theme Engine */}
      <div 
        data-surface="primary-metallic"
        className="rounded-2xl p-6 sm:p-7 space-y-6"
      >
        <div className="flex items-center gap-2 relative z-10">
          <Sparkles className="w-4 h-4 shrink-0" style={{ color: accentColor }} />
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            {t('profile.themeSettingsTitle')}
          </h2>
          {isSavingProfile && (
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-semibold animate-pulse ml-auto">
              Syncing to Supabase...
            </span>
          )}
        </div>

        {/* 1. Theme Mode: Dark / Light / System */}
        <div className="space-y-2 relative z-10">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            {t('profile.themeModeLabel')}
          </label>
          <div className="grid grid-cols-3 gap-2 p-1 bg-slate-200/80 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800 shadow-inner">
            <button
              type="button"
              onClick={() => setThemeMode('dark')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                themeMode === 'dark'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>{t('profile.themeDark')}</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('light')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                themeMode === 'light'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>{t('profile.themeLight')}</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode('system')}
              className={`py-2 px-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                themeMode === 'system'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>{t('profile.themeSystem')}</span>
            </button>
          </div>
        </div>

        {/* 2. Surface Sheen Intensity */}
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {t('profile.surfaceIntensityLabel')}
            </label>
            <span className="text-[11px] font-mono text-slate-700 dark:text-slate-300 font-bold capitalize">
              {surfaceIntensity}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'medium', 'high'] as SurfaceIntensity[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSurfaceIntensity(level)}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                  surfaceIntensity === level
                    ? 'border-slate-500 dark:border-white/50 bg-white dark:bg-white/10 text-slate-950 dark:text-white shadow-sm'
                    : 'border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-400'
                }`}
              >
                {level === 'low' && t('profile.surfaceLow')}
                {level === 'medium' && t('profile.surfaceMedium')}
                {level === 'high' && t('profile.surfaceHigh')}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Predefined Accent Colors + Custom Picker */}
        <div className="space-y-2 relative z-10">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            {t('profile.accentColorLabel')}
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {PREDEFINED_ACCENTS.map((item) => {
              const isSelected = accentColor.toLowerCase() === item.hex.toLowerCase();
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setAccentColor(item.hex);
                    setCustomHex(item.hex);
                  }}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-105 cursor-pointer shadow-sm ${
                    isSelected ? 'ring-2 ring-offset-2 ring-slate-900 dark:ring-offset-slate-900 scale-105' : ''
                  }`}
                  style={{ backgroundColor: item.hex }}
                  title={item.name}
                >
                  {isSelected && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
              );
            })}

            {/* Custom color hex input */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-300 dark:border-slate-800">
              <input
                type="color"
                value={accentColor}
                onChange={(e) => {
                  setAccentColor(e.target.value);
                  setCustomHex(e.target.value);
                }}
                className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
              />
              <input
                type="text"
                value={customHex}
                onChange={handleCustomHexChange}
                placeholder="#3b82f6"
                className="w-24 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-slate-100 uppercase shadow-sm"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Secondary Flat Card: Flagship Anatomical Model Preference */}
      <div data-surface="secondary-flat" className="rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {t('profile.anatomicalSexLabel')}
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-3 max-w-sm">
          <button
            type="button"
            onClick={() => setGender('male')}
            className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              gender === 'male'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            {gender === 'male' && <Check className="w-3.5 h-3.5" />}
            <span>{t('profile.male')}</span>
          </button>
          <button
            type="button"
            onClick={() => setGender('female')}
            className={`p-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              gender === 'female'
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 shadow-sm'
                : 'border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
            }`}
          >
            {gender === 'female' && <Check className="w-3.5 h-3.5" />}
            <span>{t('profile.female')}</span>
          </button>
        </div>
      </div>

      {/* Secondary Flat Card: Rest Timer Defaults */}
      <form onSubmit={handleSaveRestDefaults} data-surface="secondary-flat" className="rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
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
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
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
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
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
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
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
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-900 dark:text-slate-100 shadow-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-4 py-2 text-xs font-bold text-white rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
          style={{ backgroundColor: accentColor }}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{t('common.save')}</span>
        </button>
      </form>

      {/* Account Info (Metadata display) */}
      <div data-surface="secondary-flat" className="rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          {t('profile.userHeader')}
        </h3>
        
        <div className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t('profile.emailLabel')}:</span>
            <span className="font-bold text-slate-900 dark:text-white">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t('profile.userIdLabel')}:</span>
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-bold">{user?.id || 'N/A'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-semibold">{t('profile.createdAtLabel')}:</span>
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 font-bold">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
