import 'react-native-reanimated';

import {DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider} from '@react-navigation/native';
import {useEffect, useState} from 'react';

import HandwrittenFont from "@/components/HandwrittenFont";
import LanguageProvider from "@/components/context/LanguageContext";
import {Stack} from 'expo-router';
import TeacherProvider from '@/components/context/TeacherContext';
import {ThemeProvider} from "@/components/context/ThemeContext";
import {useColorScheme} from '@/hooks/useColorScheme';
import {useFonts} from 'expo-font';

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
		setShowSplashScreen(false);
	}

	return (
		<ThemeProvider>
			<LanguageProvider>
				<TeacherProvider>
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
				</TeacherProvider>
			</LanguageProvider>
		</ThemeProvider>
	);
}