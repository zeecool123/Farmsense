/**
 * Advanced ML Features for Farmsense
 * Provides predictive analytics and recommendations
 */

import { CROP_PROFILES } from '../utils/constants';

import { getAdjustedRecommendations } from '../utils/cropData';

/**
 * Get AI recommendations for optimal crop conditions
 * Uses CSV data and adjusts based on current pH
 */
export const getAIRecommendations = async (cropKey, currentConditions) => {
  const crop = CROP_PROFILES[cropKey];
  if (!crop) return null;

  // Get adjusted recommendations from CSV data
  const adjustedRecs = await getAdjustedRecommendations(cropKey, currentConditions);

  if (!adjustedRecs) {
    // Fallback to basic recommendations
    return getBasicRecommendations(crop, currentConditions);
  }

  // Generate actionable recommendations
  const recommendations = [];

  // Temperature recommendation
  if (adjustedRecs.temperature.status !== 'optimal') {
    const action = adjustedRecs.temperature.status === 'low' ? 'Increase' : 'Decrease';
    recommendations.push({
      parameter: 'Temperature',
      action: `${action} temperature to ${adjustedRecs.temperature.target.toFixed(1)}°C`,
      priority: adjustedRecs.temperature.status === 'low' && currentConditions.temperature < 15 ? 'high' : 'medium',
      reason: `Optimal range: ${adjustedRecs.temperature.range.min.toFixed(1)}-${adjustedRecs.temperature.range.max.toFixed(1)}°C`,
    });
  }

  // Humidity recommendation
  if (adjustedRecs.humidity.status !== 'optimal') {
    const action = adjustedRecs.humidity.status === 'low' ? 'Increase' : 'Decrease';
    recommendations.push({
      parameter: 'Humidity',
      action: `${action} humidity to ${adjustedRecs.humidity.target.toFixed(1)}%`,
      priority: adjustedRecs.humidity.status === 'low' && currentConditions.humidity < 40 ? 'high' : 'medium',
      reason: `Optimal range: ${adjustedRecs.humidity.range.min.toFixed(1)}-${adjustedRecs.humidity.range.max.toFixed(1)}%`,
    });
  }

  // Water content recommendation
  if (adjustedRecs.waterContent.status !== 'optimal') {
    const action = adjustedRecs.waterContent.status === 'low' ? 'Increase' : 'Decrease';
    recommendations.push({
      parameter: 'Water Content',
      action: `${action} irrigation to ${adjustedRecs.waterContent.target.toFixed(0)} ml/day`,
      priority: adjustedRecs.waterContent.status === 'low' ? 'high' : 'medium',
      reason: `Optimal range: ${adjustedRecs.waterContent.range.min.toFixed(0)}-${adjustedRecs.waterContent.range.max.toFixed(0)} ml/day`,
    });
  }

  // pH recommendation
  if (adjustedRecs.ph.status !== 'optimal') {
    const action = adjustedRecs.ph.status === 'low' ? 'Increase' : 'Decrease';
    recommendations.push({
      parameter: 'Soil pH',
      action: `${action} soil pH to ${adjustedRecs.ph.target.toFixed(1)}`,
      priority: 'high', // pH is critical
      reason: `Optimal range: ${adjustedRecs.ph.range.min.toFixed(1)}-${adjustedRecs.ph.range.max.toFixed(1)}. pH affects nutrient availability.`,
    });
  }

  // Sort by priority
  recommendations.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return {
    recommendations,
    overallStatus: recommendations.length === 0 ? 'optimal' : 
                   recommendations.filter(r => r.priority === 'high').length > 0 ? 'needs_attention' : 'good',
    summary: recommendations.length === 0 
      ? 'All parameters are optimal for crop growth.'
      : `${recommendations.length} parameter(s) need adjustment for best growth.`,
  };
};

/**
 * Fallback basic recommendations
 */
