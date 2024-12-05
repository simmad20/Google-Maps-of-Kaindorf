import * as Location from 'expo-location'; // Import Expo Location module

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Gyroscope, Magnetometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';

interface Marker {
  id: number;
  latitude: number;
  longitude: number;
  title: string;
}

export default function MapsOfKaindorf() {
  const [selectedLocation, setSelectedLocation] = useState<Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const scale = useSharedValue(3);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Location permission not granted');
        return;
      }

      // Start location updates
      const locationWatcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update location every second
          distanceInterval: 1, // Update if the user moves by 1 meter
        },
        (newLocation) => {
          const { latitude, longitude } = newLocation.coords;
          setUserLocation(() => ({ latitude, longitude }));
          console.log(`Updated location: Latitude=${latitude}, Longitude=${longitude}`);
        }
      );

      return () => {
        // Clean up location watcher on component unmount
        locationWatcher.remove();
      };
    };

    requestLocationPermission();

    // Gyroscope and Magnetometer subscriptions
    const magnetometerSubscription = Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      rotation.value = angle;
    });

    const gyroscopeSubscription = Gyroscope.addListener((gyroData) => {
      const { x, y } = gyroData;
      gyroX.value += x / 1000;
      gyroY.value = y / 1000;
    });

    return () => {
      magnetometerSubscription.remove();
      gyroscopeSubscription.remove();
    };
  }, []);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = event.scale;
    })
    .onEnd(() => {
      scale.value = withSpring(3);
    });

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (lastTranslateX.value + event.translationX < 417.06840032339096) {
        if (lastTranslateX.value + event.translationX > -417.06840032339096) {
          translateX.value = lastTranslateX.value + event.translationX;
        }
      }
      if (lastTranslateY.value + event.translationY > -36.6378413438797) {
        if (lastTranslateY.value + event.translationY < 36.6378413438797) {
          translateY.value = lastTranslateY.value + event.translationY;
        }
      }
    })
    .onEnd(() => {
      lastTranslateX.value = translateX.value;
      lastTranslateY.value = translateY.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  const arrowStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { translateX: withSpring(gyroX.value * 50) },
        { translateY: withSpring(gyroY.value * 50) },
      ],
    };
  });

  const markers: Marker[] = [
    { id: 1, latitude: 40.0722, longitude: 6.4395, title: 'Lehrer 1' },
    { id: 2, latitude: 47.0719, longitude: 15.4385, title: 'Lehrer 2' },
  ];

  const handleMarkerPress = (marker: Marker) => {
    setSelectedLocation(marker);
  };

  return (
    <View style={styles.container}>
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          <Image
            source={require('@/assets/images/OG.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />

          {markers.map(marker => (
            <TouchableOpacity
              key={marker.id}
              style={[styles.marker, { top: marker.latitude * 3, left: marker.longitude * 3 }]}
              onPress={() => handleMarkerPress(marker)}
            >
              <Image
                source={require('@/assets/images/Teacher.png')}
                style={styles.teacherImage}
              />
            </TouchableOpacity>
          ))}

          {userLocation && (
            <Animated.View style={[styles.userArrow, arrowStyle]}>
              <Image source={require('@/assets/images/arrow.png')} style={styles.arrowImage} />
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>

      {selectedLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Selected Location:</Text>
          <Text>Latitude: {selectedLocation.latitude}</Text>
          <Text>Longitude: {selectedLocation.longitude}</Text>
          <Text>Title: {selectedLocation.title}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.resetButton} onPress={() => setSelectedLocation(null)}>
        <Text style={styles.resetButtonText}>Reset Location</Text>
      </TouchableOpacity>
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
  mapContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  marker: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teacherImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userArrow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 50,
    height: 50,
    marginLeft: -25,
    marginTop: -25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  infoBox: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  infoText: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resetButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});