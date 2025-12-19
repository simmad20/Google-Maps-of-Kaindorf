"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = MapScreen;
var react_native_1 = require("react-native");
var LanguageContext_1 = require("@/components/context/LanguageContext");
var react_1 = require("react");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var Ionicons_1 = require("@expo/vector-icons/Ionicons");
var MapsOfKaindorf_1 = require("@/components/MapsOfKaindorf");
var ParallaxScrollView_1 = require("@/components/ParallaxScrollView");
var QRScanner_1 = require("@/components/QRScanner");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
function MapScreen() {
    var _a;
    var texts = (0, react_1.useContext)(LanguageContext_1.LanguageContext).texts;
    var windowHeight = (0, react_native_1.useWindowDimensions)().height;
    var _b = (0, react_1.useState)(false), qrVisible = _b[0], setQrVisible = _b[1];
    var _c = (0, react_1.useState)('UG'), floor = _c[0], setFloor = _c[1];
    // Dynamische Höhe berechnen
    var MAP_HEIGHT = windowHeight * 0.460;
    var openQr = function () { return setQrVisible(true); };
    var closeQr = function () { return setQrVisible(false); };
    return (<react_native_safe_area_context_1.SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView_1.default headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }} headerImage={<ThemedView_1.ThemedView style={styles.headerTextContainer}>
                        <ThemedText_1.ThemedText style={styles.headerTextOuter}>
                            <ThemedText_1.ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText_1.ThemedText>
                        </ThemedText_1.ThemedText>
                    </ThemedView_1.ThemedView>} headerHeight={80}>
                <react_native_1.View style={styles.titleRow}>
                    <ThemedText_1.ThemedText type="title">{(_a = texts === null || texts === void 0 ? void 0 : texts.mapTitle) !== null && _a !== void 0 ? _a : 'Find your Way'}</ThemedText_1.ThemedText>
                    <react_native_1.TouchableOpacity style={styles.qrCircle} onPress={openQr}>
                        <Ionicons_1.default name="qr-code-outline" size={26} color="#fff"/>
                    </react_native_1.TouchableOpacity>
                </react_native_1.View>

                <react_native_1.View style={styles.mapWrapper}>
                    <react_native_gesture_handler_1.GestureHandlerRootView style={styles.mapContainerWrapper}>
                        <MapsOfKaindorf_1.default floor={floor} onReachStairs={function () { return setFloor('OG'); }} onQrPress={openQr} showLogger={false}/>
                    </react_native_gesture_handler_1.GestureHandlerRootView>

                    <react_native_1.View style={[styles.verticalButtonWrapper, { height: MAP_HEIGHT }]}>
                        <react_native_1.TouchableOpacity onPress={function () { return setFloor('OG'); }} style={[
            styles.longButton,
            styles.buttonTop,
            floor === 'OG' && styles.active
        ]}>
                            <ThemedText_1.ThemedText style={styles.buttonText}>OG</ThemedText_1.ThemedText>
                        </react_native_1.TouchableOpacity>
                        <react_native_1.TouchableOpacity onPress={function () { return setFloor('UG'); }} style={[
            styles.longButton,
            styles.buttonBottom,
            floor === 'UG' && styles.active
        ]}>
                            <ThemedText_1.ThemedText style={styles.buttonText}>UG</ThemedText_1.ThemedText>
                        </react_native_1.TouchableOpacity>
                    </react_native_1.View>
                </react_native_1.View>

                {qrVisible && <QRScanner_1.default visible={qrVisible} onClose={closeQr} onScan={closeQr}/>}
            </ParallaxScrollView_1.default>
        </react_native_safe_area_context_1.SafeAreaView>);
}
var HEADER_HEIGHT = 150;
var styles = react_native_1.StyleSheet.create({
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderRightColor: '#a453ec',
        borderLeftColor: '#a453ec',
        borderRightWidth: 3,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderBottomColor: '#a453ec',
    },
    headerTextOuter: {},
    headerText: {
        color: '#a453ec',
        fontSize: 24,
        fontFamily: 'Nice',
    },
    headerGear: { marginLeft: 20 },
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
        paddingHorizontal: 20,
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
    verticalButtonWrapper: {
        position: 'absolute',
        right: -25,
        top: 0,
        justifyContent: 'space-between',
    },
    longButton: {
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e5e5',
        borderRadius: 12,
    },
    buttonTop: {
        flex: 1,
    },
    buttonBottom: {
        flex: 1,
    },
    active: {
        backgroundColor: '#7A3BDF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
});
