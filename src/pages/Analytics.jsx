import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SensorChart from '../components/SensorChart';
import SensorReading from '../components/SensorReading';
import { TRAY_IDS } from '../utils/constants';

const Analytics = () => {
  const { trays, sensorData, aiScores } = useApp();
  const [selectedTray, setSelectedTray] = useState('A');
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState(24); // hours

  // Generate mock historical data
  useEffect(() => {
    const data = [];
    const now = Date.now();
    const interval = (timeRange * 3600000) / 24; // Divide time range into 24 points

    for (let i = 0; i < 24; i++) {
      const time = new Date(now - (24 - i) * interval);
      const hour = time.getHours();
      const minute = time.getMinutes();

      // Simulate realistic variations
      const tempBase = 20 + Math.sin(i / 24 * Math.PI * 2) * 5;
      const humidityBase = 70 + Math.sin((i + 6) / 24 * Math.PI * 2) * 15;
      const phBase = 6.5 + Math.sin((i + 12) / 24 * Math.PI * 2) * 0.2;

      data.push({
        time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`,
        temperature: Math.round((tempBase + (Math.random() - 0.5) * 2) * 10) / 10,
        humidity: Math.round((humidityBase + (Math.random() - 0.5) * 3) * 10) / 10,
        ph: Math.round((phBase + (Math.random() - 0.5) * 0.1) * 100) / 100,
        waterUsage: Math.round(140 + (Math.random() - 0.5) * 40),
      });
    }
    setChartData(data);
  }, [selectedTray, timeRange]);

  const currentSensorData = sensorData[selectedTray];
  const tray = trays[selectedTray];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Analytics & Trends</h1>
        <p className="text-gray-600">Monitor sensor trends and historical data</p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Select Tray</label>
            <select
              value={selectedTray}
              onChange={(e) => setSelectedTray(e.target.value)}
              className="w-full border rounded px-4 py-2"
            >
              {TRAY_IDS.map((tray) => (
                <option key={tray} value={tray}>
                  Tray {tray}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(parseInt(e.target.value))}
              className="w-full border rounded px-4 py-2"
            >
              <option value={1}>Last 1 Hour</option>
              <option value={6}>Last 6 Hours</option>
              <option value={12}>Last 12 Hours</option>
              <option value={24}>Last 24 Hours</option>
              <option value={168}>Last 7 Days</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tray Info */}
      {tray && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-green-100 text-sm">Crop</p>
              <p className="text-2xl font-bold">{tray.crop?.name} {tray.crop?.icon}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">AI Score</p>
              <p className="text-2xl font-bold">{aiScores[selectedTray] || 0}/100</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Status</p>
              <p className="text-2xl font-bold">🟢 {tray.status}</p>
            </div>
            <div>
              <p className="text-green-100 text-sm">Last Updated</p>
              <p className="text-lg font-bold">
                {currentSensorData?.timestamp
                  ? new Date(currentSensorData.timestamp).toLocaleTimeString()
                  : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Current Readings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Readings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SensorReading
            label="Temperature"
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
            label="Humidity"
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
            label="pH Level"
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
            label="Water Usage"
            value={currentSensorData?.waterUsage?.toFixed(0) || '--'}
            unit="ml/min"
            icon="💦"
            status="info"
          />
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        <SensorChart
          data={chartData}
          dataKey="temperature"
          stroke="#ff7300"
          title={`Temperature Trend (${timeRange}h)`}
        />
        <SensorChart
          data={chartData}
          dataKey="humidity"
          stroke="#8884d8"
          title={`Humidity Trend (${timeRange}h)`}
        />
        <SensorChart
          data={chartData}
          dataKey="ph"
          stroke="#82ca9d"
          title={`pH Level Trend (${timeRange}h)`}
        />
        <SensorChart
          data={chartData}
          dataKey="waterUsage"
          stroke="#ffc658"
          title={`Water Usage Trend (${timeRange}h)`}
        />
      </div>

      {/* Optimal Parameters */}
      {tray?.crop && (
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4">Optimal Parameters for {tray.crop.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-600 text-sm">Temperature</p>
              <p className="text-lg font-bold">{tray.crop.optimalTemp.min}-{tray.crop.optimalTemp.max}°C</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <p className="text-gray-600 text-sm">Humidity</p>
              <p className="text-lg font-bold">{tray.crop.optimalHumidity.min}-{tray.crop.optimalHumidity.max}%</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <p className="text-gray-600 text-sm">pH Level</p>
              <p className="text-lg font-bold">{tray.crop.optimalPH.min}-{tray.crop.optimalPH.max}</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <p className="text-gray-600 text-sm">Water Usage</p>
              <p className="text-lg font-bold">{tray.crop.optimalWaterUsage.min}-{tray.crop.optimalWaterUsage.max}ml/day</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="text-gray-600 text-sm">Light Hours</p>
              <p className="text-lg font-bold">{tray.crop.optimalLight.min}-{tray.crop.optimalLight.max}h/day</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
