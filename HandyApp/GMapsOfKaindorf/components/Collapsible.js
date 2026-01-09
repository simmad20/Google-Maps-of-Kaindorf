"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collapsible = Collapsible;
var Ionicons_1 = require("@expo/vector-icons/Ionicons");
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
var Colors_1 = require("@/constants/Colors");
var ThemeContext_1 = require("@/components/context/ThemeContext");
function Collapsible(_a) {
    var children = _a.children, title = _a.title;
    var _b = (0, react_1.useState)(false), isOpen = _b[0], setIsOpen = _b[1];
    var isDarkMode = (0, react_1.useContext)(ThemeContext_1.ThemeContext).isDarkMode;
    var theme = isDarkMode ? 'dark' : 'light';
    return (<ThemedView_1.ThemedView>
            <react_native_1.TouchableOpacity style={styles.heading} onPress={function () { return setIsOpen(function (value) { return !value; }); }} activeOpacity={0.8}>
                <Ionicons_1.default name={isOpen ? 'chevron-down' : 'chevron-forward-outline'} size={18} color={theme === 'light' ? Colors_1.Colors.light.icon : Colors_1.Colors.dark.icon}/>
                <ThemedText_1.ThemedText type="defaultSemiBold">{title}</ThemedText_1.ThemedText>
            </react_native_1.TouchableOpacity>
            {isOpen && <ThemedView_1.ThemedView style={styles.content}>{children}</ThemedView_1.ThemedView>}
        </ThemedView_1.ThemedView>);
}
var styles = react_native_1.StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    content: {
        marginTop: 6,
        marginLeft: 24,
    },
});
