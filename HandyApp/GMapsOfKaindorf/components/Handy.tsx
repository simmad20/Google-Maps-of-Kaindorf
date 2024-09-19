import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SensorTypes, gyroscope, setUpdateIntervalForType } from 'react-native-sensors';

import axios from 'axios';

export default function App() {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [isGyroscopeActive, setGyroscopeActive] = useState(false);

  const serverIP = '192.168.222.3'; // Ersetze dies durch die IP-Adresse deines Servers
  const serverPort = '27007'; // Der Port, den dein Server verwendet

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.gyroscope, 100); // Intervall auf 100ms setzen

    let subscription:any;
    if (isGyroscopeActive) {
      subscription = gyroscope.subscribe(({ x, y, z }) => {
        setGyroData({ x, y, z });
      });
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [isGyroscopeActive]);

  // Funktion zum Senden der Gyroskop-Daten an den Server
  const sendGyroDataToServer = async () => {
    const dataString = `${gyroData.x.toFixed(2)},${gyroData.y.toFixed(2)},${gyroData.z.toFixed(2)}`;
    try {
      await axios.post(`http://${serverIP}:${serverPort}/gyro`, { data: dataString });
    } catch (error:any) {
      console.log('Fehler beim Senden der Daten: ', error.message);
    }
  };

  useEffect(() => {
    let intervalId:any;
    if (isGyroscopeActive) {
      intervalId = setInterval(() => {
        sendGyroDataToServer();
      }, 1000); // Daten alle 1 Sekunde senden
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGyroscopeActive, gyroData]);

  const toggleGyroscope = () => {
    setGyroscopeActive(!isGyroscopeActive);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Gyroskop-Daten</Text>
      <Text style={styles.dataText}>
        X: {gyroData.x.toFixed(2)}, Y: {gyroData.y.toFixed(2)}, Z: {gyroData.z.toFixed(2)}
      </Text>
      <Button
        title={isGyroscopeActive ? 'Stop Gyroskop' : 'Start Gyroskop'}
        onPress={toggleGyroscope}
        color="#1E90FF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dataText: {
    fontSize: 20,
    marginVertical: 20,
  },
});