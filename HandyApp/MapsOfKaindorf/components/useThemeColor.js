"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeColor = useThemeColor;
var ThemeContext_1 = require("@/components/context/ThemeContext");
var Colors_1 = require("@/constants/Colors");
var react_1 = require("react");
function useThemeColor(props, colorName) {
    var _a;
    var isDarkMode = (0, react_1.useContext)(ThemeContext_1.ThemeContext).isDarkMode;
    var theme = isDarkMode ? 'dark' : 'light';
    if (!props)
        return Colors_1.Colors[theme][colorName];
    return (_a = props[theme]) !== null && _a !== void 0 ? _a : Colors_1.Colors[theme][colorName];
}
