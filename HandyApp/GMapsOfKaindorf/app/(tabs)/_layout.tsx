import React, {useEffect} from 'react';

import {Colors} from '@/constants/Colors';
import {TabBarIcon} from '@/components/navigation/TabBarIcon';
import {Tabs} from 'expo-router';
import {useColorScheme} from '@/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();
    useEffect(() => {
        console.log(colorScheme);
    });

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
                headerShown: false,
                tabBarStyle: {backgroundColor: '#2d283e'}
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="chooseTeacher"
                options={{
                    title: 'Select',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color}/>
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Map',
                    tabBarIcon: ({color, focused}) => (
                        <TabBarIcon name={focused ? 'map' : 'map-outline'} color={color}/>
                    ),
                }}
            />
        </Tabs>
    );
}
