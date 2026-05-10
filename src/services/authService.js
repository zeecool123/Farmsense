// COMPLETELY REMOVED FIREBASE IMPORTS - 100% Local Storage Mode

const USERS_KEY = 'farmsense_users_dev';
const CURRENT_USER_KEY = 'farmsense_current_user_dev';

let localAuthListeners = [];

const notifyLocalAuthListeners = (user) => {
  localAuthListeners.forEach((callback) => callback(user));
};

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

export const enablePersistence = async () => {
  return Promise.resolve();
};

export const signUpUser = async (email, password, displayName) => {
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
  
  return { ...newUser, password: undefined };
};

export const signInUser = async (email, password) => {
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
  notifyLocalAuthListeners(safeUser); 
  return safeUser;
};

export const signOutUser = async () => {
  saveCurrentUser(null);
  notifyLocalAuthListeners(null); 
};

export const onAuthChange = (callback) => {
  const user = getCurrentStoredUser();
  callback(user);
  localAuthListeners.push(callback);
  
  return () => {
    localAuthListeners = localAuthListeners.filter(cb => cb !== callback);
  };
};

export const getCurrentUser = () => {
  return getCurrentStoredUser();
};