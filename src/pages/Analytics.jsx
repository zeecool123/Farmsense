import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import SensorChart from '../components/SensorChart';
import SensorReading from '../components/SensorReading';
import { TRAY_IDS } from '../utils/constants';
import { predictCropYield, predictHarvestTime } from '../utils/mlPredictions';

const Analytics = () => {
  const { trays, sensorData, aiScores, sensorHistory } = useApp();
  const { t } = useLanguage();
  const [selectedTray, setSelectedTray] = useState('A');
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(24); // hours
  const selectedTrayHistory = sensorHistory[selectedTray] || [];

  useEffect(() => {
    if (selectedTrayHistory.length > 1) {
      setChartData(
        selectedTrayHistory.map((entry) => ({
          // MODIFIED: Added 'second: 2-digit' so the x-axis actually moves!
          time: new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          temperature: entry.temperature,
          humidity: entry.humidity,
          ph: entry.ph,
          waterUsage: entry.waterUsage,
        }))
      );
      return;
    }

    const data = [];
    const now = Date.now();
    const interval = (timeRange * 3600000) / 24;

    for (let i = 0; i < 24; i++) {
      const time = new Date(now - (24 - i) * interval);
      const hour = time.getHours();
      const minute = time.getMinutes();

      const tempBase = 20 + Math.sin((i / 24) * Math.PI * 2) * 5;
      const humidityBase = 70 + Math.sin(((i + 6) / 24) * Math.PI * 2) * 15;
      const phBase = 6.5 + Math.sin(((i + 12) / 24) * Math.PI * 2) * 0.2;

      data.push({
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        temperature: Math.round((tempBase + (Math.random() - 0.5) * 2) * 10) / 10,
        humidity: Math.round((humidityBase + (Math.random() - 0.5) * 3) * 10) / 10,
        ph: Math.round((phBase + (Math.random() - 0.5) * 0.1) * 100) / 100,
        waterUsage: Math.round(140 + (Math.random() - 0.5) * 40),
      });
    }
    setChartData(data);
  }, [selectedTray, timeRange, selectedTrayHistory]);

  const currentSensorData = sensorData[selectedTray];
  const tray = trays[selectedTray];
  const historyForPrediction = selectedTrayHistory.length > 0 ? selectedTrayHistory : chartData;

  const yieldPrediction = useMemo(
    () => (tray?.cropKey ? predictCropYield(historyForPrediction, tray.cropKey) : null),
    [tray?.cropKey, historyForPrediction]
  );

  const harvestPrediction = useMemo(
    () => (tray?.cropKey ? predictHarvestTime(tray.cropKey, historyForPrediction, 25) : null),
    [tray?.cropKey, historyForPrediction]
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* ... The rest of your JSX remains exactly the same ... */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{t('analyticsAndTrends')}</h1>
        <p className="text-gray-600">{t('monitorSensorTrends')}</p>
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
              {TRAY_IDS.map((tray) => (
                <option key={tray} value={tray}>
                  {t('tray')} {tray}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">{t('timeRangeLabel')}</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="w-full border rounded px-4 py-2"
            >
              <option value={1}>{t('last1Hour')}</option>
              <option value={6}>{t('last6Hours')}</option>
              <option value={12}>{t('last12Hours')}</option>
              <option value={24}>{t('last24Hours')}</option>
              <option value={168}>{t('last7Days')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tray Info */}
      {tray && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-green-100 text-sm">{t('cropLabel')}</p>
              <p className="text-2xl font-bold">{tray.crop?.name} {tray.crop?.icon}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">{t('aiScoreLabel')}</p>
              <p className="text-2xl font-bold">{aiScores[selectedTray] || 0}/100</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">{t('statusLabel')}</p>
              <p className="text-2xl font-bold">🟢 {tray.status}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">{t('lastUpdate')}</p>
              <p className="text-lg font-bold">
                {currentSensorData?.timestamp
                  ? new Date(currentSensorData.timestamp).toLocaleTimeString()
                  : t('noData')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Readings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{t('currentReadingsHeading')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorReading
            label={t('temperature')}
            value={currentSensorData?.temperature?.toFixed(1) || '--'}
            unit="°C"
            icon="🌡️"
            status={
              tray?.crop &&
              currentSensorData?.temperature >= tray.crop.optimalTemp.min &&
              currentSensorData?.temperature <= tray.crop.optimalTemp.max
                ? 'optimal'
                : 'warning'
            }
          />
          <SensorReading
            label={t('humidity')}
            value={currentSensorData?.humidity?.toFixed(1) || '--'}
            unit="%"
            icon="💧"
            status={
              tray?.crop &&
              currentSensorData?.humidity >= tray.crop.optimalHumidity.min &&
              currentSensorData?.humidity <= tray.crop.optimalHumidity.max
                ? 'optimal'
                : 'warning'
            }
          />
          <SensorReading
            label={t('pHTrend')}
            value={currentSensorData?.ph?.toFixed(2) || '--'}
            unit=""
            icon="⚗️"
            status={
              tray?.crop &&
              currentSensorData?.ph >= tray.crop.optimalPH.min &&
              currentSensorData?.ph <= tray.crop.optimalPH.max
                ? 'optimal'
                : 'warning'
            }
          />
          <SensorReading
            label={t('waterUsage')}
            value={currentSensorData?.waterUsage?.toFixed(0) || '--'}
            unit="ml/min"
            icon="💦"
            status="info"
          />
        </div>
      </div>

      {/* Prediction Summary */}
      {(yieldPrediction || harvestPrediction) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{t('yieldForecastHeading')}</h2>
            <p className="text-sm text-gray-600 mb-4">
              {selectedTrayHistory.length > 0 ? t('usingRealSensorHistory') : t('usingFallbackTrendData')}
            </p>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-green-600">{yieldPrediction?.estimatedYield || t('noData')}</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">{t('confidence')}</p>
                  <p className="text-xl font-bold">{yieldPrediction?.confidence || 0}%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">{t('trendLabel')}</p>
                  <p className="text-xl font-bold capitalize">{yieldPrediction?.trend || 'stable'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4">{t('harvestProjectionHeading')}</h2>
            <div className="space-y-3">
              <div className="text-5xl font-bold text-amber-600">{harvestPrediction?.maturityPercent || '--'}%</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">{t('daysToHarvest')}</p>
                  <p className="text-xl font-bold">{harvestPrediction?.daysToHarvest || '--'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="text-sm text-gray-500">{t('estimatedDate')}</p>
                  <p className="text-xl font-bold">{harvestPrediction?.estimatedHarvestDate || t('tbd')}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700">{harvestPrediction?.harvestReadiness}</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="space-y-6">
        <SensorChart
          data={chartData}
          dataKey="temperature"
          stroke="#ff7300"
          title={`${t('temperatureTrend')} (${timeRange}h)`}
        />
        <SensorChart
          data={chartData}
          dataKey="humidity"
          stroke="#8884d8"
          title={`${t('humidityTrend')} (${timeRange}h)`}
        />
        <SensorChart
          data={chartData}
          dataKey="ph"
          stroke="#82ca9d"
          title={`${t('pHTrend')} (${timeRange}h)`}
        />
        <SensorChart
          data={chartData}
          dataKey="waterUsage"
          stroke="#ffc658"
          title={`${t('waterUsageTrend')} (${timeRange}h)`}
        />
      </div>

      {/* Optimal Parameters */}
      {tray?.crop && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">{t('optimalParametersFor', { cropName: tray.crop.name })}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-600 text-sm">{t('temperature')}</p>
              <p className="text-lg font-bold">{tray.crop.optimalTemp.min}-{tray.crop.optimalTemp.max}°C</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 text-sm">{t('humidity')}</p>
              <p className="text-lg font-bold">{tray.crop.optimalHumidity.min}-{tray.crop.optimalHumidity.max}%</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-600 text-sm">{t('pHTrend')}</p>
              <p className="text-lg font-bold">{tray.crop.optimalPH.min}-{tray.crop.optimalPH.max}</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-600 text-sm">{t('waterUsage')}</p>
              <p className="text-lg font-bold">{tray.crop.optimalWaterUsage.min}-{tray.crop.optimalWaterUsage.max}ml/day</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-gray-600 text-sm">{t('lightHours')}</p>
              <p className="text-lg font-bold">{tray.crop.optimalLight.min}-{tray.crop.optimalLight.max}h/day</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;