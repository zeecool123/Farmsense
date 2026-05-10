
// Crop profiles with optimal parameters based on recommendation data
export const CROP_PROFILES = {
  blackgram: {
    name: 'Blackgram',
    icon: '🌱',
    optimalTemp: { min: 25, max: 35 },
    optimalHumidity: { min: 60, max: 80 },
    optimalPH: { min: 6.5, max: 7.5 },
    optimalWaterUsage: { min: 40, max: 60 }, // ml per day, based on rainfall
    optimalLight: { min: 10, max: 12 }, // hours
  },
  chickpea: {
    name: 'Chickpea',
    icon: '🌰',
    optimalTemp: { min: 17, max: 21 },
    optimalHumidity: { min: 14, max: 20 },
    optimalPH: { min: 6.0, max: 8.0 },
    optimalWaterUsage: { min: 65, max: 95 },
    optimalLight: { min: 12, max: 14 },
  },
  grapes: {
    name: 'Grapes',
    icon: '🍇',
    optimalTemp: { min: 20, max: 30 },
    optimalHumidity: { min: 70, max: 90 },
    optimalPH: { min: 6.0, max: 7.0 },
    optimalWaterUsage: { min: 60, max: 80 },
    optimalLight: { min: 14, max: 16 },
  },
  kidneybeans: {
    name: 'Kidney Beans',
    icon: '🫘',
    optimalTemp: { min: 16, max: 23 },
    optimalHumidity: { min: 18, max: 24 },
    optimalPH: { min: 5.5, max: 6.5 },
    optimalWaterUsage: { min: 60, max: 145 },
    optimalLight: { min: 12, max: 14 },
  },
  lentil: {
    name: 'Lentil',
    icon: '🫘',
    optimalTemp: { min: 18, max: 25 },
    optimalHumidity: { min: 60, max: 75 },
    optimalPH: { min: 6.0, max: 7.5 },
    optimalWaterUsage: { min: 35, max: 50 },
    optimalLight: { min: 10, max: 12 },
  },
  mothbeans: {
    name: 'Moth Beans',
    icon: '🌱',
    optimalTemp: { min: 25, max: 32 },
    optimalHumidity: { min: 60, max: 75 },
    optimalPH: { min: 6.0, max: 7.5 },
    optimalWaterUsage: { min: 30, max: 45 },
    optimalLight: { min: 10, max: 12 },
  },
  mungbean: {
    name: 'Mung Bean',
    icon: '🌱',
    optimalTemp: { min: 25, max: 32 },
    optimalHumidity: { min: 60, max: 75 },
    optimalPH: { min: 6.0, max: 7.5 },
    optimalWaterUsage: { min: 35, max: 50 },
    optimalLight: { min: 10, max: 12 },
  },
  muskmelon: {
    name: 'Muskmelon',
    icon: '🍈',
    optimalTemp: { min: 25, max: 32 },
    optimalHumidity: { min: 80, max: 95 },
    optimalPH: { min: 6.0, max: 7.0 },
    optimalWaterUsage: { min: 20, max: 30 },
    optimalLight: { min: 12, max: 14 },
  },
  pigeonpeas: {
    name: 'Pigeon Peas',
    icon: '🌰',
    optimalTemp: { min: 20, max: 28 },
    optimalHumidity: { min: 60, max: 75 },
    optimalPH: { min: 6.0, max: 7.5 },
    optimalWaterUsage: { min: 80, max: 120 },
    optimalLight: { min: 12, max: 14 },
  },
  watermelon: {
    name: 'Watermelon',
    icon: '🍉',
    optimalTemp: { min: 25, max: 32 },
    optimalHumidity: { min: 75, max: 90 },
    optimalPH: { min: 6.0, max: 7.0 },
    optimalWaterUsage: { min: 40, max: 60 },
    optimalLight: { min: 12, max: 14 },
  },
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

// Area identifiers
export const AREA_IDS = ['A', 'B', 'C', 'D', 'E', 'F'];

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
