import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React, { useState } from 'react';

export default function MapsOfKaindorf() {
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const scale = useSharedValue(3);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const lastTranslateX = useSharedValue(0);
  const lastTranslateY = useSharedValue(0);

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
      console.log(lastTranslateY.value);
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

  const markers = [
    { id: 1, latitude: 47.0722, longitude: 15.4395, title: 'Marker 1' },
    { id: 2, latitude: 47.0719, longitude: 15.4385, title: 'Marker 2' },
  ];

  const handleMarkerPress = (location: { latitude: number; longitude: number }) => {
    setSelectedLocation(location);
  };

  return (
    <View style={styles.container}>
      {/* GestureDetector for handling both pan and pinch gestures */}
      <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
        <Animated.View style={[styles.mapContainer, animatedStyle]}>
          {/* Background image as the map */}
          <Image
            source={require('@/assets/images/OG.png')}
            style={styles.mapImage}
            resizeMode="contain"
          />

          {/* Marker overlay */}
          {markers.map(marker => (
            <TouchableOpacity
              key={marker.id}
              style={[styles.marker, { top: marker.latitude * 1000, left: marker.longitude * 1000 }]}
              onPress={() => handleMarkerPress({ latitude: marker.latitude, longitude: marker.longitude })}
            >
              <View style={styles.markerDot} />
            </TouchableOpacity>
          ))}
        </Animated.View>
      </GestureDetector>

      {/* Info box for selected marker */}
      {selectedLocation && (
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Selected Location:</Text>
          <Text>Latitude: {selectedLocation.latitude}</Text>
          <Text>Longitude: {selectedLocation.longitude}</Text>
        </View>
      )}

      {/* Button to reset marker selection */}
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
  markerDot: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: 'red',
  },
  infoBox: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
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