const getBasicRecommendations = (crop, currentConditions) => {
  const recommendations = [];

  // Temperature
  if (currentConditions.temperature < crop.optimalTemp.min) {
    recommendations.push({
      parameter: 'Temperature',
      action: `Increase temperature to ${crop.optimalTemp.min}°C`,
      priority: 'medium',
      reason: `Current: ${currentConditions.temperature}°C`,
    });
  } else if (currentConditions.temperature > crop.optimalTemp.max) {
    recommendations.push({
      parameter: 'Temperature',
      action: `Decrease temperature to ${crop.optimalTemp.max}°C`,
      priority: 'medium',
      reason: `Current: ${currentConditions.temperature}°C`,
    });
  }

  // Humidity
  if (currentConditions.humidity < crop.optimalHumidity.min) {
    recommendations.push({
      parameter: 'Humidity',
      action: `Increase humidity to ${crop.optimalHumidity.min}%`,
      priority: 'medium',
      reason: `Current: ${currentConditions.humidity}%`,
    });
  } else if (currentConditions.humidity > crop.optimalHumidity.max) {
    recommendations.push({
      parameter: 'Humidity',
      action: `Decrease humidity to ${crop.optimalHumidity.max}%`,
      priority: 'medium',
      reason: `Current: ${currentConditions.humidity}%`,
    });
  }

  // pH
  if (currentConditions.ph < crop.optimalPH.min) {
    recommendations.push({
      parameter: 'Soil pH',
      action: `Increase soil pH to ${crop.optimalPH.min}`,
      priority: 'high',
      reason: `Current: ${currentConditions.ph}`,
    });
  } else if (currentConditions.ph > crop.optimalPH.max) {
    recommendations.push({
      parameter: 'Soil pH',
      action: `Decrease soil pH to ${crop.optimalPH.max}`,
      priority: 'high',
      reason: `Current: ${currentConditions.ph}`,
    });
  }

  return {
    recommendations,
    overallStatus: recommendations.length === 0 ? 'optimal' : 'needs_attention',
    summary: recommendations.length === 0 
      ? 'All parameters are optimal for crop growth.'
      : `${recommendations.length} parameter(s) need adjustment.`,
  };
};


/**
 * Predict crop yield based on historical data
 * Uses trend analysis and AI score history
 */

export const predictCropYield = (sensorHistory, cropKey, daysToHarvest = 30) => {
  if (!sensorHistory || sensorHistory.length === 0) {
    return {
      estimatedYield: 'Insufficient data',
      confidence: 0,
      trend: 'unknown',
    };
  }

  const crop = CROP_PROFILES[cropKey];
  if (!crop) return null;

  // Calculate average AI scores
  const scores = sensorHistory
    .map((record) => record.aiScore || 0)
    .filter((score) => score > 0);

  const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;

  // Estimate yield based on score
  let yieldEstimate = 0;
  let confidence = Math.min(100, (scores.length / 20) * 100); // Confidence increases with data

  if (avgScore >= 95) {
    yieldEstimate = 100; // Excellent yield
  } else if (avgScore >= 80) {
    yieldEstimate = 85 + Math.random() * 10;
  } else if (avgScore >= 60) {
    yieldEstimate = 70 + Math.random() * 15;
  } else if (avgScore >= 40) {
    yieldEstimate = 50 + Math.random() * 20;
  } else {
    yieldEstimate = Math.min(avgScore, 40);
  }

  // Calculate trend (improving or declining)
  let trend = 'stable';
  if (scores.length >= 2) {
    const recentAvg = scores.slice(-5).reduce((a, b) => a + b) / Math.min(5, scores.length);
    const olderAvg = scores.slice(0, 5).reduce((a, b) => a + b) / Math.min(5, scores.length);
    if (recentAvg > olderAvg + 5) trend = 'improving';
    else if (recentAvg < olderAvg - 5) trend = 'declining';
  }

  return {
    estimatedYield: Math.round(yieldEstimate) + '%',
    confidence: Math.round(confidence),
    trend,
    avgScore: Math.round(avgScore),
    daysToHarvest,
    recommendation: getYieldRecommendation(avgScore, trend),
  };
};

