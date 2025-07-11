// frontend/public/service-worker.js

// A self-contained Service Worker for the Emergency Alert PWA.
// This version has no external imports and uses native browser APIs.

const DB_NAME = 'emergency-alerts-db';
const DB_VERSION = 1;
const STORE_NAME = 'pending-alerts';
const SYNC_TAG = 'sync-pending-alerts';

// --- IndexedDB Utility Functions (defined directly inside the worker) ---

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = (event) => reject(`IndexedDB error: ${event.target.errorCode}`);
    request.onsuccess = (event) => resolve(event.target.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getPendingAlerts() {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result);
  });
}

async function deletePendingAlert(id) {
  const db = await openDB();
  return new Promise((resolve) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    store.delete(id);
    transaction.oncomplete = () => resolve();
  });
}

// --- Background Sync Logic ---

self.addEventListener('sync', (event) => {
  if (event.tag === SYNC_TAG) {
    event.waitUntil(syncPendingAlerts());
  }
});

async function syncPendingAlerts() {
  console.log('Service Worker: Sync event triggered.');

  const pendingAlerts = await getPendingAlerts();
  if (pendingAlerts.length === 0) {
    console.log('Service Worker: No pending alerts to sync.');
    return;
  }

  console.log(`Service Worker: Found ${pendingAlerts.length} pending alerts. Syncing...`);
  
  // The backend URL needs to be known here.
  // Using the live URL of your deployed backend.
  const API_BASE_URL = 'https://alert-system-3trd.onrender.com/api/v1';

  for (const alert of pendingAlerts) {
    try {
      // Use the native fetch API. It is always available in a service worker.
      // This removes the need for importing Axios or other API services.
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });

      if (response.ok) {
        // If the request was successful, delete the alert from IndexedDB.
        await deletePendingAlert(alert.id);
        console.log(`Service Worker: Successfully synced and deleted alert with ID ${alert.id}.`);
      } else {
        // If the server responds with an error (e.g., 4xx, 5xx).
        console.error(`Service Worker: Server failed to process alert ${alert.id}. Status: ${response.status}`);
        // Break the loop to avoid sending further requests if the server is having issues.
        break;
      }
    } catch (error) {
      // This catches network errors (e.g., if the server is truly unreachable).
      console.error(`Service Worker: Network error syncing alert ${alert.id}.`, error);
      // We must break here. If one request fails due to network, they all will.
      // The browser will automatically retry the sync later.
      break;
    }
  }
}

// --- Basic Service Worker Lifecycle Events ---

self.addEventListener('install', (event) => {
  console.log('Service Worker: Installed.');
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activated.');
  // Take control of all pages under this service worker's scope immediately.
  event.waitUntil(self.clients.claim());
});
