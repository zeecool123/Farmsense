/**
 * Load and process crop recommendation data from CSV
 */

let cropData = null;

/**
 * Load CSV data
 */
export const loadCropData = async () => {
  if (cropData) return cropData;

  try {
    const response = await fetch('/data/Crop_recommendation.csv');
    const csvText = await response.text();

    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    cropData = lines.slice(1).map(line => {
      const values = line.split(',');
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = parseFloat(values[i]) || values[i];
      });
      return obj;
    });

    return cropData;
  } catch (error) {
    console.error('Error loading crop data:', error);
    return [];
  }
};

/**
 * Get optimal ranges for each crop
 */
export const getCropProfiles = async () => {
  const data = await loadCropData();

  const profiles = {};

  // Group by label
  const grouped = data.reduce((acc, row) => {
    const label = row.label;
    if (!acc[label]) acc[label] = [];
    acc[label].push(row);
    return acc;
  }, {});

  // Calculate ranges for each crop
  Object.keys(grouped).forEach(crop => {
    const rows = grouped[crop];

    const params = {
      N: rows.map(r => r.N),
      P: rows.map(r => r.P),
      K: rows.map(r => r.K),
      temperature: rows.map(r => r.temperature),
      humidity: rows.map(r => r.humidity),
      ph: rows.map(r => r.ph),
      rainfall: rows.map(r => r.rainfall),
    };

    const getRange = (values) => ({
      min: Math.min(...values),
      max: Math.max(...values),
      avg: values.reduce((a, b) => a + b) / values.length,
    });

    profiles[crop] = {
      name: crop.charAt(0).toUpperCase() + crop.slice(1),
      icon: getCropIcon(crop),
      optimalTemp: getRange(params.temperature),
      optimalHumidity: getRange(params.humidity),
      optimalPH: getRange(params.ph),
      optimalWaterUsage: getRange(params.rainfall), // Using rainfall as water content
      optimalN: getRange(params.N),
      optimalP: getRange(params.P),
      optimalK: getRange(params.K),
    };
  });

  return profiles;
};

/**
 * Get crop icon
 */
const getCropIcon = (crop) => {
  const icons = {
    blackgram: '🌱',
    chickpea: '🌰',
    grapes: '🍇',
    kidneybeans: '🫘',
    lentil: '🫘',
    mothbeans: '🌱',
    mungbean: '🌱',
    muskmelon: '🍈',
    pigeonpeas: '🌰',
    watermelon: '🍉',
  };
  return icons[crop] || '🌱';
};

/**
 * Get recommendations based on current conditions and pH adjustments
 */
export const getAdjustedRecommendations = async (cropKey, currentConditions) => {
  const profiles = await getCropProfiles();
  const profile = profiles[cropKey];

  if (!profile) return null;

  const { temperature, humidity, ph, waterUsage } = currentConditions;

  // Base recommendations
  let recommendations = {
    temperature: {
      target: profile.optimalTemp.avg,
      range: profile.optimalTemp,
      status: getStatus(temperature, profile.optimalTemp),
    },
    humidity: {
      target: profile.optimalHumidity.avg,
      range: profile.optimalHumidity,
      status: getStatus(humidity, profile.optimalHumidity),
    },
    waterContent: {
      target: profile.optimalWaterUsage.avg,
      range: profile.optimalWaterUsage,
      status: getStatus(waterUsage, profile.optimalWaterUsage),
    },
    ph: {
      target: profile.optimalPH.avg,
      range: profile.optimalPH,
      status: getStatus(ph, profile.optimalPH),
    },
  };

  // Adjust based on pH
  const phAdjustment = getPHAdjustment(ph, profile.optimalPH);

  if (phAdjustment !== 1) {
    // Adjust other parameters based on pH deviation
    recommendations.temperature.target *= phAdjustment;
    recommendations.humidity.target *= phAdjustment;
    recommendations.waterContent.target *= phAdjustment;
  }

  return recommendations;
};

/**
 * Get status of a parameter
 */
const getStatus = (current, optimal) => {
  if (current >= optimal.min && current <= optimal.max) return 'optimal';
  if (current < optimal.min) return 'low';
  if (current > optimal.max) return 'high';
  return 'unknown';
};

/**
 * Get pH adjustment factor
 */
const getPHAdjustment = (currentPH, optimalPH) => {
  const deviation = Math.abs(currentPH - optimalPH.avg);
  if (deviation < 0.5) return 1; // No adjustment

  // Adjust other parameters by up to 10% based on pH deviation
  const adjustment = 1 + (deviation / optimalPH.avg) * 0.1;
  return Math.min(adjustment, 1.2); // Cap at 20% adjustment
};