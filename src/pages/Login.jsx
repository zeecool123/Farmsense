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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200 to-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5"></div>
      </div>

      <div className="glass-card p-10 w-full max-w-md backdrop-blur-2xl animate-fade-in relative z-10">
        <div className="flex justify-end mb-6">
          <LanguageSelector />
        </div>

        <div className="text-center mb-10">
          <div className="text-7xl mb-4 inline-block bg-gradient-to-br from-emerald-400 to-emerald-600 p-4 rounded-2xl">🌱</div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent mb-2">Farmsense</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{t('loginSubheading')}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-5 py-4 rounded-xl text-sm font-medium animate-slide-up">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('emailAddress')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300/40 dark:border-gray-600/40 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500"
              placeholder={t('emailPlaceholder')}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300/40 dark:border-gray-600/40 rounded-xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-500"
              placeholder={t('passwordPlaceholder')}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary py-3.5 text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('noAccount')}{' '}
            <Link to="/signup" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
              {t('createOne')}
            </Link>
          </p>
        </div>

        {/* Features highlight */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <span className="text-2xl mb-2">📊</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{t('realTimeMonitoring')}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
            <span className="text-2xl mb-2">🤖</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{t('aiInsights')}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <span className="text-2xl mb-2">⚡</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center">{t('smartControls')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
