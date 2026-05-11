/**
 * Resource Context
 * Manages state for resource tracking (water, electricity, costs)
 */

import { createContext, useContext, useState, useCallback } from 'react';

const ResourceContext = createContext();

export const useResources = () => {
  const context = useContext(ResourceContext);
  if (!context) {
    throw new Error('useResources must be used within ResourceProvider');
  }
  return context;
};

export const ResourceProvider = ({ children }) => {
  const [resourceData, setResourceData] = useState({
    water: {
      today: 0,
      week: 0,
      month: 0,
      efficiency: 50,
      target: 240, // liters/day
      unit: 'liters',
      cost: 0.0075, // $ per liter
    },
    electricity: {
      today: 0,
      week: 0,
      month: 0,
      efficiency: 50,
      target: 12, // kWh/day
      unit: 'kWh',
      cost: 0.30, // $ per kWh
    },
  });

  const createInitialDailyMetrics = () => {
    const metrics = [];
    const baseWater = 220;
    const baseEnergy = 9;

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const water = Math.max(1, Math.round(baseWater + (Math.random() - 0.5) * 40));
      const energy = Math.max(0.5, Math.round(baseEnergy + (Math.random() - 0.5) * 2));
      const waterCost = Math.round(water * resourceData.water.cost * 100) / 100;
      const energyCost = Math.round(energy * resourceData.electricity.cost * 100) / 100;

      metrics.push({
        date: date.toISOString().split('T')[0],
        water,
        waterCost,
        energy,
        energyCost,
        totalCost: Math.round((waterCost + energyCost) * 100) / 100,
        cropsHarvested: 0,
        timestamp: date.toISOString(),
      });
    }

    return metrics;
  };

  const [dailyMetrics, setDailyMetrics] = useState(createInitialDailyMetrics); // Historical daily data
  const [resourceAlerts, setResourceAlerts] = useState([]);
  const [optimizationSettings, setOptimizationSettings] = useState({
    waterTarget: 240,
    energyTarget: 12,
    costOptimization: true,
    yieldOptimization: true,
  });

  // Update resource data
  const updateResourceData = useCallback((type, data) => {
    setResourceData(prev => ({
      ...prev,
      [type]: { ...prev[type], ...data },
    }));
  }, []);

  // Add daily metric
  const addDailyMetric = useCallback((date, waterUsed, energyUsed, cropsHarvested = 0) => {
    const waterCost = waterUsed * resourceData.water.cost;
    const energyCost = energyUsed * resourceData.electricity.cost;

    setDailyMetrics(prev => [
      ...prev,
      {
        date,
        water: waterUsed,
        waterCost,
        energy: energyUsed,
        energyCost,
        totalCost: waterCost + energyCost,
        cropsHarvested,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [resourceData.water.cost, resourceData.electricity.cost]);

  // Get resource trends
  const getResourceTrends = useCallback((days = 7) => {
    const recent = dailyMetrics.slice(-days);

    if (recent.length === 0) {
      const defaultCost =
        Math.round(
          (resourceData.water.target * resourceData.water.cost + resourceData.electricity.target * resourceData.electricity.cost) * 100
        ) / 100;
      return {
        water: resourceData.water.target,
        electricity: resourceData.electricity.target,
        cost: defaultCost,
        period: `${days}d`,
        dataPoints: [],
      };
    }

    const totalWater = recent.reduce((sum, m) => sum + m.water, 0);
    const totalEnergy = recent.reduce((sum, m) => sum + m.energy, 0);
    const totalCost = recent.reduce((sum, m) => sum + m.totalCost, 0);

    return {
      water: Math.round((totalWater / days) * 10) / 10,
      electricity: Math.round((totalEnergy / days) * 10) / 10,
      cost: Math.round((totalCost / days) * 100) / 100,
      period: `${days}d`,
      dataPoints: recent,
    };
  }, [dailyMetrics, resourceData]);

  // Get efficiency scores
  const getEfficiencyScores = useCallback(() => {
    const recent = getResourceTrends(7);

    const waterEfficiency = Math.max(
      0,
      Math.min(100, 100 - ((recent.water - optimizationSettings.waterTarget) / optimizationSettings.waterTarget) * 50)
    );

    const energyEfficiency = Math.max(
      0,
      Math.min(100, 100 - ((recent.electricity - optimizationSettings.energyTarget) / optimizationSettings.energyTarget) * 50)
    );

    const overall = (waterEfficiency + energyEfficiency) / 2;

    return {
      water: Math.round(waterEfficiency),
      electricity: Math.round(energyEfficiency),
      overall: Math.round(overall),
    };
  }, [getResourceTrends, optimizationSettings]);

  // Get potential savings
  const getPotentialSavings = useCallback(() => {
    const trends = getResourceTrends(30);

    // If usage is 20% above target
    const waterWaste = Math.max(0, trends.water - optimizationSettings.waterTarget);
    const energyWaste = Math.max(0, trends.electricity - optimizationSettings.energyTarget);

    const potentialWaterSavings = waterWaste * 30 * resourceData.water.cost;
    const potentialEnergySavings = energyWaste * 30 * resourceData.electricity.cost;
    const totalPotentialSavings = potentialWaterSavings + potentialEnergySavings;

    return {
      water: Math.round(potentialWaterSavings * 100) / 100,
      electricity: Math.round(potentialEnergySavings * 100) / 100,
      total: Math.round(totalPotentialSavings * 100) / 100,
      percentageImprovement: trends.water > 0 ? Math.round((waterWaste / trends.water) * 100) : 0,
    };
  }, [getResourceTrends, optimizationSettings, resourceData]);

  // Add resource alert
  const addResourceAlert = useCallback((alert) => {
    setResourceAlerts(prev => [...prev, { ...alert, id: `alert_${Date.now()}`, timestamp: new Date().toISOString() }]);
  }, []);

  // Clear old alerts
  const clearOldAlerts = useCallback((days = 7) => {
    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    setResourceAlerts(prev => prev.filter(a => new Date(a.timestamp).getTime() > cutoffTime));
  }, []);

  // Update optimization settings
  const updateOptimizationSettings = useCallback((settings) => {
    setOptimizationSettings(prev => ({ ...prev, ...settings }));
  }, []);

  // Get cost breakdown
  const getCostBreakdown = useCallback((period = 'month') => {
    const days = period === 'month' ? 30 : period === 'week' ? 7 : 1;
    const trends = getResourceTrends(days);

    return {
      water: Math.round(trends.water * days * resourceData.water.cost * 100) / 100,
      electricity: Math.round(trends.electricity * days * resourceData.electricity.cost * 100) / 100,
      total: Math.round((trends.water * days * resourceData.water.cost + trends.electricity * days * resourceData.electricity.cost) * 100) / 100,
      period,
    };
  }, [getResourceTrends, resourceData]);

  const value = {
    resourceData,
    dailyMetrics,
    resourceAlerts,
    optimizationSettings,
    updateResourceData,
    addDailyMetric,
    getResourceTrends,
    getEfficiencyScores,
    getPotentialSavings,
    addResourceAlert,
    clearOldAlerts,
    updateOptimizationSettings,
    getCostBreakdown,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
};
