"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelloWave = HelloWave;
var react_native_reanimated_1 = require("react-native-reanimated");
var react_native_1 = require("react-native");
var ThemedText_1 = require("@/components/ThemedText");
function HelloWave() {
    var rotation = (0, react_native_reanimated_1.useSharedValue)(0);
    rotation.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(25, { duration: 150 }), (0, react_native_reanimated_1.withTiming)(0, { duration: 150 })), 4);
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({ transform: [{ rotate: "".concat(rotation.value, "deg") }] }); });
    return (<react_native_reanimated_1.default.View style={animatedStyle}>
      <ThemedText_1.ThemedText style={styles.text}>👋</ThemedText_1.ThemedText>
    </react_native_reanimated_1.default.View>);
}
var styles = react_native_1.StyleSheet.create({
    text: { fontSize: 28, lineHeight: 32, marginTop: -6 },
});
