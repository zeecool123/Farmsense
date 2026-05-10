/**
 * Hook for fetching and managing tray data
 */
import { useState, useEffect } from 'react';

export const useTray = (trayId) => {
  const [tray, setTray] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mockTray = {
      id: trayId,
      name: `Tray ${trayId}`,
      status: 'online',
      lastUpdated: new Date().toISOString(),
      crop: null,
    };

    setTray(mockTray);
    setLoading(false);
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
    setLoading(false);
  }, [trayId]);

  return { sensorData, loading };
};
