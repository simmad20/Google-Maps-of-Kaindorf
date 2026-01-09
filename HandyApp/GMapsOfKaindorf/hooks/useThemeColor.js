"use strict";
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeColor = useThemeColor;
var Colors_1 = require("@/constants/Colors");
var react_1 = require("react");
var ThemeContext_1 = require("@/components/context/ThemeContext");
function useThemeColor(props, colorName) {
    var isDarkMode = (0, react_1.useContext)(ThemeContext_1.ThemeContext).isDarkMode;
    var theme = isDarkMode ? 'dark' : 'light';
    var colorFromProps = props[theme];
    if (colorFromProps) {
        return colorFromProps;
    }
    else {
        return Colors_1.Colors[theme][colorName];
    }
}
