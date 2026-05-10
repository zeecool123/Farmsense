// Firebase configuration
// IMPORTANT: Replace these placeholder values with your actual Firebase config
// Get these values from: https://console.firebase.google.com/ > Your Project > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "your-api-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id"
};

// Check if we have valid Firebase config
const hasValidConfig = firebaseConfig.apiKey !== "your-api-key" &&
                      firebaseConfig.projectId !== "your-project-id";

let app, auth, db, realtimeDb;

if (hasValidConfig) {
  // Initialize Firebase with valid config
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  realtimeDb = getDatabase(app);
} else {
  console.warn('Firebase config not properly set up. Authentication will use localStorage fallback.');
  // Auth will be handled by fallback in authService.js
  auth = null;
  db = {};
  realtimeDb = {};
  app = {};
}

export { auth, db, realtimeDb };
export default app;