/**
 * Hook for fetching and managing tray data
 */
import { useState, useEffect } from 'react';
import { getTrayData } from '../services/firebaseService';

export const useTray = (trayId) => {
  const [tray, setTray] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTray = async () => {
      try {
        const data = await getTrayData(trayId);
        setTray(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTray();
  }, [trayId]);

  return { tray, loading, error };
};

/**
 * Hook for real-time sensor data
 */
export const useSensorData = (trayId) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This would subscribe to real-time updates
    // subscribeSensorData(trayId, setSensorData);
    setLoading(false);
  }, [trayId]);

  return { sensorData, loading };
};
