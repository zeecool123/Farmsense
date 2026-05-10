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
  const [sensorHistory, setSensorHistory] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useSimulator, setUseSimulator] = useState(true); 
  const MAX_HISTORY_LENGTH = 60;

  useEffect(() => {
    const initializeSensors = async () => {
      setLoading(true);
      const trayIds = ['A', 'B', 'C', 'D', 'E', 'F'];
      const cropKeys = Object.keys(CROP_PROFILES);

      trayIds.forEach((id, index) => {
        const cropKey = cropKeys[index % cropKeys.length];
        const crop = CROP_PROFILES[cropKey];
        
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

        if (useSimulator) {
          const simulator = SensorSimulatorRegistry.create(id, cropKey, 5000);
          simulator.start();

          simulator.subscribe((data) => {
            const timestamp = new Date();
            setSensorData((prev) => ({
              ...prev,
              [id]: { ...data, timestamp },
            }));

            if (crop && data) {
              const score = calculateAIScore(data, crop);
              setAiScores((prev) => ({
                ...prev,
                [id]: score,
              }));

              addSensorHistory(id, { ...data, timestamp, aiScore: score });
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

  const checkForAnomalies = useCallback((trayId, crop, sensorData, aiScore) => {
    const alerts_to_add = [];

    if (sensorData.temperature < crop.optimalTemp.min - 2 || sensorData.temperature > crop.optimalTemp.max + 2) {
      alerts_to_add.push({
        trayId,
        severity: 'warning',
        title: '🌡️ Temperature Alert',
        message: `Temperature is ${sensorData.temperature}°C (optimal: ${crop.optimalTemp.min}-${crop.optimalTemp.max}°C)`,
      });
    }

    if (sensorData.humidity < crop.optimalHumidity.min - 5 || sensorData.humidity > crop.optimalHumidity.max + 5) {
      alerts_to_add.push({
        trayId,
        severity: 'warning',
        title: '💧 Humidity Alert',
        message: `Humidity is ${sensorData.humidity}% (optimal: ${crop.optimalHumidity.min}-${crop.optimalHumidity.max}%)`,
      });
    }

    if (sensorData.ph < crop.optimalPH.min - 0.3 || sensorData.ph > crop.optimalPH.max + 0.3) {
      alerts_to_add.push({
        trayId,
        severity: 'warning',
        title: '⚗️ pH Alert',
        message: `pH level is ${sensorData.ph} (optimal: ${crop.optimalPH.min}-${crop.optimalPH.max})`,
      });
    }

    if (aiScore >= 95) {
      alerts_to_add.push({
        trayId,
        severity: 'info',
        title: '✨ Perfect Match',
        message: `Tray ${trayId} has reached perfect conditions! Replicating parameters.`,
      });
    }

    alerts_to_add.forEach((alert) => {
      const exists = alerts.some(
        (a) => a.trayId === alert.trayId && a.title === alert.title
      );
      if (!exists) {
        addAlert(alert);
      }
    });
  }, [alerts]);

  const addSensorHistory = useCallback((trayId, entry) => {
    setSensorHistory((prev) => {
      const history = prev[trayId] ? [...prev[trayId]] : [];
      history.push(entry);
      if (history.length > MAX_HISTORY_LENGTH) history.shift();
      return { ...prev, [trayId]: history };
    });
  }, []);

  const updateTray = useCallback((trayId, trayData) => {
    setTrays((prev) => ({
      ...prev,
      [trayId]: { ...prev[trayId], ...trayData },
    }));
  }, []);

  // FIXED: Using a random string combined with Date.now() to ensure absolutely unique keys
  const addAlert = useCallback((alert) => {
    const id = Date.now().toString() + '_' + Math.random().toString(36).substring(2, 9);
    const newAlert = { ...alert, id };
    
    setAlerts((prev) => [newAlert, ...prev].slice(0, 50)); 
    
    if (alert.severity !== 'critical') {
      setTimeout(() => {
        clearAlert(id);
      }, 30000);
    }
    
    return id;
  }, []);

  const clearAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const updateSensorData = useCallback((trayId, data) => {
    const timestamp = new Date();
    const entry = { ...data, timestamp, aiScore: aiScores[trayId] || 0 };

    setSensorData((prev) => ({
      ...prev,
      [trayId]: {
        ...prev[trayId],
        ...data,
        timestamp,
      },
    }));

    setSensorHistory((prev) => {
      const history = prev[trayId] ? [...prev[trayId]] : [];
      history.push(entry);
      if (history.length > MAX_HISTORY_LENGTH) history.shift();
      return { ...prev, [trayId]: history };
    });
  }, [aiScores]);

  const triggerControl = useCallback((trayId, controlType, action) => {
    console.log(`Control: ${controlType} -> ${action} on Tray ${trayId}`);
    addAlert({
      trayId,
      severity: 'info',
      title: `🎛️ ${controlType.toUpperCase()} Control`,
      message: `${controlType} system has been ${action}`,
    });
  }, [addAlert]);

  const simulateAnomaly = useCallback((trayId, type = 'temperature') => {
    const simulator = SensorSimulatorRegistry.get(trayId);
    if (simulator) {
      simulator.simulateAnomaly(type, 'high');
    }
  }, []);

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
    sensorHistory,
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