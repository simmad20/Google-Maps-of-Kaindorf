import * as Location from 'expo-location';

import { useEffect } from 'react';

export default function GPSLogger() {
  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    const start = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          console.log('❌ Keine GPS Permission');
          return;
        }

        console.log('✅ GPS Logger aktiviert');

        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            timeInterval: 1000,
            distanceInterval: 1,
          },
          (loc: Location.LocationObject) => {
            const { latitude, longitude } = loc.coords;
            console.log(`📍 LOG: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
          }
        );
      } catch (error) {
        console.log('❌ GPS Logger Fehler:', error);
      }
    };

    start();

    // Clean up watcher on unmount
    return () => {
      if (subscription) {
        subscription.remove();
        subscription = null;
        console.log('🛑 GPS Logger gestoppt');
      }
    };
  }, []);

  return null;
}