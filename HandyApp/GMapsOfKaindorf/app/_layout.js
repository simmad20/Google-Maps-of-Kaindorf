"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RootLayout;
require("react-native-reanimated");
var react_1 = require("react");
var HandwrittenFont_1 = require("@/components/HandwrittenFont");
var LanguageContext_1 = require("@/components/context/LanguageContext");
var expo_router_1 = require("expo-router");
var TeacherContext_1 = require("@/components/context/TeacherContext");
var ThemeContext_1 = require("@/components/context/ThemeContext");
var useColorScheme_1 = require("@/hooks/useColorScheme");
var expo_font_1 = require("expo-font");
function RootLayout() {
    var colorScheme = (0, useColorScheme_1.useColorScheme)();
    var loaded = (0, expo_font_1.useFonts)({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Peasone: require('../assets/fonts/Peasone.otf'),
        Super: require('../assets/fonts/Super-Morning.ttf'),
        Nice: require('../assets/fonts/Simpleness.otf'),
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf'),
        MontserratLight: require('../assets/fonts/Montserrat-Light.ttf')
    })[0];
    var _a = (0, react_1.useState)(true), showSplashScreen = _a[0], setShowSplashScreen = _a[1];
    var finishSplash = function () {
        setShowSplashScreen(false);
    };
    return (<ThemeContext_1.ThemeProvider>
			<LanguageContext_1.default>
				<TeacherContext_1.default>
					{loaded ? (showSplashScreen ? (<HandwrittenFont_1.default text="HTBLA Kaindorf" finishScreen={finishSplash}/>) : (<expo_router_1.Stack>
								<expo_router_1.Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
								<expo_router_1.Stack.Screen name="+not-found"/>
							</expo_router_1.Stack>)) : null}
				</TeacherContext_1.default>
			</LanguageContext_1.default>
		</ThemeContext_1.ThemeProvider>);
}
