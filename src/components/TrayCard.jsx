import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TrayCard = ({ trayId, crop, aiScore, status, onClick }) => {
  const { t } = useLanguage();

  const getStatusColor = (currentStatus) => {
    if (currentStatus === 'online') return 'bg-emerald-500 shadow-emerald-500/50';
    if (currentStatus === 'offline') return 'bg-gray-500 shadow-gray-500/50';
    return 'bg-amber-500 shadow-amber-500/50';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20';
    return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
  };

  return (
    <div
      onClick={onClick}
      className="glass-card p-7 cursor-pointer group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">{t('trayLabel')}</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">#{trayId}</h3>
        </div>
        <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 px-3 py-2 rounded-full backdrop-blur-sm">
          <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(status)} shadow-lg animate-pulse`}></span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 capitalize">
            {status === 'online' ? t('onlineStatus') : t('offlineStatus')}
          </span>
        </div>
      </div>

      {/* Crop Info */}
      <div className="mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">{t('cropLabel')}</p>
        {crop ? (
          <p className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {crop.icon} {crop.name}
          </p>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 italic">{t('unassigned')}</p>
        )}
      </div>

      {/* AI Score */}
      <div>
        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-2">{t('healthScore')}</p>
        <div className="flex items-end gap-3">
          <span className={`text-3xl font-bold ${getScoreColor(aiScore)} px-3 py-1 rounded-lg`}>
            {aiScore}%
          </span>
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 transition-all duration-500"
              style={{ width: `${aiScore}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrayCard;