"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ChooseTeacherScreen;
var LanguageContext_1 = require("@/components/context/LanguageContext");
var ParallaxScrollView_1 = require("@/components/ParallaxScrollView");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var react_native_1 = require("react-native");
var TeacherSelection_1 = require("@/components/TeacherSelection");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
var react_1 = require("react");
function ChooseTeacherScreen() {
    var texts = (0, react_1.useContext)(LanguageContext_1.LanguageContext).texts;
    return (<react_native_safe_area_context_1.SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView_1.default headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }} headerImage={<ThemedView_1.ThemedView style={styles.headerTextContainer}>
                        <ThemedText_1.ThemedText style={styles.headerTextOuter}>
                            <ThemedText_1.ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText_1.ThemedText>
                        </ThemedText_1.ThemedText>
                    </ThemedView_1.ThemedView>} headerHeight={80}>
                <ThemedView_1.ThemedView style={styles.titleContainer}>
                    <ThemedText_1.ThemedText type="title">{texts.selectText}</ThemedText_1.ThemedText>
                </ThemedView_1.ThemedView>
                <TeacherSelection_1.default />
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
        alignItems: 'center'
    },
    logo: {
        width: '100%',
        height: '100%'
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
