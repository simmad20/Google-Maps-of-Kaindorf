"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unstableSettings = void 0;
exports.default = RootLayout;
require("react-native-reanimated");
var native_1 = require("@react-navigation/native");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("@/components/context/ThemeContext");
var react_1 = require("react");
// Expo Router UI Components
var native_2 = require("@react-navigation/native");
var HandwrittenFont_1 = require("@/components/HandwrittenFont");
var LanguageContext_1 = require("@/components/context/LanguageContext");
var TeacherContext_1 = require("@/components/context/TeacherContext");
var expo_font_1 = require("expo-font");
exports.unstableSettings = {
    initialRouteName: '(tabs)',
};
function RootLayout() {
    return (<ThemeContext_1.ThemeProvider>
            <LanguageContext_1.default>
                <TeacherContext_1.default>
                    <RootNavigation />
                </TeacherContext_1.default>
            </LanguageContext_1.default>
        </ThemeContext_1.ThemeProvider>);
}
function RootNavigation() {
    var isDarkMode = (0, react_1.useContext)(ThemeContext_1.ThemeContext).isDarkMode;
    var fontsLoaded = (0, expo_font_1.useFonts)({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        Peasone: require('../assets/fonts/Peasone.otf'),
        Super: require('../assets/fonts/Super-Morning.ttf'),
        Nice: require('../assets/fonts/Simpleness.otf'),
        Montserrat: require('../assets/fonts/Montserrat-Medium.ttf'),
        MontserratLight: require('../assets/fonts/Montserrat-Light.ttf'),
    })[0];
    var _a = (0, react_1.useState)(true), showSplash = _a[0], setShowSplash = _a[1];
    (0, react_1.useEffect)(function () {
        if (fontsLoaded) {
            expo_router_1.SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);
    if (!fontsLoaded)
        return null;
    return (<native_2.ThemeProvider value={isDarkMode ? native_1.DarkTheme : native_1.DefaultTheme}>
            {showSplash ? (<HandwrittenFont_1.default text="HTBLA Kaindorf" finishScreen={function () { return setShowSplash(false); }}/>) : (<expo_router_1.Stack>
                    <expo_router_1.Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
                    <expo_router_1.Stack.Screen name="settings" options={{ title: "Settings" }}/>
                    <expo_router_1.Stack.Screen name="+not-found"/>
                </expo_router_1.Stack>)}
        </native_2.ThemeProvider>);
}