/**
 * Get recommendations to improve yield
 */
const getYieldRecommendation = (avgScore, trend) => {
  if (avgScore >= 95) {
    return '✨ Perfect conditions! Maintain current settings.';
  } else if (avgScore >= 80) {
    return '🟢 Excellent! Minor adjustments may further improve yield.';
  } else if (avgScore >= 60) {
    return '🟡 Good progress. Check temperature and humidity levels.';
  } else if (avgScore >= 40) {
    return '🟠 Multiple parameters need adjustment. Review crop profile.';
  } else {
    return '🔴 Critical. Urgent intervention required.';
  }
};

/**
 * Predict optimal harvest time
 * Based on growth patterns and sensor data
 */
export const predictHarvestTime = (cropKey, sensorHistory, plantedDaysAgo) => {
  const crop = CROP_PROFILES[cropKey];
  if (!crop) return null;

  // Estimated growth duration (varies by crop)
  const growthDuration = {
    blackgram: 75,
    chickpea: 90,
    grapes: 150,
    kidneybeans: 85,
    lentil: 80,
    mothbeans: 70,
    mungbean: 65,
    muskmelon: 80,
    pigeonpeas: 120,
    watermelon: 85,
    strawberry: 45,
    lettuce: 35,
    tomato: 70,
    basil: 30,
  }[cropKey] || 75;


  // Calculate maturity percentage based on time
  const maturityPercent = Math.min(100, (plantedDaysAgo / growthDuration) * 100);

  // Adjust based on AI scores (good conditions accelerate growth)
  let adjustedMaturity = maturityPercent;
  if (sensorHistory && sensorHistory.length > 0) {
    const avgScore = sensorHistory.reduce((a, b) => a + (b.aiScore || 0), 0) / sensorHistory.length;
    if (avgScore >= 80) {
      adjustedMaturity = Math.min(100, maturityPercent * 1.1); // 10% faster growth
    } else if (avgScore < 40) {
      adjustedMaturity = maturityPercent * 0.9; // 10% slower growth
    }
  }

  // Calculate days to harvest
  const daysToHarvest = Math.max(1, Math.round((100 - adjustedMaturity) * (growthDuration / 100)));

  return {
    maturityPercent: Math.round(adjustedMaturity),
    daysToHarvest,
    estimatedHarvestDate: getEstimatedDate(daysToHarvest),
    harvestReadiness: getHarvestReadiness(adjustedMaturity),
  };
};

/**
 * Get harvest readiness status
 */
const getHarvestReadiness = (maturityPercent) => {
  if (maturityPercent >= 95) return '✅ Ready to harvest!';
  if (maturityPercent >= 80) return '🟢 Almost ready (1-2 days)';
  if (maturityPercent >= 60) return '🟡 Developing (3-5 days)';
  if (maturityPercent >= 40) return '🟠 Growing (1-2 weeks)';
  return '🔴 Early stage (2+ weeks)';
};

/**
 * Estimate nutrient levels and recommendations
 */
