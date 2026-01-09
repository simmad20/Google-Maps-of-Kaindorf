"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HandwrittenFont;
var react_1 = require("react");
var react_native_1 = require("react-native");
var react_native_reanimated_1 = require("react-native-reanimated");
var SplashScreen = require("expo-splash-screen");
var prop_types_1 = require("prop-types");
var FontAwesome6_1 = require("@expo/vector-icons/FontAwesome6");
HandwrittenFont.propTypes = {
    text: prop_types_1.default.string.isRequired,
    finishScreen: prop_types_1.default.func
};
function HandwrittenFont(_a) {
    var text = _a.text, finishScreen = _a.finishScreen;
    var _b = (0, react_1.useState)(''), displayedText = _b[0], setDisplayedText = _b[1]; // Text that is currently displayed
    var opacity = (0, react_native_reanimated_1.useSharedValue)(0);
    (0, react_1.useEffect)(function () {
        if (finishScreen !== undefined && displayedText === text) {
            finishScreen();
        }
    });
    (0, react_1.useEffect)(function () {
        var currentText = '';
        text.split('').forEach(function (letter, index) {
            setTimeout(function () {
                currentText += letter;
                setDisplayedText(currentText);
            }, index * 300);
        });
        opacity.value = (0, react_native_reanimated_1.withTiming)(1, {
            duration: 2000,
            easing: react_native_reanimated_1.Easing.ease,
        });
        // Hide the splash screen once the text is fully displayed
        setTimeout(function () {
            SplashScreen.hideAsync();
        }, text.length * 300 + 500); // Adjust timing based on text length
    }, []);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            opacity: opacity.value,
        };
    });
    return (<react_native_1.View style={styles.container}>
            <react_native_1.View style={styles.mapsOfContainer}>
                <react_native_1.Text style={styles.mapsOfText}>Maps</react_native_1.Text>
                <react_native_1.Text style={styles.mapsOfText}>of</react_native_1.Text>
                <react_native_1.Text style={styles.icon}><FontAwesome6_1.default name="map-location" size={50} color="#a453ec"/></react_native_1.Text>
            </react_native_1.View>
            <react_native_1.View style={styles.handwrittenContainer}>
                <react_native_reanimated_1.default.Text style={[styles.handwrittenText, animatedStyle]}>
                    {displayedText}
                </react_native_reanimated_1.default.Text></react_native_1.View>
            <react_native_1.View style={styles.footerContainer}>
                <react_native_1.Text style={styles.madeByText}>made by</react_native_1.Text>
                <react_native_1.Image style={styles.roomgatorLogo} source={require('../assets/images/roomgator-logo_cutted.png')}/>
            </react_native_1.View>
        </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e'
    },
    handwrittenText: {
        fontSize: 35,
        fontFamily: 'Nice',
        color: 'white'
    },
    mapsOfContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapsOfText: {
        fontSize: 40,
        fontFamily: 'MontserratLight',
        color: '#a453ec'
    },
    handwrittenContainer: {
        flex: 2
    },
    icon: {
        marginTop: 10
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 25
    },
    madeByText: {
        fontSize: 16,
        color: 'white',
        marginRight: 30,
        fontFamily: 'MontserratLight',
    },
    roomgatorLogo: {
        height: 40,
        width: '35%'
    }
});
