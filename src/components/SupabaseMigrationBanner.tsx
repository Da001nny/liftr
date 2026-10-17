import React, { useState, useEffect } from 'react';
import { Database as DbIcon, Copy, Check, ExternalLink, RefreshCw, X } from 'lucide-react';
import { useTranslation } from '../i18n';
import { 
  fetchPhase1MigrationSql, 
  fetchPhase3MigrationSql, 
  fetchPhase4MigrationSql,
  fetchPhase5MigrationSql 
} from '../lib/exerciseService';

interface SchemaStatusData {
  profilesTableExists: boolean;
  exercisesTableExists: boolean;
  phase1Ready: boolean;
  phase3Ready?: boolean;
  phase4Ready?: boolean;
  phase5Ready?: boolean;
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
  const [phase3Sql, setPhase3Sql] = useState<string>('');
  const [phase4Sql, setPhase4Sql] = useState<string>('');
  const [phase5Sql, setPhase5Sql] = useState<string>('');
  const [activeModalPhase, setActiveModalPhase] = useState<1 | 3 | 4 | 5>(1);

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
    fetchPhase3MigrationSql().then(sql => {
      if (sql) setPhase3Sql(sql);
    });
    fetchPhase4MigrationSql().then(sql => {
      if (sql) setPhase4Sql(sql);
    });
    fetchPhase5MigrationSql().then(sql => {
      if (sql) setPhase5Sql(sql);
    });
  }, []);

  const handleCopySql = (sqlText: string) => {
    navigator.clipboard.writeText(sqlText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!status) return null;

  // Phase 0, 1, 3, 4, and 5 verified in Supabase Table Editor!
  if (status.profilesTableExists && status.phase1Ready && status.phase3Ready && status.phase4Ready && status.phase5Ready) {
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

  // Determine which phase is pending
  const isPhase5Pending = status.phase1Ready && status.phase3Ready && status.phase4Ready && !status.phase5Ready;
  const isPhase4Pending = status.phase1Ready && status.phase3Ready && !status.phase4Ready;
  const isPhase3Pending = status.phase1Ready && !status.phase3Ready;
  const currentBannerPhase: 1 | 3 | 4 | 5 = isPhase5Pending ? 5 : (isPhase4Pending ? 4 : (isPhase3Pending ? 3 : 1));
  const currentSql = currentBannerPhase === 5 
    ? phase5Sql 
    : (currentBannerPhase === 4 ? phase4Sql : (currentBannerPhase === 3 ? phase3Sql : phase1Sql));

  const bannerBg = isPhase5Pending
    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200'
    : (isPhase4Pending 
      ? 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-200' 
      : (isPhase3Pending 
        ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-900 dark:text-indigo-200' 
        : 'bg-blue-500/10 border-blue-500/30 text-blue-900 dark:text-blue-200'));

  const iconColor = isPhase5Pending 
    ? 'text-emerald-500' 
    : (isPhase4Pending ? 'text-purple-500' : (isPhase3Pending ? 'text-indigo-500' : 'text-blue-500'));
  const titleColor = isPhase5Pending
    ? 'text-emerald-950 dark:text-emerald-100'
    : (isPhase4Pending 
      ? 'text-purple-950 dark:text-purple-100' 
      : (isPhase3Pending ? 'text-indigo-950 dark:text-indigo-100' : 'text-blue-950 dark:text-blue-100'));
  const descColor = isPhase5Pending
    ? 'text-emerald-900 dark:text-emerald-300'
    : (isPhase4Pending 
      ? 'text-purple-900 dark:text-purple-300' 
      : (isPhase3Pending ? 'text-indigo-900 dark:text-indigo-300' : 'text-blue-900 dark:text-blue-300'));

  const bannerTitle = isPhase5Pending
    ? t('supabasePhase5.bannerTitle')
    : (isPhase4Pending 
      ? t('supabasePhase4.bannerTitle') 
      : (isPhase3Pending ? t('supabasePhase3.bannerTitle') : t('supabasePhase1.bannerTitle')));
  const bannerDesc = isPhase5Pending
    ? t('supabasePhase5.bannerDesc')
    : (isPhase4Pending 
      ? t('supabasePhase4.bannerDesc') 
      : (isPhase3Pending ? t('supabasePhase3.bannerDesc') : t('supabasePhase1.bannerDesc')));
  const copyBtnText = isPhase5Pending
    ? t('supabasePhase5.copySqlButton')
    : (isPhase4Pending 
      ? t('supabasePhase4.copySqlButton') 
      : (isPhase3Pending ? t('supabasePhase3.copySqlButton') : t('supabasePhase1.copySqlButton')));
  const viewBtnText = isPhase5Pending
    ? t('supabasePhase5.viewSqlButton')
    : (isPhase4Pending 
      ? t('supabasePhase4.viewSqlButton') 
      : (isPhase3Pending ? t('supabasePhase3.viewSqlButton') : t('supabasePhase1.viewSqlButton')));
  const openBtnText = isPhase5Pending
    ? t('supabasePhase5.openEditorButton')
    : (isPhase4Pending 
      ? t('supabasePhase4.openEditorButton') 
      : (isPhase3Pending ? t('supabasePhase3.openEditorButton') : t('supabasePhase1.openEditorButton')));

  const btnBg = isPhase5Pending
    ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-950 dark:text-emerald-100'
    : (isPhase4Pending 
      ? 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-950 dark:text-purple-100' 
      : (isPhase3Pending 
        ? 'bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-950 dark:text-indigo-100' 
        : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-950 dark:text-blue-100'));

  const primaryBtnBg = isPhase5Pending
    ? 'bg-emerald-600 hover:bg-emerald-700'
    : (isPhase4Pending 
      ? 'bg-purple-600 hover:bg-purple-700' 
      : (isPhase3Pending ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'));

  return (
    <div className={`border-b px-4 py-3 ${bannerBg}`}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <DbIcon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />
          <div>
            <span className={`font-bold ${titleColor}`}>
              {bannerTitle}
            </span>
            <p className={`mt-0.5 font-medium ${descColor}`}>
              {bannerDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (currentSql) {
                handleCopySql(currentSql);
              } else {
                const fetchFn = currentBannerPhase === 4 ? fetchPhase4MigrationSql : (currentBannerPhase === 3 ? fetchPhase3MigrationSql : fetchPhase1MigrationSql);
                fetchFn().then(sql => {
                  if (sql) {
                    if (currentBannerPhase === 4) setPhase4Sql(sql);
                    else if (currentBannerPhase === 3) setPhase3Sql(sql);
                    else setPhase1Sql(sql);
                    handleCopySql(sql);
                  }
                });
              }
            }}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer flex items-center gap-1 font-athletic uppercase tracking-wider ${btnBg}`}
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? t('common.copied') : copyBtnText}</span>
          </button>
          
          <button
            onClick={() => {
              setActiveModalPhase(currentBannerPhase);
              setShowSqlModal(true);
            }}
            className={`px-2.5 py-1 rounded font-bold transition-colors cursor-pointer font-athletic uppercase tracking-wider ${btnBg}`}
          >
            {viewBtnText}
          </button>

          <a
            href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/sql/new"
            target="_blank"
            rel="noopener noreferrer"
            className={`px-2.5 py-1 rounded text-white font-bold flex items-center gap-1 transition-colors font-athletic uppercase tracking-wider ${primaryBtnBg}`}
          >
            <span>{openBtnText}</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={runCheck}
            disabled={checking}
            className={`p-1 rounded transition-colors cursor-pointer hover:opacity-80`}
            title={t('supabaseSetup.recheckTitle')}
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
                  {activeModalPhase === 5
                    ? 'Supabase Phase 5 Migration (005_create_activity_progress.sql)'
                    : (activeModalPhase === 4 
                      ? 'Supabase Phase 4 Migration (004_create_calendar_scheduling.sql)' 
                      : (activeModalPhase === 3 ? 'Supabase Phase 3 Migration (003_create_workout_progression.sql)' : 'Supabase Phase 1 Migration (002_create_exercise_catalog.sql)'))}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {activeModalPhase === 5
                    ? 'Creates bodyweight_entries and step_entries tables with RLS policies, architected for future wearables.'
                    : (activeModalPhase === 4
                      ? 'Creates workout_series, scheduled_workouts, calendar_notes, and calendar_rest_days tables with RLS policies.'
                      : (activeModalPhase === 3 
                        ? 'Creates workouts, workout_exercises, workout_sets, personal_records, workout_templates, and template_exercises with RLS policies.'
                        : 'Creates 4 tables (muscle_regions, muscles, exercises, exercise_muscle_contributions) and seeds 203 exercises with 820 contributions.'))}
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
              <pre>{(activeModalPhase === 5 ? phase5Sql : (activeModalPhase === 4 ? phase4Sql : (activeModalPhase === 3 ? phase3Sql : phase1Sql))) || t('supabasePhase1.loadingSql')}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-neutral-500">
                {copied 
                  ? (activeModalPhase === 5 ? t('supabasePhase5.sqlCopied') : (activeModalPhase === 4 ? t('supabasePhase4.sqlCopied') : (activeModalPhase === 3 ? t('supabasePhase3.sqlCopied') : t('supabasePhase1.sqlCopied')))) 
                  : t('supabasePhase1.copySqlHint')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopySql(activeModalPhase === 4 ? phase4Sql : (activeModalPhase === 3 ? phase3Sql : phase1Sql))}
                  className={`px-4 py-2 text-white text-xs font-bold font-athletic uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeModalPhase === 4 ? 'bg-purple-600 hover:bg-purple-700' : (activeModalPhase === 3 ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700')
                  }`}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? t('common.copied') : (activeModalPhase === 4 ? t('supabasePhase4.copySqlButton') : (activeModalPhase === 3 ? t('supabasePhase3.copySqlButton') : t('supabasePhase1.copySqlButton')))}</span>
                </button>
                <a
                  href="https://supabase.com/dashboard/project/cetpdeuuymspiygxnmdg/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold font-athletic uppercase tracking-wider rounded-xl flex items-center gap-1.5 transition-colors"
                >
                  <span>{activeModalPhase === 4 ? t('supabasePhase4.openEditorButton') : (activeModalPhase === 3 ? t('supabasePhase3.openEditorButton') : t('supabasePhase1.openEditorButton'))}</span>
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
