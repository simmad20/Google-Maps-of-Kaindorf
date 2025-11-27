import * as SplashScreen from 'expo-splash-screen';

import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image, StyleSheet, View } from 'react-native';
import React, { useEffect, useState } from 'react';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedText } from '@/components/ThemedText';

interface HandwrittenFontProps {
  text: string;
  finishScreen?: () => void;
}

export default function HandwrittenFont({ text, finishScreen }: HandwrittenFontProps) {
  const [displayedText, setDisplayedText] = useState('');
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (finishScreen && displayedText === text) finishScreen();
  }, [displayedText]);

  useEffect(() => {
    let currentText = '';
    text.split('').forEach((letter, index) => {
      setTimeout(() => {
        currentText += letter;
        setDisplayedText(currentText);
      }, index * 300);
    });

    opacity.value = withTiming(1, { duration: 2000, easing: Easing.ease });

    setTimeout(() => SplashScreen.hideAsync(), text.length * 300 + 500);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={styles.container}>
      <View style={styles.mapsOfContainer}>
        <ThemedText type="title" style={styles.mapsOfText}>Maps</ThemedText>
        <ThemedText type="title" style={styles.mapsOfText}>of</ThemedText>
        <FontAwesome6 name="map-location" size={50} color="#a453ec" style={styles.icon} />
      </View>
      <View style={styles.handwrittenContainer}>
        <Animated.Text style={[styles.handwrittenText, animatedStyle]}>{displayedText}</Animated.Text>
      </View>
      <View style={styles.footerContainer}>
        <ThemedText style={styles.madeByText}>made by</ThemedText>
        <Image style={styles.roomgatorLogo} source={require('../assets/images/roomgator-logo_cutted.png')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2d283e' },
  handwrittenText: { fontSize: 35, fontFamily: 'Nice', color: 'white' },
  mapsOfContainer: { flex: 3, justifyContent: 'center', alignItems: 'center' },
  mapsOfText: { fontSize: 40, fontFamily: 'MontserratLight', color: '#a453ec' },
  handwrittenContainer: { flex: 2 },
  icon: { marginTop: 10 },
  footerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 20, marginBottom: 25 },
  madeByText: { fontSize: 16, color: 'white', marginRight: 30, fontFamily: 'MontserratLight' },
  roomgatorLogo: { height: 40, width: '35%' },
});