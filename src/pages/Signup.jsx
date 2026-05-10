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
    <div className="min-h-screen bg-gradient-to-br from-farm-500 to-farm-600 flex items-center justify-center px-4 py-8">
      <div className="bg-white/95 dark:bg-slate-950/95 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-[0_30px_80px_-40px_rgba(22,163,74,0.9)] p-8 w-full max-w-md backdrop-blur-xl">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Farmsense</h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">{t('signupHeading')}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('fullName')}</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder="John Farmer"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('emailAddress')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t('emailPlaceholder')}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t('passwordPlaceholder')}
              disabled={loading}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('minPasswordChars')}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">{t('confirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-farm-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              placeholder={t('confirmPasswordPlaceholder')}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-farm-600 hover:bg-farm-700 text-white font-semibold py-3 rounded-lg transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? t('creatingAccount') : t('signUp')}
          </button>
        </form>

        {/* Terms */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4">
          {t('bySigningUp')}
        </p>

        {/* Sign In Link */}
        <div className="mt-6 border-t pt-6 text-center">
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-farm-600 dark:text-farm-400 font-semibold hover:underline">
              {t('signInLink')}
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 space-y-2 text-sm text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span>✅</span> {t('freeAccount')}
          </div>
          <div className="flex items-center gap-2">
            <span>✅</span> {t('instantSetup')}
          </div>
          <div className="flex items-center gap-2">
            <span>✅</span> {t('fullFeatures')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;