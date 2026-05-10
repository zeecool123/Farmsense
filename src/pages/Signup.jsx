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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Decorative gradient circles */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-emerald-200 dark:bg-emerald-900/20 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl opacity-20"></div>

      <div className="glass-card p-10 w-full max-w-md backdrop-blur-2xl animate-fade-in relative z-10">
        <div className="flex justify-end mb-4">
          <LanguageSelector />
        </div>
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🌿</div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Farmsense</h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{t('signupHeading')}</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('fullName')}</label>
            <input
              type="text"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition"
              placeholder="John Farmer"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('emailAddress')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition"
              placeholder={t('emailPlaceholder')}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('password')}</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition"
              placeholder={t('passwordPlaceholder')}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('minPasswordChars')}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('confirmPassword')}</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300/50 dark:border-gray-600/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 transition"
              placeholder={t('confirmPasswordPlaceholder')}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-6"
          >
            {loading ? t('creatingAccount') : t('signUp')}
          </button>
        </form>
            />
        </form>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6">
          {t('bySigningUp')}
        </p>

        {/* Sign In Link */}
        <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition">
              {t('signInLink')}
            </Link>
          </p>
        </div>

        {/* Features */}
        <div className="mt-8 space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400">✓</span> {t('freeAccount')}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400">✓</span> {t('instantSetup')}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400">✓</span> {t('fullFeatures')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;