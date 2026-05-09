import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import TrayCard from '../components/TrayCard';
import AlertBox from '../components/AlertBox';
import SensorReading from '../components/SensorReading';
import { TRAY_IDS } from '../utils/constants';

const Dashboard = () => {
  const { trays, alerts, clearAlert, sensorData, aiScores, simulateAnomaly, resetAnomaly } = useApp();
  const [selectedTray, setSelectedTray] = useState(null);

  const selectedTrayData = selectedTray ? trays[selectedTray] : null;
  const selectedSensorData = selectedTray ? sensorData[selectedTray] : null;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Real-time monitoring of all trays and system health</p>
      </div>

      {/* Alerts Section */}
      {alerts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Recent Alerts ({alerts.length})</h2>
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

      {/* Trays Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Tray Status</h2>
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
            <h2 className="text-2xl font-bold">Tray {selectedTray} Details</h2>
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
              <p className="text-gray-600 text-sm">Crop</p>
              <p className="text-lg font-bold flex items-center gap-2">
                {selectedTrayData.crop?.icon} {selectedTrayData.crop?.name}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <p className="text-lg font-bold text-green-600">
                🟢 {selectedTrayData.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">AI Score</p>
              <p className="text-lg font-bold text-blue-600">{aiScores[selectedTray] || 0}/100</p>
            </div>
          </div>

          {/* Real-time Sensor Data */}
          {selectedSensorData ? (
            <div>
              <h3 className="text-xl font-bold mb-4">Live Sensor Readings</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SensorReading
                  label="Temperature"
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
                  label="Humidity"
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
                  label="pH Level"
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
                  label="Water Usage"
                  value={selectedSensorData.waterUsage?.toFixed(0)}
                  unit="ml"
                  icon="💦"
                  status="info"
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Waiting for sensor data...</p>
          )}

          {/* Test Controls */}
          <div className="border-t pt-4">
            <h3 className="text-lg font-bold mb-3">Test Controls</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => simulateAnomaly(selectedTray, 'temperature')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm"
              >
                Simulate Temp Anomaly
              </button>
              <button
                onClick={() => simulateAnomaly(selectedTray, 'humidity')}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
              >
                Simulate Humidity Anomaly
              </button>
              <button
                onClick={() => resetAnomaly(selectedTray)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 text-sm"
              >
                Reset to Normal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
