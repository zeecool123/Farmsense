import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const TrayCard = ({ trayId, crop, aiScore, status, onClick }) => {
  // FIXED: We extract the 't' function from useLanguage() so the component can translate text
  const { t } = useLanguage();

  const getStatusColor = (currentStatus) => {
    if (currentStatus === 'online') return 'bg-green-500';
    if (currentStatus === 'offline') return 'bg-gray-500';
    return 'bg-yellow-500';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">
          {t('trayLabel')} {trayId}
        </h3>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${getStatusColor(status)}`}></span>
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300 capitalize">
            {status === 'online' ? t('onlineStatus') : t('offlineStatus')}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">{t('cropLabel')}:</span>
          <span className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
            {crop ? (
              <>
                {crop.icon} {crop.name}
              </>
            ) : (
              <span className="text-slate-400 italic">{t('unassigned')}</span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-500 dark:text-slate-400">{t('score')}:</span>
          <span className={`font-bold ${aiScore >= 80 ? 'text-green-600' : aiScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {aiScore}/100
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrayCard;