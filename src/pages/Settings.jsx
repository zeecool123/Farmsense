import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('settings')}</h1>
      <p className="text-gray-600 mb-8">{t('configureSystem')}</p>

      <div className="space-y-6 max-w-2xl">
        {/* Account Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{t('accountSettings')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">{t('emailLabel')}</label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">{t('passwordLabel')}</label>
              <input
                type="password"
                className="w-full border rounded px-3 py-2"
                placeholder="••••••••"
              />
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              {t('update')}
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{t('notificationsHeading')}</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>{t('criticalAlerts')}</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="w-4 h-4" />
              <span>{t('dailyReports')}</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="w-4 h-4" />
              <span>{t('marketingEmails')}</span>
            </label>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{t('systemSettings')}</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">{t('dataRefreshInterval')}</label>
              <input
                type="number"
                defaultValue="5"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">{t('alertSensitivity')}</label>
              <select className="w-full border rounded px-3 py-2">
                <option>{t('low')}</option>
                <option>{t('medium')}</option>
                <option>{t('high')}</option>
              </select>
            </div>
            <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              {t('saveSettings')}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-lg shadow-md p-6 border border-red-200">
          <h2 className="text-2xl font-bold mb-4 text-red-600">{t('dangerZone')}</h2>
          <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
            {t('deleteAccount')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
