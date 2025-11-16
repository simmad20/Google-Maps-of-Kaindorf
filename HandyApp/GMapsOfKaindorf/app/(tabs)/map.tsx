import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapsOfKaindorf from '@/components/MapsOfKaindorf';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import QRScanner from '@/components/QRScanner';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function TabTwoScreen() {
    const [qrVisible, setQrVisible] = useState(false);
    const [scannedData, setScannedData] = useState<string | null>(null);
    const [floor, setFloor] = useState<'OG' | 'UG'>('OG');

    const handleQrScan = (data: string) => {
        setScannedData(data);
        console.log('QR gescannt:', data);
    };

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Path to the Teacher</ThemedText>
            </ThemedView>

            <View style={styles.toggleContainer}>
                <TouchableOpacity
                    style={[styles.floorButton, floor === 'OG' && styles.floorActive]}
                    onPress={() => setFloor('OG')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.floorText}>OG</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.floorButton, floor === 'UG' && styles.floorActive]}
                    onPress={() => setFloor('UG')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.floorText}>UG</Text>
                </TouchableOpacity>
            </View>

            <GestureHandlerRootView style={{ flex: 1 }}>
                <MapsOfKaindorf
                    floor={floor}
                    onQrPress={() => setQrVisible(true)}
                />
            </GestureHandlerRootView>

            {qrVisible && (
                <QRScanner
                    visible={qrVisible}
                    onClose={() => setQrVisible(false)}
                    onScan={(data) => {
                        handleQrScan(data);
                        setQrVisible(false);
                    }}
                />
            )}
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    floorToggle: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 8,
    },
    floorButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        marginHorizontal: 4,
        backgroundColor: '#eee',
        elevation: 3,
    },
    floorActive: {
        backgroundColor: '#a453ec',
        elevation: 5,
    },
    floorText: {
        fontWeight: 'bold',
        color: '#fff',
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 12,
        zIndex: 10,
        position: 'relative',
    },
});