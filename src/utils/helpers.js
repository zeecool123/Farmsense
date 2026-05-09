import { CROP_PROFILES, AI_SCORE_THRESHOLDS } from './constants';

/**
 * Calculate AI score based on sensor data vs optimal profile
 * Score from 0-100, where 100 is perfect match
 */
export const calculateAIScore = (sensorData, cropProfile) => {
  if (!sensorData || !cropProfile) return 0;

  let scoreSum = 0;
  let parameterCount = 0;

  // Temperature scoring
  if (sensorData.temperature !== undefined) {
    const temp = sensorData.temperature;
    const { min, max } = cropProfile.optimalTemp;
    if (temp >= min && temp <= max) {
      scoreSum += 100;
    } else if (temp >= min - 5 && temp <= max + 5) {
      scoreSum += 80;
    } else {
      scoreSum += Math.max(0, 100 - Math.abs(temp - (min + max) / 2) * 5);
    }
    parameterCount++;
  }

  // Humidity scoring
  if (sensorData.humidity !== undefined) {
    const humidity = sensorData.humidity;
    const { min, max } = cropProfile.optimalHumidity;
    if (humidity >= min && humidity <= max) {
      scoreSum += 100;
    } else if (humidity >= min - 5 && humidity <= max + 5) {
      scoreSum += 80;
    } else {
      scoreSum += Math.max(0, 100 - Math.abs(humidity - (min + max) / 2) * 2);
    }
    parameterCount++;
  }

  // pH scoring
  if (sensorData.ph !== undefined) {
    const ph = sensorData.ph;
    const { min, max } = cropProfile.optimalPH;
    if (ph >= min && ph <= max) {
      scoreSum += 100;
    } else {
      scoreSum += Math.max(0, 100 - Math.abs(ph - (min + max) / 2) * 20);
    }
    parameterCount++;
  }

  return parameterCount > 0 ? Math.round(scoreSum / parameterCount) : 0;
};

/**
 * Get health status based on AI score
 */
export const getHealthStatus = (score) => {
  if (score >= AI_SCORE_THRESHOLDS.perfect) return 'Perfect';
  if (score >= AI_SCORE_THRESHOLDS.excellent) return 'Excellent';
  if (score >= AI_SCORE_THRESHOLDS.good) return 'Good';
  if (score >= AI_SCORE_THRESHOLDS.fair) return 'Fair';
  return 'Poor';
};

/**
 * Get color based on score
 */
export const getScoreColor = (score) => {
  if (score >= AI_SCORE_THRESHOLDS.perfect) return '#10b981'; // green
  if (score >= AI_SCORE_THRESHOLDS.excellent) return '#3b82f6'; // blue
  if (score >= AI_SCORE_THRESHOLDS.good) return '#f59e0b'; // amber
  if (score >= AI_SCORE_THRESHOLDS.fair) return '#ef4444'; // red
  return '#6b7280'; // gray
};

/**
 * Get crop profile by name
 */
export const getCropProfile = (cropName) => {
  return CROP_PROFILES[cropName.toLowerCase()] || null;
};

/**
 * Format sensor reading with units
 */
export const formatSensorReading = (value, type) => {
  switch (type) {
    case 'temperature':
      return `${value}°C`;
    case 'humidity':
      return `${value}%`;
    case 'ph':
      return `${value.toFixed(2)}`;
    case 'waterUsage':
      return `${value}ml`;
    case 'lightIntensity':
      return `${value} lux`;
    default:
      return value;
  }
};
