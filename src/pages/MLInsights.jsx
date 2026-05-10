import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { TRAY_IDS } from '../utils/constants';
import {
  predictCropYield,
  predictHarvestTime,
  estimateNutrientRequirements,
  predictWaterConsumption,
  predictResourceEfficiency,
  predictAnomalies,
} from '../utils/mlPredictions';

const MLInsights = () => {
  const { trays, sensorData, sensorHistory } = useApp();
  const { t } = useLanguage();
  const [selectedTray, setSelectedTray] = useState('A');
  const [growthStage, setGrowthStage] = useState('vegetative');

  const tray = trays[selectedTray];
  const currentSensorData = sensorData[selectedTray];
  const selectedTrayHistory = sensorHistory[selectedTray] || [];

  const mockHistory = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      aiScore: 60 + Math.random() * 40,
      temperature: (currentSensorData?.temperature || 22) + (Math.random() - 0.5) * 4,
      humidity: (currentSensorData?.humidity || 70) + (Math.random() - 0.5) * 10,
      ph: (currentSensorData?.ph || 6.5) + (Math.random() - 0.5) * 0.3,
      waterUsage: (currentSensorData?.waterUsage || 150) + (Math.random() - 0.5) * 50,
    }));
  }, [selectedTray, currentSensorData]);

  const historyForPrediction = selectedTrayHistory.length > 0 ? selectedTrayHistory : mockHistory;

  const yieldPrediction = useMemo(
    () => (tray?.cropKey ? predictCropYield(historyForPrediction, tray.cropKey) : null),
    [tray?.cropKey, historyForPrediction]
  );

  const harvestPrediction = useMemo(
    () => (tray?.cropKey ? predictHarvestTime(tray.cropKey, historyForPrediction, 25) : null),
    [tray?.cropKey, historyForPrediction]
  );

  const nutrients = useMemo(
    () => tray?.cropKey ? estimateNutrientRequirements(tray.cropKey, historyForPrediction, growthStage) : null,
    [tray?.cropKey, historyForPrediction, growthStage]
  );

  const water = useMemo(
    () =>
      tray?.cropKey && currentSensorData
        ? predictWaterConsumption(tray.cropKey, currentSensorData.temperature, currentSensorData.humidity)
        : null,
    [tray?.cropKey, currentSensorData]
  );

  const efficiency = useMemo(() => predictResourceEfficiency(historyForPrediction), [historyForPrediction]);

  const anomalies = useMemo(
    () => tray?.cropKey ? predictAnomalies(historyForPrediction, tray.cropKey) : null,
    [tray?.cropKey, historyForPrediction]
  );

  if (!tray) {
    return (
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('mlInsights')}</h1>
        <p className="text-gray-600">{t('noTraySelected')}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🤖 {t('mlInsights')}</h1>
        <p className="text-gray-600">{t('aiPoweredPredictions')}</p>
        <p className="text-sm text-gray-500 mt-1">
          {selectedTrayHistory.length > 0 ? t('usingRealTrayHistory') : t('usingFallbackSensorData')}
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">{t('selectTrayLabel')}</label>
            <select
              value={selectedTray}
              onChange={(e) => setSelectedTray(e.target.value)}
              className="w-full border rounded px-4 py-2"
            >
              {TRAY_IDS.map((id) => (
                <option key={id} value={id}>
                  {t('tray')} {id} {trays[id]?.crop?.icon}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">{t('growthStageLabel')}</label>
            <select
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              className="w-full border rounded px-4 py-2"
            >
              <option value="vegetative">🌿 {t('vegetative')}</option>
              <option value="flowering">🌸 {t('flowering')}</option>
              <option value="fruiting">🍓 {t('fruiting')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tray Info */}
      {tray && (
        <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-purple-100 text-sm">{t('cropLabel')}</p>
              <p className="text-2xl font-bold">{tray.crop?.name} {tray.crop?.icon}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">{t('growStageLabel')}</p>
              <p className="text-xl font-bold capitalize">{t(growthStage)}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">{t('daysSincePlanted')}</p>
              <p className="text-2xl font-bold">25 {t('days')}</p>
            </div>
            <div>
              <p className="text-purple-100 text-sm">{t('statusLabel')}</p>
              <p className="text-xl font-bold">🟢 {t('healthy')}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Predictions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">📊 {t('yieldPredictionTitle')}</h2>
          {yieldPrediction && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-gradient-to-r from-green-100 to-green-50 rounded-lg">
                <p className="text-gray-600 text-sm">{t('estimatedYield')}</p>
                <p className="text-5xl font-bold text-green-600">{yieldPrediction.estimatedYield}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">{t('confidence')}</p>
                  <p className="text-2xl font-bold text-blue-600">{yieldPrediction.confidence}%</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">{t('trendLabel')}</p>
                  <p className="text-xl font-bold capitalize">
                    {yieldPrediction.trend === 'improving' ? '📈' :
                     yieldPrediction.trend === 'declining' ? '📉' : '➡️'} {yieldPrediction.trend}
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded">
                <p className="text-sm font-semibold text-blue-900">{yieldPrediction.recommendation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🌾 {t('harvestPredictionTitle')}</h2>
          {harvestPrediction && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-gradient-to-r from-amber-100 to-amber-50 rounded-lg">
                <p className="text-gray-600 text-sm">{t('maturity')}</p>
                <p className="text-5xl font-bold text-amber-600">{harvestPrediction.maturityPercent}%</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">{t('daysToHarvest')}</p>
                  <p className="text-2xl font-bold text-orange-600">{harvestPrediction.daysToHarvest}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-600">{t('estimatedDate')}</p>
                  <p className="text-sm font-bold">{harvestPrediction.estimatedHarvestDate}</p>
                </div>
              </div>
              <div className="bg-green-50 border-l-4 border-green-500 p-3 rounded">
                <p className="text-sm font-semibold text-green-900">{harvestPrediction.harvestReadiness}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Nutrients & Water */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🧪 {t('nutrientRequirements')}</h2>
          {nutrients && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-3">{nutrients.recommendation}</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">Nitrogen (N)</span>
                    <span className="text-sm font-bold text-blue-600">{nutrients.nitrogen} mg/L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (nutrients.nitrogen / 250) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">Phosphorus (P)</span>
                    <span className="text-sm font-bold text-green-600">{nutrients.phosphorus} mg/L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (nutrients.phosphorus / 150) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-semibold">Potassium (K)</span>
                    <span className="text-sm font-bold text-purple-600">{nutrients.potassium} mg/L</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${Math.min(100, (nutrients.potassium / 300) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">💧 {t('waterConsumptionForecast')}</h2>
          {water && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-gradient-to-r from-cyan-100 to-cyan-50 rounded-lg">
                <p className="text-gray-600 text-sm">{t('predictedDailyUsage')}</p>
                <p className="text-4xl font-bold text-cyan-600">{water.predictedDailyUsage}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm font-semibold mb-2">{t('adjustmentFactors')}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>{t('adjustmentLabel')}</span>
                    <span className={water.adjustment > 0 ? 'text-red-600' : 'text-green-600'}>
                      {water.adjustment > 0 ? '+' : ''}{water.adjustment}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t('reasonLabel')}</span>
                    <span className="font-semibold">{water.adjustmentReason}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">⚡ {t('resourceEfficiency')}</h2>
          {efficiency && (
            <div className="space-y-4">
              <div className="text-center py-4 bg-gradient-to-r from-indigo-100 to-indigo-50 rounded-lg">
                <p className="text-gray-600 text-sm">{t('efficiencyScore')}</p>
                <p className="text-5xl font-bold text-indigo-600">{efficiency.score}</p>
                <p className="text-sm font-semibold text-indigo-700 mt-1">{efficiency.efficiency}</p>
              </div>
              <div className={`p-4 rounded border-l-4 ${
                efficiency.score >= 80 ? 'bg-green-50 border-green-500' :
                efficiency.score >= 60 ? 'bg-yellow-50 border-yellow-500' :
                'bg-red-50 border-red-500'
              }`}>
                <p className="text-sm font-semibold">{efficiency.recommendation}</p>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">🚨 {t('anomalyDetection')}</h2>
          {anomalies && (
            <div className="space-y-4">
              <div className="text-center py-4 rounded-lg" style={{
                backgroundColor: anomalies.riskLevel === 'critical' ? '#fee2e2' :
                                 anomalies.riskLevel === 'high' ? '#fef08a' :
                                 anomalies.riskLevel === 'medium' ? '#dbeafe' :
                                 '#dcfce7',
              }}>
                <p className="text-gray-600 text-sm">{t('riskLevelLabel')}</p>
                <p className="text-3xl font-bold capitalize" style={{
                  color: anomalies.riskLevel === 'critical' ? '#dc2626' :
                         anomalies.riskLevel === 'high' ? '#ca8a04' :
                         anomalies.riskLevel === 'medium' ? '#2563eb' :
                         '#16a34a',
                }}>
                  {anomalies.riskLevel}
                </p>
              </div>
              {anomalies.anomaliesDetected.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {anomalies.anomaliesDetected.map((anomaly, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded text-sm ${
                        anomaly.severity === 'critical' ? 'bg-red-100 text-red-800 border-l-4 border-red-500' :
                        anomaly.severity === 'warning' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' :
                        'bg-blue-100 text-blue-800 border-l-4 border-blue-500'
                      }`}
                    >
                      <p className="font-semibold">{anomaly.type}</p>
                      <p>{anomaly.message}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 rounded bg-green-100 text-green-800 text-sm">
                  {t('noAnomaliesDetected')}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MLInsights;
