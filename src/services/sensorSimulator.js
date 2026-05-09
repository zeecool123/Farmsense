import { CROP_PROFILES } from '../utils/constants';

/**
 * Generates realistic sensor data based on crop profile
 * Simulates real IoT sensor readings with slight variations
 */
export const generateSensorData = (cropKey, baseSensorData = null) => {
  const crop = CROP_PROFILES[cropKey];
  
  if (!crop) {
    return {
      temperature: 20 + Math.random() * 10,
      humidity: 60 + Math.random() * 30,
      ph: 6.5 + (Math.random() - 0.5) * 0.3,
      waterUsage: 150 + Math.random() * 50,
      lightIntensity: 5000 + Math.random() * 3000,
    };
  }

  // Generate data slightly varied around optimal values
  const tempMid = (crop.optimalTemp.min + crop.optimalTemp.max) / 2;
  const tempVariance = (crop.optimalTemp.max - crop.optimalTemp.min) / 4;
  
  const humidityMid = (crop.optimalHumidity.min + crop.optimalHumidity.max) / 2;
  const humidityVariance = (crop.optimalHumidity.max - crop.optimalHumidity.min) / 4;
  
  const phMid = (crop.optimalPH.min + crop.optimalPH.max) / 2;
  const phVariance = (crop.optimalPH.max - crop.optimalPH.min) / 4;
  
  const waterMid = (crop.optimalWaterUsage.min + crop.optimalWaterUsage.max) / 2;
  const waterVariance = (crop.optimalWaterUsage.max - crop.optimalWaterUsage.min) / 4;

  // Add slight variation to base data if provided
  const tempNoise = baseSensorData?.temperature ? Math.sin(Date.now() / 1000) * 2 : 0;
  const humidityNoise = baseSensorData?.humidity ? Math.cos(Date.now() / 1000) * 3 : 0;

  return {
    temperature: Math.round((tempMid + (Math.random() - 0.5) * tempVariance + tempNoise) * 10) / 10,
    humidity: Math.round((humidityMid + (Math.random() - 0.5) * humidityVariance + humidityNoise) * 10) / 10,
    ph: Math.round((phMid + (Math.random() - 0.5) * phVariance) * 100) / 100,
    waterUsage: Math.round(waterMid + (Math.random() - 0.5) * waterVariance),
    lightIntensity: Math.round(4000 + Math.random() * 2000),
  };
};

/**
 * Simulates IoT device sensor streaming
 * Useful for development without real devices
 */
export class SensorSimulator {
  constructor(trayId, cropKey, interval = 5000) {
    this.trayId = trayId;
    this.cropKey = cropKey;
    this.interval = interval;
    this.isRunning = false;
    this.subscribers = [];
    this.currentData = null;
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    if (this.currentData) {
      callback(this.currentData);
    }
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    
    this.currentData = generateSensorData(this.cropKey);
    this.notifySubscribers();

    this.intervalId = setInterval(() => {
      this.currentData = generateSensorData(this.cropKey, this.currentData);
      this.notifySubscribers();
    }, this.interval);
  }

  stop() {
    if (!this.isRunning) return;
    this.isRunning = false;
    clearInterval(this.intervalId);
  }

  notifySubscribers() {
    this.subscribers.forEach(callback => {
      try {
        callback(this.currentData);
      } catch (error) {
        console.error('Error in sensor subscriber:', error);
      }
    });
  }

  getCurrentData() {
    return this.currentData;
  }

  // Simulate anomaly for testing alerts
  simulateAnomaly(type = 'temperature', severity = 'high') {
    const crop = CROP_PROFILES[this.cropKey];
    if (!crop) return;

    switch (type) {
      case 'temperature':
        this.currentData.temperature = severity === 'high' 
          ? crop.optimalTemp.max + 5 
          : crop.optimalTemp.min - 5;
        break;
      case 'humidity':
        this.currentData.humidity = severity === 'high'
          ? crop.optimalHumidity.max + 10
          : crop.optimalHumidity.min - 10;
        break;
      case 'ph':
        this.currentData.ph = severity === 'high'
          ? crop.optimalPH.max + 0.3
          : crop.optimalPH.min - 0.3;
        break;
      default:
        break;
    }
    this.notifySubscribers();
  }

  // Reset to normal operation
  resetAnomaly() {
    this.currentData = generateSensorData(this.cropKey);
    this.notifySubscribers();
  }
}

/**
 * Global sensor simulator registry
 */
export const SensorSimulatorRegistry = (() => {
  const simulators = {};

  return {
    create(trayId, cropKey, interval) {
      if (!simulators[trayId]) {
        simulators[trayId] = new SensorSimulator(trayId, cropKey, interval);
      }
      return simulators[trayId];
    },

    get(trayId) {
      return simulators[trayId];
    },

    start(trayId) {
      if (simulators[trayId]) {
        simulators[trayId].start();
      }
    },

    stop(trayId) {
      if (simulators[trayId]) {
        simulators[trayId].stop();
      }
    },

    startAll() {
      Object.values(simulators).forEach(sim => sim.start());
    },

    stopAll() {
      Object.values(simulators).forEach(sim => sim.stop());
    },

    getAll() {
      return simulators;
    },

    clear() {
      Object.values(simulators).forEach(sim => sim.stop());
      Object.keys(simulators).forEach(key => delete simulators[key]);
    },
  };
})();
