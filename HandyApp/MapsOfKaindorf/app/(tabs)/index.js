"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
var LanguageContext_1 = require("@/components/context/LanguageContext");
var react_native_1 = require("react-native");
var Feedback_1 = require("@/components/Feedback");
var HelloWave_1 = require("@/components/HelloWave");
var FontAwesome_1 = require("react-native-vector-icons/FontAwesome");
var ParallaxScrollView_1 = require("@/components/ParallaxScrollView");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
var react_1 = require("react");
var expo_router_1 = require("expo-router");
function HomeScreen() {
    var _a = (0, react_1.useContext)(LanguageContext_1.LanguageContext), texts = _a.texts, switchLanguage = _a.switchLanguage;
    var router = (0, expo_router_1.useRouter)();
    return (<react_native_safe_area_context_1.SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView_1.default headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }} headerImage={<ThemedView_1.ThemedView style={styles.headerTextContainer}>
                        <ThemedText_1.ThemedText style={styles.headerTextOuter}>
                            <ThemedText_1.ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText_1.ThemedText>
                            <react_native_1.Pressable style={styles.headerGear} onPress={function () { return router.push('/settings'); }}>
                                <FontAwesome_1.default name="gear" size={25} color="#a453ec"/>
                            </react_native_1.Pressable>
                        </ThemedText_1.ThemedText>
                    </ThemedView_1.ThemedView>} headerHeight={80}>
                <ThemedView_1.ThemedView style={styles.titleContainer}>
                    <ThemedText_1.ThemedText type="title">{texts.greeting}</ThemedText_1.ThemedText>
                    <HelloWave_1.HelloWave />
                </ThemedView_1.ThemedView>

                <ThemedView_1.ThemedView style={styles.stepContainer}>
                    <ThemedText_1.ThemedText type="default">{texts.desc}</ThemedText_1.ThemedText>
                </ThemedView_1.ThemedView>

                <ThemedView_1.ThemedView style={styles.stepContainer}>
                    <ThemedText_1.ThemedText type="default">{texts.nav}</ThemedText_1.ThemedText>
                </ThemedView_1.ThemedView>

                <react_native_1.Pressable style={styles.switchLanguageButton} onPress={function () { return switchLanguage(); }}>
                    <ThemedText_1.ThemedText style={styles.buttonText}>{texts.otherLanguage}</ThemedText_1.ThemedText>
                </react_native_1.Pressable>

                <Feedback_1.default />
            </ParallaxScrollView_1.default>
        </react_native_safe_area_context_1.SafeAreaView>);
}
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
    titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    stepContainer: { gap: 8, marginBottom: 8, fontFamily: 'Montserrat' },
    switchLanguageButton: { backgroundColor: '#2d283e', padding: 5, width: 100, borderRadius: 7 },
    buttonText: { color: '#a453ec', fontSize: 14, textAlign: 'center' },
});
