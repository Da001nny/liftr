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
        
        {/* Brand Header with Athletic Energy */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 premium-icon-container-accent mx-auto mb-3 shadow-xl"
               style={{ backgroundColor: accentColor }}>
            <Dumbbell className="w-7 h-7 text-white premium-icon-embedded" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-widest font-display text-neutral-900 dark:text-white uppercase">
            {t('common.appName')}
          </h1>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mt-1">
            {mode === 'signin' ? t('auth.welcomeBack') : t('auth.createAccountSubtitle')}
          </p>
        </div>

        {/* Elevated Metallic Card Container */}
        <div 
          data-surface="primary-metallic"
          className="rounded-2xl p-6 sm:p-8 bg-[#f5f5f7] dark:bg-[#161616] text-neutral-900 dark:text-neutral-100 border border-neutral-200/90 dark:border-white/15 shadow-sm dark:shadow-2xl transition-all"
        >
          {/* Segmented Mode Switcher */}
          <div className="flex items-center p-1 bg-neutral-200/80 dark:bg-[#181818] rounded-xl mb-6 border border-neutral-300/80 dark:border-neutral-800 shadow-inner">
            <button
              type="button"
              onClick={() => { setMode('signin'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-athletic ${
                mode === 'signin'
                  ? 'bg-neutral-900 text-white dark:bg-[#252525] shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
              }`}
            >
              {t('auth.signIn')}
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer font-athletic ${
                mode === 'signup'
                  ? 'bg-neutral-900 text-white dark:bg-[#252525] shadow-sm'
                  : 'text-neutral-700 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white'
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
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5 font-athletic">
                {t('auth.emailLabel')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.emailPlaceholder')}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm font-medium text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-sm"
                  style={{ '--tw-ring-color': accentColor } as any}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5 font-athletic">
                {t('auth.passwordLabel')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm font-medium text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-sm"
                  style={{ '--tw-ring-color': accentColor } as any}
                />
              </div>
            </div>

            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-1.5 font-athletic">
                  {t('auth.confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 dark:text-neutral-400 pointer-events-none" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('auth.confirmPasswordPlaceholder')}
                    className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-[#1a1a1a] border border-neutral-300 dark:border-neutral-800 rounded-xl text-sm font-medium text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all shadow-sm"
                    style={{ '--tw-ring-color': accentColor } as any}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl text-white font-bold uppercase tracking-wider text-xs font-athletic flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
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
          <div className="mt-6 pt-5 border-t border-neutral-300/80 dark:border-neutral-800 text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            <div className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
              <span>{t('auth.tableEditorCheckStep')}</span>
            </div>
            <p>
              {t('auth.tableEditorCheckNotice')}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
