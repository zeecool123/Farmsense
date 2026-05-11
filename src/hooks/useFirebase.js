import { useState, useEffect, useCallback } from 'react';
import { SensorSimulatorRegistry, generateSensorData } from '../services/sensorSimulator';
import { calculateAIScore } from '../utils/helpers';

/**
 * Hook for real-time sensor data with simulator support
 */
export const useSensorData = (areaId, cropKey, useSimulator = true) => {
  const [sensorData, setSensorData] = useState(null);
  const [aiScore, setAiScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!areaId || !cropKey) {
      setLoading(false);
      return;
    }

    let unsubscribe;

    if (useSimulator) {
      // Use local simulator
      const simulator = SensorSimulatorRegistry.create(areaId, cropKey, 5000);
      simulator.start();

      unsubscribe = simulator.subscribe((data) => {
        setSensorData(data);
        setLoading(false);

        // Calculate AI score
        const crop = require('../utils/constants').CROP_PROFILES[cropKey];
        if (crop && data) {
          const score = calculateAIScore(data, crop);
          setAiScore(score);
        }
      });

      return () => {
        unsubscribe();
        simulator.stop();
      };
    } else {
      // Would connect to Firebase here
      setLoading(false);
    }
  }, [areaId, cropKey, useSimulator]);

  return { sensorData, aiScore, loading };
};

/**
 * Hook for managing area data
 */
export const useAreaData = (areaId) => {
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading area data
    const mockArea = {
      id: areaId,
      name: `Area ${areaId}`,
      status: 'online',
      lastUpdated: new Date(),
    };
    setArea(mockArea);
    setLoading(false);
  }, [areaId]);

  return { area, loading, error };
};

/**
 * Hook for control operations
 */
export const useControl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerControl = useCallback(async (areaId, controlType, action, duration = null) => {
    setLoading(true);
    try {
      // Simulate control trigger
      console.log(`Triggering ${controlType} control on Area ${areaId}: ${action}`);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err);
      setLoading(false);
      return false;
    }
  }, []);

  return { triggerControl, loading, error };
};

/**
 * Hook for alerts
 */
export const useAlerts = (userId) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading alerts
    setAlerts([]);
    setLoading(false);
  }, [userId]);

  const addAlert = useCallback((alert) => {
    const newAlert = {
      id: Date.now(),
      timestamp: new Date(),
      ...alert,
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
    return newAlert.id;
  }, []);

  const removeAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  return { alerts, loading, addAlert, removeAlert };
};
