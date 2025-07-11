// frontend/src/hooks/useGeoLocation.js

import { useState, useEffect } from 'react';

const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    let watchId;

    const onSuccess = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setError(null);
      setLoading(false);
    };

    const onError = (err) => {
      setError(err.message);
      setLoading(false);
    };

    // Get the initial position
    navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    // Watch for subsequent position changes
    watchId = navigator.geolocation.watchPosition(onSuccess, onError, options);

    // Cleanup function to clear the watcher when the component unmounts
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [options]); // Re-run effect if options change

  return { location, error, loading };
};

export default useGeoLocation;
