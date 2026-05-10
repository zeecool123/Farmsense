import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import TrayCard from '../components/TrayCard';
import SensorReading from '../components/SensorReading';
import HardwareSensorDashboard from '../components/HardwareSensorDashboard';
import { TRAY_IDS } from '../utils/constants';

const Dashboard = () => {
  const { trays, alerts, sensorData, aiScores, simulateAnomaly, resetAnomaly } = useApp();
  const { t } = useLanguage();
  const [selectedTray, setSelectedTray] = useState(null);

  const selectedTrayData = selectedTray ? trays[selectedTray] : null;
  const selectedSensorData = selectedTray ? sensorData[selectedTray] : null;

  const summaryStats = useMemo(() => {
    const activeTrays = TRAY_IDS.filter((trayId) => trays[trayId]?.status === 'online').length;
    const avgScore = TRAY_IDS.reduce((sum, trayId) => sum + (aiScores[trayId] || 0), 0) / TRAY_IDS.length || 0;
    const latestUpdate = Math.max(
      ...TRAY_IDS.map((trayId) => sensorData[trayId]?.timestamp?.getTime() || 0)
    );
    return {
      activeTrays,
      avgScore: Math.round(avgScore),
      latestUpdate: latestUpdate ? new Date(latestUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('noData'),
      alertCount: alerts.length,
    };
  }, [trays, alerts, aiScores, sensorData, t]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">{t('dashboard')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('dashboardOverview')}</p>
      </div>

      {/* Overview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('activeTrays')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{summaryStats.activeTrays}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('traysCurrentlyOnline')}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('averageHealth')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{summaryStats.avgScore}%</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('averageAIScore')}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('activeAlerts')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{summaryStats.alertCount}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('openSystemNotifications')}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase">{t('lastUpdate')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900 dark:text-white">{summaryStats.latestUpdate}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{t('mostRecentSensorData')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-3">{t('quickActions')}</h2>
          <p className="text-cyan-100 mb-4">{t('jumpIntoWorkflows')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/trays" className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 font-semibold text-sm shadow transition backdrop-blur-sm">
              {t('manageTrays')}
            </Link>
            <Link to="/analytics" className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 font-semibold text-sm shadow transition backdrop-blur-sm">
              {t('viewAnalytics')}
            </Link>
            <Link to="/ml-insights" className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 font-semibold text-sm shadow transition backdrop-blur-sm">
              {t('mlInsights')}
            </Link>
            <Link to="/settings" className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 font-semibold text-sm shadow transition backdrop-blur-sm">
              {t('systemSettings')}
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-6 border border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{t('howToUseFarmsense')}</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300">
            <li>{t('assignYourTrays')}</li>
            <li>{t('monitorLiveConditions')}</li>
            <li>{t('trackTrends')}</li>
            <li>{t('reviewAIInsights')}</li>
            <li>{t('adjustPreferences')}</li>
          </ol>
        </div>
      </div>

      {/* ML Insights Quick Link */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-blue-200">{t('aiDrivenInsights')}</p>
            <h2 className="text-3xl font-bold mt-2">{t('exploreMLInsights')}</h2>
            <p className="mt-2 text-blue-100 max-w-xl">
              {t('goToMLInsights')} {t('viewAnalytics')}
            </p>
          </div>
          <Link
            to="/ml-insights"
            className="inline-flex items-center justify-center bg-white text-blue-700 font-semibold rounded-lg px-5 py-3 shadow hover:bg-slate-100 transition"
          >
            {t('goToMLInsights')}
          </Link>
        </div>
      </div>

      {/* Trays Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">{t('trayStatus')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TRAY_IDS.map((trayId) => {
            const tray = trays[trayId];
            return (
              <TrayCard
                key={trayId}
                trayId={trayId}
                crop={tray?.crop}
                aiScore={aiScores[trayId] || 0}
                status={tray?.status || 'offline'}
                onClick={() => setSelectedTray(selectedTray === trayId ? null : trayId)}
              />
            );
          })}
        </div>
      </div>

      {/* Selected Tray Details */}
      {selectedTrayData && (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 space-y-6 border border-slate-200 dark:border-slate-700">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('trayDetails', { trayId: selectedTray })}</h2>
            <button
              onClick={() => setSelectedTray(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tray Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{t('cropLabel')}</p>
              <p className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                {selectedTrayData.crop?.icon} {selectedTrayData.crop?.name}
              </p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{t('statusLabel')}</p>
              <p className="text-lg font-bold text-green-600">
                🟢 {selectedTrayData.status}
              </p>
            </div>
            <div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{t('aiScoreLabel')}</p>
              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{aiScores[selectedTray] || 0}/100</p>
            </div>
          </div>

          {/* Real-time Sensor Data */}
          {selectedSensorData ? (
            <div>
              <h3 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">{t('liveSensorReadings')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SensorReading
                  label={t('temperature') || 'Temperature'}
                  value={selectedSensorData.temperature?.toFixed(1)}
                  unit="°C"
                  icon="🌡️"
                  status={
                    selectedSensorData.temperature >= selectedTrayData.crop?.optimalTemp.min &&
                    selectedSensorData.temperature <= selectedTrayData.crop?.optimalTemp.max
                      ? 'optimal'
                      : 'anomaly'
                  }
                />
                <SensorReading
                  label={t('humidity') || 'Humidity'}
                  value={selectedSensorData.humidity?.toFixed(1)}
                  unit="%"
                  icon="💧"
                  status={
                    selectedSensorData.humidity >= selectedTrayData.crop?.optimalHumidity.min &&
                    selectedSensorData.humidity <= selectedTrayData.crop?.optimalHumidity.max
                      ? 'optimal'
                      : 'anomaly'
                  }
                />
                <SensorReading
                  label={t('phLevel') || 'pH Level'}
                  value={selectedSensorData.ph?.toFixed(2)}
                  unit=""
                  icon="⚗️"
                  status={
                    selectedSensorData.ph >= selectedTrayData.crop?.optimalPH.min &&
                    selectedSensorData.ph <= selectedTrayData.crop?.optimalPH.max
                      ? 'optimal'
                      : 'anomaly'
                  }
                />
                <SensorReading
                  label={t('waterUsage') || 'Water Usage'}
                  value={selectedSensorData.waterUsage?.toFixed(0)}
                  unit="ml"
                  icon="💦"
                  status="info"
                />
              </div>
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400">{t('waitingForSensorData')}</p>
          )}

          {/* Test Controls */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
            <h3 className="text-lg font-bold mb-3 text-slate-900 dark:text-white">{t('testControls')}</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => simulateAnomaly(selectedTray, 'temperature')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm shadow"
              >
                {t('simulateTempAnomaly')}
              </button>
              <button
                onClick={() => simulateAnomaly(selectedTray, 'humidity')}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm shadow"
              >
                {t('simulateHumidityAnomaly')}
              </button>
              <button
                onClick={() => resetAnomaly(selectedTray)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm shadow"
              >
                {t('resetToNormal') || 'Reset to Normal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;