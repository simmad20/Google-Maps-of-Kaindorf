"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Feedback;
var LanguageContext_1 = require("@/components/context/LanguageContext");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
function Feedback() {
    var texts = (0, react_1.useContext)(LanguageContext_1.LanguageContext).texts;
    var _a = (0, react_1.useState)(true), show = _a[0], setShow = _a[1];
    if (!show)
        return null;
    var handleFeedback = function (feedback) {
        console.log('Feedback:', feedback);
        setShow(false);
    };
    return (<ThemedView_1.ThemedView style={styles.container}>
      <ThemedText_1.ThemedText style={styles.text}>{texts.feedback}</ThemedText_1.ThemedText>
      <ThemedText_1.ThemedText style={styles.emoji}>
        <react_native_1.Text onPress={function () { return handleFeedback('GOOD'); }}>😊</react_native_1.Text>
        <react_native_1.Text onPress={function () { return handleFeedback('MID'); }}>😑</react_native_1.Text>
        <react_native_1.Text onPress={function () { return handleFeedback('BAD'); }}>☹️️</react_native_1.Text>
      </ThemedText_1.ThemedText>
    </ThemedView_1.ThemedView>);
}
var styles = react_native_1.StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center', elevation: 3 },
    emoji: { fontSize: 40, lineHeight: 50, textAlign: 'center' },
    text: { textAlign: 'center' },
});
