// screens/MapScreen.tsx
import React, { useContext, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, useWindowDimensions, SafeAreaView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MapsOfKaindorf from '@/components/MapsOfKaindorf';
import { useEvent } from '@/components/context/EventContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import QRScanner from '@/components/QRScanner';
import EventCountdown from "@/components/EventCountdown";

export default function MapScreen() {
    const { activeEvent } = useEvent();
    const { height: windowHeight } = useWindowDimensions();
    const [floor, setFloor] = useState<'UG' | 'OG'>('UG');
    const [qrVisible, setQrVisible] = useState(false);

    const MAP_HEIGHT = windowHeight * 0.46;
    const accent = activeEvent?.themeColor ?? '#7A3BDF';

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={{ flex: 1 }}>
                {/* Header mit Event Info und Countdown */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <ThemedText type="title" style={styles.title}>
                            {activeEvent?.name || 'Maps of Kaindorf'}
                        </ThemedText>
                        {activeEvent?.endDateTime && (
                            <EventCountdown compact={true} />
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.qrCircle, { backgroundColor: accent }]}
                        onPress={() => setQrVisible(true)}
                    >
                        <Ionicons name="qr-code-outline" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mapWrapper}>
                    <GestureHandlerRootView style={styles.mapContainerWrapper}>
                        <MapsOfKaindorf
                            floor={floor}
                            qrPosition={qrPosition}
                            onReachStairs={() => setFloor('OG')}
                            onQrPress={() => setQrVisible(true)}
                            showLogger={false}
                        />
                    </GestureHandlerRootView>

                    <View style={[styles.verticalButtonWrapper, { height: MAP_HEIGHT }]}>
                        <TouchableOpacity
                            onPress={() => setFloor('OG')}
                            style={[styles.longButton, floor === 'OG' && { backgroundColor: accent }]}
                        >
                            <ThemedText style={[styles.buttonText, floor === 'OG' && { color: '#fff' }]}>OG</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setFloor('UG')}
                            style={[styles.longButton, floor === 'UG' && { backgroundColor: accent }]}
                        >
                            <ThemedText style={[styles.buttonText, floor === 'UG' && { color: '#fff' }]}>UG</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {qrVisible && <QRScanner visible={qrVisible} onClose={() => setQrVisible(false)} onScan={() => setQrVisible(false)} />}
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
    },
    headerLeft: {
        flex: 1,
        marginRight: 12,
    },
    title: {
        color: '#2d283e',
        marginBottom: 8,
    },
    qrCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        marginTop: 8,
    },
    mapWrapper: {
        marginTop: 0,
        width: '100%',
        alignItems: 'center',
        position: 'relative',
        paddingRight: 20,
    },
    mapContainerWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    verticalButtonWrapper: {
        position: 'absolute',
        right: -25,
        top: 0,
        justifyContent: 'space-between',
    },
    longButton: {
        width: 38,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e5e5',
        borderRadius: 12,
    },
    buttonText: {
        color: '#333',
        fontWeight: '700',
        fontSize: 14,
    },
});