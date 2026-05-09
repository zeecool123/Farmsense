import { db, rtdb } from '../config/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { ref, onValue, set, push, remove } from 'firebase/database';

/**
 * Firestore Operations - Tray Management
 */

export const getAllTrays = async (userId) => {
  try {
    const q = query(collection(db, 'trays'), where('userId', '==', userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching trays:', error);
    throw error;
  }
};

export const getTrayData = async (trayId) => {
  try {
    const docRef = doc(db, 'trays', trayId);
    // Placeholder for actual Firestore get
    console.log('Fetching tray:', trayId);
    return null;
  } catch (error) {
    console.error('Error fetching tray data:', error);
    throw error;
  }
};

export const createTray = async (userId, trayData) => {
  try {
    const docRef = await addDoc(collection(db, 'trays'), {
      ...trayData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating tray:', error);
    throw error;
  }
};

export const updateTrayData = async (trayId, data) => {
  try {
    const docRef = doc(db, 'trays', trayId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('Tray updated:', trayId, data);
  } catch (error) {
    console.error('Error updating tray:', error);
    throw error;
  }
};

/**
 * Real-time Database Operations - Sensor Data
 */

export const subscribeSensorData = (trayId, callback) => {
  try {
    const sensorRef = ref(rtdb, `trays/${trayId}/sensors`);
    const unsubscribe = onValue(sensorRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    }, (error) => {
      console.error('Error subscribing to sensor data:', error);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up sensor subscription:', error);
  }
};

export const publishSensorData = async (trayId, sensorData) => {
  try {
    const sensorRef = ref(rtdb, `trays/${trayId}/sensors`);
    await set(sensorRef, {
      ...sensorData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error publishing sensor data:', error);
    throw error;
  }
};

export const subscribeAIScore = (trayId, callback) => {
  try {
    const scoreRef = ref(rtdb, `trays/${trayId}/aiScore`);
    const unsubscribe = onValue(scoreRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to AI score:', error);
  }
};

export const updateAIScore = async (trayId, score) => {
  try {
    const scoreRef = ref(rtdb, `trays/${trayId}/aiScore`);
    await set(scoreRef, {
      value: score,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating AI score:', error);
    throw error;
  }
};

/**
 * Control Operations - Actuators (LED, AC, Irrigation)
 */

export const triggerControl = async (trayId, controlType, action, duration = null) => {
  try {
    const controlRef = ref(rtdb, `trays/${trayId}/controls/${controlType}`);
    await set(controlRef, {
      action,
      duration,
      timestamp: new Date().toISOString(),
      status: 'active',
    });
    console.log(`Control triggered: ${controlType} -> ${action} on Tray ${trayId}`);
  } catch (error) {
    console.error('Error triggering control:', error);
    throw error;
  }
};

export const subscribeControlStatus = (trayId, controlType, callback) => {
  try {
    const controlRef = ref(rtdb, `trays/${trayId}/controls/${controlType}`);
    const unsubscribe = onValue(controlRef, (snapshot) => {
      const data = snapshot.val();
      callback(data);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to control status:', error);
  }
};

/**
 * Alerts and Notifications
 */

export const createAlert = async (userId, trayId, alert) => {
  try {
    const alertRef = ref(rtdb, `users/${userId}/alerts`);
    const newAlertRef = push(alertRef);
    await set(newAlertRef, {
      ...alert,
      trayId,
      timestamp: new Date().toISOString(),
      read: false,
    });
    return newAlertRef.key;
  } catch (error) {
    console.error('Error creating alert:', error);
    throw error;
  }
};

export const subscribeAlerts = (userId, callback) => {
  try {
    const alertsRef = ref(rtdb, `users/${userId}/alerts`);
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const data = snapshot.val();
      const alerts = data ? Object.entries(data).map(([key, val]) => ({ id: key, ...val })) : [];
      callback(alerts);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to alerts:', error);
  }
};

export const deleteAlert = async (userId, alertId) => {
  try {
    const alertRef = ref(rtdb, `users/${userId}/alerts/${alertId}`);
    await remove(alertRef);
  } catch (error) {
    console.error('Error deleting alert:', error);
    throw error;
  }
};

/**
 * Historical Data
 */

export const logSensorHistory = async (trayId, sensorData) => {
  try {
    const historyRef = ref(rtdb, `trays/${trayId}/history`);
    const newEntryRef = push(historyRef);
    await set(newEntryRef, {
      ...sensorData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging sensor history:', error);
    throw error;
  }
};

export const subscribeSensorHistory = (trayId, limit = 100, callback) => {
  try {
    const historyRef = ref(rtdb, `trays/${trayId}/history`);
    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      let history = data ? Object.entries(data).map(([key, val]) => ({ id: key, ...val })) : [];
      // Sort by timestamp descending and limit
      history = history
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
      callback(history);
    });
    return unsubscribe;
  } catch (error) {
    console.error('Error subscribing to sensor history:', error);
  }
};

