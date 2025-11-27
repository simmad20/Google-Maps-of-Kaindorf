import { StyleSheet, Switch, TouchableOpacity } from 'react-native';

import FeatherIcon from 'react-native-vector-icons/Feather';
import { LanguageContext } from '@/components/context/LanguageContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ThemeContext } from '@/components/context/ThemeContext';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext } from 'react';

export default function SettingsScreen() {
    const { isDarkMode, toggleTheme } = useContext(ThemeContext);
    const { texts, switchLanguage } = useContext(LanguageContext);

    return (
        <>
            <Stack.Screen
                options={{
                    title: texts.settings,
                    headerStyle: { backgroundColor: '#2d283e' },
                    headerTintColor: '#a453ec',
                }}
            />
            <SafeAreaView style={styles.safeContainer}>
                <ThemedView style={styles.container}>
                    {/* Preferences Section */}
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

                        {/* Language */}
                        <TouchableOpacity style={styles.row} onPress={switchLanguage}>
                            <ThemedView style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                                <FeatherIcon name="globe" size={20} color="#fff" />
                            </ThemedView>
                            <ThemedText style={styles.rowLabel}>Language</ThemedText>
                            <ThemedView style={styles.rowSpacer} />
                            <ThemedText style={styles.rowValue}>{texts.language}</ThemedText>
                            <FeatherIcon name="chevron-right" size={20} color="#C6C6C6" />
                        </TouchableOpacity>

                        {/* Dark Mode */}
                        <ThemedView style={styles.row}>
                            <ThemedView style={[styles.rowIcon, { backgroundColor: '#007AFF' }]}>
                                <FeatherIcon name="moon" size={20} color="#fff" />
                            </ThemedView>
                            <ThemedText style={styles.rowLabel}>Dark Mode</ThemedText>
                            <ThemedView style={styles.rowSpacer} />
                            <Switch value={isDarkMode} onValueChange={toggleTheme} />
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeContainer: { flex: 1 },
    container: { paddingVertical: 24 },
    section: { paddingTop: 12 },
    sectionTitle: {
        marginVertical: 8,
        marginHorizontal: 24,
        fontSize: 14,
        fontWeight: '600',
        color: '#a7a7a7',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    rowIcon: { width: 30, height: 30, borderRadius: 4, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    rowLabel: { fontSize: 17, fontWeight: '500' },
    rowSpacer: { flex: 1 },
    rowValue: { fontSize: 17, fontWeight: '500', color: '#8B8B8B', marginRight: 4 },
});