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
    { path: '/settings', label: t('settings'), icon: '⚙️' },
  ];

  return (
    <aside className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 min-h-screen fixed left-0 top-0 shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌱</span>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Farmsense</h2>
        </div>
      </div>
      <div className="p-6">
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                location.pathname === item.path
                  ? 'bg-farm-50 dark:bg-farm-900/20 text-farm-700 dark:text-farm-300 border-r-2 border-farm-500'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
