"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SettingsScreen;
var react_native_1 = require("react-native");
var Feather_1 = require("react-native-vector-icons/Feather");
var LanguageContext_1 = require("@/components/context/LanguageContext");
var react_native_safe_area_context_1 = require("react-native-safe-area-context");
var expo_router_1 = require("expo-router");
var ThemeContext_1 = require("@/components/context/ThemeContext");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
var react_1 = require("react");
function SettingsScreen() {
    var _a = (0, react_1.useContext)(ThemeContext_1.ThemeContext), isDarkMode = _a.isDarkMode, toggleTheme = _a.toggleTheme;
    var _b = (0, react_1.useContext)(LanguageContext_1.LanguageContext), texts = _b.texts, switchLanguage = _b.switchLanguage;
    return (<>
            <expo_router_1.Stack.Screen options={{
            title: texts.settings,
            headerStyle: { backgroundColor: '#2d283e' },
            headerTintColor: '#a453ec',
        }}/>
            <react_native_safe_area_context_1.SafeAreaView style={styles.safeContainer}>
                <ThemedView_1.ThemedView style={styles.container}>
                    {/* Preferences Section */}
                    <ThemedView_1.ThemedView style={styles.section}>
                        <ThemedText_1.ThemedText style={styles.sectionTitle}>Preferences</ThemedText_1.ThemedText>

                        {/* Language */}
                        <react_native_1.TouchableOpacity style={styles.row} onPress={switchLanguage}>
                            <ThemedView_1.ThemedView style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                                <Feather_1.default name="globe" size={20} color="#fff"/>
                            </ThemedView_1.ThemedView>
                            <ThemedText_1.ThemedText style={styles.rowLabel}>Language</ThemedText_1.ThemedText>
                            <ThemedView_1.ThemedView style={styles.rowSpacer}/>
                            <ThemedText_1.ThemedText style={styles.rowValue}>{texts.language}</ThemedText_1.ThemedText>
                            <Feather_1.default name="chevron-right" size={20} color="#C6C6C6"/>
                        </react_native_1.TouchableOpacity>

                        {/* Dark Mode */}
                        <ThemedView_1.ThemedView style={styles.row}>
                            <ThemedView_1.ThemedView style={[styles.rowIcon, { backgroundColor: '#007AFF' }]}>
                                <Feather_1.default name="moon" size={20} color="#fff"/>
                            </ThemedView_1.ThemedView>
                            <ThemedText_1.ThemedText style={styles.rowLabel}>Dark Mode</ThemedText_1.ThemedText>
                            <ThemedView_1.ThemedView style={styles.rowSpacer}/>
                            <react_native_1.Switch value={isDarkMode} onValueChange={toggleTheme}/>
                        </ThemedView_1.ThemedView>
                    </ThemedView_1.ThemedView>
                </ThemedView_1.ThemedView>
            </react_native_safe_area_context_1.SafeAreaView>
        </>);
}
var styles = react_native_1.StyleSheet.create({
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
