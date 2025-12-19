"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParallaxScrollView;
var react_native_reanimated_1 = require("react-native-reanimated");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemeContext_1 = require("@/components/context/ThemeContext");
var ThemedView_1 = require("@/components/ThemedView");
function ParallaxScrollView(_a) {
    var children = _a.children, headerImage = _a.headerImage, headerBackgroundColor = _a.headerBackgroundColor, headerHeight = _a.headerHeight;
    var isDarkMode = (0, react_1.useContext)(ThemeContext_1.ThemeContext).isDarkMode;
    var scrollRef = (0, react_native_reanimated_1.useAnimatedRef)();
    var scrollOffset = (0, react_native_reanimated_1.useScrollViewOffset)(scrollRef);
    var HEADER_HEIGHT = headerHeight !== null && headerHeight !== void 0 ? headerHeight : 150;
    var headerAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [
            {
                translateY: (0, react_native_reanimated_1.interpolate)(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]),
            },
            {
                scale: (0, react_native_reanimated_1.interpolate)(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
            },
        ],
    }); });
    return (<react_native_1.SafeAreaView style={styles.safeContainer}>
      <ThemedView_1.ThemedView style={styles.container}>
        <react_native_reanimated_1.default.ScrollView ref={scrollRef} scrollEventThrottle={16}>
          <react_native_reanimated_1.default.View style={[
            styles.header,
            {
                backgroundColor: headerBackgroundColor[isDarkMode ? "dark" : "light"],
                height: HEADER_HEIGHT,
            },
            headerAnimatedStyle,
        ]}>
            {headerImage}
          </react_native_reanimated_1.default.View>
          <ThemedView_1.ThemedView style={styles.content}>{children}</ThemedView_1.ThemedView>
        </react_native_reanimated_1.default.ScrollView>
      </ThemedView_1.ThemedView>
    </react_native_1.SafeAreaView>);
}
var styles = react_native_1.StyleSheet.create({
    safeContainer: { flex: 1 },
    container: { flex: 1 },
    header: { backgroundColor: 'white' },
    content: { flex: 1, padding: 32, gap: 16, overflow: 'hidden' },
});
