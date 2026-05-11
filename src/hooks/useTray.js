/**
 * Hook for fetching and managing area data
 */
import { useState, useEffect } from 'react';

export const useArea = (areaId) => {
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const mockArea = {
      id: areaId,
      name: `Area ${areaId}`,
      status: 'online',
      lastUpdated: new Date().toISOString(),
      crop: null,
    };

    setArea(mockArea);
    setLoading(false);
  }, [areaId]);

  return { area, loading, error };
};

/**
 * Hook for real-time sensor data
 */
export const useSensorData = (areaId) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [areaId]);

  return { sensorData, loading };
};
