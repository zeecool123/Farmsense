// Crop profiles with optimal parameters
export const CROP_PROFILES = {
  strawberry: {
    name: 'Strawberry',
    icon: '🍓',
    optimalTemp: { min: 15, max: 25 },
    optimalHumidity: { min: 60, max: 80 },
    optimalPH: { min: 5.8, max: 6.8 },
    optimalWaterUsage: { min: 100, max: 200 }, // ml per day
    optimalLight: { min: 12, max: 14 }, // hours
  },
  lettuce: {
    name: 'Lettuce',
    icon: '🥬',
    optimalTemp: { min: 15, max: 22 },
    optimalHumidity: { min: 70, max: 85 },
    optimalPH: { min: 6.0, max: 7.0 },
    optimalWaterUsage: { min: 150, max: 250 },
    optimalLight: { min: 12, max: 16 },
  },
  tomato: {
    name: 'Tomato',
    icon: '🍅',
    optimalTemp: { min: 20, max: 28 },
    optimalHumidity: { min: 60, max: 75 },
    optimalPH: { min: 6.0, max: 6.8 },
    optimalWaterUsage: { min: 200, max: 300 },
    optimalLight: { min: 14, max: 16 },
  },
  basil: {
    name: 'Basil',
    icon: '🌿',
    optimalTemp: { min: 18, max: 25 },
    optimalHumidity: { min: 50, max: 70 },
    optimalPH: { min: 6.0, max: 7.0 },
    optimalWaterUsage: { min: 80, max: 150 },
    optimalLight: { min: 12, max: 14 },
  },
};

// Tray identifiers
export const TRAY_IDS = ['A', 'B', 'C', 'D', 'E', 'F'];

// AI Scoring thresholds
export const AI_SCORE_THRESHOLDS = {
  perfect: 95,
  excellent: 80,
  good: 60,
  fair: 40,
  poor: 0,
};

// Sensor data types
export const SENSOR_TYPES = {
  temperature: 'temperature',
  humidity: 'humidity',
  ph: 'ph',
  waterUsage: 'waterUsage',
  lightIntensity: 'lightIntensity',
};

// System controls
export const CONTROLS = {
  led: 'led',
  ac: 'ac',
  irrigation: 'irrigation',
};

// Alert severity levels
export const ALERT_SEVERITY = {
  critical: 'critical',
  warning: 'warning',
  info: 'info',
};
