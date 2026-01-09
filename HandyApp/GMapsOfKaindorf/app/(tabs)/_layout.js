"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TabLayout;
var react_1 = require("react");
var Colors_1 = require("@/constants/Colors");
var TabBarIcon_1 = require("@/components/navigation/TabBarIcon");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("@/components/context/ThemeContext");
function TabLayout() {
    var isDarkMode = (0, react_1.useContext)(ThemeContext_1.ThemeContext).isDarkMode;
    var colorScheme = isDarkMode ? 'dark' : 'light';
    return (<expo_router_1.Tabs screenOptions={{
            tabBarActiveTintColor: Colors_1.Colors[colorScheme !== null && colorScheme !== void 0 ? colorScheme : 'light'].tint,
            headerShown: false,
            tabBarStyle: { backgroundColor: '#2d283e' }
        }}>
            <expo_router_1.Tabs.Screen name="index" options={{
            title: 'Home',
            tabBarIcon: function (_a) {
                var color = _a.color, focused = _a.focused;
                return (<TabBarIcon_1.TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>);
            },
        }}/>
            <expo_router_1.Tabs.Screen name="chooseTeacher" options={{
            title: 'Select',
            tabBarIcon: function (_a) {
                var color = _a.color, focused = _a.focused;
                return (<TabBarIcon_1.TabBarIcon name={focused ? 'person' : 'person-outline'} color={color}/>);
            },
        }}/>
            <expo_router_1.Tabs.Screen name="map" options={{
            title: 'Map',
            tabBarIcon: function (_a) {
                var color = _a.color, focused = _a.focused;
                return (<TabBarIcon_1.TabBarIcon name={focused ? 'map' : 'map-outline'} color={color}/>);
            },
        }}/>
        </expo_router_1.Tabs>);
}
