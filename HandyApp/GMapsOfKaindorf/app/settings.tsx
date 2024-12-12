import React, {useContext} from 'react';
import {SafeAreaView, StyleSheet, Switch, Text, TouchableOpacity, View} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import {Stack} from "expo-router";
import FeatherIcon from "react-native-vector-icons/Feather"
import {ThemeContext, ThemeContextType} from "@/components/context/ThemeContext";
import {ThemedView} from "@/components/ThemedView";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";

export default function Settings() {
    const {isDarkMode, toggleTheme} = useContext<ThemeContextType>(ThemeContext)
    const {language, switchLanguage, texts} = useContext<LanguageContextType>(LanguageContext);
    return (
        <>
            <Stack.Screen
                options={{title: 'Settings', headerStyle: {backgroundColor: '#2d283e'}, headerTintColor: '#a453ec'}}/>
            <SafeAreaView style={styles.safeContainer}>
                <ThemedView style={styles.container}>
                    <ThemedView style={styles.section}>
                        <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>

                        <ThemedView style={styles.sectionBody}>
                            <ThemedView style={[styles.rowWrapper, styles.rowFirst]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        switchLanguage()
                                    }}
                                    style={styles.row}>
                                    <ThemedView
                                        style={[styles.rowIcon, {backgroundColor: '#fe9400'}]}>
                                        <FeatherIcon
                                            color="#fff"
                                            name="globe"
                                            size={20}/>
                                    </ThemedView>

                                    <ThemedText style={styles.rowLabel}>Language</ThemedText>

                                    <ThemedView style={styles.rowSpacer}/>

                                    <ThemedText style={styles.rowValue}>{texts.language}</ThemedText>

                                    <FeatherIcon
                                        color="#C6C6C6"
                                        name="chevron-right"
                                        size={20}/>
                                </TouchableOpacity>
                            </ThemedView>

                            <ThemedView style={styles.rowWrapper}>
                                <ThemedView style={styles.row}>
                                    <ThemedView
                                        style={[styles.rowIcon, {backgroundColor: '#007AFF'}]}>
                                        <FeatherIcon
                                            color="#fff"
                                            name="moon"
                                            size={20}/>
                                    </ThemedView>

                                    <ThemedText style={styles.rowLabel}>Dark Mode</ThemedText>

                                    <ThemedView style={styles.rowSpacer}/>

                                    <Switch value={isDarkMode} onValueChange={toggleTheme}/>
                                </ThemedView>
                            </ThemedView>

                            <ThemedView style={styles.rowWrapper}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // handle onPress
                                    }}
                                    style={styles.row}>
                                    <ThemedView
                                        style={[styles.rowIcon, {backgroundColor: '#32c759'}]}>
                                        <FeatherIcon
                                            color="#fff"
                                            name="navigation"
                                            size={20}/>
                                    </ThemedView>

                                    <ThemedText style={styles.rowLabel}>Location</ThemedText>

                                    <ThemedView style={styles.rowSpacer}/>

                                    <ThemedText style={styles.rowValue}>Vienna, AT</ThemedText>

                                    <FeatherIcon
                                        color="#C6C6C6"
                                        name="chevron-right"
                                        size={20}/>
                                </TouchableOpacity>
                            </ThemedView>
                        </ThemedView>
                    </ThemedView>
                </ThemedView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1
    },
    container: {
        paddingVertical: 24,
        paddingHorizontal: 0,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    contentFooter: {
        marginTop: 24,
        fontSize: 13,
        fontWeight: '500',
        color: '#929292',
        textAlign: 'center',
    },
    header: {
        paddingHorizontal: 24,
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#1d1d1d',
    },
    headerSubtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#929292',
        marginTop: 6,
    },
    section: {
        paddingTop: 12,
    },
    sectionTitle: {
        marginVertical: 8,
        marginHorizontal: 24,
        fontSize: 14,
        fontWeight: '600',
        color: '#a7a7a7',
        textTransform: 'uppercase',
        letterSpacing: 1.2,
    },
    sectionBody: {
        paddingLeft: 24,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e3e3e3',
    },
    /** Row */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingRight: 16,
        height: 50,
    },
    rowWrapper: {
        borderTopWidth: 1,
        borderColor: '#e3e3e3',
    },
    rowFirst: {
        borderTopWidth: 0,
    },
    rowIcon: {
        width: 30,
        height: 30,
        borderRadius: 4,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    rowLabel: {
        fontSize: 17,
        fontWeight: '500'
    },
    rowSpacer: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    rowValue: {
        fontSize: 17,
        fontWeight: '500',
        color: '#8B8B8B',
        marginRight: 4,
    },
})