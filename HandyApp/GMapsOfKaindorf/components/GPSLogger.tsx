import * as Location from "expo-location";

import { useEffect } from "react";

export default function GPSLogger() {
  useEffect(() => {
    const start = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("❌ Keine GPS Permission");
        return;
      }

      console.log("✅ GPS Logger aktiviert");

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (loc) => {
          const { latitude, longitude } = loc.coords;

          console.log(
            `📍 LOG: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
          );
        }
      );
    };

    start();
  }, []);

  return null;
}