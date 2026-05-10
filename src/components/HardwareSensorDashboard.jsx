import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRAY_IDS } from '../utils/constants';
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
  const { trays, sensorData } = useApp();
  const { t } = useLanguage();
  const [hoverState, setHoverState] = useState({ trayId: TRAY_IDS[0], sensorKey: 'arduino' });

  const activeTrayId = hoverState.trayId;
  const activeSensorKey = hoverState.sensorKey;
  const activeTray = trays[activeTrayId];
  const activeData = sensorData[activeTrayId] || {};
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
          <p className="text-sm text-slate-600">
            {t('arduinoSensorSummary')}
          </p>
        </div>
      );
    }

    const sensorValue = activeData[activeSensor.key];
    const displayValue = sensorValue === undefined || sensorValue === null ? '--' : sensorValue;
    const unit = activeSensor.unit || '';
    const optimalRange = (() => {
      if (!activeTray?.crop) return null;
      switch (activeSensor.key) {
        case 'temperature':
          return `${activeTray.crop.optimalTemp.min}-${activeTray.crop.optimalTemp.max}°C`;
        case 'humidity':
          return `${activeTray.crop.optimalHumidity.min}-${activeTray.crop.optimalHumidity.max}%`;
        case 'ph':
          return `${activeTray.crop.optimalPH.min}-${activeTray.crop.optimalPH.max}`;
        case 'waterUsage':
          return `${activeTray.crop.optimalWaterUsage.min}-${activeTray.crop.optimalWaterUsage.max}ml/day`;
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
          {activeTray?.crop && (
            <p className="mt-3 text-slate-500">{t('sensorCurrentTray', { trayId: activeTrayId, cropName: activeTray.crop.name })}</p>
          )}
        </div>
      </div>
    );
  };

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
          {TRAY_IDS.map((trayId) => {
            const tray = trays[trayId];
            const sensorValues = sensorData[trayId] || {};
            return (
              <div key={trayId} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">{t('trayLabel')}</p>
                    <p className="text-xl font-semibold text-slate-900">{t('tray')} {trayId}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    {tray?.status === 'online' ? t('onlineStatus') : t('offlineStatus')}
                  </span>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {SENSOR_TYPES.map((sensor) => (
                    <button
                      type="button"
                      key={`${trayId}-${sensor.key}`}
                      onMouseEnter={() => setHoverState({ trayId, sensorKey: sensor.key })}
                      className={`rounded-3xl border px-4 py-3 text-left transition duration-200 ${
                        hoverState.trayId === trayId && hoverState.sensorKey === sensor.key
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
          <div className="mb-6 flex items-center gap-3">
            <span className="text-3xl">{activeSensor?.icon}</span>
            <div>
              <p className="text-sm uppercase tracking-wider text-slate-500">{t('sensorOverview')}</p>
              <h3 className="text-xl font-bold text-slate-900">{activeSensor ? t(activeSensor.labelKey) : t('noSensorData')}</h3>
            </div>
          </div>
          {renderSensorValue()}
        </div>
      </div>
    </div>
  );
};

export default HardwareSensorDashboard;
