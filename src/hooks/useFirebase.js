import { useState, useEffect, useCallback } from 'react';
import { SensorSimulatorRegistry, generateSensorData } from '../services/sensorSimulator';
import { calculateAIScore } from '../utils/helpers';

/**
 * Hook for real-time sensor data with simulator support
 */
export const useSensorData = (trayId, cropKey, useSimulator = true) => {
  const [sensorData, setSensorData] = useState(null);
  const [aiScore, setAiScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!trayId || !cropKey) {
      setLoading(false);
      return;
    }

    let unsubscribe;

    if (useSimulator) {
      // Use local simulator
      const simulator = SensorSimulatorRegistry.create(trayId, cropKey, 5000);
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
  }, [trayId, cropKey, useSimulator]);

  return { sensorData, aiScore, loading };
};

/**
 * Hook for managing tray data
 */
export const useTrayData = (trayId) => {
  const [tray, setTray] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate loading tray data
    const mockTray = {
      id: trayId,
      name: `Tray ${trayId}`,
      status: 'online',
      lastUpdated: new Date(),
    };
    setTray(mockTray);
    setLoading(false);
  }, [trayId]);

  return { tray, loading, error };
};

/**
 * Hook for control operations
 */
export const useControl = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const triggerControl = useCallback(async (trayId, controlType, action, duration = null) => {
    setLoading(true);
    try {
      // Simulate control trigger
      console.log(`Triggering ${controlType} control on Tray ${trayId}: ${action}`);
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
