import 'react-native-reanimated';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { ThemeContext, ThemeProvider } from '@/components/context/ThemeContext';
import { useContext, useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider as ExpoThemeProvider } from '@react-navigation/native';
import HandwrittenFont from '@/components/HandwrittenFont';
import LanguageProvider from '@/components/context/LanguageContext';
import { useFonts } from 'expo-font';
import ObjectProvider from "@/components/context/ObjectContext";
import {EventProvider} from "@/components/context/EventContext";
import {AuthProvider, useAuth} from "@/components/context/AuthContext";
import WelcomeScreen from "@/components/WelcomeScreen";

export const unstableSettings = {
    initialRouteName: '(tabs)',
};

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <ThemeProvider>
                    <LanguageProvider>
                            <RootNavigation />
                    </LanguageProvider>
                </ThemeProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
}

function RootNavigation() {
    const { isDarkMode } = useContext(ThemeContext);
    const { isLoggedIn, isLoading, onJoinSuccess } = useAuth();
    const [sessionKey, setSessionKey] = useState(0);

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
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    useEffect(() => {
        if (isLoggedIn) setSessionKey(prev => prev + 1);
    }, [isLoggedIn]);

    if (!fontsLoaded || isLoading) return null;

    return (
        <ExpoThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
            {showSplash ? (
                <HandwrittenFont text="HTBLA Kaindorf" finishScreen={() => setShowSplash(false)} />
            ) : !isLoggedIn ? (
                <WelcomeScreen onJoinSuccess={onJoinSuccess} />
            ) : (
                <EventProvider key={sessionKey}>
                    <ObjectProvider key={sessionKey}>
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                            <Stack.Screen name="settings" options={{ title: "Settings" }} />
                            <Stack.Screen name="+not-found" />
                        </Stack>
                    </ObjectProvider>
                </EventProvider>
            )}
        </ExpoThemeProvider>
    );
}