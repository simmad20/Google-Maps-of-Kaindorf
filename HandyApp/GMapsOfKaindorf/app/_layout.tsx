import 'react-native-reanimated';

import * as SplashScreen from 'expo-splash-screen';

import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import HandwrittenFont from "@/components/HandwrittenFont";
import {Stack} from 'expo-router';
import {useColorScheme} from '@/hooks/useColorScheme';
import {useFonts} from 'expo-font';

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
        </ThemeProvider>
    );
}