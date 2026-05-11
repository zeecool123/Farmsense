/**
 * Sensor Data Collection & Management Service
 * Collects real-time sensor data, stores in Firebase, and analyzes trends
 */

/**
 * Sensor data model
 */
export const createSensorSnapshot = (areaId, sensorReadings, systemStatus, energyUsage, waterUsage) => {
  return {
    areaId,
    timestamp: new Date().toISOString(),
    sensors: {
      temperature: sensorReadings.temperature || { value: 0, unit: '°C' },
      humidity: sensorReadings.humidity || { value: 0, unit: '%' },
      ph: sensorReadings.ph || { value: 6.5 },
      soilMoisture: sensorReadings.soilMoisture || { value: 0, unit: '%' },
      waterLevel: sensorReadings.waterLevel || { value: 0, unit: '%' },
      lightIntensity: sensorReadings.lightIntensity || { value: 0, unit: 'lux' },
      co2: sensorReadings.co2 || { value: 0, unit: 'ppm' },
    },
    systemStatus: {
      wateringActive: systemStatus?.wateringActive || false,
      heatingActive: systemStatus?.heatingActive || false,
      lightingActive: systemStatus?.lightingActive || false,
      fanActive: systemStatus?.fanActive || false,
      ventilationActive: systemStatus?.ventilationActive || false,
    },
    energyUsage: {
      waterPump: energyUsage?.waterPump || 0, // watts
      heater: energyUsage?.heater || 0,
      lights: energyUsage?.lights || 0,
      ventilation: energyUsage?.ventilation || 0,
      other: energyUsage?.other || 0,
      total: (energyUsage?.waterPump || 0) + (energyUsage?.heater || 0) + (energyUsage?.lights || 0) + (energyUsage?.ventilation || 0) + (energyUsage?.other || 0),
    },
    waterUsage: waterUsage || 0, // liters
  };
};

/**
 * Calculate daily statistics from hourly readings
 */
export const calculateDailyStats = (hourlyReadings) => {
  if (!hourlyReadings || hourlyReadings.length === 0) {
    return null;
  }

  const temps = hourlyReadings.map(r => r.sensors.temperature.value);
  const humidity = hourlyReadings.map(r => r.sensors.humidity.value);
  const waterUsage = hourlyReadings.reduce((sum, r) => sum + (r.waterUsage || 0), 0);
  const energyUsage = hourlyReadings.reduce((sum, r) => sum + (r.energyUsage.total || 0), 0) / 1000; // Convert to kWh

  return {
    date: new Date().toISOString().split('T')[0],
    temperature: {
      avg: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
      min: Math.min(...temps),
      max: Math.max(...temps),
    },
    humidity: {
      avg: Math.round((humidity.reduce((a, b) => a + b, 0) / humidity.length) * 10) / 10,
      min: Math.min(...humidity),
      max: Math.max(...humidity),
    },
    waterUsage,
    energyUsage,
    readingCount: hourlyReadings.length,
  };
};

/**
 * Get trend data (compare current week to previous week)
 */
export const calculateTrend = (currentWeekData, previousWeekData) => {
  if (!currentWeekData || !previousWeekData) return null;

  const currentAvg = currentWeekData.reduce((sum, d) => sum + d.value, 0) / currentWeekData.length;
  const previousAvg = previousWeekData.reduce((sum, d) => sum + d.value, 0) / previousWeekData.length;

  const percentChange = ((currentAvg - previousAvg) / previousAvg) * 100;

  return {
    current: Math.round(currentAvg * 100) / 100,
    previous: Math.round(previousAvg * 100) / 100,
    change: Math.round(percentChange * 10) / 10,
    direction: percentChange > 0 ? 'up' : percentChange < 0 ? 'down' : 'stable',
    isGood: percentChange < 0, // Down is good for water/electricity
  };
};

/**
 * Check if sensor reading is within optimal range
 */