export const estimateNutrientRequirements = (cropKey, sensorHistory, growthStage = 'vegetative') => {
  const crop = CROP_PROFILES[cropKey];
  if (!crop) return null;

  // Base nutrient requirements vary by crop
  const nutrients = {
    blackgram: { nitrogen: 20, phosphorus: 40, potassium: 20 },
    chickpea: { nitrogen: 20, phosphorus: 40, potassium: 60 },
    grapes: { nitrogen: 60, phosphorus: 20, potassium: 100 },
    kidneybeans: { nitrogen: 20, phosphorus: 40, potassium: 20 },
    lentil: { nitrogen: 20, phosphorus: 40, potassium: 20 },
    mothbeans: { nitrogen: 20, phosphorus: 40, potassium: 20 },
    mungbean: { nitrogen: 20, phosphorus: 40, potassium: 20 },
    muskmelon: { nitrogen: 80, phosphorus: 40, potassium: 120 },
    pigeonpeas: { nitrogen: 20, phosphorus: 40, potassium: 60 },
    watermelon: { nitrogen: 80, phosphorus: 40, potassium: 120 },
    strawberry: { nitrogen: 150, phosphorus: 80, potassium: 200 },
    lettuce: { nitrogen: 120, phosphorus: 60, potassium: 150 },
    tomato: { nitrogen: 200, phosphorus: 100, potassium: 250 },
    basil: { nitrogen: 100, phosphorus: 50, potassium: 100 },
  }[cropKey] || { nitrogen: 40, phosphorus: 40, potassium: 60 };


  // Adjust for growth stage
  if (growthStage === 'flowering') {
    nutrients.phosphorus *= 1.5;
    nutrients.potassium *= 1.2;
  } else if (growthStage === 'fruiting') {
    nutrients.potassium *= 1.5;
  }

  // Adjust based on average pH (affects nutrient availability)
  let phAdjustment = 1;
  if (sensorHistory && sensorHistory.length > 0) {
    const avgPh = sensorHistory.reduce((a, b) => a + (b.ph || 6.5), 0) / sensorHistory.length;
    if (avgPh < 6) {
      phAdjustment = 0.9; // Acidic - reduce nutrients
    } else if (avgPh > 7) {
      phAdjustment = 1.1; // Alkaline - increase nutrients
    }
  }

  return {
    nitrogen: Math.round(nutrients.nitrogen * phAdjustment),
    phosphorus: Math.round(nutrients.phosphorus * phAdjustment),
    potassium: Math.round(nutrients.potassium * phAdjustment),
    stage: growthStage,
    recommendation: getNutrientRecommendation(cropKey, growthStage),
  };
};

/**
 * Get nutrient recommendation text
 */
const getNutrientRecommendation = (cropKey, stage) => {
  const recommendations = {
    vegetative: `🌿 Focus on nitrogen for leaf growth on ${cropKey}`,
    flowering: `🌸 Increase phosphorus to support flowering on ${cropKey}`,
    fruiting: `🍓 Boost potassium for fruit development on ${cropKey}`,
  };
  return recommendations[stage] || 'Maintain balanced nutrient levels';
};

/**
 * Predict water consumption
 */
export const predictWaterConsumption = (cropKey, temperature, humidity, plantSize = 'medium') => {
  const crop = CROP_PROFILES[cropKey];
  if (!crop) return null;

  const baseWater = (crop.optimalWaterUsage.min + crop.optimalWaterUsage.max) / 2;

  // Adjust for temperature
  let tempAdjustment = 1;
  const optimalTemp = (crop.optimalTemp.min + crop.optimalTemp.max) / 2;
  if (temperature > optimalTemp + 5) {
    tempAdjustment = 1.3; // Hot - more water needed
  } else if (temperature < optimalTemp - 5) {
    tempAdjustment = 0.7; // Cold - less water needed
  }

  // Adjust for humidity
  let humidityAdjustment = 1;
  if (humidity < 50) {
    humidityAdjustment = 1.2; // Dry - more water needed
  } else if (humidity > 80) {
    humidityAdjustment = 0.8; // Humid - less water needed
  }

  // Adjust for plant size
  const sizeMultiplier = {
    small: 0.7,
    medium: 1,
    large: 1.5,
  }[plantSize] || 1;

  const predictedWater = Math.round(baseWater * tempAdjustment * humidityAdjustment * sizeMultiplier);

  return {
    predictedDailyUsage: predictedWater + ' ml/day',
    adjustment: Math.round((tempAdjustment * humidityAdjustment - 1) * 100),
    adjustmentReason:
      temperature > optimalTemp + 5 ? 'Temperature high' : 
      temperature < optimalTemp - 5 ? 'Temperature low' :
      humidity < 50 ? 'Low humidity' :
      humidity > 80 ? 'High humidity' :
      'Optimal conditions',
  };
};

