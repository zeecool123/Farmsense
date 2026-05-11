import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Changed text-gray-800 to text-slate-900 dark:text-white for extreme clarity */}
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('settings')}</h1>
      <p className="text-slate-600 dark:text-slate-400 mb-8">{t('configureSystem')}</p>

      <div className="space-y-6 max-w-2xl">
        {/* Account Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('accountSettings')}</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{t('emailLabel')}</label>
              <input
                type="email"
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-farm-500 transition"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{t('passwordLabel')}</label>
              <input
                type="password"
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-farm-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button className="bg-farm-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-farm-700 transition shadow">
              {t('update')}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('notificationsHeading')}</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-farm-600 rounded focus:ring-farm-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{t('criticalAlerts')}</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-farm-600 rounded focus:ring-farm-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{t('dailyReports')}</span>
            </label>
            <label className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition">
              <input type="checkbox" className="w-5 h-5 text-farm-600 rounded focus:ring-farm-500 bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-600" />
              <span className="font-medium text-slate-800 dark:text-slate-200">{t('marketingEmails')}</span>
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('systemSettings')}</h2>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{t('dataRefreshInterval')}</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-farm-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">{t('alertSensitivity')}</label>
              <select className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-farm-500 transition">
                <option value="low">{t('low')}</option>
                <option value="medium">{t('medium')}</option>
                <option value="high">{t('high')}</option>
              </select>
            </div>
            <button className="bg-farm-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-farm-700 transition shadow">
              {t('saveSettings')}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl shadow-md p-6 border border-red-200 dark:border-red-800/50 mt-8">
          <h2 className="text-2xl font-bold mb-4 text-red-600 dark:text-red-500">{t('dangerZone')}</h2>
          <p className="text-sm text-red-600/80 dark:text-red-400 mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button className="bg-red-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-red-700 transition shadow">
            {t('deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;