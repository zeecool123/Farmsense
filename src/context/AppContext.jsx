import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { SensorSimulatorRegistry, generateSensorData } from '../services/sensorSimulator';
import { calculateAIScore } from '../utils/helpers';
import { CROP_PROFILES } from '../utils/constants';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [trays, setTrays] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [sensorData, setSensorData] = useState({});
  const [aiScores, setAiScores] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useSimulator, setUseSimulator] = useState(true); // Toggle for Firebase vs Simulator

  // Initialize trays with simulator
  useEffect(() => {
    const initializeSensors = async () => {
      setLoading(true);
      // Create simulators for demo trays
      const trayIds = ['A', 'B', 'C', 'D', 'E', 'F'];
      const cropKeys = Object.keys(CROP_PROFILES);

      trayIds.forEach((id, index) => {
        const cropKey = cropKeys[index % cropKeys.length];
        const crop = CROP_PROFILES[cropKey];
        
        // Initialize tray
        setTrays((prev) => ({
          ...prev,
          [id]: {
            id,
            crop,
            cropKey,
            status: 'online',
            createdAt: new Date(),
          },
        }));

        // Create and start sensor simulator
        if (useSimulator) {
          const simulator = SensorSimulatorRegistry.create(id, cropKey, 5000);
          simulator.start();

          // Subscribe to sensor updates
          simulator.subscribe((data) => {
            setSensorData((prev) => ({
              ...prev,
              [id]: { ...data, timestamp: new Date() },
            }));

            // Calculate AI score
            if (crop && data) {
              const score = calculateAIScore(data, crop);
              setAiScores((prev) => ({
                ...prev,
                [id]: score,
              }));

              // Check for anomalies and create alerts
              checkForAnomalies(id, crop, data, score);
            }
          });
        }
      });

      setLoading(false);
    };

    initializeSensors();

    return () => {
      SensorSimulatorRegistry.stopAll();
    };
  }, [useSimulator]);

  // Check for anomalies and generate alerts
  const checkForAnomalies = useCallback((trayId, crop, sensorData, aiScore) => {
    const alerts_to_add = [];

    // Temperature anomaly
    if (sensorData.temperature < crop.optimalTemp.min - 2 || sensorData.temperature > crop.optimalTemp.max + 2) {
      alerts_to_add.push({
        trayId,
        severity: 'warning',
        title: '🌡️ Temperature Alert',
        message: `Temperature is ${sensorData.temperature}°C (optimal: ${crop.optimalTemp.min}-${crop.optimalTemp.max}°C)`,
      });
    }

    // Humidity anomaly
    if (sensorData.humidity < crop.optimalHumidity.min - 5 || sensorData.humidity > crop.optimalHumidity.max + 5) {
      alerts_to_add.push({
        trayId,
        severity: 'warning',
        title: '💧 Humidity Alert',
        message: `Humidity is ${sensorData.humidity}% (optimal: ${crop.optimalHumidity.min}-${crop.optimalHumidity.max}%)`,
      });
    }

    // pH anomaly
    if (sensorData.ph < crop.optimalPH.min - 0.3 || sensorData.ph > crop.optimalPH.max + 0.3) {
      alerts_to_add.push({
        trayId,
        severity: 'warning',
        title: '⚗️ pH Alert',
        message: `pH level is ${sensorData.ph} (optimal: ${crop.optimalPH.min}-${crop.optimalPH.max})`,
      });
    }

    // Perfect match - replicate conditions
    if (aiScore >= 95) {
      alerts_to_add.push({
        trayId,
        severity: 'info',
        title: '✨ Perfect Match',
        message: `Tray ${trayId} has reached perfect conditions! Replicating parameters.`,
      });
    }

    // Add unique alerts
    alerts_to_add.forEach((alert) => {
      const exists = alerts.some(
        (a) => a.trayId === alert.trayId && a.title === alert.title
      );
      if (!exists) {
        addAlert(alert);
      }
    });
  }, [alerts]);

  // Add or update a tray
  const updateTray = useCallback((trayId, trayData) => {
    setTrays((prev) => ({
      ...prev,
      [trayId]: { ...prev[trayId], ...trayData },
    }));
  }, []);

  // Add alert
  const addAlert = useCallback((alert) => {
    const id = Date.now();
    const newAlert = { ...alert, id };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 50)); // Keep last 50 alerts
    
    // Auto-dismiss after 30 seconds if not critical
    if (alert.severity !== 'critical') {
      setTimeout(() => {
        clearAlert(id);
      }, 30000);
    }
    
    return id;
  }, []);

  // Clear alert
  const clearAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  // Update sensor data for a tray
  const updateSensorData = useCallback((trayId, data) => {
    setSensorData((prev) => ({
      ...prev,
      [trayId]: {
        ...prev[trayId],
        ...data,
        timestamp: new Date(),
      },
    }));
  }, []);

  // Trigger control action
  const triggerControl = useCallback((trayId, controlType, action) => {
    console.log(`Control: ${controlType} -> ${action} on Tray ${trayId}`);
    addAlert({
      trayId,
      severity: 'info',
      title: `🎛️ ${controlType.toUpperCase()} Control`,
      message: `${controlType} system has been ${action}`,
    });
  }, [addAlert]);

  // Simulate anomaly (for testing)
  const simulateAnomaly = useCallback((trayId, type = 'temperature') => {
    const simulator = SensorSimulatorRegistry.get(trayId);
    if (simulator) {
      simulator.simulateAnomaly(type, 'high');
    }
  }, []);

  // Reset anomaly (for testing)
  const resetAnomaly = useCallback((trayId) => {
    const simulator = SensorSimulatorRegistry.get(trayId);
    if (simulator) {
      simulator.resetAnomaly();
    }
  }, []);

  const value = {
    trays,
    setTrays,
    updateTray,
    alerts,
    addAlert,
    clearAlert,
    sensorData,
    updateSensorData,
    aiScores,
    currentUser,
    setCurrentUser,
    loading,
    setLoading,
    triggerControl,
    simulateAnomaly,
    resetAnomaly,
    useSimulator,
    setUseSimulator,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

