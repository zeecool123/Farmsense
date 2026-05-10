import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', label: t('dashboard'), icon: '📊' },
    { path: '/trays', label: t('trayManagement'), icon: '🌱' },
    { path: '/analytics', label: t('analyticsAndTrends'), icon: '📈' },
    { path: '/ml-insights', label: t('mlInsights'), icon: '🤖' },
    { path: '/ai-chat', label: t('aiChat', 'AI Assistant'), icon: '💬' },
    { path: '/settings', label: t('settings'), icon: '⚙️' },
  ];

  return (
    <aside className="w-64 min-h-screen fixed left-0 top-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200/40 dark:border-gray-700/40 backdrop-blur-xl">
      {/* Logo Section */}
      <div className="p-8 border-b border-gray-200/40 dark:border-gray-700/40">
        <div className="flex items-center gap-3 group">
          <div className="text-3xl group-hover:scale-110 transition-transform duration-300">🌱</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">Farmsense</h2>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Smart Farm Management</p>
      </div>

      {/* Navigation */}
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20 text-emerald-700 dark:text-emerald-300 shadow-sm border border-emerald-100 dark:border-emerald-800/50'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/30 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                <span className={`text-xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-t from-white to-transparent dark:from-gray-900 dark:to-transparent">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p className="font-semibold mb-1">Farmsense v1.0</p>
          <p>Powering Smart Agriculture</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
