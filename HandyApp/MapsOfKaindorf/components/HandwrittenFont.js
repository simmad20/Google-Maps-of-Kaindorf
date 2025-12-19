"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HandwrittenFont;
var SplashScreen = require("expo-splash-screen");
var react_native_reanimated_1 = require("react-native-reanimated");
var react_native_1 = require("react-native");
var react_1 = require("react");
var FontAwesome6_1 = require("@expo/vector-icons/FontAwesome6");
var ThemedText_1 = require("@/components/ThemedText");
function HandwrittenFont(_a) {
    var text = _a.text, finishScreen = _a.finishScreen;
    var _b = (0, react_1.useState)(''), displayedText = _b[0], setDisplayedText = _b[1];
    var opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_1.useEffect)(function () {
        if (finishScreen && displayedText === text)
            finishScreen();
    }, [displayedText]);
    (0, react_1.useEffect)(function () {
        var currentText = '';
        text.split('').forEach(function (letter, index) {
            setTimeout(function () {
                currentText += letter;
                setDisplayedText(currentText);
            }, index * 300);
        });
        opacity.value = (0, react_native_reanimated_1.withTiming)(1, { duration: 2000, easing: react_native_reanimated_1.Easing.ease });
        setTimeout(function () { return SplashScreen.hideAsync(); }, text.length * 300 + 500);
    }, []);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({ opacity: opacity.value }); });
    return (<react_native_1.View style={styles.container}>
      <react_native_1.View style={styles.mapsOfContainer}>
        <ThemedText_1.ThemedText type="title" style={styles.mapsOfText}>Maps</ThemedText_1.ThemedText>
        <ThemedText_1.ThemedText type="title" style={styles.mapsOfText}>of</ThemedText_1.ThemedText>
        <FontAwesome6_1.default name="map-location" size={50} color="#a453ec" style={styles.icon}/>
      </react_native_1.View>
      <react_native_1.View style={styles.handwrittenContainer}>
        <react_native_reanimated_1.default.Text style={[styles.handwrittenText, animatedStyle]}>{displayedText}</react_native_reanimated_1.default.Text>
      </react_native_1.View>
      <react_native_1.View style={styles.footerContainer}>
        <ThemedText_1.ThemedText style={styles.madeByText}>made by</ThemedText_1.ThemedText>
        <react_native_1.Image style={styles.roomgatorLogo} source={require('../assets/images/roomgator-logo_cutted.png')}/>
      </react_native_1.View>
    </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
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
