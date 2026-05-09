import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRAY_IDS, CROP_PROFILES } from '../utils/constants';
import TrayCard from '../components/TrayCard';
import SensorReading from '../components/SensorReading';

const TrayManagement = () => {
  const { trays, updateTray, sensorData, aiScores, triggerControl } = useApp();
  const [editingTray, setEditingTray] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState('');

  const handleAssignCrop = (trayId, cropKey) => {
    const crop = CROP_PROFILES[cropKey];
    updateTray(trayId, { crop, cropKey });
    setEditingTray(null);
    setSelectedCrop('');
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">Tray Management</h1>
      <p className="text-gray-600 mb-8">Assign crops to trays and monitor parameters</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tray Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Your Trays</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {TRAY_IDS.map((trayId) => (
              <div key={trayId}>
                <TrayCard
                  trayId={trayId}
                  crop={trays[trayId]?.crop}
                  aiScore={aiScores[trayId] || 0}
                  status={trays[trayId]?.status || 'offline'}
                  onClick={() => setEditingTray(editingTray === trayId ? null : trayId)}
                />
                {editingTray === trayId && (
                  <div className="mt-2 bg-white rounded-lg shadow-md p-4 border border-green-200">
                    <h3 className="font-bold mb-3">Assign Crop to Tray {trayId}</h3>
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full border rounded px-3 py-2 mb-3"
                    >
                      <option value="">Select a crop...</option>
                      {Object.entries(CROP_PROFILES).map(([key, profile]) => (
                        <option key={key} value={key}>
                          {profile.icon} {profile.name}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        onClick={() => selectedCrop && handleAssignCrop(trayId, selectedCrop)}
                        disabled={!selectedCrop}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:bg-gray-300"
                      >
                        Assign
                      </button>
                      <button
                        onClick={() => {
                          setEditingTray(null);
                          setSelectedCrop('');
                        }}
                        className="flex-1 bg-gray-300 px-3 py-2 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Live Sensor Preview */}
                {trays[trayId]?.crop && sensorData[trayId] && (
                  <div className="mt-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-3 text-sm">
                    <p className="font-semibold mb-2">Live Readings:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-600">Temp:</span> <span className="font-bold">{sensorData[trayId].temperature?.toFixed(1)}°C</span>
                      </div>
                      <div>
                        <span className="text-gray-600">pH:</span> <span className="font-bold">{sensorData[trayId].ph?.toFixed(2)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Humidity:</span> <span className="font-bold">{sensorData[trayId].humidity?.toFixed(1)}%</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Score:</span> <span className="font-bold text-blue-600">{aiScores[trayId]}/100</span>
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
          <h2 className="text-2xl font-bold mb-4">Crop Profiles</h2>
          <div className="space-y-4">
            {Object.entries(CROP_PROFILES).map(([key, crop]) => (
              <div key={key} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-green-500 hover:shadow-lg transition">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{crop.icon}</span>
                  <h3 className="text-lg font-bold">{crop.name}</h3>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">🌡️ Temperature:</span>
                    <span className="font-semibold">{crop.optimalTemp.min}-{crop.optimalTemp.max}°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">💧 Humidity:</span>
                    <span className="font-semibold">{crop.optimalHumidity.min}-{crop.optimalHumidity.max}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">⚗️ pH:</span>
                    <span className="font-semibold">{crop.optimalPH.min}-{crop.optimalPH.max}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">💦 Water:</span>
                    <span className="font-semibold">{crop.optimalWaterUsage.min}-{crop.optimalWaterUsage.max}ml/day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">💡 Light:</span>
                    <span className="font-semibold">{crop.optimalLight.min}-{crop.optimalLight.max}h/day</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingTray(
                      TRAY_IDS.find(id => !trays[id]?.crop || trays[id]?.crop?.name === key)
                    );
                    setSelectedCrop(key);
                  }}
                  className="w-full mt-3 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700"
                >
                  Assign to Tray
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Center */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">System Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TRAY_IDS.map((trayId) => (
            trays[trayId]?.crop && (
              <div key={trayId} className="border rounded-lg p-4">
                <h3 className="font-bold mb-3">Tray {trayId}</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => triggerControl(trayId, 'LED', 'on')}
                    className="w-full bg-yellow-500 text-white px-3 py-2 rounded text-sm hover:bg-yellow-600"
                  >
                    💡 Turn ON LED
                  </button>
                  <button
                    onClick={() => triggerControl(trayId, 'AC', 'on')}
                    className="w-full bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600"
                  >
                    ❄️ Turn ON AC
                  </button>
                  <button
                    onClick={() => triggerControl(trayId, 'Irrigation', 'on')}
                    className="w-full bg-cyan-500 text-white px-3 py-2 rounded text-sm hover:bg-cyan-600"
                  >
                    💧 Start Irrigation
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

export default TrayManagement;
