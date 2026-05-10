import { auth } from '../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';

// Fallback localStorage implementation
const USERS_KEY = 'farmsense_users_dev';
const CURRENT_USER_KEY = 'farmsense_current_user_dev';

// --- NEW: Local auth listeners to trigger React state updates ---
let localAuthListeners = [];
const notifyLocalAuthListeners = (user) => {
  localAuthListeners.forEach((callback) => callback(user));
};
// ----------------------------------------------------------------

const getStoredUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch (error) {
    console.error('Error reading stored users:', error);
    return [];
  }
};

const saveStoredUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

const getCurrentStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || 'null');
  } catch (error) {
    console.error('Error reading current user:', error);
    return null;
  }
};

// Check if Firebase is properly configured
const isFirebaseConfigured = auth !== null;

export const enablePersistence = async () => {
  return Promise.resolve();
};

export const signUpUser = async (email, password, displayName) => {
  if (isFirebaseConfigured) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: displayName || 'Farmer'
      });

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || displayName || 'Farmer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          alertNotifications: true,
          dailyReports: true,
          dataRefreshInterval: 5,
        },
      };
    } catch (error) {
      throw error;
    }
  } else {
    // Fallback to localStorage
    const users = getStoredUsers();

    if (users.some((user) => user.email === email)) {
      const error = new Error('Email already in use');
      error.code = 'auth/email-already-in-use';
      throw error;
    }

    if (password.length < 6) {
      const error = new Error('Password must be at least 6 characters');
      error.code = 'auth/weak-password';
      throw error;
    }

    const newUser = {
      uid: `user_${Date.now()}`,
      email,
      displayName: displayName || 'Farmer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        alertNotifications: true,
        dailyReports: true,
        dataRefreshInterval: 5,
      },
      password,
    };

    users.push(newUser);
    saveStoredUsers(users);
    
    const safeUser = { ...newUser, password: undefined };
    saveCurrentUser(safeUser);
    notifyLocalAuthListeners(safeUser); // Trigger React update
    
    return safeUser;
  }
};

export const signInUser = async (email, password) => {
  if (isFirebaseConfigured) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Farmer',
        createdAt: user.metadata.creationTime,
        updatedAt: user.metadata.lastSignInTime,
        preferences: {
          alertNotifications: true,
          dailyReports: true,
          dataRefreshInterval: 5,
        },
      };
    } catch (error) {
      throw error;
    }
  } else {
    // Fallback to localStorage
    const users = getStoredUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      const error = new Error('No account found with this email');
      error.code = 'auth/user-not-found';
      throw error;
    }

    if (user.password !== password) {
      const error = new Error('Incorrect password');
      error.code = 'auth/wrong-password';
      throw error;
    }

    const safeUser = { ...user, password: undefined };
    saveCurrentUser(safeUser);
    notifyLocalAuthListeners(safeUser); // Trigger React update
    return safeUser;
  }
};

export const signOutUser = async () => {
  if (isFirebaseConfigured) {
    await signOut(auth);
  } else {
    saveCurrentUser(null);
    notifyLocalAuthListeners(null); // Trigger React update
  }
};

export const onAuthChange = (callback) => {
  if (isFirebaseConfigured) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Farmer',
          createdAt: user.metadata.creationTime,
          updatedAt: user.metadata.lastSignInTime,
          preferences: {
            alertNotifications: true,
            dailyReports: true,
            dataRefreshInterval: 5,
          },
        });
      } else {
        callback(null);
      }
    });
  } else {
    // Fallback: simulate auth state change with stored user and register listener
    const user = getCurrentStoredUser();
    callback(user);
    localAuthListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      localAuthListeners = localAuthListeners.filter(cb => cb !== callback);
    };
  }
};

export const getCurrentUser = () => {
  if (isFirebaseConfigured) {
    return auth.currentUser ? {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName || 'Farmer',
      createdAt: auth.currentUser.metadata.creationTime,
      updatedAt: auth.currentUser.metadata.lastSignInTime,
      preferences: {
        alertNotifications: true,
        dailyReports: true,
        dataRefreshInterval: 5,
      },
    } : null;
  } else {
    return getCurrentStoredUser();
  }
};