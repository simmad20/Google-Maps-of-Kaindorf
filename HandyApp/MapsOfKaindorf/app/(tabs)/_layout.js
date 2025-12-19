"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TabLayout;
var react_1 = require("react");
var ThemeContext_1 = require("@/components/context/ThemeContext");
var Colors_1 = require("@/constants/Colors");
var FontAwesome_1 = require("@expo/vector-icons/FontAwesome");
var expo_router_1 = require("expo-router");
function TabBarIcon(props) {
    return <FontAwesome_1.default size={28} style={{ marginBottom: -3 }} {...props}/>;
}
function TabLayout() {
    var isDarkMode = (0, react_1.useContext)(ThemeContext_1.ThemeContext).isDarkMode;
    var colorScheme = isDarkMode ? 'dark' : 'light';
    return (<expo_router_1.Tabs screenOptions={{
            tabBarActiveTintColor: Colors_1.Colors[colorScheme].tint,
            headerShown: false,
            tabBarStyle: { backgroundColor: '#2d283e' },
        }}>
            <expo_router_1.Tabs.Screen name="index" options={{
            title: 'Home',
            tabBarIcon: function (_a) {
                var color = _a.color;
                return <TabBarIcon name="home" color={color}/>;
            },
        }}/>
            <expo_router_1.Tabs.Screen name="chooseTeacher" options={{
            title: 'Select',
            tabBarIcon: function (_a) {
                var color = _a.color;
                return <TabBarIcon name="user" color={color}/>;
            },
        }}/>
            <expo_router_1.Tabs.Screen name="map" options={{
            title: 'Map',
            tabBarIcon: function (_a) {
                var color = _a.color;
                return <TabBarIcon name="map" color={color}/>;
            },
        }}/>
        </expo_router_1.Tabs>);
}
