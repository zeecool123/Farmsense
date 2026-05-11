/**
 * Waste Detection Service
 * AI-powered detection of water and electricity waste
 * Identifies patterns, predicts issues, and suggests optimizations
 */

/**
 * Water waste detection rules
 */
export const detectWaterWaste = (areaData, sensorHistory = []) => {
  const waste = [];

  if (!areaData) return waste;

  const currentSensors = areaData.currentSensors || {};
  const automationTasks = areaData.automationTasks || [];

  // Rule 1: Soil is constantly wet (overwatering)
  if (currentSensors.soilMoisture && currentSensors.soilMoisture.value > 80) {
    if (sensorHistory.length > 5) {
      const recentMoisture = sensorHistory.slice(-5).map(h => h.soilMoisture || 0);
      if (recentMoisture.every(m => m > 75)) {
        waste.push({
          type: 'OVERWATERING',
          severity: 'warning',
          detected: true,
          message: 'Soil is constantly wet (>80% moisture) - you\'re watering too much',
          explanation: 'Plants only need soil moisture around 60-70%. Constant wetness can cause root rot and fungal issues.',
          wastageEstimate: {
            water: '30-40%',
            daily: 'Extra 50-75 liters',
            weekly: 'Extra 350-525 liters',
            cost: '$2.50-4.00/week',
          },
          suggestions: [
            'Reduce watering frequency from 2x to 1x per day',
            'Reduce watering duration by 30 seconds',
            'Check soil moisture before watering (only water if <60%)',
            'Ensure soil drains properly - check for clogged holes',
          ],
          action: 'Reduce watering task frequency',
        });
      }
    }
  }

  // Rule 2: Water level dropping but soil moisture not rising (leak/inefficiency)
  if (sensorHistory.length > 3) {
    const waterLevelTrend = sensorHistory.slice(-3).map(h => h.waterLevel || 100);
    const moistureTrend = sensorHistory.slice(-3).map(h => h.soilMoisture || 0);

    const waterLevelDropping = waterLevelTrend[0] > waterLevelTrend[2];
    const moistureNotIncreasing = moistureTrend[0] >= moistureTrend[2];

    if (waterLevelDropping && moistureNotIncreasing) {
      waste.push({
        type: 'WATER_SYSTEM_LEAK',
        severity: 'critical',
        detected: true,
        message: 'Water level dropping but soil not getting wetter - possible leak or malfunction',
        explanation: 'Water is leaving the tank/system but not reaching the soil. This indicates a leak or pump failure.',
        wastageEstimate: {
          water: '50-100%',
          daily: 'Unknown (leaking)',
          weekly: '500+ liters',
          cost: '$3.75+/week',
        },
        suggestions: [
          'Check watering lines for visible leaks',
          'Inspect pump for failures',
          'Check if water is going to wrong area',
          'Test manual watering to verify lines are clear',
          'Contact support if unsure',
        ],
        action: 'Disable watering - manual check required',
      });
    }
  }

  // Rule 3: Watering during high evaporation time (midday)
  const wateringTask = automationTasks.find(t => t.taskType === 'watering');
  if (wateringTask && wateringTask.timeWindow) {
    const [startHour] = wateringTask.timeWindow.start.split(':').map(Number);
    if (startHour >= 10 && startHour <= 16) {
      waste.push({
        type: 'EVAPORATION_WASTE',
        severity: 'info',
        detected: true,
        message: 'Watering during high-sun hours (10 AM - 4 PM) = 40% more evaporation waste',
        explanation: 'Hot sun causes water to evaporate before plants can absorb it. Early morning or evening is better.',
        wastageEstimate: {
          water: '30-40%',
          daily: '30-50 liters wasted to evaporation',
          weekly: '210-350 liters',
          cost: '$1.60-2.60/week',
        },
        suggestions: [
          'Change watering time to 6-7 AM (best)',
          'Or change to 7-8 PM (good)',
          'Keep current time if shaded area',
        ],
        action: 'Reschedule watering to 6:00 AM',
      });
    }
  }

  return waste.filter(w => w.detected);
};

/**
 * Electricity waste detection rules
 */
