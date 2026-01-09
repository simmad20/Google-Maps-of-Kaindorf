"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_native_1 = require("react-native");
var react_1 = require("react");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var Ionicons_1 = require("@expo/vector-icons/Ionicons");
var MapsOfKaindorf_1 = require("@/components/MapsOfKaindorf");
var ParallaxScrollView_1 = require("@/components/ParallaxScrollView");
var QRScanner_1 = require("@/components/QRScanner");
var ThemedText_1 = require("@/components/ThemedText");
var logo = require('@/assets/images/logo.png');
var TabTwoScreen = function () {
    var _a = (0, react_1.useState)(false), qrVisible = _a[0], setQrVisible = _a[1];
    var _b = (0, react_1.useState)('OG'), floor = _b[0], setFloor = _b[1];
    var openQr = function () { return setQrVisible(true); };
    var closeQr = function () { return setQrVisible(false); };
    return (<ParallaxScrollView_1.default headerBackgroundColor={{ light: '#ffffff', dark: '#222' }} headerImage={<react_native_1.View style={styles.headerContainer}>
                    {/* Logo Header */}
                    <react_native_1.Image source={logo} style={styles.logo} resizeMode="cover"/>
                </react_native_1.View>}>
            {/* Title + QR Row */}
            <react_native_1.View style={styles.titleRow}>
                <ThemedText_1.ThemedText type="title">Find your Way</ThemedText_1.ThemedText>

                <react_native_1.TouchableOpacity style={styles.qrCircle} onPress={openQr}>
                    <Ionicons_1.default name="qr-code-outline" size={26} color="#fff"/>
                </react_native_1.TouchableOpacity>
            </react_native_1.View>

            {/* Map + Floor Buttons */}
            <react_native_1.View style={styles.mapWrapper}>
                {/* GestureHandlerRootView --> GestureDetector funktioniert */}
                <react_native_gesture_handler_1.GestureHandlerRootView style={styles.mapContainerWrapper}>
                    <MapsOfKaindorf_1.default floor={floor} onQrPress={openQr} showLogger={false}/>
                </react_native_gesture_handler_1.GestureHandlerRootView>

                <react_native_1.View style={styles.verticalButtonWrapper}>
                    <react_native_1.TouchableOpacity onPress={function () { return setFloor('OG'); }} style={[styles.longButton, styles.buttonTop, floor === 'OG' && styles.active]}>
                        <ThemedText_1.ThemedText style={styles.buttonText}>OG</ThemedText_1.ThemedText>
                    </react_native_1.TouchableOpacity>

                    <react_native_1.TouchableOpacity onPress={function () { return setFloor('UG'); }} style={[styles.longButton, styles.buttonBottom, floor === 'UG' && styles.active]}>
                        <ThemedText_1.ThemedText style={styles.buttonText}>UG</ThemedText_1.ThemedText>
                    </react_native_1.TouchableOpacity>
                </react_native_1.View>
            </react_native_1.View>

            {/* QR Scanner Modal */}
            {qrVisible && (<QRScanner_1.default visible={qrVisible} onClose={closeQr} onScan={function () { return closeQr(); }}/>)}
        </ParallaxScrollView_1.default>);
};
exports.default = TabTwoScreen;
var isMobile = react_native_1.Dimensions.get('window').width < 650;
var MAP_HEIGHT = react_native_1.Dimensions.get('window').height * 0.476;
var HEADER_HEIGHT = 150;
var styles = react_native_1.StyleSheet.create({
    headerContainer: {
        width: '100%',
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
    },
    qrCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#7A3BDF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    mapWrapper: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        paddingRight: 20,
        position: 'relative',
    },
    mapContainerWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    rightBar: {
        position: 'absolute',
        right: 14,
        top: isMobile ? '38%' : '30%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
    },
    verticalButtonWrapper: {
        position: 'absolute',
        right: -25,
        top: 0,
        height: MAP_HEIGHT,
    },
    longButton: {
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e5e5',
        borderRadius: 12,
    },
    buttonTop: {
        height: MAP_HEIGHT / 2 - 6,
    },
    buttonBottom: {
        height: MAP_HEIGHT / 2 - 6,
    },
    active: {
        backgroundColor: '#7A3BDF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
