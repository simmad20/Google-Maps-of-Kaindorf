import {useContext} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";
import {IObject} from "@/models/interfaces";
import {StyleSheet, View, StatusBar, Platform} from "react-native";
import {ThemedText} from "@/components/ThemedText";
import ObjectSelection from "@/components/ObjectSelection";
import {ObjectContext, ObjectContextType} from "@/components/context/ObjectContext";
import {useEvent} from '@/components/context/EventContext';
import {useRouter} from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LinearGradient} from 'expo-linear-gradient';
import {useTheme} from '@/app/hooks/useTheme';

export default function ChooseTeacherScreen() {
    const {texts} = useContext<LanguageContextType>(LanguageContext);
    const {setSelectedObject} = useContext<ObjectContextType>(ObjectContext);
    const {activeEvent} = useEvent();
    const router = useRouter();
    const {isDarkMode} = useTheme();

    const handleTeacherSelect = (object: IObject) => {
        console.log("Selected object:", object);
        setSelectedObject(object);
        router.push('/map');
    };

    const accent = activeEvent?.themeColor ?? '#7A3BDF';

    // Theme-basierte Farben
    const themeColors = {
        background: isDarkMode ? '#0f172a' : '#f8fafc',
        cardBackground: isDarkMode ? '#1e293b' : '#ffffff',
        textPrimary: isDarkMode ? '#f1f5f9' : '#1e293b',
        textSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
        border: isDarkMode ? '#334155' : '#e2e8f0',
        gradientStart: isDarkMode ? '#0f172a' : '#f8fafc',
        gradientEnd: isDarkMode ? '#1e293b' : '#f1f5f9',
    };

    const getColorWithAlpha = (color: string, alpha: number) => {
        const alphaValue = isDarkMode ? Math.min(alpha + 0.1, 0.9) : alpha;
        return `${color}${Math.floor(alphaValue * 255).toString(16).padStart(2, '0')}`;
    };

    return (
        <View style={[styles.container, {backgroundColor: themeColors.background}]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={themeColors.background}
            />

            {/* Modern Top Bar */}
            <LinearGradient
                colors={[themeColors.gradientStart, themeColors.gradientEnd]}
                style={[styles.topBar, {borderBottomColor: themeColors.border}]}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
            >
                <View style={styles.topBarContent}>
                    <View style={styles.backSection}>
                        <View
                            style={[styles.backButton, {
                                backgroundColor: getColorWithAlpha(accent, 0.15),
                                borderColor: themeColors.border
                            }]}
                            onTouchEnd={() => router.back()}
                        >
                            <Icon name="arrow-left" size={18} color={accent}/>
                        </View>
                        <View style={styles.titleSection}>
                            <ThemedText style={[styles.title, {color: themeColors.textPrimary}]}>
                                {texts.selectText || 'Lehrer auswählen'}
                            </ThemedText>
                            <ThemedText style={[styles.subtitle, {color: themeColors.textSecondary}]}>
                                Wähle dein Suchobjekt
                            </ThemedText>
                        </View>
                    </View>

                    <View
                        style={[styles.settingsButton, {
                            backgroundColor: getColorWithAlpha(accent, 0.15),
                            borderColor: themeColors.border
                        }]}
                        onTouchEnd={() => router.push('/settings')}
                    >
                        <Icon name="gear" size={18} color={accent}/>
                    </View>
                </View>
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
                <ObjectSelection
                    onSelect={handleTeacherSelect}
                    accentColor={accent}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    topBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
    },
    titleSection: {
        flex: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    content: {
        flex: 1,
        paddingTop: 8,
    },
});