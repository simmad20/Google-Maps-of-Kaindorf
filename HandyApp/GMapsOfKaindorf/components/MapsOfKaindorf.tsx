import * as Location from 'expo-location'; // Import Expo Location module

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Gyroscope, Magnetometer } from 'expo-sensors';
import React, { useEffect, useState } from 'react';
import Svg, { Line } from 'react-native-svg';
import { getLatitude, getLongitude, getPreciseDistance } from 'geolib';

import { GeolibInputCoordinates } from 'geolib/es/types';

interface Marker {
  id: number;
  y: number;
  x: number;
  title: string;
}

export default function MapsOfKaindorf() {
  const [selectedLocation, setSelectedLocation] = useState<Marker | null>(null);
  const [userLocation, setUserLocation] = useState({ latitude: 46.801649, longitude: 15.5419766 });
  const [userPosition, setUserPosition] = useState({ x: Dimensions.get('window').width / 2 , y: 110 });
  const [mapHeight, setMapHeight] = useState(Dimensions.get('window').height * 0.4);

  const picture = require('@/assets/images/OG.png');
  const scale = useSharedValue(3);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const gyroX = useSharedValue(0);
  const gyroY = useSharedValue(0);
  const centralPathY = mapHeight * 0.45;

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
          const distance = getPreciseDistance(userLocation, { latitude, longitude });

          console.log('Location updated:');
          console.log(`location1: Latitude=${latitude}, Longitude=${longitude}`);
          console.log(`UserLocation location2: Latitude=${getLatitude(userLocation)}, Longitude=${getLongitude(userLocation)}`);
          console.log(`und die zurrückgelegten Meter=${distance}`);
          console.log('---------------------------------------------------');
          console.log(`Alles=${JSON.stringify(newLocation)}`);
          console.log('---------------------------------------------------');


          console.log(`\n\n\n`);
          console.log(`Alles1=${JSON.stringify(userLocation)}`);
          //setUserPosition({ x: latitude, y: longitude });
          setUserLocation({ latitude: 10, longitude: longitude });
          console.log(`Alles2=${JSON.stringify(userLocation)}`);
          console.log(`\n\n\n`);
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
    })
    .onEnd(() => {
      lastTranslateX.value = translateX.value;
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
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

  const calculatePath = () => {
    if (!selectedLocation || !userPosition) return null;

    const path = [];
    const { x: userX, y: userY } = userPosition;
    const { x: teacherX, y: teacherY } = selectedLocation;

    // 1. Vertikal bewegen zum zentralen Gang
    if (userY !== centralPathY) {
      path.push({ x: userX, y: centralPathY });
    }

    // 2. Horizontal entlang des zentralen Gangs bewegen
    if (userX !== teacherX) {
      path.push({ x: teacherX, y: centralPathY });
    }

    // 3. Vertikal zum Lehrer bewegen
    if (teacherY !== centralPathY) {
      path.push({ x: teacherX, y: teacherY });
    }

    return path;
  };
  const path = calculatePath();

  const markers: Marker[] = [
    { id: 1, y: 88, x: 36, title: 'Lehrer 1' },
    { id: 2, y: 116, x: 15, title: 'Lehrer 2' },
  ];

  const handleMarkerPress = (marker: Marker) => {
    setSelectedLocation(marker);
  };

  return (
    <View style={styles.container} id='map'>
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View style={[styles.mapContainer, { height: mapHeight }, animatedStyle]}>
          <Image
            source={picture}
            style={styles.mapImage}
            resizeMode="contain"
            onLayout={(event) => {
              const { width, height } = Image.resolveAssetSource(picture);
              setMapHeight(height / 2);
            }}
          />

          {markers.map(marker => (
            <TouchableOpacity
              key={marker.id}
              style={[styles.marker, { top: marker.y, left: marker.x }]}
              onPress={() => handleMarkerPress(marker)}
            >
              <Image
                source={require('@/assets/images/Teacher.png')}
                style={styles.teacherImage}
              />
            </TouchableOpacity>

          ))}

          {(getLatitude(userLocation) != 0 && getLongitude(userLocation) != 0) && (
            <Animated.View style={[styles.userArrow, arrowStyle, { top: userPosition.y || '50%', left: userPosition.x }]}>
              <Image source={require('@/assets/images/arrow.png')} style={styles.arrowImage} />
            </Animated.View>
          )}

          {path && (
            <Svg style={StyleSheet.absoluteFill}>
              {path.map((point, index) => {
                const prevPoint = index === 0 ? userPosition : path[index - 1];
                return (
                  <Line
                    key={index}
                    x1={prevPoint.x}
                    y1={prevPoint.y}
                    x2={point.x}
                    y2={point.y}
                    stroke="blue"
                    strokeWidth="2"
                  />
                );
              })}
            </Svg>
          )}
        </Animated.View>
      </GestureDetector>

      {selectedLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Selected Location:</Text>
          <Text>Latitude: {selectedLocation.y}</Text>
          <Text>Longitude: {selectedLocation.x}</Text>
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
    transform: [{ translateX: -15 }, { translateY: -15 }], // Zentrierung
  },
  userArrow: {
    position: 'absolute',
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
    transform: [{ translateX: 0.5 }, { translateY: 5 }], // Zentrierung
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