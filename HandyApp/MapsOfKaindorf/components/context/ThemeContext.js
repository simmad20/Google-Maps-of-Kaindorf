"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeProvider = exports.ThemeContext = void 0;
var react_1 = require("react");
var react_native_1 = require("react-native");
exports.ThemeContext = (0, react_1.createContext)({
    isDarkMode: false,
    toggleTheme: function () { return null; },
});
var ThemeProvider = function (_a) {
    var children = _a.children;
    var systemScheme = (0, react_native_1.useColorScheme)();
    var _b = (0, react_1.useState)(systemScheme === 'dark'), isDarkMode = _b[0], setIsDarkMode = _b[1];
    var toggleTheme = function () { return setIsDarkMode(function (prev) { return !prev; }); };
    return (<exports.ThemeContext.Provider value={{ isDarkMode: isDarkMode, toggleTheme: toggleTheme }}>
      {children}
    </exports.ThemeContext.Provider>);
};
exports.ThemeProvider = ThemeProvider;
