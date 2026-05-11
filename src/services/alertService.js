/**
 * Alert Service
 * Manages smart alerts with severity levels, grouping, and prioritization
 */

/**
 * Alert severity levels
 */
export const ALERT_SEVERITY = {
  CRITICAL: 'critical', // Immediate action needed
  WARNING: 'warning', // Should fix today
  INFO: 'info', // FYI
};

/**
 * Alert types
 */
export const ALERT_TYPES = {
  // System alerts
  SYSTEM_ERROR: 'system_error',
  SENSOR_OFFLINE: 'sensor_offline',
  DEVICE_FAILURE: 'device_failure',

  // Water alerts
  LOW_WATER_LEVEL: 'low_water_level',
  OVERWATERING: 'overwatering',
  UNDERWATERING: 'underwatering',
  WATER_LEAK: 'water_leak',

  // Energy alerts
  HIGH_ENERGY_USE: 'high_energy_use',
  EQUIPMENT_OVERUSE: 'equipment_overuse',

  // Crop health alerts
  LOW_HEALTH_SCORE: 'low_health_score',
  DISEASE_RISK: 'disease_risk',
  PEST_RISK: 'pest_risk',

  // Environmental alerts
  TEMPERATURE_OUT_OF_RANGE: 'temperature_out_of_range',
  HUMIDITY_OUT_OF_RANGE: 'humidity_out_of_range',
  PH_OUT_OF_RANGE: 'ph_out_of_range',

  // Maintenance alerts
  MAINTENANCE_DUE: 'maintenance_due',
  FILTER_NEEDS_CLEANING: 'filter_needs_cleaning',
};

/**
 * Create an alert
 */
export const createAlert = (type, areaId, config = {}) => {
  return {
    id: `alert_${areaId}_${type}_${Date.now()}`,
    type,
    areaId,
    severity: config.severity || ALERT_SEVERITY.WARNING,
    title: config.title || type.replace(/_/g, ' '),
    message: config.message || '',
    description: config.description || '',
    suggestedActions: config.suggestedActions || [],
    createdAt: new Date().toISOString(),
    resolvedAt: null,
    acknowledged: false,
    dismissed: false,
    priority: config.priority || 5,
    data: config.data || {},
  };
};

/**
 * Group similar alerts
 */
export const groupAlerts = (alerts) => {
  const grouped = {
    [ALERT_SEVERITY.CRITICAL]: [],
    [ALERT_SEVERITY.WARNING]: [],
    [ALERT_SEVERITY.INFO]: [],
  };

  alerts.forEach(alert => {
    if (!alert.dismissed && !alert.resolvedAt) {
      const severity = alert.severity || ALERT_SEVERITY.INFO;
      grouped[severity].push(alert);
    }
  });

  return grouped;
};

/**
 * Prioritize alerts for display
 */
export const prioritizeAlerts = (alerts, limit = 10) => {
  const filtered = alerts.filter(a => !a.dismissed && !a.resolvedAt);

  // Sort by severity, then by priority, then by creation date
  filtered.sort((a, b) => {
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const aSevere = severityOrder[a.severity] || 2;
    const bSevere = severityOrder[b.severity] || 2;

    if (aSevere !== bSevere) return aSevere - bSevere;

    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return bTime - aTime; // Newest first
  });

  return filtered.slice(0, limit);
};

/**
 * Acknowledge alert (user sees it but doesn't dismiss)
 */
export const acknowledgeAlert = (alert) => {
  return {
    ...alert,
    acknowledged: true,
    acknowledgedAt: new Date().toISOString(),
  };
};

/**
 * Dismiss alert (user doesn't want to see it)
 */
export const dismissAlert = (alert) => {
  return {
    ...alert,
    dismissed: true,
    dismissedAt: new Date().toISOString(),
  };
};

/**
 * Resolve alert (issue was fixed)
 */
export const resolveAlert = (alert, resolution = {}) => {
  return {
    ...alert,
    resolvedAt: new Date().toISOString(),
    resolved: true,
    resolution: {
      method: resolution.method || 'auto_resolved',
      details: resolution.details || '',
    },
  };
};

/**
 * Generate alerts from sensor data
 */
