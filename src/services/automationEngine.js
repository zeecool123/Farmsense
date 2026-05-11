/**
 * Automation Engine
 * Manages automated agricultural tasks (watering, lighting, climate control)
 */

/**
 * Automation task model
 */
export const createAutomationTask = (areaId, taskType, config = {}) => {
  const timestamp = new Date().toISOString();

  const baseTask = {
    id: `task_${areaId}_${taskType}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    areaId,
    taskType, // 'watering', 'lighting', 'climate', 'nutrients'
    createdAt: timestamp,
    enabled: true,
    status: 'idle', // idle, scheduled, running, completed, failed
    lastRun: null,
    nextRun: null,
  };

  // Task-specific configurations
  const configs = {
    watering: {
      trigger: 'soil_moisture', // or 'schedule'
      threshold: config.threshold || 60, // Water when <60%
      duration: config.duration || 120, // seconds
      maxDaily: config.maxDaily || 3, // Max 3 times per day
      timeWindow: config.timeWindow || { start: '06:00', end: '20:00' },
    },
    lighting: {
      type: 'schedule', // or 'light_sensor'
      onTime: config.onTime || '06:00',
      offTime: config.offTime || '20:00',
      duration: 0, // calculated as hours between on/off
      intensity: config.intensity || 100, // 0-100%
    },
    climate: {
      targetTemp: config.targetTemp || 25,
      targetHumidity: config.targetHumidity || 70,
      tempTolerance: config.tempTolerance || 2, // ±2°C
      humidityTolerance: config.humidityTolerance || 5, // ±5%
      heaterMode: config.heaterMode || 'auto', // auto, manual, off
      coolerMode: config.coolerMode || 'auto',
      humidifierMode: config.humidifierMode || 'auto',
      ventilationMode: config.ventilationMode || 'auto',
    },
    nutrients: {
      trigger: 'schedule', // or 'ph_based'
      frequency: config.frequency || '7d', // Every 7 days
      amount: config.amount || 100, // ml
      concentration: config.concentration || 'standard',
      lastDelivery: null,
    },
  };

  return {
    ...baseTask,
    ...configs[taskType],
  };
};

/**
 * Predefined automation profiles for crops
 */
export const getAutomationProfile = (cropKey) => {
  const profiles = {
    tomato: [
      createAutomationTask('', 'watering', {
        threshold: 60,
        duration: 120,
        maxDaily: 2,
        timeWindow: { start: '06:00', end: '18:00' },
      }),
      createAutomationTask('', 'lighting', {
        onTime: '06:00',
        offTime: '20:00',
        intensity: 80,
      }),
      createAutomationTask('', 'climate', {
        targetTemp: 25,
        targetHumidity: 70,
        tempTolerance: 2,
        humidityTolerance: 5,
      }),
      createAutomationTask('', 'nutrients', {
        frequency: '7d',
        amount: 100,
      }),
    ],
    lettuce: [
      createAutomationTask('', 'watering', {
        threshold: 65,
        duration: 90,
        maxDaily: 2,
        timeWindow: { start: '05:00', end: '19:00' },
      }),
      createAutomationTask('', 'lighting', {
        onTime: '05:00',
        offTime: '19:00',
        intensity: 70,
      }),
      createAutomationTask('', 'climate', {
        targetTemp: 18,
        targetHumidity: 75,
        tempTolerance: 2,
        humidityTolerance: 5,
      }),
      createAutomationTask('', 'nutrients', {
        frequency: '5d',
        amount: 80,
      }),
    ],
    strawberry: [
      createAutomationTask('', 'watering', {
        threshold: 55,
        duration: 100,
        maxDaily: 3,
        timeWindow: { start: '06:00', end: '19:00' },
      }),
      createAutomationTask('', 'lighting', {
        onTime: '06:00',
        offTime: '18:00',
        intensity: 75,
      }),
      createAutomationTask('', 'climate', {
        targetTemp: 20,
        targetHumidity: 72,
        tempTolerance: 2,
        humidityTolerance: 5,
      }),
      createAutomationTask('', 'nutrients', {
        frequency: '7d',
        amount: 90,
      }),
    ],
  };

  return profiles[cropKey] || profiles.tomato; // Default to tomato profile
};

/**
 * Check if task should run based on current sensors and time
 */
export const shouldRunTask = (task, currentSensors, currentTime) => {
  if (!task.enabled) return false;

  const now = new Date(currentTime || Date.now());
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  switch (task.taskType) {
    case 'watering':
      // Check if within time window
      if (task.timeWindow) {
        const [startHour, startMin] = task.timeWindow.start.split(':').map(Number);
        const [endHour, endMin] = task.timeWindow.end.split(':').map(Number);
        const nowMins = now.getHours() * 60 + now.getMinutes();
        const startMins = startHour * 60 + startMin;
        const endMins = endHour * 60 + endMin;

        if (nowMins < startMins || nowMins > endMins) return false;
      }

      // Check soil moisture threshold
      if (currentSensors?.soilMoisture?.value !== undefined) {
        return currentSensors.soilMoisture.value < task.threshold;
      }
      return false;

    case 'lighting':
      // Check if current time is within lighting window
      const [onHour, onMin] = task.onTime.split(':').map(Number);
      const [offHour, offMin] = task.offTime.split(':').map(Number);
      const currentMins = now.getHours() * 60 + now.getMinutes();
      const onMins = onHour * 60 + onMin;
      const offMins = offHour * 60 + offMin;

      return currentMins >= onMins && currentMins < offMins;

    case 'climate':
      // Climate tasks run continuously, but return true if adjustments needed
      const tempOff = Math.abs((currentSensors?.temperature?.value || 20) - task.targetTemp);
      const humidityOff = Math.abs((currentSensors?.humidity?.value || 70) - task.targetHumidity);

      return tempOff > task.tempTolerance || humidityOff > task.humidityTolerance;

    case 'nutrients':
      // Check if it's time for nutrient delivery
      if (task.lastDelivery) {
        const lastDeliveryTime = new Date(task.lastDelivery);
        const daysSinceDelivery = (now - lastDeliveryTime) / (1000 * 60 * 60 * 24);
        const freqDays = parseInt(task.frequency);
        return daysSinceDelivery >= freqDays;
      }
      return true; // First time

    default:
      return false;
  }
};

/**
 * Execute automation task
 */
export const executeTask = (task, currentSensors) => {
  const execution = {
    taskId: task.id,
    taskType: task.taskType,
    executedAt: new Date().toISOString(),
    status: 'executed',
    action: null,
    expectedDuration: null,
    energyUsage: null,
    waterUsage: null,
  };

  switch (task.taskType) {
    case 'watering':
      execution.action = 'Start watering pump';
      execution.expectedDuration = task.duration; // seconds
      execution.waterUsage = (task.duration / 60) * 1.5; // liters (assuming 1.5L/min)
      execution.energyUsage = 45; // watts for pump
      break;

    case 'lighting':
      execution.action = `Turn on lights to ${task.intensity}% intensity`;
      execution.energyUsage = 800 * (task.intensity / 100); // watts
      break;

    case 'climate':
      // Determine what adjustments are needed
      const tempOff = (currentSensors?.temperature?.value || 20) - task.targetTemp;
      const humidityOff = (currentSensors?.humidity?.value || 70) - task.targetHumidity;

      const actions = [];
      if (tempOff > task.tempTolerance) {
        actions.push('Activate cooler/ventilation');
        execution.energyUsage = 150; // ventilation
      } else if (tempOff < -task.tempTolerance) {
        actions.push('Activate heater');
        execution.energyUsage = 1200; // heater
      }

      if (humidityOff < -task.humidityTolerance) {
        actions.push('Activate humidifier');
        execution.energyUsage = (execution.energyUsage || 0) + 200;
      } else if (humidityOff > task.humidityTolerance) {
        actions.push('Increase ventilation');
        execution.energyUsage = (execution.energyUsage || 0) + 100;
      }

      execution.action = actions.length > 0 ? actions.join('; ') : 'Conditions optimal - no action needed';
      break;

    case 'nutrients':
      execution.action = `Deliver ${task.amount}ml of ${task.concentration} nutrients`;
      execution.energyUsage = 20; // pump energy
      break;

    default:
      execution.status = 'failed';
      execution.action = 'Unknown task type';
  }

  return execution;
};

/**
 * Get today's scheduled tasks
 */
export const getTodaysTasks = (tasks, areaId = null) => {
  const filtered = areaId ? tasks.filter(t => t.areaId === areaId) : tasks;
  const today = new Date().toDateString();

  return filtered.map(task => ({
    ...task,
    scheduledTime: getNextTaskTime(task),
    isScheduledForToday: getNextTaskTime(task)?.toDateString() === today,
  }));
};

/**
 * Calculate next task execution time
 */
export const getNextTaskTime = (task) => {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  switch (task.taskType) {
    case 'watering':
      // Next watering time
      const [hour, min] = task.timeWindow.start.split(':').map(Number);
      const nextWatering = new Date();
      nextWatering.setHours(hour, min, 0);

      if (nextWatering < now) {
        nextWatering.setDate(nextWatering.getDate() + 1);
      }
      return nextWatering;

    case 'lighting':
      const [onHour, onMin] = task.onTime.split(':').map(Number);
      const nextLighting = new Date();
      nextLighting.setHours(onHour, onMin, 0);

      if (nextLighting < now) {
        nextLighting.setDate(nextLighting.getDate() + 1);
      }
      return nextLighting;

    case 'nutrients':
      const freqDays = parseInt(task.frequency);
      const nextNutrients = new Date(task.lastDelivery || now);
      nextNutrients.setDate(nextNutrients.getDate() + freqDays);
      return nextNutrients;

    default:
      return tomorrow;
  }
};

/**
 * Calculate total daily automation metrics
 */
export const calculateAutomationMetrics = (executions) => {
  return {
    totalTasks: executions.length,
    successfulTasks: executions.filter(e => e.status === 'executed').length,
    failedTasks: executions.filter(e => e.status === 'failed').length,
    totalWaterUsed: executions.reduce((sum, e) => sum + (e.waterUsage || 0), 0),
    totalEnergyUsed: executions.reduce((sum, e) => sum + (e.energyUsage || 0), 0) / 1000, // kWh
    taskDistribution: {
      watering: executions.filter(e => e.taskType === 'watering').length,
      lighting: executions.filter(e => e.taskType === 'lighting').length,
      climate: executions.filter(e => e.taskType === 'climate').length,
      nutrients: executions.filter(e => e.taskType === 'nutrients').length,
    },
  };
};

/**
 * Toggle task on/off
 */
export const toggleTask = (task, enabled) => {
  return {
    ...task,
    enabled,
    toggledAt: new Date().toISOString(),
  };
};

/**
 * Update task configuration
 */
export const updateTaskConfig = (task, newConfig) => {
  return {
    ...task,
    ...newConfig,
    updatedAt: new Date().toISOString(),
  };
};
