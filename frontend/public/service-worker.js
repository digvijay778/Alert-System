// frontend/public/service-worker.js

// We need to import the same IndexedDB utilities and API functions used in the app.
// Since service workers can't use ES modules directly, you would typically use a bundler
// (like Vite's Rollup) to create a single, bundled service worker file.
// For simplicity here, we assume these functions are globally available or have been bundled.

// Placeholder for IndexedDB functions (in a real build, these would be imported)
import { getPendingAlerts, deletePendingAlert } from '../src/utils/indexedDB';
// Placeholder for API functions
import { alertApi } from '../src/api/alertApi';

const SYNC_TAG = 'sync-pending-alerts';

// Listen for the 'sync' event.
self.addEventListener('sync', (event) => {
  // Check if the sync event tag matches the one we registered.
  if (event.tag === SYNC_TAG) {
    // waitUntil() tells the browser to keep the service worker alive
    // until the promise resolves, ensuring the sync process completes.
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

  for (const alert of pendingAlerts) {
    try {
      // Attempt to send the alert to the server.
      await alertApi.sendAlert(alert);
      // If successful, delete it from IndexedDB.
      await deletePendingAlert(alert.id);
      console.log(`Service Worker: Successfully synced and deleted alert with ID ${alert.id}.`);
    } catch (error) {
      console.error(`Service Worker: Failed to sync alert with ID ${alert.id}.`, error);
      // If an alert fails to sync, it remains in IndexedDB for the next attempt.
      // The browser will automatically retry the sync later with an exponential backoff strategy.
      // We break the loop to avoid sending further requests if the server is down.
      break;
    }
  }
}
