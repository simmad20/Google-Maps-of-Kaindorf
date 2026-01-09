"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TabTwoScreen;
var Ionicons_1 = require("@expo/vector-icons/Ionicons");
var ParallaxScrollView_1 = require("@/components/ParallaxScrollView");
var react_native_1 = require("react-native");
var TeacherSelection_1 = require("@/components/TeacherSelection");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
function TabTwoScreen() {
    return (<ParallaxScrollView_1.default headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }} headerImage={<Ionicons_1.default size={310} name="code-slash" style={styles.headerImage}/>}>
            <ThemedView_1.ThemedView style={styles.titleContainer}>
                <ThemedText_1.ThemedText type="title">Choose a Teacher</ThemedText_1.ThemedText>
            </ThemedView_1.ThemedView>

            <TeacherSelection_1.default />

        </ParallaxScrollView_1.default>);
}
var styles = react_native_1.StyleSheet.create({
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
        alignItems: 'center'
    },
});
