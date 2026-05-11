import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AREA_IDS } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';

const SENSOR_TYPES = [
  {
    key: 'arduino',
    icon: '🧠',
    labelKey: 'arduinoSensor',
    descriptionKey: 'arduinoSensorDesc',
  },
  {
    key: 'temperature',
    icon: '🌡️',
    labelKey: 'temperatureSensor',
    descriptionKey: 'temperatureSensorDesc',
    unit: '°C',
  },
  {
    key: 'humidity',
    icon: '💧',
    labelKey: 'humiditySensor',
    descriptionKey: 'humiditySensorDesc',
    unit: '%',
  },
  {
    key: 'ph',
    icon: '⚗️',
    labelKey: 'pHSensor',
    descriptionKey: 'pHSensorDesc',
    unit: '',
  },
  {
    key: 'waterUsage',
    icon: '💦',
    labelKey: 'waterFlowSensor',
    descriptionKey: 'waterFlowSensorDesc',
    unit: 'ml/min',
  },
];

const HardwareSensorDashboard = () => {
  const { areas, sensorData, sensorHistory } = useApp();
  const { t } = useLanguage();
  const [hoverState, setHoverState] = useState({ areaId: AREA_IDS[0], sensorKey: 'arduino' });
  const [graphSelection, setGraphSelection] = useState({ areaId: AREA_IDS[0], sensorKey: 'temperature' });

  const activeAreaId = hoverState.areaId;
  const activeSensorKey = hoverState.sensorKey;
  const activeArea = areas[activeAreaId];
  const activeData = sensorData[activeAreaId] || {};
  const activeSensor = SENSOR_TYPES.find((sensor) => sensor.key === activeSensorKey);

  const renderSensorValue = () => {
    if (!activeSensor) return t('noSensorData');

    if (activeSensor.key === 'arduino') {
      return (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-xs text-slate-500">{t('temperature')}</p>
              <p className="text-xl font-semibold">{activeData.temperature?.toFixed(1) ?? '--'}°C</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-xs text-slate-500">{t('humidity')}</p>
              <p className="text-xl font-semibold">{activeData.humidity?.toFixed(1) ?? '--'}%</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-xs text-slate-500">{t('phLevel')}</p>
              <p className="text-xl font-semibold">{activeData.ph?.toFixed(2) ?? '--'}</p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-4">
              <p className="text-xs text-slate-500">{t('waterUsage')}</p>
              <p className="text-xl font-semibold">{activeData.waterUsage ?? '--'} {t('mlPerMinute')}</p>
            </div>
          </div>
          <p className="text-sm text-slate-600">{t('arduinoSensorSummary')}</p>
        </div>
      );
    }

    const sensorValue = activeData[activeSensor.key];
    const displayValue = sensorValue === undefined || sensorValue === null ? '--' : sensorValue;
    const unit = activeSensor.unit || '';
    const optimalRange = (() => {
      if (!activeArea?.crop) return null;
      switch (activeSensor.key) {
        case 'temperature':
          return `${activeArea.crop.optimalTemp.min}-${activeArea.crop.optimalTemp.max}°C`;
        case 'humidity':
          return `${activeArea.crop.optimalHumidity.min}-${activeArea.crop.optimalHumidity.max}%`;
        case 'ph':
          return `${activeArea.crop.optimalPH.min}-${activeArea.crop.optimalPH.max}`;
        case 'waterUsage':
          return `${activeArea.crop.optimalWaterUsage.min}-${activeArea.crop.optimalWaterUsage.max}ml/day`;
        default:
          return null;
      }
    })();

    return (
      <div className="space-y-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{activeSensor.icon}</span>
            <div>
              <p className="text-sm font-semibold text-slate-500">{activeSensor.labelKey ? t(activeSensor.labelKey) : activeSensor.label}</p>
              <p className="text-2xl font-bold text-slate-900">
                {displayValue}
                <span className="text-base font-medium ml-1">{unit}</span>
              </p>
            </div>
          </div>
          {optimalRange && (
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold mb-1">{t('optimalRange')}</p>
              <p>{optimalRange}</p>
            </div>
          )}
        </div>
        <div className="rounded-3xl bg-slate-50 p-5 text-sm text-slate-600">
          <p>{t(activeSensor.descriptionKey)}</p>
          {activeArea?.crop && (
            <p className="mt-3 text-slate-500">{t('sensorCurrentTray', { trayId: activeAreaId, cropName: activeArea.crop.name })}</p>
          )}
        </div>
      </div>
    );
  };

  const graphSensorKey = graphSelection.sensorKey;
  const graphAreaId = graphSelection.areaId;
  const chartSensor = SENSOR_TYPES.find((sensor) => sensor.key === graphSensorKey);
  const history = sensorHistory[graphAreaId] || [];
  const trendPoints = history
    .map((entry) => ({ value: entry[chartSensor.key], time: entry.timestamp ? new Date(entry.timestamp) : null }))
    .filter((point) => typeof point.value === 'number');

  const chartHasData = trendPoints.length > 0;
  const chartValues = chartHasData ? trendPoints.map((point) => point.value) : [];
  const minValue = chartHasData ? Math.min(...chartValues) : 0;
  const maxValue = chartHasData ? Math.max(...chartValues) : 0;
  const range = maxValue === minValue ? 1 : maxValue - minValue;
  const chartWidth = 560;
  const chartHeight = 220;
  const padding = 28;
  const chartStep = chartValues.length > 1 ? (chartWidth - padding * 2) / (chartValues.length - 1) : 0;
  const chartPath = chartHasData
    ? chartValues
        .map((value, index) => {
          const x = padding + index * chartStep;
          const y = chartHeight - padding - ((value - minValue) / range) * (chartHeight - padding * 2);
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ')
    : '';

  return (
    <div className="mt-8 bg-white rounded-3xl shadow-md p-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('hardwareSensorSection')}</h2>
          <p className="text-sm text-gray-600">{t('hardwareSensorHoverDescription')}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="grid gap-4">
          {AREA_IDS.map((areaId) => {
            const area = areas[areaId];
            const sensorValues = sensorData[areaId] || {};
            return (
              <div key={areaId} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">{t('trayLabel')}</p>
                    <p className="text-xl font-semibold text-slate-900">{t('tray')} {areaId}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {area?.status === 'online' ? t('onlineStatus') : t('offlineStatus')}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 mb-4">
                  <div className="rounded-3xl bg-white p-3 border border-slate-200">
                    <p className="text-xs text-slate-500">{t('temperature')}</p>
                    <p className="text-lg font-semibold text-slate-900">{sensorValues.temperature?.toFixed(1) ?? '--'}°C</p>
                  </div>
                  <div className="rounded-3xl bg-white p-3 border border-slate-200">
                    <p className="text-xs text-slate-500">{t('humidity')}</p>
                    <p className="text-lg font-semibold text-slate-900">{sensorValues.humidity?.toFixed(1) ?? '--'}%</p>
                  </div>
                  <div className="rounded-3xl bg-white p-3 border border-slate-200">
                    <p className="text-xs text-slate-500">{t('phLevel')}</p>
                    <p className="text-lg font-semibold text-slate-900">{sensorValues.ph?.toFixed(2) ?? '--'}</p>
                  </div>
                  <div className="rounded-3xl bg-white p-3 border border-slate-200">
                    <p className="text-xs text-slate-500">{t('waterUsage')}</p>
                    <p className="text-lg font-semibold text-slate-900">{sensorValues.waterUsage ?? '--'} {t('mlPerMinute')}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SENSOR_TYPES.map((sensor) => (
                    <button
                      type="button"
                      key={`${areaId}-${sensor.key}`}
                      onMouseEnter={() => setHoverState({ areaId, sensorKey: sensor.key })}
                      className={`rounded-3xl border px-4 py-3 text-left transition duration-200 ${
                        hoverState.areaId === areaId && hoverState.sensorKey === sensor.key
                          ? 'border-green-500 bg-white shadow-lg'
                          : 'border-slate-200 bg-white/90 hover:border-green-400 hover:bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{sensor.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{t(sensor.labelKey)}</p>
                          <p className="text-xs text-slate-500">
                            {sensor.key === 'arduino'
                              ? t('connectedDevice')
                              : sensorValues[sensor.key] !== undefined
                              ? `${sensorValues[sensor.key]}${sensor.unit}`
                              : t('noData')}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-wider text-slate-500">{t('sensorOverview')}</p>
              <h3 className="text-2xl font-bold text-slate-900">{activeSensor ? t(activeSensor.labelKey) : t('noSensorData')}</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 w-full sm:w-auto">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('selectTrayLabel')}</span>
                <select
                  value={graphSelection.areaId}
                  onChange={(e) => setGraphSelection((prev) => ({ ...prev, areaId: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                >
                  {AREA_IDS.map((areaId) => (
                    <option value={areaId} key={areaId}>{`${t('tray')} ${areaId}`}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('selectSensorLabel')}</span>
                <select
                  value={graphSelection.sensorKey}
                  onChange={(e) => setGraphSelection((prev) => ({ ...prev, sensorKey: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-900"
                >
                  {SENSOR_TYPES.filter((sensor) => ['temperature', 'humidity', 'ph'].includes(sensor.key)).map((sensor) => (
                    <option value={sensor.key} key={sensor.key}>{t(sensor.labelKey)}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          {renderSensorValue()}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500 uppercase tracking-wider">{t('viewSensorGraph')}</p>
                <h4 className="text-xl font-bold text-slate-900">{t('sensorTrendHistory')}</h4>
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm">
              {!chartHasData ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-500">
                  {t('graphNoData')}
                </div>
              ) : (
                <>
                  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500 uppercase tracking-wider">{t('selectedTray')} {graphSelection.areaId}</p>
                      <h3 className="text-lg font-semibold text-slate-900">{t(chartSensor.labelKey)}</h3>
                    </div>
                    <div className="rounded-3xl bg-slate-100 px-4 py-3 text-right">
                      <p className="text-xs uppercase tracking-wider text-slate-500">{t('latestReading')}</p>
                      <p className="text-2xl font-bold text-slate-900">{trendPoints[trendPoints.length - 1].value.toFixed(chartSensor.key === 'ph' ? 2 : 1)}{chartSensor.unit || ''}</p>
                      <p className="text-xs text-slate-500">{trendPoints[trendPoints.length - 1].time?.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full">
                      <defs>
                        <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={chartPath} fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d={`${chartPath} L ${chartWidth - padding} ${chartHeight - padding} L ${padding} ${chartHeight - padding} Z`}
                        fill="url(#trendGradient)"
                        opacity="0.6"
                      />
                      <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="rgba(148, 163, 184, 0.35)" strokeDasharray="4 4" />
                    </svg>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-sm text-slate-600">
                      <div>
                        <p className="font-semibold text-slate-900">{minValue.toFixed(chartSensor.key === 'ph' ? 2 : 1)}{chartSensor.unit || ''}</p>
                        <p>{t('lowest')}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{maxValue.toFixed(chartSensor.key === 'ph' ? 2 : 1)}{chartSensor.unit || ''}</p>
                        <p>{t('highest')}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{trendPoints.length}</p>
                        <p>{t('dataPoints')}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareSensorDashboard;
