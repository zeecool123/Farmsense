/**
 * Resource Optimizer
 * Calculates optimal schedules and configurations to maximize yield while minimizing usage
 */

/**
 * Calculate optimal watering schedule based on crop and conditions
 */
export const optimizeWateringSchedule = (cropKey, sensorData, growthStage = 'vegetative') => {
  const baseSchedules = {
    tomato: {
      vegetative: { frequency: '2x daily', timeWindows: ['06:00-06:30', '18:00-18:30'], duration: 120 },
      flowering: { frequency: '2x daily', timeWindows: ['06:00-06:30', '18:00-18:30'], duration: 140 },
      fruiting: { frequency: '3x daily', timeWindows: ['06:00-06:30', '12:00-12:20', '18:00-18:30'], duration: 100 },
    },
    lettuce: {
      vegetative: { frequency: '2x daily', timeWindows: ['05:00-05:20', '17:00-17:20'], duration: 90 },
      flowering: { frequency: '2x daily', timeWindows: ['05:00-05:20', '17:00-17:20'], duration: 90 },
      fruiting: { frequency: '2x daily', timeWindows: ['05:00-05:20', '17:00-17:20'], duration: 90 },
    },
    strawberry: {
      vegetative: { frequency: '2x daily', timeWindows: ['06:00-06:20', '17:00-17:20'], duration: 100 },
      flowering: { frequency: '3x daily', timeWindows: ['06:00-06:20', '12:00-12:20', '17:00-17:20'], duration: 100 },
      fruiting: { frequency: '3x daily', timeWindows: ['06:00-06:20', '12:00-12:20', '17:00-17:20'], duration: 120 },
    },
  };

  let schedule = baseSchedules[cropKey]?.[growthStage] || baseSchedules.tomato.vegetative;

  // Adjust based on current conditions
  if (sensorData) {
    const temp = sensorData.temperature?.value || 22;
    const humidity = sensorData.humidity?.value || 70;

    // Higher temperature = more frequent watering
    if (temp > 28) {
      schedule.frequency = schedule.frequency === '2x daily' ? '3x daily' : '4x daily';
    }

    // Low humidity = more frequent watering
    if (humidity < 50) {
      schedule.duration = Math.round(schedule.duration * 1.2);
    }
  }

  return {
    crop: cropKey,
    stage: growthStage,
    optimized: true,
    schedule,
    efficiency: 'optimal',
    dailyWaterEstimate: calculateDailyWaterNeeds(schedule),
  };
};

/**
 * Calculate optimal lighting schedule
 */
export const optimizeLightingSchedule = (cropKey, season = 'spring') => {
  const baseSchedules = {
    tomato: { spring: { onTime: '06:00', offTime: '20:00', duration: 14 } },
    lettuce: { spring: { onTime: '05:00', offTime: '19:00', duration: 14 } },
    strawberry: { spring: { onTime: '06:00', offTime: '18:00', duration: 12 } },
  };

  const seasonalAdjustments = {
    spring: 0, // 14 hours base
    summer: 0, // 14 hours
    fall: 1, // +1 hour (need more light as days get shorter)
    winter: 2, // +2 hours
  };

  let schedule = baseSchedules[cropKey]?.spring || baseSchedules.tomato.spring;
  const adjustment = seasonalAdjustments[season] || 0;

  schedule = {
    ...schedule,
    duration: schedule.duration + adjustment,
    adjustment,
    season,
  };

  return {
    crop: cropKey,
    season,
    optimized: true,
    schedule,
    dailyEnergyEstimate: schedule.duration * 0.8, // kWh (assuming 800W lights)
  };
};

/**
 * Calculate optimal climate control settings
 */
export const optimizeClimateControl = (cropKey, growthStage = 'vegetative') => {
  const targets = {
    tomato: {
      vegetative: { temp: { target: 24, tolerance: 2 }, humidity: { target: 70, tolerance: 5 } },
      flowering: { temp: { target: 26, tolerance: 2 }, humidity: { target: 75, tolerance: 5 } },
      fruiting: { temp: { target: 25, tolerance: 2 }, humidity: { target: 65, tolerance: 5 } },
    },
    lettuce: {
      vegetative: { temp: { target: 18, tolerance: 2 }, humidity: { target: 75, tolerance: 5 } },
      flowering: { temp: { target: 18, tolerance: 2 }, humidity: { target: 75, tolerance: 5 } },
      fruiting: { temp: { target: 18, tolerance: 2 }, humidity: { target: 75, tolerance: 5 } },
    },
  };

  const target = targets[cropKey]?.[growthStage] || targets.tomato.vegetative;

  return {
    crop: cropKey,
    stage: growthStage,
    optimized: true,
    target,
    estimatedCost: {
      daily: '2.50-4.50',
      weekly: '17.50-31.50',
      monthly: '75-135',
    },
  };
};

/**
 * Calculate daily water needs based on schedule
 */
export const calculateDailyWaterNeeds = (schedule) => {
  let totalSeconds = 0;

  if (schedule.timeWindows) {
    totalSeconds = schedule.timeWindows.length * schedule.duration;
  }

  // Assuming 1.5 liters per minute
  const litersPerSecond = 1.5 / 60;
  const totalLiters = totalSeconds * litersPerSecond;

  return Math.round(totalLiters * 10) / 10; // liters
};

/**
 * Calculate daily electricity needs
 */
