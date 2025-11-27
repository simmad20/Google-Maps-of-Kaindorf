import React, { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/components/context/ThemeContext';

import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable } from 'react-native';
import { Tabs } from 'expo-router';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: { name: React.ComponentProps<typeof FontAwesome>['name']; color: string }) {
    return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
    const { isDarkMode } = useContext<ThemeContextType>(ThemeContext);
    const colorScheme = isDarkMode ? 'dark' : 'light';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: useClientOnlyValue(false, true),
                tabBarStyle: { backgroundColor: '#2d283e' },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
                }}
            />
            <Tabs.Screen
                name="chooseTeacher"
                options={{
                    title: 'Select',
                    tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({ color }) => <TabBarIcon name="map" color={color} />,
                }}
            />
        </Tabs>
    );
}