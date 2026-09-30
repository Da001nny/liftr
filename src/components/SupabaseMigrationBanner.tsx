import React, { useState, useEffect } from 'react';
import { Database as DbIcon, Copy, Check, ExternalLink, RefreshCw, X } from 'lucide-react';
import { useTranslation } from '../i18n';
import { fetchPhase1MigrationSql } from '../lib/exerciseService';

interface SchemaStatusData {
  profilesTableExists: boolean;
  exercisesTableExists: boolean;
  phase1Ready: boolean;
  counts?: {
    exercises: number;
    muscles: number;
    regions: number;
    contributions: number;
  };
}

const PHASE_0_SQL = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme_mode TEXT NOT NULL DEFAULT 'system' CHECK (theme_mode IN ('light', 'dark', 'system')),
  accent_color TEXT NOT NULL DEFAULT '#3b82f6',
  surface_intensity TEXT NOT NULL DEFAULT 'medium' CHECK (surface_intensity IN ('low', 'medium', 'high')),
  rest_timer_defaults JSONB NOT NULL DEFAULT '{"defaultRestSeconds": 90, "warmupRestSeconds": 60, "compoundRestSeconds": 180}'::jsonb,
  gender TEXT NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, theme_mode, accent_color, surface_intensity, rest_timer_defaults, gender)
  VALUES (NEW.id, 'system', '#3b82f6', 'medium', '{"defaultRestSeconds": 90, "warmupRestSeconds": 60, "compoundRestSeconds": 180}'::jsonb, 'male')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();`;

export const SupabaseMigrationBanner: React.FC = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SchemaStatusData | null>(null);
  const [checking, setChecking] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);
  const [phase1Sql, setPhase1Sql] = useState<string>('');

  const runCheck = async () => {
    setChecking(true);
    try {
      const res = await fetch('/api/schema-status');
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.items && json.data.items.length > 0) {
          setStatus(json.data.items[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to check schema status:', err);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    runCheck();
    fetchPhase1MigrationSql().then(sql => {
      if (sql) setPhase1Sql(sql);
    });
  }, []);

  const handleCopySql = (sqlText: string) => {
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!status) return null;

  // Both Phase 0 and Phase 1 verified in Supabase Table Editor!
  if (status.profilesTableExists && status.phase1Ready) {
    return null;
  }

  // Phase 0 migration needed
  if (!status.profilesTableExists) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-3 text-amber-900 dark:text-amber-200">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5">
            <DbIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-950 dark:text-amber-100">{t('supabaseSetup.bannerTitle')}</span>
              <p className="text-amber-900 dark:text-amber-300 mt-0.5 font-medium">
                {t('supabaseSetup.bannerDesc')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowSqlModal(true)}
              className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-900 dark:text-amber-100 font-medium transition-colors cursor-pointer"
            >
              {t('supabaseSetup.copySqlButton')}
            </button>
            <a
              href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/sql/new"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white font-medium flex items-center gap-1 transition-colors"
            >
              <span>{t('supabaseSetup.openEditorButton')}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={runCheck}
              disabled={checking}
              className="p-1 rounded hover:bg-amber-500/20 transition-colors cursor-pointer"
              title={t('supabaseSetup.alreadyRanButton')}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {showSqlModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full p-5 shadow-2xl flex flex-col max-h-[85vh]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-semibold text-slate-900 dark:text-white text-sm">
                  Supabase SQL Migration (public.profiles)
                </h3>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-xs font-semibold px-2 py-1"
                >
                  {t('common.close')}
                </button>
              </div>

              <div className="my-3 overflow-y-auto flex-1 bg-slate-950 p-3 rounded-lg text-emerald-400 font-mono text-xs leading-relaxed border border-slate-800">
                <pre>{PHASE_0_SQL}</pre>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  {copied ? t('supabaseSetup.sqlCopiedMessage') : ''}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopySql(PHASE_0_SQL)}
                    className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? t('common.copied') : t('supabaseSetup.copySqlButton')}</span>
                  </button>
                  <a
                    href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/sql/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>{t('supabaseSetup.openEditorButton')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Phase 1 migration notification
  return (
    <div className="bg-blue-500/10 border-b border-blue-500/30 px-4 py-3 text-blue-900 dark:text-blue-200">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <DbIcon className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-blue-950 dark:text-blue-100">{t('supabasePhase1.bannerTitle')}</span>
            <p className="text-blue-900 dark:text-blue-300 mt-0.5 font-medium">
              {t('supabasePhase1.bannerDesc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (phase1Sql) {
                handleCopySql(phase1Sql);
              } else {
                fetchPhase1MigrationSql().then(sql => {
                  if (sql) {
                    setPhase1Sql(sql);
                    handleCopySql(sql);
                  }
                });
              }
            }}
            className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-950 dark:text-blue-100 font-bold transition-colors cursor-pointer flex items-center gap-1 font-athletic uppercase tracking-wider"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? t('common.copied') : t('supabasePhase1.copySqlButton')}</span>
          </button>
          
          <button
            onClick={() => setShowSqlModal(true)}
            className="px-2.5 py-1 rounded bg-blue-500/20 hover:bg-blue-500/30 text-blue-950 dark:text-blue-100 font-bold transition-colors cursor-pointer font-athletic uppercase tracking-wider"
          >
            {t('supabasePhase1.viewSqlButton')}
          </button>

          <a
            href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1 transition-colors font-athletic uppercase tracking-wider"
          >
            <span>{t('supabasePhase1.openEditorButton')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={runCheck}
            disabled={checking}
            className="p-1 rounded hover:bg-blue-500/20 transition-colors cursor-pointer"
            title="Re-check Supabase schema"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-white text-base font-display uppercase">
                  Supabase Phase 1 Migration (002_create_exercise_catalog.sql)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Creates 4 tables (muscle_regions, muscles, exercises, exercise_muscle_contributions) and seeds 203 exercises with 820 contributions.
                </p>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 overflow-y-auto flex-1 bg-neutral-950 p-4 rounded-xl text-emerald-400 font-mono text-xs leading-relaxed border border-neutral-800">
              <pre>{phase1Sql ? phase1Sql.slice(0, 10000) + (phase1Sql.length > 10000 ? '\n\n-- ... [357 KB full SQL script ready to copy with the button below] ...' : '') : 'Loading SQL...'}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-500">
                {copied ? t('supabasePhase1.sqlCopied') : 'Copy and paste into your Supabase SQL Editor'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySql(phase1Sql)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-athletic uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t('common.copied') : t('supabasePhase1.copySqlButton')}</span>
                </button>
                <a
                  href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-athletic uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>{t('supabasePhase1.openEditorButton')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
