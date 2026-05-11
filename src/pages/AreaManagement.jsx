import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AREA_IDS, CROP_PROFILES } from '../utils/constants';
import { useLanguage } from '../context/LanguageContext';
import AreaCard from '../components/AreaCard';
import SensorReading from '../components/SensorReading';

const AreaManagement = () => {
  const { areas, updateArea, sensorData, aiScores, triggerControl } = useApp();
  const { t } = useLanguage();
  const [editingArea, setEditingArea] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');

  const handleAssignCrop = (areaId, cropKey) => {
    const crop = CROP_PROFILES[cropKey];
    updateArea(areaId, { crop, cropKey });
    setEditingArea(null);
    setSelectedCrop('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold text-black mb-2">{t('areaManagement')}</h1>
      <p className="text-gray-600 mb-8">{t('assignCropsDescription')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Area Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('yourAreas')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {AREA_IDS.map((areaId) => (
              <div key={areaId}>
                <AreaCard
                  areaId={areaId}
                  crop={areas[areaId]?.crop}
                  aiScore={aiScores[areaId] || 0}
                  status={areas[areaId]?.status || 'offline'}
                  onClick={() => setEditingArea(editingArea === areaId ? null : areaId)}
                />
                {editingArea === areaId && (
                  <div className="mt-2 bg-white rounded-lg shadow-md p-4 border border-green-200">
                    <h3 className="font-bold mb-3">{t('assignCropToArea', { areaId })}</h3>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full border rounded px-3 py-2 mb-3 bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
                    >
                      <option value="">{t('selectCropPlaceholder')}</option>
                      {Object.entries(CROP_PROFILES).map(([key, profile]) => (
                        <option key={key} value={key}>
                          {profile.icon} {profile.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => selectedCrop && handleAssignCrop(areaId, selectedCrop)}
                        disabled={!selectedCrop}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
                      >
                        {t('assign')}
                      </button>
                      <button
                        onClick={() => {
                          setEditingArea(null);
                          setSelectedCrop('');
                        }}
                        className="flex-1 bg-gray-300 px-3 py-2 rounded hover:bg-gray-400"
                      >
                        {t('cancel')}
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Sensor Preview */}
                {areas[areaId]?.crop && sensorData[areaId] && (
                  <div className="mt-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 text-sm">
                    <p className="font-semibold mb-2">{t('liveSensorReadings')}</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600">{t('temperature')}:</span> <span className="font-bold">{sensorData[areaId].temperature?.toFixed(1)}°C</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('phLevel')}:</span> <span className="font-bold">{sensorData[areaId].ph?.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('humidity')}:</span> <span className="font-bold">{sensorData[areaId].humidity?.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">{t('score')}:</span> <span className="font-bold text-blue-600">{aiScores[areaId]}/100</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Crop Profiles Sidebar */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('cropProfiles')}</h2>
          <div className="space-y-4">
            {Object.entries(CROP_PROFILES).map(([key, crop]) => (
              <div key={key} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition dark:border-green-600">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{crop.icon}</span>
                  <h3 className="text-lg font-bold text-black dark:text-white">{crop.name}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">🌡️ {t('temperature')}:</span>
                    <span className="font-semibold text-black dark:text-white">{crop.optimalTemp.min}-{crop.optimalTemp.max}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">💧 {t('humidity')}:</span>
                    <span className="font-semibold text-black dark:text-white">{crop.optimalHumidity.min}-{crop.optimalHumidity.max}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">⚗️ {t('phLevel')}:</span>
                    <span className="font-semibold text-black dark:text-white">{crop.optimalPH.min}-{crop.optimalPH.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">💦 {t('waterUsage')}:</span>
                    <span className="font-semibold text-black dark:text-white">{crop.optimalWaterUsage.min}-{crop.optimalWaterUsage.max}ml/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">💡 {t('lightHours')}:</span>
                    <span className="font-semibold text-black dark:text-white">{crop.optimalLight.min}-{crop.optimalLight.max}h/day</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingArea(
                      AREA_IDS.find(id => !areas[id]?.crop || areas[id]?.crop?.name === key)
                    );
                    setSelectedCrop(key);
                  }}
                  className="w-full mt-3 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  {t('assignToArea')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Center */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t('systemControlsLabel')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {AREA_IDS.map((areaId) => (
            areas[areaId]?.crop && (
              <div key={areaId} className="border rounded-lg p-4">
                <h3 className="font-bold mb-3">{t('tray')} {areaId}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => triggerControl(areaId, 'LED', 'on')}
                    className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600"
                  >
                    💡 {t('turnOnLED')}
                  </button>
                  <button
                    onClick={() => triggerControl(areaId, 'AC', 'on')}
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                  >
                    ❄️ {t('turnOnAC')}
                  </button>
                  <button
                    onClick={() => triggerControl(areaId, 'Irrigation', 'on')}
                    className="w-full bg-cyan-500 text-white px-3 py-2 rounded text-sm hover:bg-cyan-600"
                  >
                    💧 {t('startIrrigation')}
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default AreaManagement;
