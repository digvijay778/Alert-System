// frontend/src/utils/serviceWorkerRegistration.js

// This function registers the service worker.
export function register() {
  // We only register the service worker in a production environment.
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // The URL for our service worker. It must be in the public folder.
      const swUrl = '/service-worker.js';

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('Service Worker registered successfully:', registration);
        })
        .catch((error) => {
          console.error('Error during service worker registration:', error);
        });
    });
  }
}

// This function can be used to unregister the service worker.
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
