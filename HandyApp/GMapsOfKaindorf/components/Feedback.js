"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFeedback = setFeedback;
exports.default = Feedback;
var react_native_1 = require("react-native");
var react_1 = require("react");
var ThemedView_1 = require("@/components/ThemedView");
var ThemedText_1 = require("@/components/ThemedText");
var LanguageContext_1 = require("@/components/context/LanguageContext");
function setFeedback(feedback) {
}
function Feedback() {
    var _a = (0, react_1.useContext)(LanguageContext_1.LanguageContext), language = _a.language, texts = _a.texts, switchLanguage = _a.switchLanguage;
    var _b = (0, react_1.useState)(true), show = _b[0], setShow = _b[1];
    (0, react_1.useEffect)(function () { }, [show]);
    if (show) {
        return (<ThemedView_1.ThemedView>
                <ThemedText_1.ThemedText style={styles.text}>{texts.feedback}</ThemedText_1.ThemedText>
                <ThemedText_1.ThemedText style={styles.emoji}>
                    <react_native_1.Text onPress={function () { return setFeedback('GOOD'); }}>😊</react_native_1.Text>
                    <react_native_1.Text onPress={function () { return setFeedback('MID'); }}>😑</react_native_1.Text>
                    <react_native_1.Text onPress={function () { return setFeedback('BAD'); }}>☹️️</react_native_1.Text>
                </ThemedText_1.ThemedText>
            </ThemedView_1.ThemedView>);
    }
    else {
        return (<></>);
    }
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3
    },
    emoji: {
        fontSize: 40,
        lineHeight: 50,
        textAlign: "center"
    },
    text: {
        textAlign: "center"
    }
});
