// screens/HomeScreen.tsx
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Pressable,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEvent } from '@/components/context/EventContext';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import EventCountdown from "@/components/EventCountdown";

export default function HomeScreen() {
    const { activeEvent, loading } = useEvent();
    const router = useRouter();

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ThemedText>Lade Event...</ThemedText>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
                headerHeight={100}
                headerImage={
                    <ThemedView style={[
                        styles.headerContainer,
                        { backgroundColor: activeEvent?.themeColor || '#2d283e' }
                    ]}>
                        <ThemedView style={styles.headerContent}>
                            <ThemedText style={styles.headerTitle}>
                                {activeEvent?.name || 'Maps of Kaindorf'}
                            </ThemedText>
                            <Pressable
                                style={styles.headerGear}
                                onPress={() => router.push('/settings')}
                            >
                                <Icon name="gear" size={25} color="#fff" />
                            </Pressable>
                        </ThemedView>
                    </ThemedView>
                }
            >
                {/* Event Information Card */}
                {activeEvent && (
                    <ThemedView style={styles.eventCard}>
                        {/* Event Status Badge */}
                        <ThemedView style={[
                            styles.statusBadge,
                            { backgroundColor: activeEvent.themeColor + '20' }
                        ]}>
                            <ThemedText style={[
                                styles.statusText,
                                { color: activeEvent.themeColor }
                            ]}>
                                AKTIVES EVENT
                            </ThemedText>
                        </ThemedView>

                        {/* Event Description */}
                        {activeEvent.description && (
                            <ThemedView style={styles.descriptionSection}>
                                <ThemedText style={styles.sectionTitle}>
                                    Beschreibung
                                </ThemedText>
                                <ThemedText style={styles.descriptionText}>
                                    {activeEvent.description}
                                </ThemedText>
                            </ThemedView>
                        )}

                        {/* Countdown */}
                        {activeEvent.endDateTime && (
                            <ThemedView style={styles.countdownSection}>
                                <ThemedText style={styles.sectionTitle}>
                                    Countdown
                                </ThemedText>
                                <EventCountdown />
                            </ThemedView>
                        )}

                        {/* Event Details */}
                        <ThemedView style={styles.detailsGrid}>
                            <ThemedView style={styles.detailItem}>
                                <Icon name="calendar" size={16} color="#7A3BDF" />
                                <ThemedText style={styles.detailLabel}>
                                    Start
                                </ThemedText>
                                <ThemedText style={styles.detailValue}>
                                    {new Date(activeEvent.startDateTime).toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </ThemedText>
                            </ThemedView>

                            {activeEvent.endDateTime && (
                                <ThemedView style={styles.detailItem}>
                                    <Icon name="calendar-check-o" size={16} color="#7A3BDF" />
                                    <ThemedText style={styles.detailLabel}>
                                        Ende
                                    </ThemedText>
                                    <ThemedText style={styles.detailValue}>
                                        {new Date(activeEvent.endDateTime).toLocaleDateString('de-DE', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </ThemedText>
                                </ThemedView>
                            )}
                        </ThemedView>
                    </ThemedView>
                )}

                {/* Announcement */}
                {activeEvent?.announcement && (
                    <ThemedView style={[
                        styles.announcementCard,
                        { borderLeftColor: activeEvent.themeColor }
                    ]}>
                        <ThemedView style={styles.announcementHeader}>
                            <Icon name="bullhorn" size={20} color={activeEvent.themeColor} />
                            <ThemedText style={styles.announcementTitle}>
                                Ankündigung
                            </ThemedText>
                        </ThemedView>
                        <ThemedText style={styles.announcementText}>
                            {activeEvent.announcement}
                        </ThemedText>
                    </ThemedView>
                )}

                {/* Main Content */}
                <ThemedView style={styles.contentContainer}>
                    <ThemedText type="title" style={styles.welcomeTitle}>
                        Willkommen
                    </ThemedText>
                    <ThemedText style={styles.welcomeText}>
                        Zur interaktiven Maps-App der HTL Kaindorf!
                        {activeEvent && ` Aktuell findet "${activeEvent.name}" statt.`}
                    </ThemedText>

                    {/* Quick Actions */}
                    <ThemedView style={styles.actionsContainer}>
                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push('/map')}
                        >
                            <Icon name="map" size={24} color="#7A3BDF" />
                            <ThemedText style={styles.actionText}>
                                Karte öffnen
                            </ThemedText>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionButton}
                            onPress={() => router.push('/chooseTeacher')}
                        >
                            <Icon name="users" size={24} color="#7A3BDF" />
                            <ThemedText style={styles.actionText}>
                                Suchobjekt wählen
                            </ThemedText>
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            </ParallaxScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContainer: {
        flex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 20,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 40,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
        fontFamily: 'Nice',
        flex: 1,
    },
    headerGear: {
        padding: 8,
    },
    eventCard: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    statusBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 16,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    descriptionSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#555',
    },
    countdownSection: {
        marginBottom: 20,
    },
    detailsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    detailItem: {
        alignItems: 'center',
        flex: 1,
    },
    detailLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    detailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginTop: 2,
    },
    announcementCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    announcementHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    announcementTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginLeft: 8,
    },
    announcementText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#555',
    },
    contentContainer: {
        margin: 16,
    },
    welcomeTitle: {
        marginBottom: 8,
        color: '#2d283e',
    },
    welcomeText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#555',
        marginBottom: 24,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
    actionButton: {
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        width: '45%',
    },
    actionText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
});