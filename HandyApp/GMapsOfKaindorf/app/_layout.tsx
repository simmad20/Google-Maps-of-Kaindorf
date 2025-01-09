import 'react-native-reanimated';
import {DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider} from '@react-navigation/native';
import {ThemeProvider} from "@/components/context/ThemeContext";
import {useEffect, useState} from 'react';

import HandwrittenFont from "@/components/HandwrittenFont";
import {Stack} from 'expo-router';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useFonts} from 'expo-font';
import LanguageProvider from "@/components/context/LanguageContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Peasone: require('../assets/fonts/Peasone.otf'),
        Super: require('../assets/fonts/Super-Morning.ttf'),
        Nice: require('../assets/fonts/Simpleness.otf'),
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf'),
        MontserratLight: require('../assets/fonts/Montserrat-Light.ttf')
    });

    const [showSplashScreen, setShowSplashScreen] = useState(true);

    const finishSplash = () => {
        setShowSplashScreen(false)
    }

    return (
        <ThemeProvider>
            <LanguageProvider>
                {loaded ? (
                    showSplashScreen ? (
                        <HandwrittenFont text="HTBLA Kaindorf" finishScreen={finishSplash}/>
                    ) : (
                        <Stack screenOptions={{headerShown: false}}>
                            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                            <Stack.Screen name="+not-found"/>
                        </Stack>
                    )
                ) : null}
            </LanguageProvider>
        </ThemeProvider>
    );
}