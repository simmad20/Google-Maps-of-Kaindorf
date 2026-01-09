"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemedText_1 = require("@/components/ThemedText");
var expo_router_1 = require("expo-router");
var Feather_1 = require("react-native-vector-icons/Feather");
var ThemeContext_1 = require("@/components/context/ThemeContext");
var ThemedView_1 = require("@/components/ThemedView");
var LanguageContext_1 = require("@/components/context/LanguageContext");
function Settings() {
    var _a = (0, react_1.useContext)(ThemeContext_1.ThemeContext), isDarkMode = _a.isDarkMode, toggleTheme = _a.toggleTheme;
    var _b = (0, react_1.useContext)(LanguageContext_1.LanguageContext), language = _b.language, switchLanguage = _b.switchLanguage, texts = _b.texts;
    return (<>
            <expo_router_1.Stack.Screen options={{
            title: texts.settings,
            headerStyle: { backgroundColor: '#2d283e' },
            headerTintColor: '#a453ec'
        }}/>
            <react_native_1.SafeAreaView style={styles.safeContainer}>
                <ThemedView_1.ThemedView style={styles.container}>
                    <ThemedView_1.ThemedView style={styles.section}>
                        <ThemedText_1.ThemedText style={styles.sectionTitle}>Preferences</ThemedText_1.ThemedText>

                        <ThemedView_1.ThemedView style={styles.sectionBody}>
                            <ThemedView_1.ThemedView style={[styles.rowWrapper, styles.rowFirst]}>
                                <react_native_1.TouchableOpacity onPress={function () {
            switchLanguage();
        }} style={styles.row}>
                                    <ThemedView_1.ThemedView style={[styles.rowIcon, { backgroundColor: '#fe9400' }]}>
                                        <Feather_1.default color="#fff" name="globe" size={20}/>
                                    </ThemedView_1.ThemedView>

                                    <ThemedText_1.ThemedText style={styles.rowLabel}>Language</ThemedText_1.ThemedText>

                                    <ThemedView_1.ThemedView style={styles.rowSpacer}/>

                                    <ThemedText_1.ThemedText style={styles.rowValue}>{texts.language}</ThemedText_1.ThemedText>

                                    <Feather_1.default color="#C6C6C6" name="chevron-right" size={20}/>
                                </react_native_1.TouchableOpacity>
                            </ThemedView_1.ThemedView>

                            <ThemedView_1.ThemedView style={styles.rowWrapper}>
                                <ThemedView_1.ThemedView style={styles.row}>
                                    <ThemedView_1.ThemedView style={[styles.rowIcon, { backgroundColor: '#007AFF' }]}>
                                        <Feather_1.default color="#fff" name="moon" size={20}/>
                                    </ThemedView_1.ThemedView>

                                    <ThemedText_1.ThemedText style={styles.rowLabel}>Dark Mode</ThemedText_1.ThemedText>

                                    <ThemedView_1.ThemedView style={styles.rowSpacer}/>

                                    <react_native_1.Switch value={isDarkMode} onValueChange={toggleTheme}/>
                                </ThemedView_1.ThemedView>
                            </ThemedView_1.ThemedView>

                            <ThemedView_1.ThemedView style={styles.rowWrapper}>
                                <react_native_1.TouchableOpacity onPress={function () {
            // handle onPress
        }} style={styles.row}>
                                    <ThemedView_1.ThemedView style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
                                        <Feather_1.default color="#fff" name="navigation" size={20}/>
                                    </ThemedView_1.ThemedView>

                                    <ThemedText_1.ThemedText style={styles.rowLabel}>Location</ThemedText_1.ThemedText>

                                    <ThemedView_1.ThemedView style={styles.rowSpacer}/>

                                    <ThemedText_1.ThemedText style={styles.rowValue}>Vienna, AT</ThemedText_1.ThemedText>

                                    <Feather_1.default color="#C6C6C6" name="chevron-right" size={20}/>
                                </react_native_1.TouchableOpacity>
                            </ThemedView_1.ThemedView>
                        </ThemedView_1.ThemedView>
                    </ThemedView_1.ThemedView>
                </ThemedView_1.ThemedView>
            </react_native_1.SafeAreaView>
        </>);
}
var styles = react_native_1.StyleSheet.create({
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
});
