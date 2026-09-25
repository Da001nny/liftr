import React, { useState, useEffect } from 'react';
import { Database as DbIcon, Copy, Check, ExternalLink, RefreshCw } from 'lucide-react';
import { useTranslation } from '../i18n';
import { checkSupabaseProfilesTable } from '../lib/supabase';

const SCHEMA_SQL = `-- Run this in your Supabase SQL Editor:
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
  const [tableExists, setTableExists] = useState<boolean | null>(null);
  const [checking, setChecking] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [showSqlModal, setShowSqlModal] = useState<boolean>(false);

  const runCheck = async () => {
    setChecking(true);
    const { exists } = await checkSupabaseProfilesTable();
    setTableExists(exists);
    setChecking(false);
  };

  useEffect(() => {
    runCheck();
  }, []);

  const handleCopySql = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (tableExists === true || tableExists === null) {
    return null;
  }

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
              <pre>{SCHEMA_SQL}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                {copied ? t('supabaseSetup.sqlCopiedMessage') : ''}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
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
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
