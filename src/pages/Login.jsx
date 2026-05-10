import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from '../components/LanguageSelector';

const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError(t('pleaseFillFields'));
        setLoading(false);
        return;
      }

      await signInUser(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found') {
        setError(t('noAccountFound'));
      } else if (err.code === 'auth/wrong-password') {
        setError(t('incorrectPassword'));
      } else if (err.code === 'auth/invalid-email') {
        setError(t('invalidEmail'));
      } else {
        setError(err.message || t('failedToSignIn'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farm-400 via-farm-500 to-farm-600 flex items-center justify-center p-4">
      <div className="bg-white/95 dark:bg-slate-950/95 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_30px_80px_-40px_rgba(22,163,74,0.9)] p-8 w-full max-w-md backdrop-blur-xl">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🌱</div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Farmsense</h1>
          <p className="text-slate-600 dark:text-slate-300 text-lg">{t('loginSubheading')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('emailAddress')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t('emailPlaceholder')}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farm-500 focus:border-transparent transition-all bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t('passwordPlaceholder')}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-farm-500 to-farm-600 text-white font-semibold py-3 rounded-xl hover:from-farm-600 hover:to-farm-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {t('noAccount')}{' '}
            <Link to="/signup" className="text-farm-600 dark:text-farm-400 font-semibold hover:text-farm-700 dark:hover:text-farm-300 transition-colors">
              {t('createOne')}
            </Link>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs text-slate-500 dark:text-slate-400">
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">📊</span>
            {t('realTimeMonitoring')}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">🤖</span>
            {t('aiInsights')}
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl mb-1">⚡</span>
            {t('smartControls')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
