import 'react-native-reanimated';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { ThemeContext, ThemeProvider } from '@/components/context/ThemeContext';
import { useContext, useEffect, useState } from 'react';

// Expo Router UI Components
import { ThemeProvider as ExpoThemeProvider } from '@react-navigation/native';
import HandwrittenFont from '@/components/HandwrittenFont';
import LanguageProvider from '@/components/context/LanguageContext';
import TeacherProvider from '@/components/context/TeacherContext';
import { useFonts } from 'expo-font';
import ObjectProvider from "@/components/context/ObjectContext";
import {EventProvider} from "@/components/context/EventContext";

export const unstableSettings = {
    initialRouteName: '(tabs)',
};

export default function RootLayout() {
    return (
        <ThemeProvider>
            <EventProvider>
                <ObjectProvider>
                    <LanguageProvider>
                        <TeacherProvider>
                            <RootNavigation />
                        </TeacherProvider>
                    </LanguageProvider>
                </ObjectProvider>
            </EventProvider>
        </ThemeProvider>
    );
}

function RootNavigation() {
    const { isDarkMode } = useContext(ThemeContext);

    const [fontsLoaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Peasone: require('../assets/fonts/Peasone.otf'),
        Super: require('../assets/fonts/Super-Morning.ttf'),
        Nice: require('../assets/fonts/Simpleness.otf'),
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf'),
        MontserratLight: require('../assets/fonts/Montserrat-Light.ttf'),
    });

    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) return null;

    return (
        <ExpoThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
            {showSplash ? (
                <HandwrittenFont text="HTBLA Kaindorf" finishScreen={() => setShowSplash(false)} />
            ) : (
                <Stack>
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="settings" options={{ title: "Settings" }} />
                    <Stack.Screen name="+not-found" />
                </Stack>
            )}
        </ExpoThemeProvider>
    );
}