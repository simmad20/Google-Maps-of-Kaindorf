import React, {useContext} from 'react';
import {
    StyleSheet,
    Pressable,
    ScrollView,
    TouchableOpacity,
    View,
    StatusBar,
    Dimensions,
    useColorScheme
} from 'react-native';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useEvent} from '@/components/context/EventContext';
import {useRouter} from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import {LinearGradient} from 'expo-linear-gradient';
import EventCountdown from "@/components/EventCountdown";
import {useTheme} from '@/app/hooks/useTheme';
import {ThemeContext} from "@/components/context/ThemeContext";
import {LanguageContext} from "@/components/context/LanguageContext";
import {useAuth} from "@/components/context/AuthContext";

const {width} = Dimensions.get('window');

export default function HomeScreen() {
    const {logout} = useAuth();
    const {activeEvent, loading} = useEvent();
    const router = useRouter();
    const {isDarkMode} = useTheme();
    const systemColorScheme = useColorScheme();
    const {toggleTheme} = useContext(ThemeContext);
    const {language, switchLanguage} = useContext(LanguageContext);


    // Theme-basierte Farben
    const themeColors = {
        background: isDarkMode ? '#0f172a' : '#f8fafc',
        cardBackground: isDarkMode ? '#1e293b' : '#ffffff',
        textPrimary: isDarkMode ? '#f1f5f9' : '#1e293b',
        textSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
        textTertiary: isDarkMode ? '#94a3b8' : '#475569',
        border: isDarkMode ? '#334155' : '#e2e8f0',
        accentBackground: isDarkMode ? '#1e293b' : '#f8fafc',
        announcementBg: isDarkMode ? '#451a03' : '#fffbeb',
    };

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ThemedText style={styles.loadingText}>Lade Applikation...</ThemedText>
            </ThemedView>
        );
    }

    const eventColor = activeEvent?.themeColor || '#7A3BDF';

    // Alpha-Werte für Dark Mode anpassen
    const getColorWithAlpha = (color: string, alpha: number) => {
        const alphaValue = isDarkMode ? Math.min(alpha + 0.1, 0.9) : alpha;
        return `${color}${Math.floor(alphaValue * 255).toString(16).padStart(2, '0')}`;
    };

    return (
        <ThemedView style={[styles.container, {backgroundColor: themeColors.background}]}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                       backgroundColor={themeColors.background}/>

            <ThemedView style={[styles.statusArea, {
                backgroundColor: themeColors.background,
                borderBottomColor: themeColors.border
            }]}>
                <View style={styles.statusContent}>
                    <View style={styles.eventIndicator}>
                        <View style={[styles.indicatorDot, {backgroundColor: eventColor}]}/>
                        <ThemedText style={[styles.eventName, {color: themeColors.textPrimary}]} numberOfLines={1}>
                            {activeEvent?.name || 'Maps of Kaindorf'}
                        </ThemedText>
                    </View>
                    <Pressable
                        style={[styles.settingsButton, {
                            backgroundColor: themeColors.cardBackground,
                            borderColor: themeColors.border
                        }]}
                        onPress={async () => {
                            await logout();
                        }}
                    >
                        <Icon name="sign-out" size={18} color={eventColor}/>
                    </Pressable>
                    <Pressable
                        style={[styles.settingsButton, {
                            backgroundColor: themeColors.cardBackground,
                            borderColor: themeColors.border
                        }]}
                        onPress={() => toggleTheme()}
                    >
                        {isDarkMode ? <Icon name="sun-o" size={20} color={eventColor}/> :
                            <Icon name="moon-o" size={20} color={eventColor}/>}
                    </Pressable>
                </View>

                {activeEvent?.endDateTime && (
                    <ThemedView style={[styles.countdownBanner, {
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.border
                    }]}>
                        <Icon name="clock-o" size={14} color={eventColor}/>
                        <EventCountdown
                            compact={true}
                            showLabel={true}
                            showIcon={false}
                            variant="inline"
                        />
                    </ThemedView>
                )}
            </ThemedView>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Gradient Section */}
                <LinearGradient
                    colors={[
                        getColorWithAlpha(eventColor, 0.15),
                        getColorWithAlpha(eventColor, 0.08),
                        getColorWithAlpha(eventColor, 0.02)
                    ]}
                    style={styles.heroGradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                >
                    <View style={styles.heroContent}>
                        <View style={styles.heroTexts}>
                            <ThemedText style={[styles.welcomeTitle, {color: themeColors.textPrimary}]}>
                                Willkommen zurück! 👋
                            </ThemedText>
                            <ThemedText style={[styles.welcomeSubtitle, {color: themeColors.textSecondary}]}>
                                {activeEvent
                                    ? `Das Event "${activeEvent.name}" ist aktiv`
                                    : 'HTL Kaindorf Maps App'}
                            </ThemedText>
                        </View>
                        <View style={[styles.heroIcon, {backgroundColor: getColorWithAlpha(eventColor, 0.15)}]}>
                            <Icon name="map-marker" size={32} color={eventColor}/>
                        </View>
                    </View>
                </LinearGradient>

                {/* Main Actions Grid */}
                <View style={styles.actionsSection}>
                    <ThemedText style={[styles.sectionTitle, {color: themeColors.textPrimary}]}>
                        Schnellzugriff
                    </ThemedText>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity
                            style={[styles.actionCard, {
                                backgroundColor: themeColors.cardBackground,
                                borderLeftColor: eventColor,
                                borderColor: themeColors.border
                            }]}
                            onPress={() => router.push('/map')}
                        >
                            <View style={[styles.actionIcon, {backgroundColor: getColorWithAlpha(eventColor, 0.1)}]}>
                                <Icon name="map" size={24} color={eventColor}/>
                            </View>
                            <View style={styles.actionTexts}>
                                <ThemedText style={[styles.actionTitle, {color: themeColors.textPrimary}]}>
                                    Karte öffnen
                                </ThemedText>
                                <ThemedText style={[styles.actionSubtitle, {color: themeColors.textSecondary}]}>
                                    Interaktive Campus-Karte
                                </ThemedText>
                            </View>
                            <Icon name="chevron-right" size={16} color={themeColors.textTertiary}/>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionCard, {
                                backgroundColor: themeColors.cardBackground,
                                borderLeftColor: eventColor,
                                borderColor: themeColors.border
                            }]}
                            onPress={() => router.push('/chooseTeacher')}
                        >
                            <View style={[styles.actionIcon, {backgroundColor: getColorWithAlpha(eventColor, 0.1)}]}>
                                <Icon name="search" size={24} color={eventColor}/>
                            </View>
                            <View style={styles.actionTexts}>
                                <ThemedText style={[styles.actionTitle, {color: themeColors.textPrimary}]}>
                                    Objekte suchen
                                </ThemedText>
                                <ThemedText style={[styles.actionSubtitle, {color: themeColors.textSecondary}]}>
                                    Lehrer, Räume & mehr
                                </ThemedText>
                            </View>
                            <Icon name="chevron-right" size={16} color={themeColors.textTertiary}/>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Event Info Cards */}
                {activeEvent && (
                    <View style={styles.infoSection}>
                        <ThemedText style={[styles.sectionTitle, {color: themeColors.textPrimary}]}>
                            Event Informationen
                        </ThemedText>

                        {/* Event Status Card */}
                        <ThemedView style={[styles.statusCard, {
                            backgroundColor: themeColors.cardBackground
                        }]}>
                            <View style={styles.statusHeader}>
                                <View style={[styles.statusBadge, {backgroundColor: themeColors.accentBackground}]}>
                                    <View style={[styles.liveDot, {backgroundColor: eventColor}]}/>
                                    <ThemedText style={[styles.statusText, {color: eventColor}]}>
                                        AKTIVES EVENT
                                    </ThemedText>
                                </View>
                                <ThemedText style={[styles.eventDate, {color: themeColors.textSecondary}]}>
                                    {new Date(activeEvent.startDateTime).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </ThemedText>
                            </View>

                            {activeEvent.description && (
                                <ThemedText style={[styles.eventDescription, {color: themeColors.textTertiary}]}>
                                    {activeEvent.description}
                                </ThemedText>
                            )}

                            {/* Detailed Countdown */}
                            {activeEvent.endDateTime && (
                                <ThemedView style={[styles.detailedCountdown, {
                                    backgroundColor: themeColors.accentBackground,
                                    borderColor: themeColors.border
                                }]}>
                                    <View style={styles.countdownHeader}>
                                        <Icon name="hourglass-half" size={16} color={eventColor}/>
                                        <ThemedText style={[styles.countdownTitle, {color: themeColors.textPrimary}]}>
                                            Verbleibende Zeit
                                        </ThemedText>
                                    </View>
                                    <EventCountdown compact={false}/>
                                </ThemedView>
                            )}
                        </ThemedView>

                        {/* Announcement Card */}
                        {activeEvent.announcement && (
                            <ThemedView style={[styles.announcementCard, {
                                backgroundColor: themeColors.announcementBg,
                                borderLeftColor: eventColor
                            }]}>
                                <View style={styles.announcementHeader}>
                                    <Icon name="bullhorn" size={20} color={eventColor}/>
                                    <ThemedText style={[styles.announcementTitle, {color: themeColors.textPrimary}]}>
                                        Wichtige Ankündigung
                                    </ThemedText>
                                </View>
                                <ThemedText style={[styles.announcementText, {color: themeColors.textTertiary}]}>
                                    {activeEvent.announcement}
                                </ThemedText>
                            </ThemedView>
                        )}
                    </View>
                )}

                {/* Quick Stats */}
                <View style={styles.statsSection}>
                    <ThemedText style={[styles.sectionTitle, {color: themeColors.textPrimary}]}>
                        Auf einen Blick
                    </ThemedText>
                    <View style={styles.statsGrid}>
                        <ThemedView style={[styles.statItem, {
                            backgroundColor: themeColors.cardBackground
                        }]}>
                            <View style={[styles.statIcon, {backgroundColor: getColorWithAlpha(eventColor, 0.1)}]}>
                                <Icon name="calendar" size={18} color={eventColor}/>
                            </View>
                            <ThemedText style={[styles.statValue, {color: themeColors.textPrimary}]}>
                                {activeEvent
                                    ? new Date(activeEvent.startDateTime).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: 'short'
                                    })
                                    : '--'}
                            </ThemedText>
                            <ThemedText style={[styles.statLabel, {color: themeColors.textSecondary}]}>
                                Startdatum
                            </ThemedText>
                        </ThemedView>

                        <ThemedView style={[styles.statItem, {
                            backgroundColor: themeColors.cardBackground
                        }]}>
                            <View style={[styles.statIcon, {backgroundColor: getColorWithAlpha(eventColor, 0.1)}]}>
                                <Icon name="location-arrow" size={18} color={eventColor}/>
                            </View>
                            <ThemedText style={[styles.statValue, {color: themeColors.textPrimary}]}>
                                {activeEvent ? 'Aktiv' : 'Bereit'}
                            </ThemedText>
                            <ThemedText style={[styles.statLabel, {color: themeColors.textSecondary}]}>
                                Status
                            </ThemedText>
                        </ThemedView>
                    </View>
                </View>

                {/* Bottom Spacer */}
                <View style={styles.bottomSpacer}/>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
    },
    statusArea: {
        paddingTop: 60,
        paddingHorizontal: 20,
        paddingBottom: 12,
        borderBottomWidth: 1,
    },
    statusContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    eventIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    indicatorDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    eventName: {
        fontSize: 18,
        fontWeight: '700',
        flex: 1,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    countdownBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
    },
    countdownLabel: {
        fontSize: 12,
        marginLeft: 6,
        marginRight: 4,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    heroGradient: {
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 24,
        borderRadius: 24,
        padding: 24,
    },
    heroContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    heroTexts: {
        flex: 1,
        marginRight: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    welcomeSubtitle: {
        fontSize: 15,
        lineHeight: 22,
    },
    heroIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionsSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
    },
    actionsGrid: {
        gap: 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    actionIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionTexts: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 13,
        lineHeight: 18,
    },
    infoSection: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    statusCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    statusHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 6,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    eventDate: {
        fontSize: 14,
        fontWeight: '500',
    },
    eventDescription: {
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 20,
    },
    detailedCountdown: {
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
    },
    countdownHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    countdownTitle: {
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 8,
    },
    announcementCard: {
        borderRadius: 16,
        padding: 20,
        borderLeftWidth: 4,
    },
    announcementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
    },
    announcementText: {
        fontSize: 14,
        lineHeight: 22,
    },
    statsSection: {
        paddingHorizontal: 20,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    statIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bottomSpacer: {
        height: 100,
    },
});