export const detectElectricityWaste = (areaData, sensorHistory = []) => {
  const waste = [];

  if (!areaData) return waste;

  const currentSensors = areaData.currentSensors || {};
  const energyUsage = areaData.energyUsage || {};
  const systemStatus = areaData.systemStatus || {};

  // Rule 1: Heater on when temperature is already optimal
  if (systemStatus.heatingActive && currentSensors.temperature) {
    const targetTemp = areaData.climateSettings?.targetTemp || 25;
    const tempDiff = currentSensors.temperature.value - targetTemp;

    if (tempDiff > 0) {
      // Room is warmer than target yet heater is on
      waste.push({
        type: 'UNNECESSARY_HEATING',
        severity: 'warning',
        detected: true,
        message: `Heater running when room is ${tempDiff.toFixed(1)}°C above target - wasting electricity`,
        explanation: 'Your room is already warm enough (or too warm). The heater is doing unnecessary work.',
        wastageEstimate: {
          energy: '15-25%',
          daily: `${(energyUsage.heater * 0.2 / 1000).toFixed(2)} kWh`,
          weekly: `${(energyUsage.heater * 0.2 / 1000 * 7).toFixed(2)} kWh`,
          cost: `$${(energyUsage.heater * 0.2 / 1000 * 7 * 0.30).toFixed(2)}/week`,
        },
        suggestions: [
          `Turn off heater until evening`,
          `Use solar heat during day - install reflective panels`,
          `Insulate walls to reduce heat loss`,
          `Set thermostat lower by 2°C`,
        ],
        action: 'Turn off heater now',
      });
    }
  }

  // Rule 2: Lights on during daytime (high natural light)
  if (systemStatus.lightingActive && currentSensors.lightIntensity) {
    if (currentSensors.lightIntensity.value > 800) {
      // Natural light is sufficient
      waste.push({
        type: 'UNNECESSARY_LIGHTING',
        severity: 'info',
        detected: true,
        message: 'Natural light is strong (800+ lux) - artificial lights are wasting electricity',
        explanation: 'Your plants are getting plenty of natural light. Artificial lights add extra cost.',
        wastageEstimate: {
          energy: '20-30%',
          daily: `${(energyUsage.lights * 0.25 / 1000).toFixed(2)} kWh`,
          weekly: `${(energyUsage.lights * 0.25 / 1000 * 7).toFixed(2)} kWh`,
          cost: `$${(energyUsage.lights * 0.25 / 1000 * 7 * 0.30).toFixed(2)}/week`,
        },
        suggestions: [
          'Turn off lights during daylight hours',
          'Install automatic light sensors',
          'Use lights only after sunset',
          'Move plants closer to natural light source',
        ],
        action: 'Turn off lights until sunset',
      });
    }
  }

  // Rule 3: Ventilation running when not needed
  if (systemStatus.ventilationActive || systemStatus.fanActive) {
    const humidity = currentSensors.humidity?.value || 70;
    const targetHumidity = areaData.climateSettings?.targetHumidity || 70;

    if (humidity <= targetHumidity - 5) {
      // Humidity is already low, ventilation will make it worse
      waste.push({
        type: 'UNNECESSARY_VENTILATION',
        severity: 'info',
        detected: true,
        message: 'Ventilation running when humidity is already low - unnecessary energy use',
        explanation: 'Fans/ventilation remove moisture from air. Running them when humidity is already low wastes energy.',
        wastageEstimate: {
          energy: '10-15%',
          daily: `${(energyUsage.ventilation * 0.12 / 1000).toFixed(2)} kWh`,
          weekly: `${(energyUsage.ventilation * 0.12 / 1000 * 7).toFixed(2)} kWh`,
          cost: `$${(energyUsage.ventilation * 0.12 / 1000 * 7 * 0.30).toFixed(2)}/week`,
        },
        suggestions: [
          'Turn off ventilation - increase humidity instead with humidifier',
          'Run ventilation only during peak heat hours',
          'Install humidity sensor to auto-control ventilation',
        ],
        action: 'Turn off ventilation - enable humidifier',
      });
    }
  }

  // Rule 4: All systems running at night (no one present)
  const hour = new Date().getHours();
  if (hour >= 22 || hour <= 6) {
    // Night time
    const totalWaste = (energyUsage.lights || 0) + (energyUsage.heater || 0) * 0.5;
    if (totalWaste > 500) {
      waste.push({
        type: 'NIGHT_MODE_INEFFICIENCY',
        severity: 'info',
        detected: true,
        message: 'Multiple systems running at night - consider night mode to save 30-40%',
        explanation: 'Heating/lighting at night is rarely needed and costs money. Enable night mode.',
        wastageEstimate: {
          energy: '30-40%',
          daily: `${(totalWaste * 0.35 / 1000).toFixed(2)} kWh`,
          weekly: `${(totalWaste * 0.35 / 1000 * 7).toFixed(2)} kWh`,
          cost: `$${(totalWaste * 0.35 / 1000 * 7 * 0.30).toFixed(2)}/week`,
        },
        suggestions: [
          'Enable Night Mode to reduce heating/lighting',
          'Turn off lights completely at night',
          'Reduce heating target by 5°C',
          'Set ventilation to minimum',
        ],
        action: 'Enable Night Mode',
      });
    }
  }

  return waste.filter(w => w.detected);
};