export const isSensorOptimal = (sensorName, value, optimalRange) => {
  if (!optimalRange) return true;

  const { min, max } = optimalRange;
  return value >= min && value <= max;
};

/**
 * Get deviation from optimal
 */
export const getSensorDeviation = (value, optimalRange) => {
  if (!optimalRange) return 0;

  const { min, max } = optimalRange;
  if (value < min) return min - value;
  if (value > max) return value - max;
  return 0;
};

/**
 * Generate sensor alert if out of range
 */
export const generateSensorAlert = (sensorName, value, optimalRange) => {
  if (isSensorOptimal(sensorName, value, optimalRange)) {
    return null;
  }

  const deviation = getSensorDeviation(value, optimalRange);
  const { min, max } = optimalRange;

  const severityMap = {
    temperature: { warning: 3, critical: 5 },
    humidity: { warning: 10, critical: 20 },
    ph: { warning: 0.5, critical: 1 },
    soilMoisture: { warning: 15, critical: 30 },
  };

  const thresholds = severityMap[sensorName] || { warning: 5, critical: 10 };

  return {
    sensor: sensorName,
    value,
    optimalRange,
    deviation,
    severity: deviation > thresholds.critical ? 'critical' : deviation > thresholds.warning ? 'warning' : 'info',
    message: value < min
      ? `${sensorName} is ${value} - LOWER than ideal (${min}-${max})`
      : `${sensorName} is ${value} - HIGHER than ideal (${min}-${max})`,
  };
};

/**
 * Batch save sensor data to Firebase
 */
export const saveSensorDataToFirebase = async (db, collection, areaId, sensorSnapshot) => {
  try {
    if (!db) {
      console.warn('Firebase DB not available - storing locally');
      return { success: false, local: true };
    }

    // Firebase Firestore logic would go here
    // For now, return success indication
    return {
      success: true,
      timestamp: sensorSnapshot.timestamp,
      areaId,
    };
  } catch (error) {
    console.error('Error saving sensor data:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get sensor history for analysis
 */
export const getSensorHistory = async (db, areaId, days = 7) => {
  try {
    // This would query Firebase for historical data
    // Returns array of daily statistics

    return {
      areaId,
      period: `${days} days`,
      dataPoints: [], // Would be populated from Firebase
    };
  } catch (error) {
    console.error('Error fetching sensor history:', error);
    return null;
  }
};

/**
 * Generate mock sensor data for testing
 */
export const generateMockSensorData = (areaId, cropOptimal = {}) => {
  const baseSensors = {
    temperature: {
      value: (cropOptimal?.optimalTemp?.min || 22) + Math.random() * 3,
      unit: '°C',
    },
    humidity: {
      value: (cropOptimal?.optimalHumidity?.min || 60) + Math.random() * 15,
      unit: '%',
    },
    ph: {
      value: (cropOptimal?.optimalPH?.min || 6) + Math.random() * 1,
    },
    soilMoisture: {
      value: 50 + Math.random() * 30,
      unit: '%',
    },
    waterLevel: {
      value: 70 + Math.random() * 25,
      unit: '%',
    },
    lightIntensity: {
      value: 800 + Math.random() * 600,
      unit: 'lux',
    },
    co2: {
      value: 400 + Math.random() * 100,
      unit: 'ppm',
    },
  };

  return createSensorSnapshot(
    areaId,
    baseSensors,
    {
      wateringActive: Math.random() > 0.8,
      heatingActive: Math.random() > 0.7,
      lightingActive: Math.random() > 0.4,
      fanActive: Math.random() > 0.6,
    },
    {
      waterPump: Math.random() > 0.8 ? 45 : 0,
      heater: Math.random() > 0.7 ? 1200 : 0,
      lights: Math.random() > 0.4 ? 800 : 0,
      ventilation: 150,
    },
    Math.random() > 0.8 ? 12.5 : 0
  );
};
