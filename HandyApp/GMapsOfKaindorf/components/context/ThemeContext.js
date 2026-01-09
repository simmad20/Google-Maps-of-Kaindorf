"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = exports.ThemeContext = void 0;
var react_1 = require("react");
var useColorScheme_1 = require("@/hooks/useColorScheme");
exports.ThemeContext = (0, react_1.createContext)({
    isDarkMode: false,
    toggleTheme: function () { return null; }
});
var ThemeProvider = function (_a) {
    var children = _a.children;
    var scheme = (0, useColorScheme_1.useColorScheme)();
    var _b = (0, react_1.useState)(scheme === "dark"), isDarkMode = _b[0], setIsDarkMode = _b[1];
    var toggleTheme = function () {
        setIsDarkMode(function (prevMode) { return !prevMode; });
    };
    return (<exports.ThemeContext.Provider value={{ isDarkMode: isDarkMode, toggleTheme: toggleTheme }}>
            {children}
        </exports.ThemeContext.Provider>);
};
exports.ThemeProvider = ThemeProvider;
