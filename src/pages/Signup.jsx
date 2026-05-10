import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError(t('pleaseFillFields'));
      return false;
    }

    if (formData.displayName.length < 2) {
      setError(t('nameAtLeast2Chars'));
      return false;
    }

    if (formData.password.length < 6) {
      setError(t('passwordAtLeast6Chars'));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError(t('invalidEmail'));
      return false;
    }

    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create the account in localStorage
      await signUpUser(formData.email, formData.password, formData.displayName);
      
      // MODIFIED: Send the user to the login page instead of the home page!
      navigate('/login'); 
      
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        setError(t('emailAlreadyInUse'));
      } else if (err.code === 'auth/weak-password') {
        setError(t('weakPassword'));
      } else {
        setError(err.message || t('failedToCreateAccount'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center px-4 py-10">
      <div className="glass-card relative z-10 w-full max-w-2xl p-8 md:p-10 backdrop-blur-2xl border border-white/70 dark:border-slate-700/70 shadow-2xl">
        <div className="flex flex-col gap-6 md:gap-0 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-600 dark:text-emerald-400 mb-3">Create account</p>
            <h1 className="text-4xl md:text-5xl font-semibold text-slate-950 dark:text-white leading-tight">
              Simple sign up for everyone
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl">
              Large labels, clear fields, and an easy button make creating an account fast and friendly.
            </p>
          </div>
          <div className="flex items-center justify-end">
            <LanguageSelector />
          </div>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="rounded-3xl border border-red-200 bg-red-50/90 dark:border-red-700 dark:bg-red-900/20 px-5 py-4 text-sm text-red-700 dark:text-red-300">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-lg font-semibold text-slate-900 dark:text-white">{t('fullName')}</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-300/70 dark:border-slate-600/70 bg-white/90 dark:bg-slate-900/90 px-5 py-4 text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition"
              placeholder="John Farmer"
              disabled={loading}
            />
          </div>

          <div className="space-y-3">
            <label className="block text-lg font-semibold text-slate-900 dark:text-white">{t('emailAddress')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-3xl border border-slate-300/70 dark:border-slate-600/70 bg-white/90 dark:bg-slate-900/90 px-5 py-4 text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition"
              placeholder={t('emailPlaceholder')}
              disabled={loading}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-900 dark:text-white">{t('password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-300/70 dark:border-slate-600/70 bg-white/90 dark:bg-slate-900/90 px-5 py-4 text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition"
                placeholder={t('passwordPlaceholder')}
                disabled={loading}
              />
            </div>
            <div className="space-y-3">
              <label className="block text-lg font-semibold text-slate-900 dark:text-white">{t('confirmPassword')}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full rounded-3xl border border-slate-300/70 dark:border-slate-600/70 bg-white/90 dark:bg-slate-900/90 px-5 py-4 text-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition"
                placeholder={t('confirmPasswordPlaceholder')}
                disabled={loading}
              />
            </div>
          </div>

          <div className="text-sm text-slate-500 dark:text-slate-400">
            {t('minPasswordChars')}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full rounded-3xl py-4 text-lg font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t('creatingAccount') : t('signUp')}
          </button>
        </form>

        <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t('bySigningUp')}
          </p>
          <p className="mt-4 text-sm text-slate-800 dark:text-slate-200">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition">
              {t('signInLink')}
            </Link>
          </p>
        </div>

        <div className="mt-8 grid gap-3 text-sm text-slate-700 dark:text-slate-300">
          <div className="rounded-3xl bg-slate-100/80 dark:bg-slate-800/60 px-4 py-3">
            ✓ {t('freeAccount')}
          </div>
          <div className="rounded-3xl bg-slate-100/80 dark:bg-slate-800/60 px-4 py-3">
            ✓ {t('instantSetup')}
          </div>
          <div className="rounded-3xl bg-slate-100/80 dark:bg-slate-800/60 px-4 py-3">
            ✓ {t('fullFeatures')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;