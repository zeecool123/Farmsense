import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isGuest } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Farmer';

  return (
    <nav className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/30 dark:border-gray-700/30">
      <div className="px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">{t('dashboard')}</h1>
        </div>
        
        <div className="flex items-center gap-6">
          <LanguageSelector />
          
          {/* User Profile */}
          <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors">
            <span className="text-lg">👤</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline">{userName}</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:shadow-md"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <span className="text-lg">☀️</span>
            ) : (
              <span className="text-lg">🌙</span>
            )}
          </button>

          {/* Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all hover:shadow-md"
            >
              <span className="text-gray-600 dark:text-gray-300 text-lg">⋮</span>
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-700/30 z-50 overflow-hidden animate-slide-up backdrop-blur-xl">
                <div className="px-5 py-4 border-b border-gray-200/30 dark:border-gray-700/30">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{currentUser?.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    navigate('/settings');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300 transition-colors font-medium"
                >
                  ⚙️ {t('settings')}
                </button>
                
                <button
                  onClick={() => {
                    navigate('/');
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm text-gray-700 dark:text-gray-300 transition-colors font-medium"
                >
                  📊 {t('dashboard')}
                </button>
                
                <button
                  onClick={() => {
                    handleLogout();
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-5 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 border-t border-gray-200/30 dark:border-gray-700/30 transition-colors font-medium"
                >
                  🚪 {t('logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
