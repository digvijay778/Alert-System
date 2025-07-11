// frontend/src/utils/indexedDB.js

import { openDB } from 'idb';

const DB_NAME = 'EmergencyAlertDB';
const DB_VERSION = 1;
const STORE_NAME = 'pending-alerts';

// A promise that resolves to the database instance
const dbPromise = openDB(DB_NAME, DB_VERSION, {
  /**
   * The upgrade callback is only triggered when the database version changes,
   * making it the ideal place to define or update the database schema.
   */
  upgrade(db) {
    // Create an object store to hold the alerts if it doesn't already exist.
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      // We use an auto-incrementing key for simplicity.
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'id',
        autoIncrement: true,
      });
      // Create an index on the 'timestamp' for potential future sorting.
      store.createIndex('timestamp', 'timestamp');
    }
  },
});

/**
 * Saves a pending alert to the IndexedDB.
 * @param {object} alert - The alert data to save.
 */
export const saveAlertLocally = async (alert) => {
  const db = await dbPromise;
  // Start a 'readwrite' transaction to add data to the store.
  await db.add(STORE_NAME, alert);
};

/**
 * Retrieves all pending alerts from the IndexedDB.
 * @returns {Promise<Array<object>>} An array of all saved alerts.
 */
export const getPendingAlerts = async () => {
  const db = await dbPromise;
  return db.getAll(STORE_NAME);
};

/**
 * Deletes a specific alert from the store by its ID.
 * @param {number} id - The ID of the alert to delete.
 */
export const deletePendingAlert = async (id) => {
  const db = await dbPromise;
  await db.delete(STORE_NAME, id);
};
