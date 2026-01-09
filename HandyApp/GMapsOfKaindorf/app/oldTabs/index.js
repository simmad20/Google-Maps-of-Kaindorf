"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomeScreen;
var react_native_1 = require("react-native");
var HelloWave_1 = require("@/components/HelloWave");
var ParallaxScrollView_1 = require("@/components/ParallaxScrollView");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
var react_1 = require("react");
var LanguageContext_1 = require("@/components/context/LanguageContext");
function HomeScreen() {
    var _a = (0, react_1.useContext)(LanguageContext_1.LanguageContext), language = _a.language, oldTexts = _a.oldTexts, switchLanguage = _a.switchLanguage;
    return (<ParallaxScrollView_1.default headerBackgroundColor={{ light: '#2d283e', dark: '#2d283e' }} // Set background color of the header
     headerImage={(<ThemedView_1.ThemedView style={styles.headerTextContainer}>
                    <react_native_1.Text style={styles.headerText}>
                        Maps of Kaindorf
                    </react_native_1.Text>
                </ThemedView_1.ThemedView>)} headerHeight={70}>
            <ThemedView_1.ThemedView style={styles.titleContainer}>
                <ThemedText_1.ThemedText type="title">{oldTexts.greeting}</ThemedText_1.ThemedText>
                <HelloWave_1.HelloWave />
            </ThemedView_1.ThemedView>
            <ThemedView_1.ThemedView style={styles.stepContainer}>
                <ThemedText_1.ThemedText type="subtitle">{oldTexts.step1.title}</ThemedText_1.ThemedText>
                <ThemedText_1.ThemedText>
                    {oldTexts.step1.desc.normal1}
                    <ThemedText_1.ThemedText type="defaultSemiBold">{oldTexts.step1.desc.bold1}</ThemedText_1.ThemedText>
                    {oldTexts.step1.desc.normal2}
                    <ThemedText_1.ThemedText type="defaultSemiBold">{react_native_1.Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}</ThemedText_1.ThemedText>
                    {oldTexts.step1.desc.normal3}
                </ThemedText_1.ThemedText>
            </ThemedView_1.ThemedView>
            <ThemedView_1.ThemedView style={styles.stepContainer}>
                <ThemedText_1.ThemedText type="subtitle">{oldTexts.step2.title}</ThemedText_1.ThemedText>
                <ThemedText_1.ThemedText>
                    {oldTexts.step2.desc.normal1}
                </ThemedText_1.ThemedText>
            </ThemedView_1.ThemedView>
            <ThemedView_1.ThemedView style={styles.stepContainer}>
                <ThemedText_1.ThemedText type="subtitle">{oldTexts.step3.title}</ThemedText_1.ThemedText>
                <ThemedText_1.ThemedText>
                    {oldTexts.step3.desc.normal1}
                    <ThemedText_1.ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold1}</ThemedText_1.ThemedText>
                    {oldTexts.step3.desc.normal2}
                    <ThemedText_1.ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold2}</ThemedText_1.ThemedText>
                    {oldTexts.step3.desc.normal3}
                    <ThemedText_1.ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold3}</ThemedText_1.ThemedText>
                    {oldTexts.step3.desc.normal4}
                    <ThemedText_1.ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold4}</ThemedText_1.ThemedText>
                    {oldTexts.step3.desc.normal5}
                </ThemedText_1.ThemedText>
            </ThemedView_1.ThemedView>
            <react_native_1.Button title={oldTexts.otherLanguage} onPress={function () { return switchLanguage(); }}/>
        </ParallaxScrollView_1.default>);
}
var styles = react_native_1.StyleSheet.create({
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e', // Background color of the header
        height: 70, // Adjust as needed for header height
    },
    headerText: {
        color: '#a453ec', // Text color
        fontSize: 25, // Adjust the font size as needed
        fontFamily: 'Nice'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
});