export const generateSensorAlerts = (areaId, sensorData, optimalRanges) => {
  const alerts = [];

  if (!sensorData || !optimalRanges) return alerts;

  // Temperature alert
  if (sensorData.temperature && optimalRanges.optimalTemp) {
    const temp = sensorData.temperature.value;
    const { min, max } = optimalRanges.optimalTemp;

    if (temp < min - 2) {
      alerts.push(
        createAlert(ALERT_TYPES.TEMPERATURE_OUT_OF_RANGE, areaId, {
          severity: ALERT_SEVERITY.WARNING,
          title: 'Temperature Too Low',
          message: `Temperature is ${temp}°C, below ideal range (${min}-${max}°C)`,
          description: 'Plants are not getting enough warmth. Growth may slow down.',
          suggestedActions: [
            'Check heater is on',
            'Improve insulation',
            'Close any ventilation',
            'Move heat source closer',
          ],
          data: { current: temp, min, max },
        })
      );
    } else if (temp > max + 2) {
      alerts.push(
        createAlert(ALERT_TYPES.TEMPERATURE_OUT_OF_RANGE, areaId, {
          severity: ALERT_SEVERITY.WARNING,
          title: 'Temperature Too High',
          message: `Temperature is ${temp}°C, above ideal range (${min}-${max}°C)`,
          description: 'Plants are getting too hot. May cause stress and wilting.',
          suggestedActions: ['Open ventilation', 'Turn on fans', 'Turn off heater', 'Close windows if sunny'],
          data: { current: temp, min, max },
        })
      );
    }
  }

  // Humidity alert
  if (sensorData.humidity && optimalRanges.optimalHumidity) {
    const humidity = sensorData.humidity.value;
    const { min, max } = optimalRanges.optimalHumidity;

    if (humidity < min - 5) {
      alerts.push(
        createAlert(ALERT_TYPES.HUMIDITY_OUT_OF_RANGE, areaId, {
          severity: ALERT_SEVERITY.INFO,
          title: 'Humidity Too Low',
          message: `Humidity is ${humidity}%, below ideal range (${min}-${max}%)`,
          description: 'Air is too dry. Leaves may wilt or have brown edges.',
          suggestedActions: ['Turn on humidifier', 'Mist plants', 'Reduce ventilation', 'Add water trays'],
          data: { current: humidity, min, max },
        })
      );
    } else if (humidity > max + 5) {
      alerts.push(
        createAlert(ALERT_TYPES.HUMIDITY_OUT_OF_RANGE, areaId, {
          severity: ALERT_SEVERITY.INFO,
          title: 'Humidity Too High',
          message: `Humidity is ${humidity}%, above ideal range (${min}-${max}%)`,
          description: 'Air is too wet. Risk of mold and fungal diseases.',
          suggestedActions: [
            'Turn on fans/ventilation',
            'Reduce misting',
            'Open windows if outside humidity is lower',
          ],
          data: { current: humidity, min, max },
        })
      );
    }
  }

  // pH alert
  if (sensorData.ph && optimalRanges.optimalPH) {
    const ph = sensorData.ph.value;
    const { min, max } = optimalRanges.optimalPH;

    if (ph < min - 0.5) {
      alerts.push(
        createAlert(ALERT_TYPES.PH_OUT_OF_RANGE, areaId, {
          severity: ALERT_SEVERITY.WARNING,
          title: 'pH Too Acidic',
          message: `pH is ${ph}, below ideal range (${min}-${max})`,
          description: 'Nutrient availability is reduced. Plants may show nutrient deficiency.',
          suggestedActions: [
            'Add pH buffer (baking soda)',
            'Replace portion of nutrient solution',
            'Check nutrient source',
          ],
          data: { current: ph, min, max },
        })
      );
    } else if (ph > max + 0.5) {
      alerts.push(
        createAlert(ALERT_TYPES.PH_OUT_OF_RANGE, areaId, {
          severity: ALERT_SEVERITY.WARNING,
          title: 'pH Too Alkaline',
          message: `pH is ${ph}, above ideal range (${min}-${max})`,
          description: 'Nutrients are locked up and unavailable. Plants may show deficiency symptoms.',
          suggestedActions: [
            'Add pH down (citric acid)',
            'Partial water change with lower pH water',
            'Check water source pH',
          ],
          data: { current: ph, min, max },
        })
      );
    }
  }

  return alerts;
};

/**
 * Get alert summary for dashboard
 */
export const getAlertSummary = (alerts) => {
  const grouped = groupAlerts(alerts);

  return {
    criticalCount: grouped.critical.length,
    warningCount: grouped.warning.length,
    infoCount: grouped.info.length,
    totalUnresolved: grouped.critical.length + grouped.warning.length + grouped.info.length,
    topAlerts: prioritizeAlerts(alerts, 5),
  };
};

/**
 * Generate maintenance alert
 */
export const createMaintenanceAlert = (areaId, equipment, daysUntilDue) => {
  return createAlert(ALERT_TYPES.MAINTENANCE_DUE, areaId, {
    severity: daysUntilDue < 3 ? ALERT_SEVERITY.WARNING : ALERT_SEVERITY.INFO,
    title: `${equipment} Maintenance Due`,
    message: `${equipment} maintenance is due in ${daysUntilDue} days`,
    description: `Schedule maintenance to keep equipment running efficiently.`,
    suggestedActions: [
      `Schedule ${equipment} cleaning/replacement`,
      `Contact maintenance provider`,
      `Set calendar reminder`,
    ],
  });
};

/**
 * Mark alert as auto-resolved after fix
 */
export const autoResolveAlert = (alert, duration = 300000) => {
  // Auto-resolve after 5 minutes if condition is no longer met
  return {
    ...alert,
    autoResolveIn: duration,
    canAutoResolve: true,
  };
};

/**
 * Get alert statistics
 */
export const getAlertStatistics = (alerts, period = '7d') => {
  const now = new Date();
  const periodMs =
    period === '7d'
      ? 7 * 24 * 60 * 60 * 1000
      : period === '30d'
        ? 30 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000;

  const recentAlerts = alerts.filter(a => new Date(a.createdAt).getTime() > now.getTime() - periodMs);

  const byType = {};
  const bySeverity = { critical: 0, warning: 0, info: 0 };

  recentAlerts.forEach(alert => {
    byType[alert.type] = (byType[alert.type] || 0) + 1;
    bySeverity[alert.severity]++;
  });

  return {
    period,
    totalAlerts: recentAlerts.length,
    byType,
    bySeverity,
    resolved: recentAlerts.filter(a => a.resolvedAt).length,
    avgResolutionTime: calculateAvgResolutionTime(recentAlerts),
  };
};

/**
 * Calculate average resolution time
 */
const calculateAvgResolutionTime = (alerts) => {
  const resolved = alerts.filter(a => a.resolvedAt);
  if (resolved.length === 0) return null;

  const times = resolved.map(a => {
    const created = new Date(a.createdAt).getTime();
    const resolved = new Date(a.resolvedAt).getTime();
    return resolved - created;
  });

  const avgMs = times.reduce((a, b) => a + b) / times.length;
  return Math.round(avgMs / (60 * 1000)); // minutes
};
