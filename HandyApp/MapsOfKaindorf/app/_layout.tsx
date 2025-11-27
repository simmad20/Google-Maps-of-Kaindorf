import 'react-native-reanimated';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { useEffect, useState } from 'react';

// Expo Router UI Components
import { ThemeProvider as ExpoThemeProvider } from '@react-navigation/native';
import HandwrittenFont from '@/components/HandwrittenFont';
import LanguageProvider from '@/components/context/LanguageContext';
import TeacherProvider from '@/components/context/TeacherContext';
import { ThemeProvider } from '@/components/context/ThemeContext';
import { useColorScheme } from 'react-native';
import { useFonts } from 'expo-font';

export const unstableSettings = {
    initialRouteName: '(tabs)',
};

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const navigationRef = useNavigationContainerRef();

    const [fontsLoaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Peasone: require('../assets/fonts/Peasone.otf'),
        Super: require('../assets/fonts/Super-Morning.ttf'),
        Nice: require('../assets/fonts/Simpleness.otf'),
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf'),
        MontserratLight: require('../assets/fonts/Montserrat-Light.ttf'),
    });

    // dein alter Splash-Screen
    const [showSplash, setShowSplash] = useState(true);

    // Expo Splash ausblenden, sobald Fonts geladen sind
    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    const finishSplash = () => {
        setShowSplash(false);
    };

    if (!fontsLoaded) return null;

    return (
        <ExpoThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <ThemeProvider>
                <LanguageProvider>
                    <TeacherProvider>

                        {showSplash ? (
                            <HandwrittenFont text="HTBLA Kaindorf" finishScreen={finishSplash} />
                        ) : (
                            <Stack>
                                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                                <Stack.Screen name="settings" options={{ title: "Settings" }} />
                                <Stack.Screen name="+not-found" />
                            </Stack>
                        )}

                    </TeacherProvider>
                </LanguageProvider>
            </ThemeProvider>
        </ExpoThemeProvider>
    );
};