// COMPLETELY DISABLED FIREBASE FOR OFFLINE MODE
// We are exporting dummy objects so the rest of the app doesn't crash looking for them.

export const auth = null;
export const db = null;
export const realtimeDb = null;

const app = {};
export default app;