/**
 * Combined waste detection
 */
export const detectAllWaste = (areaData, sensorHistory = []) => {
  const waterWaste = detectWaterWaste(areaData, sensorHistory);
  const electricityWaste = detectElectricityWaste(areaData, sensorHistory);

  const allWaste = [...waterWaste, ...electricityWaste];

  // Sort by severity: critical > warning > info
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  allWaste.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    critical: allWaste.filter(w => w.severity === 'critical'),
    warnings: allWaste.filter(w => w.severity === 'warning'),
    notices: allWaste.filter(w => w.severity === 'info'),
    total: allWaste.length,
    allWaste,
  };
};

/**
 * Calculate potential savings from suggestions
 */
export const calculateSavingsPotential = (wasteItems) => {
  let totalWeeklySavings = 0;
  let totalMonthlySavings = 0;

  wasteItems.forEach(waste => {
    if (waste.wastageEstimate?.cost) {
      // Parse weekly cost
      const costMatch = waste.wastageEstimate.cost.match(/\$([0-9.]+)/);
      if (costMatch) {
        const weeklyCost = parseFloat(costMatch[1]);
        totalWeeklySavings += weeklyCost;
        totalMonthlySavings += weeklyCost * 4.3; // ~4.3 weeks per month
      }
    }
  });

  return {
    weeklySavings: Math.round(totalWeeklySavings * 100) / 100,
    monthlySavings: Math.round(totalMonthlySavings * 100) / 100,
    yearlySavings: Math.round(totalMonthlySavings * 12 * 100) / 100,
  };
};

/**
 * Get waste trends over time
 */
export const analyzeWasteTrends = (dailyWasteData) => {
  if (!dailyWasteData || dailyWasteData.length < 7) {
    return { trend: 'insufficient_data', message: 'Need 7+ days of data' };
  }

  const recentWeek = dailyWasteData.slice(-7);
  const previousWeek = dailyWasteData.slice(-14, -7);

  const recentCount = recentWeek.reduce((sum, d) => sum + d.total, 0);
  const previousCount = previousWeek.reduce((sum, d) => sum + d.total, 0);

  const trendPercent = ((recentCount - previousCount) / previousCount) * 100;

  return {
    trend: trendPercent < -10 ? 'improving' : trendPercent > 10 ? 'worsening' : 'stable',
    change: Math.round(trendPercent),
    recentAverage: Math.round(recentCount / 7),
    previousAverage: Math.round(previousCount / 7),
    message:
      trendPercent < -10
        ? '✅ Great! Waste is decreasing - keep up the good work!'
        : trendPercent > 10
          ? '⚠️ Waste is increasing - check for new issues'
          : '➡️ Waste is stable - continue current practices',
  };
};

/**
 * Priority action for highest impact savings
 */
export const getTopPriorityAction = (allWaste) => {
  if (!allWaste || allWaste.length === 0) {
    return null;
  }

  // Sort by potential savings
  const sorted = [...allWaste].sort((a, b) => {
    const aValue = parseFloat(a.wastageEstimate?.cost?.match(/\$([0-9.]+)/)?.[1] || 0);
    const bValue = parseFloat(b.wastageEstimate?.cost?.match(/\$([0-9.]+)/)?.[1] || 0);
    return bValue - aValue;
  });

  return {
    action: sorted[0].action,
    type: sorted[0].type,
    savings: sorted[0].wastageEstimate?.cost,
    explanation: sorted[0].message,
  };
};
