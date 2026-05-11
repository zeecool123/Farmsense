import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useApp } from '../context/AppContext'; // Import AppContext for alerts
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, logout, isGuest } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const { alerts, clearAlert } = useApp(); // Pull alerts from context
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Farmer';
  const userLabel = isGuest ? ' (Guest)' : '';

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left Side - Removed Dashboard Title as requested */}
        <div className="flex items-center gap-4">
           {/* Empty to push everything else to the right */}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          
          {/* Notification Bell Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <span className="text-xl">🔔</span>
              {alerts.length > 0 && (
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow">
                  {alerts.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-semibold text-slate-800 dark:text-white">Notifications</h3>
                  {alerts.length > 0 && (
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                      {alerts.length} New
                    </span>
                  )}
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {alerts.length > 0 ? (
                    alerts.map((alert) => (
                      <div key={alert.id} className="p-4 border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition relative group">
                        <div className="flex items-start gap-3">
                          <span className="text-xl">
                            {alert.severity === 'critical' ? '🚨' : alert.severity === 'warning' ? '⚠️' : 'ℹ️'}
                          </span>
                          <div className="flex-1 pr-4">
                            <h4 className="text-sm font-bold text-slate-800 dark:text-white">{alert.title}</h4>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{alert.message}</p>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                              {new Date(alert.timestamp || Date.now()).toLocaleTimeString()}
                            </p>
                          </div>
                          <button 
                            onClick={() => clearAlert(alert.id)} 
                            className="absolute right-3 top-3 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 dark:text-slate-400 text-sm">
                      No new notifications
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {isDark ? (
              <span className="text-xl">☀️</span>
            ) : (
              <span className="text-xl">🌙</span>
            )}
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-full ml-2">
            <span className="text-lg">👤</span>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{userName}{userLabel}</span>
          </div>

          {/* User Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 px-3 py-2 rounded-lg transition-colors"
            >
              <span className="text-slate-600 dark:text-slate-300">⋮</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => {navigate('/settings'); setShowDropdown(false);}}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300"
                >
                  ⚙️ {t('settings')}
                </button>
                <button
                  onClick={() => {navigate('/'); setShowDropdown(false);}}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm text-slate-700 dark:text-slate-300"
                >
                  📊 {t('dashboard')}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 border-t border-slate-200 dark:border-slate-700"
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