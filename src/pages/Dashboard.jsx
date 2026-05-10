import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import TrayCard from '../components/TrayCard';
import AlertBox from '../components/AlertBox';
import SensorReading from '../components/SensorReading';
import { TRAY_IDS } from '../utils/constants';

const Dashboard = () => {
  const { trays, alerts, clearAlert, sensorData, aiScores, simulateAnomaly, resetAnomaly } = useApp();
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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-12 animate-fade-in">
        <h1 className="text-5xl font-bold mb-3 text-gray-900 dark:text-white">{t('dashboard')}</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">{t('dashboardOverview')}</p>
      </div>

      {/* Overview Summary - Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('activeTrays')}</p>
            <span className="text-2xl">🌱</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{summaryStats.activeTrays}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('traysCurrentlyOnline')}</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full opacity-30"></div>
        </div>

        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('averageHealth')}</p>
            <span className="text-2xl">❤️</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{summaryStats.avgScore}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('averageAIScore')}</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-green-400 to-emerald-600 rounded-full opacity-30"></div>
        </div>

        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('activeAlerts')}</p>
            <span className="text-2xl">🔔</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{summaryStats.alertCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('openSystemNotifications')}</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-amber-400 to-orange-600 rounded-full opacity-30"></div>
        </div>

        <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{t('lastUpdate')}</p>
            <span className="text-2xl">⏱️</span>
          </div>
          <p className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{summaryStats.latestUpdate}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{t('mostRecentSensorData')}</p>
          <div className="mt-4 h-1 bg-gradient-to-r from-blue-400 to-cyan-600 rounded-full opacity-30"></div>
        </div>
      </div>

      {/* Quick Actions - Premium Banner */}
      <div className="mb-10">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10 p-8 border border-emerald-200/30 dark:border-emerald-800/30 shadow-lg">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.3),transparent_50%)]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{t('quickActions')}</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">{t('jumpIntoWorkflows')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/trays"
                className="btn-primary inline-block text-center"
              >
                {t('manageTrays')}
              </Link>
              <Link
                to="/analytics"
                className="btn-secondary inline-block text-center"
              >
                {t('viewAnalytics')}
              </Link>
            <Link
              to="/ml-insights"
              className="rounded-xl bg-white text-blue-700 px-4 py-3 font-semibold text-sm shadow hover:bg-slate-100 transition"
            >
              {t('mlInsights')}
            </Link>
            <Link
              to="/settings"
              className="rounded-xl bg-white text-blue-700 px-4 py-3 font-semibold text-sm shadow hover:bg-slate-100 transition"
            >
              {t('systemSettings')}
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
          <h2 className="text-2xl font-bold mb-3">{t('howToUseFarmsense')}</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-700">
            <li>{t('assignYourTrays')}</li>
            <li>{t('monitorLiveConditions')}</li>
            <li>{t('trackTrends')}</li>
            <li>{t('reviewAIInsights')}</li>
            <li>{t('adjustPreferences')}</li>
          </ol>
        </div>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('recentAlerts')} ({alerts.length})</h2>
          <div className="max-w-3xl">
            {alerts.slice(0, 5).map((alert) => (
              <AlertBox
                key={alert.id}
                alert={alert}
                onDismiss={() => clearAlert(alert.id)}
              />
            ))}
          </div>
        </div>
      )}

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
        <h2 className="text-2xl font-bold mb-4">{t('trayStatus')}</h2>
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
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t('trayDetails', { trayId: selectedTray })}</h2>
            <button
              onClick={() => setSelectedTray(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ✕
            </button>
          </div>

          {/* Tray Info */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-4">
            <div>
              <p className="text-gray-600 text-sm">{t('cropLabel')}</p>
              <p className="text-lg font-bold flex items-center gap-2">
                {selectedTrayData.crop?.icon} {selectedTrayData.crop?.name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">{t('statusLabel')}</p>
              <p className="text-lg font-bold text-green-600">
                🟢 {selectedTrayData.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">{t('aiScoreLabel')}</p>
              <p className="text-lg font-bold text-blue-600">{aiScores[selectedTray] || 0}/100</p>
            </div>
          </div>

          {/* Real-time Sensor Data */}
          {selectedSensorData ? (
            <div>
              <h3 className="text-xl font-bold mb-4">{t('liveSensorReadings')}</h3>
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
            <p className="text-gray-500">{t('waitingForSensorData')}</p>
          )}

          {/* Test Controls */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-3">{t('testControls')}</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => simulateAnomaly(selectedTray, 'temperature')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
              >
                {t('simulateTempAnomaly')}
              </button>
              <button
                onClick={() => simulateAnomaly(selectedTray, 'humidity')}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
              >
                {t('simulateHumidityAnomaly')}
              </button>
              <button
                onClick={() => resetAnomaly(selectedTray)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
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
