import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import AreaCard from '../components/AreaCard';
import SensorReading from '../components/SensorReading';
import AlertBox from '../components/AlertBox';
import { AREA_IDS } from '../utils/constants';

const Dashboard = () => {
  const { areas, alerts, sensorData, aiScores, simulateAnomaly, resetAnomaly, clearAlert } = useApp();
  const { t } = useLanguage();
  const [selectedArea, setSelectedArea] = useState(null);

  const selectedAreaData = selectedArea ? areas[selectedArea] : null;
  const selectedSensorData = selectedArea ? sensorData[selectedArea] : null;

  const summaryStats = useMemo(() => {
    const activeAreas = AREA_IDS.filter((areaId) => areas[areaId]?.status === 'online').length;
    const avgScore = AREA_IDS.reduce((sum, areaId) => sum + (aiScores[areaId] || 0), 0) / AREA_IDS.length || 0;
    const latestUpdate = Math.max(
      ...AREA_IDS.map((areaId) => sensorData[areaId]?.timestamp?.getTime() || 0)
    );
    return {
      activeAreas,
      avgScore: Math.round(avgScore),
      latestUpdate: latestUpdate ? new Date(latestUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : t('noData'),
      alertCount: alerts.length,
    };
  }, [areas, alerts, aiScores, sensorData, t]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-black dark:text-white mb-2">{t('dashboard')}</h1>
        <p className="text-slate-600 dark:text-slate-400">{t('dashboardOverview')}</p>
      </div>

      {/* Overview Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
          <p className="text-sm font-semibold text-slate-500 uppercase">{t('activeTrays')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{summaryStats.activeTrays}</p>
          <p className="text-sm text-slate-500 mt-2">{t('traysCurrentlyOnline')}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
          <p className="text-sm font-semibold text-slate-500 uppercase">{t('averageHealth')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{summaryStats.avgScore}%</p>
          <p className="text-sm text-slate-500 mt-2">{t('averageAIScore')}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
          <p className="text-sm font-semibold text-slate-500 uppercase">{t('activeAlerts')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{summaryStats.alertCount}</p>
          <p className="text-sm text-slate-500 mt-2">{t('openSystemNotifications')}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 border border-slate-100">
          <p className="text-sm font-semibold text-slate-500 uppercase">{t('lastUpdate')}</p>
          <p className="mt-3 text-4xl font-bold text-slate-900">{summaryStats.latestUpdate}</p>
          <p className="text-sm text-slate-500 mt-2">{t('mostRecentSensorData')}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold text-white mb-3">{t('quickActions')}</h2>
          <p className="text-cyan-100 mb-4">{t('jumpIntoWorkflows')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/areas" className="rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white px-4 py-3 font-semibold text-sm shadow transition backdrop-blur-sm">
              {t('manageAreas')}
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
          <h2 className="text-2xl font-bold text-black dark:text-white mb-3">{t('howToUseFarmsense')}</h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-700 dark:text-slate-300">
            <li>{t('assignYourAreas')}</li>
            <li>{t('monitorLiveConditions')}</li>
            <li>{t('trackTrends')}</li>
            <li>{t('reviewAIInsights')}</li>
            <li>{t('adjustPreferences')}</li>
          </ol>
        </div>
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
            <h2 className="text-3xl font-bold text-white mt-2">{t('exploreMLInsights')}</h2>
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

      {/* Areas Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-4">{t('areaStatus')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AREA_IDS.map((areaId) => {
            const area = areas[areaId];
            return (
              <AreaCard
                key={areaId}
                areaId={areaId}
                crop={area?.crop}
                aiScore={aiScores[areaId] || 0}
                status={area?.status || 'offline'}
                onClick={() => setSelectedArea(selectedArea === areaId ? null : areaId)}
              />
            );
          })}
        </div>
      </div>

        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
=======
      {/* Selected Tray Details */}
      {selectedTrayData && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">

          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black dark:text-white">{t('areaDetails', { areaId: selectedArea })}</h2>
            <button
              className="text-gray-400 hover:text-gray-600 text-2xl"
=======
              onClick={() => setSelectedTray(null)}
              className="text-gray-400 hover:text-gray-600 text-2xl"

            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-4">
            <div>
              <p className="text-gray-600 text-sm">{t('cropLabel')}</p>
              <p className="text-lg font-bold flex items-center gap-2">
                {selectedAreaData.crop?.icon} {selectedAreaData.crop?.name}
=======
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
              <p className="text-lg font-bold text-blue-600">{aiScores[selectedArea] || 0}/100</p>
=======
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
                    selectedSensorData.temperature >= selectedAreaData.crop?.optimalTemp.min &&
                    selectedSensorData.temperature <= selectedAreaData.crop?.optimalTemp.max
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
                    selectedSensorData.humidity >= selectedAreaData.crop?.optimalHumidity.min &&
                    selectedSensorData.humidity <= selectedAreaData.crop?.optimalHumidity.max
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
                    selectedSensorData.ph >= selectedAreaData.crop?.optimalPH.min &&
                    selectedSensorData.ph <= selectedAreaData.crop?.optimalPH.max
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
                onClick={() => simulateAnomaly(selectedArea, 'temperature')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm shadow"
              >
                {t('simulateTempAnomaly')}
              </button>
              <button
                onClick={() => simulateAnomaly(selectedArea, 'humidity')}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm shadow"
              >
                {t('simulateHumidityAnomaly')}
              </button>
              <button
                onClick={() => resetAnomaly(selectedArea)}
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