export const calculateDailyEnergyNeeds = (lighting, climate, watering) => {
  const lightingEnergy = (lighting?.dailyEnergyEstimate || 11.2) * 0.8; // Assuming 80% efficiency
  const climateEnergy = (climate ? parseFloat(climate.estimatedCost.daily) : 3) / 0.30; // rough estimate
  const wateringEnergy = (watering ? 0.5 : 0); // Small pump usage

  return Math.round((lightingEnergy + climateEnergy + wateringEnergy) * 10) / 10; // kWh
};

/**
 * Get optimization recommendations
 */
export const getOptimizationRecommendations = (cropKey, sensorData, usageData = {}) => {
  const recommendations = [];

  // Water optimization
  if (usageData.waterPerDay > 300) {
    recommendations.push({
      type: 'water',
      priority: 'high',
      recommendation: 'Your daily water usage is high. Consider:',
      actions: [
        'Switch to drip irrigation (25% more efficient)',
        'Add mulch layer (reduces evaporation by 20%)',
        'Water earlier in day (6 AM - loses 15% less to evaporation)',
        'Reduce watering frequency by 15% and monitor soil',
      ],
      estimatedSavings: '30-50 liters/day',
    });
  }

  // Energy optimization
  if (usageData.energyPerDay > 15) {
    recommendations.push({
      type: 'energy',
      priority: 'high',
      recommendation: 'Your daily energy usage is high. Consider:',
      actions: [
        'Use natural light when available (2-3 hours saves 20%)',
        'Install smart heater (learns patterns, saves 15%)',
        'Optimize lighting hours by 30 mins',
        'Improve insulation to reduce heating needs',
      ],
      estimatedSavings: '3-5 kWh/day',
    });
  }

  // Climate efficiency
  if (sensorData.temperature && Math.abs(sensorData.temperature.value - 25) > 3) {
    recommendations.push({
      type: 'climate',
      priority: 'medium',
      recommendation: 'Climate control could be more efficient:',
      actions: [
        'Adjust target temperature based on growth stage',
        'Install thermal curtains for night',
        'Use zone heating instead of whole room',
        'Check for air leaks around doors/windows',
      ],
      estimatedSavings: '$5-10/month',
    });
  }

  return recommendations;
};

/**
 * Create optimization report
 */
export const generateOptimizationReport = (cropKey, period = 'weekly') => {
  return {
    crop: cropKey,
    period,
    waterOptimization: optimizeWateringSchedule(cropKey),
    lightingOptimization: optimizeLightingSchedule(cropKey),
    climateOptimization: optimizeClimateControl(cropKey),
    recommendations: getOptimizationRecommendations(cropKey),
    generatedAt: new Date().toISOString(),
    updateFrequency: period === 'weekly' ? 'Every 7 days' : 'Every 30 days',
  };
};

/**
 * Calculate ROI of optimization
 */
export const calculateROI = (initialCost, monthlySavings) => {
  const paybackMonths = initialCost / monthlySavings;
  const yearlyROI = (monthlySavings * 12) - (initialCost / 12); // Assuming 12-month amortization

  return {
    initialInvestment: initialCost,
    paybackPeriod: Math.round(paybackMonths * 10) / 10,
    monthlySavings,
    yearlySavings: Math.round(monthlySavings * 12),
    yearlyROI,
    roiPercent: Math.round((yearlyROI / initialCost) * 1000) / 10,
  };
};

/**
 * Score overall resource efficiency
 */
export const calculateEfficiencyScore = (actualUsage, optimalUsage) => {
  let score = 100;

  if (actualUsage.water && optimalUsage.water) {
    const waterDiff = ((actualUsage.water - optimalUsage.water) / optimalUsage.water) * 100;
    score -= Math.max(0, waterDiff * 0.25); // Water is 25% of score
  }

  if (actualUsage.energy && optimalUsage.energy) {
    const energyDiff = ((actualUsage.energy - optimalUsage.energy) / optimalUsage.energy) * 100;
    score -= Math.max(0, energyDiff * 0.25); // Energy is 25% of score
  }

  if (actualUsage.crop_health && optimalUsage.crop_health) {
    const healthDiff = optimalUsage.crop_health - actualUsage.crop_health;
    score -= Math.max(0, healthDiff * 0.5); // Health is 50% of score
  }

  return Math.max(0, Math.round(score));
};

/**
 * Predict resource needs for next week
 */
export const predictWeeklyNeeds = (cropKey, historicalData = []) => {
  // Simple average-based prediction
  if (historicalData.length === 0) {
    return {
      predictedWater: 1750, // liters (250/day)
      predictedEnergy: 105, // kWh (15/day)
      confidence: 'low',
      message: 'Need historical data for accurate predictions',
    };
  }

  const avgWater = historicalData.reduce((sum, d) => sum + d.water, 0) / historicalData.length;
  const avgEnergy = historicalData.reduce((sum, d) => sum + d.energy, 0) / historicalData.length;

  return {
    predictedWater: Math.round(avgWater * 7),
    predictedEnergy: Math.round(avgEnergy * 7 * 10) / 10,
    confidence: historicalData.length > 30 ? 'high' : historicalData.length > 7 ? 'medium' : 'low',
    historicalDays: historicalData.length,
    averageDailyWater: Math.round(avgWater),
    averageDailyEnergy: Math.round(avgEnergy * 10) / 10,
  };
};