/**
 * Predict resource efficiency
 */
export const predictResourceEfficiency = (sensorHistory, controlHistory = []) => {
  if (!sensorHistory || sensorHistory.length === 0) {
    return { efficiency: 'Insufficient data', score: 0 };
  }

  const avgWaterUsage = sensorHistory.reduce((a, b) => a + (b.waterUsage || 0), 0) / sensorHistory.length;
  const avgScore = sensorHistory.reduce((a, b) => a + (b.aiScore || 0), 0) / sensorHistory.length;

  // Efficiency score: high growth with low resource usage = high efficiency
  let efficiencyScore = 0;

  if (avgScore >= 80 && avgWaterUsage < 200) {
    efficiencyScore = 95;
  } else if (avgScore >= 80) {
    efficiencyScore = 80;
  } else if (avgWaterUsage > 300) {
    efficiencyScore = 40;
  } else {
    efficiencyScore = Math.round((avgScore / 100) * avgWaterUsage / 2);
  }

  return {
    efficiency: efficiencyScore >= 80 ? 'Excellent' : 
                efficiencyScore >= 60 ? 'Good' : 
                efficiencyScore >= 40 ? 'Fair' : 'Poor',
    score: Math.round(efficiencyScore),
    recommendation: getEfficiencyRecommendation(efficiencyScore, avgWaterUsage),
  };
};

/**
 * Get efficiency recommendation
 */
const getEfficiencyRecommendation = (score, waterUsage) => {
  if (score >= 80) {
    return '✨ Excellent resource management! System is optimized.';
  } else if (waterUsage > 300) {
    return '💧 Consider reducing water usage. Check for leaks or overwatering.';
  } else {
    return '⚡ Optimize climate control settings to improve efficiency.';
  }
};

/**
 * Anomaly prediction - predict issues before they happen
 */
export const predictAnomalies = (sensorHistory, cropKey) => {
  const crop = CROP_PROFILES[cropKey];
  if (!crop || !sensorHistory || sensorHistory.length < 5) {
    return { anomaliesDetected: [], riskLevel: 'low' };
  }

  const anomalies = [];
  const recentData = sensorHistory.slice(-5);

  // Check temperature trend
  const temps = recentData.map((d) => d.temperature);
  const tempTrend = temps[temps.length - 1] - temps[0];
  if (Math.abs(tempTrend) > 3) {
    anomalies.push({
      type: 'Temperature Instability',
      severity: 'warning',
      message: `Temperature fluctuating by ${Math.abs(tempTrend).toFixed(1)}°C`,
    });
  }

  // Check humidity trend
  const humidities = recentData.map((d) => d.humidity);
  const humidityTrend = humidities[humidities.length - 1] - humidities[0];
  if (Math.abs(humidityTrend) > 10) {
    anomalies.push({
      type: 'Humidity Instability',
      severity: 'warning',
      message: `Humidity fluctuating by ${Math.abs(humidityTrend).toFixed(1)}%`,
    });
  }

  // Check pH drift
  const phs = recentData.map((d) => d.ph);
  const phDrift = Math.abs(phs[phs.length - 1] - phs[0]);
  if (phDrift > 0.2) {
    anomalies.push({
      type: 'pH Drift',
      severity: 'info',
      message: `pH drifting by ${phDrift.toFixed(2)} units`,
    });
  }

  // Determine overall risk level
  let riskLevel = 'low';
  if (anomalies.filter((a) => a.severity === 'critical').length > 0) {
    riskLevel = 'critical';
  } else if (anomalies.filter((a) => a.severity === 'warning').length > 0) {
    riskLevel = 'high';
  } else if (anomalies.length > 0) {
    riskLevel = 'medium';
  }

  return {
    anomaliesDetected: anomalies,
    riskLevel,
    predictedIssue: anomalies.length > 0 
      ? `${anomalies.length} potential issues detected`
      : 'No anomalies detected',
  };
};

/**
 * Get date string for days in future
 */
function getEstimatedDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
