import React, { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/components/context/ThemeContext';
import { useEvent } from '@/components/context/EventContext';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, StyleSheet } from 'react-native';

function TabBarIcon(props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string;
    focused: boolean;
    accentColor: string;
}) {
    return (
        <View style={[
            styles.iconContainer,
            props.focused && [
                styles.iconContainerFocused,
                { backgroundColor: props.accentColor + '20' }
            ]
        ]}>
            <FontAwesome
                size={22}
                style={{
                    marginBottom: props.focused ? 6 : 0,
                    transform: [{ scale: props.focused ? 1.1 : 1 }]
                }}
                name={props.name}
                color={props.focused ? props.accentColor : props.color}
            />
            {props.focused && (
                <View style={[styles.activeDot, { backgroundColor: props.accentColor }]} />
            )}
        </View>
    );
}

export default function TabLayout() {
    const { isDarkMode } = useContext<ThemeContextType>(ThemeContext);
    const { activeEvent } = useEvent();
    const colorScheme = isDarkMode ? 'dark' : 'light';

    const accent = activeEvent?.themeColor || '#7A3BDF';
    const isDarkTheme = isDarkMode || colorScheme === 'dark';

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: accent,
                tabBarInactiveTintColor: isDarkTheme ? '#aaa' : '#888',
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: isDarkTheme ? '#1a1a2e' : '#fff',
                    borderTopWidth: 0,
                    height: 75,
                    paddingBottom: 12,
                    paddingTop: 8,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                },
                tabBarBackground: () => (
                    <View style={[
                        styles.background,
                        { backgroundColor: isDarkTheme ? '#1a1a2e' : '#fff' }
                    ]}>
                        {/* Hintergrund mit leichter Transparenz */}
                        <View style={styles.blurOverlay} />
                    </View>
                ),
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name="home"
                            color={color}
                            focused={focused}
                            accentColor={accent}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="chooseTeacher"
                options={{
                    title: 'Auswahl',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name="user"
                            color={color}
                            focused={focused}
                            accentColor={accent}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    title: 'Karte',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon
                            name="map"
                            color={color}
                            focused={focused}
                            accentColor={accent}
                        />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginTop: 4,
    },
    iconContainerFocused: {
        borderRadius: 22,
    },
    activeDot: {
        position: 'absolute',
        bottom: -6,
        width: 4,
        height: 4,
        borderRadius: 2,
    },
    background: {
        flex: 1,
    },
    blurOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
});