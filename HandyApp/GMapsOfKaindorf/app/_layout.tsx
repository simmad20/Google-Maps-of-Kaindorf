import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {useEffect, useState} from 'react';
import 'react-native-reanimated';

import {useColorScheme} from '@/hooks/useColorScheme';
import HandwrittenFont from "@/components/HandwrittenFont";
import LanguageProvider from "@/components/context/LanguageContext";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Peasone: require('../assets/fonts/Peasone.otf'),
        Super: require('../assets/fonts/Super-Morning.ttf'),
        Nice: require('../assets/fonts/Simpleness.otf')
    });

    const [showSplashScreen, setShowSplashScreen] = useState(true);

    const finishSplash = () => {
        setShowSplashScreen(false)
    }

    return (
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <LanguageProvider>
                {loaded ? (
                    showSplashScreen ? (
                        <HandwrittenFont text="HTBLA Kaindorf" finishScreen={finishSplash}/>
                    ) : (
                        <Stack>
                            <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
                            <Stack.Screen name="+not-found"/>
                        </Stack>
                    )
                ) : null}
            </LanguageProvider>

        </ThemeProvider>
    );
}