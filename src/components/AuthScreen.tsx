import React, { useState } from 'react';
import { useTranslation } from '../i18n';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShieldCheck, Dumbbell, AlertCircle, ArrowRight, Lock, Mail } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { t } = useTranslation();
  const { signIn, signUp } = useAuth();
  const { accentColor } = useTheme();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessNotice(null);

    if (!email || !password) {
      setErrorMessage(t('errors.unauthorized'));
      return;
    }

    if (password.length < 6) {
      setErrorMessage(t('auth.passwordTooShort'));
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage(t('auth.passwordsDoNotMatch'));
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setErrorMessage(error.message);
        }
      } else {
        const { error } = await signUp(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          setSuccessNotice(t('auth.tableEditorCheckNotice'));
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || t('auth.authError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-3 shadow-lg"
               style={{ backgroundColor: accentColor }}>
            <Dumbbell className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight font-display text-slate-900 dark:text-white">
            {t('common.appName')}
          </h1>
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
            {mode === 'signin' ? t('auth.welcomeBack') : t('auth.createAccountSubtitle')}
          </p>
        </div>

        {/* Elevated Metallic Card Container */}
        <div 
          data-surface="primary-metallic"
          className="rounded-2xl p-6 sm:p-8 backdrop-blur-xl transition-all"
        >
          {/* Segmented Mode Switcher */}
          <div className="flex items-center p-1 bg-slate-200/80 dark:bg-slate-900/80 rounded-xl mb-6 border border-slate-300/80 dark:border-slate-800">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {t('auth.signIn')}
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-700 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {t('auth.signUp')}
            </button>
          </div>

          {/* Error & Success Messages */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-sm"
                  style={{ '--tw-ring-color': accentColor } as any}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-sm"
                  style={{ '--tw-ring-color': accentColor } as any}
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                  {t('auth.confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-sm"
                    style={{ '--tw-ring-color': accentColor } as any}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              style={{ backgroundColor: accentColor }}
            >
              {isSubmitting ? (
                <span>{t('auth.authenticating')}</span>
              ) : (
                <>
                  <span>{mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Supabase Verification Notice */}
          <div className="mt-6 pt-5 border-t border-slate-300/80 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Phase 0: Supabase Persistence Verification</span>
            </div>
            <p>
              Identity is derived purely from Supabase Auth. Upon signup, verify your user in the Supabase Table Editor: both <code className="bg-slate-200/90 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-900 dark:text-slate-100 font-mono">auth.users</code> and <code className="bg-slate-200/90 dark:bg-slate-800 px-1 py-0.5 rounded text-slate-900 dark:text-slate-100 font-mono">public.profiles</code>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
