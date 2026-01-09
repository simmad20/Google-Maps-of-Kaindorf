"use strict";
// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabBarIcon = TabBarIcon;
var Ionicons_1 = require("@expo/vector-icons/Ionicons");
function TabBarIcon(_a) {
    var style = _a.style, rest = __rest(_a, ["style"]);
    return <Ionicons_1.default size={28} style={[{ marginBottom: -3 }, style]} {...rest}/>;
}
