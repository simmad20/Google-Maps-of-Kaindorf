import {
    Pressable,
    StatusBar,
    StyleSheet,
    View,
    useWindowDimensions
} from 'react-native';
import React, { useEffect, useState } from 'react';

import EventCountdown from "@/components/EventCountdown";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapsOfKaindorf from '@/components/MapsOfKaindorf';
import QRScanner from '@/components/QRScanner';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEvent } from '@/components/context/EventContext';
import { useTheme } from '@/app/hooks/useTheme';

export default function MapScreen() {
    const { activeEvent } = useEvent();
    const { isDarkMode } = useTheme();
    const { height: windowHeight } = useWindowDimensions();
    const [floor, setFloor] = useState<'UG' | 'OG'>('UG');
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [qrVisible, setQrVisible] = useState(false);
    const [qrError, setQrError] = useState<string | null>(null);
    const [qrPosition, setQrPosition] = useState<{
        x: number;
        y: number;
        floor: 'OG' | 'UG';
    } | null>(null);

    const MAP_HEIGHT = windowHeight * 0.52;
    const accent = activeEvent?.themeColor ?? '#7A3BDF';

    // Theme-basierte Farben
    const themeColors = {
        background: isDarkMode ? '#0f172a' : '#f8fafc',
        cardBackground: isDarkMode ? '#1e293b' : '#ffffff',
        textPrimary: isDarkMode ? '#f1f5f9' : '#1e293b',
        textSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
        border: isDarkMode ? '#334155' : '#e2e8f0',
    };

    const openQr = () => setQrVisible(true);
    const closeQr = () => setQrVisible(false);

    const getColorWithAlpha = (color: string, alpha: number) => {
        const alphaValue = isDarkMode ? Math.min(alpha + 0.1, 0.9) : alpha;
        return `${color}${Math.floor(alphaValue * 255).toString(16).padStart(2, '0')}`;
    };

    const handleQrScan = (data: string) => {
        try {
            const parsed = JSON.parse(data);
            if (parsed?.type !== 'room') {
                setQrError('Ungültiger QR-Code');
                return;
            }

            if (!parsed.x || !parsed.y || !parsed.floor) {
                setQrError('QR-Code enthält keine Positionsdaten');
                return;
            }

            setFloor(parsed.floor);
            setQrPosition({
                x: parsed.x,
                y: parsed.y,
                floor: parsed.floor,
            });
        } catch {
            setQrError('QR-Code konnte nicht gelesen werden');
        }
    };

    useEffect(() => {
        if (qrError) {
            const timer = setTimeout(() => {
                setQrError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [qrError]);

    return (
        <GestureHandlerRootView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={themeColors.background}
            />

            {/* Top Bar */}
            <ThemedView style={[styles.topBar, {
                backgroundColor: themeColors.background,
                borderBottomColor: themeColors.border
            }]}>
                <View style={styles.eventInfo}>
                    <View style={[styles.eventDot, { backgroundColor: accent }]} />
                    <View style={styles.eventTexts}>
                        <ThemedText style={[styles.eventTitle, { color: themeColors.textPrimary }]} numberOfLines={1}>
                            {activeEvent?.name || 'Maps of Kaindorf'}
                        </ThemedText>
                        {activeEvent?.endDateTime && (
                            <EventCountdown compact={true} />
                        )}
                    </View>
                </View>

                <Pressable
                    style={[styles.scanButton, { backgroundColor: accent }]}
                    onPress={() => setIsFullscreen(!isFullscreen)}
                >
                    <Ionicons name="scan-outline" size={22} color="#fff" />
                </Pressable>
            </ThemedView>

            {/* Floor Selector */}
            <ThemedView style={[styles.floorTabs, {
                backgroundColor: themeColors.cardBackground,
                borderColor: themeColors.border
            }]}>
                <Pressable
                    style={({ pressed }) => [
                        styles.floorTab,
                        floor === 'UG' && [styles.floorTabActive, { backgroundColor: getColorWithAlpha(accent, 0.05) }],
                        pressed && styles.tabPressed
                    ]}
                    onPress={() => setFloor('UG')}
                >
                    <View style={[styles.floorIcon, floor === 'UG' && { backgroundColor: accent }]}>
                        <FontAwesome
                            name="building"
                            size={14}
                            color={floor === 'UG' ? '#fff' : themeColors.textSecondary}
                        />
                    </View>
                    <ThemedText style={[
                        styles.floorTabText,
                        { color: themeColors.textSecondary },
                        floor === 'UG' && [styles.floorTabTextActive, { color: themeColors.textPrimary }]
                    ]}>
                        Erdgeschoss
                    </ThemedText>
                </Pressable>

                <View style={[styles.tabDivider, { backgroundColor: themeColors.border }]} />

                <Pressable
                    style={({ pressed }) => [
                        styles.floorTab,
                        floor === 'OG' && [styles.floorTabActive, { backgroundColor: getColorWithAlpha(accent, 0.05) }],
                        pressed && styles.tabPressed
                    ]}
                    onPress={() => setFloor('OG')}
                >
                    <View style={[styles.floorIcon, floor === 'OG' && { backgroundColor: accent }]}>
                        <FontAwesome
                            name="building"
                            size={14}
                            color={floor === 'OG' ? '#fff' : themeColors.textSecondary}
                        />
                    </View>
                    <ThemedText style={[
                        styles.floorTabText,
                        { color: themeColors.textSecondary },
                        floor === 'OG' && [styles.floorTabTextActive, { color: themeColors.textPrimary }]
                    ]}>
                        Obergeschoss
                    </ThemedText>
                </Pressable>
            </ThemedView>

            {/* Map Container */}
            <View style={[styles.mapContainer, { height: MAP_HEIGHT }]}>
                <GestureHandlerRootView style={styles.mapWrapper}>
                    <ThemedView style={[styles.mapCard, {
                        backgroundColor: themeColors.cardBackground
                    }]}>
                        <MapsOfKaindorf
                            isFullscreen={isFullscreen}
                            floor={floor}
                            qrPosition={qrPosition}
                            onReachStairs={() => setFloor(floor === 'UG' ? 'OG' : 'UG')}
                            showLogger={false}
                        />
                    </ThemedView>
                </GestureHandlerRootView>
            </View>

            {/* Quick Actions Panel */}
            <View style={styles.actionsPanel}>
                <Pressable
                    style={({ pressed }) => [
                        styles.actionCard,
                        {
                            backgroundColor: themeColors.cardBackground,
                            borderTopColor: accent,
                            borderColor: themeColors.border
                        },
                        pressed && styles.actionPressed
                    ]}
                    onPress={openQr}
                >
                    <View style={[styles.actionIcon, { backgroundColor: getColorWithAlpha(accent, 0.1) }]}>
                        <Ionicons name="qr-code" size={20} color={accent} />
                    </View>
                    <View style={styles.actionContent}>
                        <ThemedText style={[styles.actionTitle, { color: themeColors.textPrimary }]}>
                            QR-Scanner
                        </ThemedText>
                        <ThemedText style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                            Position automatisch setzen
                        </ThemedText>
                    </View>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [
                        styles.actionCard,
                        {
                            backgroundColor: themeColors.cardBackground,
                            borderTopColor: '#10b981',
                            borderColor: themeColors.border
                        },
                        pressed && styles.actionPressed
                    ]}
                    onPress={() => setQrPosition(null)}
                >
                    <View style={[styles.actionIcon, {
                        backgroundColor: isDarkMode ? '#065f4620' : '#10b98110'
                    }]}>
                        <FontAwesome name="refresh" size={18} color="#10b981" />
                    </View>
                    <View style={styles.actionContent}>
                        <ThemedText style={[styles.actionTitle, { color: themeColors.textPrimary }]}>
                            Zurücksetzen
                        </ThemedText>
                        <ThemedText style={[styles.actionSubtitle, { color: themeColors.textSecondary }]}>
                            Markierung entfernen
                        </ThemedText>
                    </View>
                </Pressable>
            </View>

            {/* Legend */}
            <ThemedView style={[styles.legend, {
                backgroundColor: themeColors.background,
                borderTopColor: themeColors.border
            }]}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                    <ThemedText style={[styles.legendText, { color: themeColors.textSecondary }]}>
                        Aktuelle Position
                    </ThemedText>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                    <ThemedText style={[styles.legendText, { color: themeColors.textSecondary }]}>
                        Zielposition
                    </ThemedText>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#10b981' }]} />
                    <ThemedText style={[styles.legendText, { color: themeColors.textSecondary }]}>
                        Treppenhaus
                    </ThemedText>
                </View>
            </ThemedView>

            {/* QR Scanner Modal */}
            {qrVisible && (
                <QRScanner
                    visible={qrVisible}
                    onClose={closeQr}
                    onScan={handleQrScan}
                />
            )}

            {/* Error Toast */}
            {qrError && (
                <View style={styles.errorToast}>
                    <View style={styles.errorContent}>
                        <Ionicons name="warning" size={18} color="#fff" />
                        <ThemedText style={styles.errorText}>
                            {qrError}
                        </ThemedText>
                    </View>
                </View>
            )}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 16,
        borderBottomWidth: 1,
    },
    eventInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 16,
    },
    eventDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 12,
    },
    eventTexts: {
        flex: 1,
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    scanButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
    },
    floorTabs: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 16,
        padding: 6,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    floorTab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
    },
    floorTabActive: {
        borderRadius: 12,
    },
    tabPressed: {
        opacity: 0.8,
    },
    floorIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    floorTabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    floorTabTextActive: {
        fontWeight: '700',
    },
    tabDivider: {
        width: 1,
        marginVertical: 8,
    },
    mapContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    mapWrapper: {
        flex: 1,
        width: '100%',
    },
    mapCard: {
        flex: 1,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 6,
    },
    actionsPanel: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 12,
    },
    actionCard: {
        flex: 1,
        borderRadius: 16,
        padding: 16,
        borderTopWidth: 3,
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    actionPressed: {
        transform: [{ scale: 0.98 }],
        opacity: 0.9,
    },
    actionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 12,
        lineHeight: 16,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    legendText: {
        fontSize: 12,
    },
    errorToast: {
        position: 'absolute',
        top: 40,
        left: 20,
        right: 20,
        backgroundColor: '#ef4444',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    errorContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 12,
        flex: 1,
    },
});