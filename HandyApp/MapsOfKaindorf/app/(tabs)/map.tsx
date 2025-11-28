import { Image, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { LanguageContext, LanguageContextType } from '@/components/context/LanguageContext';
import React, { useContext, useState } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapsOfKaindorf from '@/components/MapsOfKaindorf';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import QRScanner from '@/components/QRScanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function MapScreen() {
    const { texts } = useContext<LanguageContextType>(LanguageContext);
    const { height: windowHeight } = useWindowDimensions();

    const [qrVisible, setQrVisible] = useState(false);
    const [floor, setFloor] = useState<'OG' | 'UG'>('UG');

    // Dynamische Höhe berechnen
    const MAP_HEIGHT = windowHeight * 0.460;

    const openQr = () => setQrVisible(true);
    const closeQr = () => setQrVisible(false);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
                headerImage={
                    <ThemedView style={styles.headerTextContainer}>
                        <ThemedText style={styles.headerTextOuter}>
                            <ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText>
                        </ThemedText>
                    </ThemedView>
                }
                headerHeight={80}
            >
                <View style={styles.titleRow}>
                    <ThemedText type="title">{texts?.mapTitle ?? 'Find your Way'}</ThemedText>
                    <TouchableOpacity style={styles.qrCircle} onPress={openQr}>
                        <Ionicons name="qr-code-outline" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mapWrapper}>
                    <GestureHandlerRootView style={styles.mapContainerWrapper}>
                        <MapsOfKaindorf
                            floor={floor}
                            onReachStairs={() => setFloor('OG')}
                            onQrPress={openQr}
                            showLogger={false}
                        />
                    </GestureHandlerRootView>

                    <View style={[styles.verticalButtonWrapper, { height: MAP_HEIGHT }]}>
                        <TouchableOpacity
                            onPress={() => setFloor('OG')}
                            style={[
                                styles.longButton,
                                styles.buttonTop,
                                floor === 'OG' && styles.active
                            ]}
                        >
                            <ThemedText style={styles.buttonText}>OG</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setFloor('UG')}
                            style={[
                                styles.longButton,
                                styles.buttonBottom,
                                floor === 'UG' && styles.active
                            ]}
                        >
                            <ThemedText style={styles.buttonText}>UG</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {qrVisible && <QRScanner visible={qrVisible} onClose={closeQr} onScan={closeQr} />}
            </ParallaxScrollView>
        </SafeAreaView>
    );
}

const HEADER_HEIGHT = 150;

const styles = StyleSheet.create({
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderRightColor: '#a453ec',
        borderLeftColor: '#a453ec',
        borderRightWidth: 3,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderBottomColor: '#a453ec',
    },
    headerTextOuter: {},
    headerText: {
        color: '#a453ec',
        fontSize: 24,
        fontFamily: 'Nice',
    },
    headerGear: { marginLeft: 20 },
    headerContainer: {
        width: '100%',
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: '100%',
        height: '100%',
    },
    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingHorizontal: 20,
    },
    qrCircle: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: '#7A3BDF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    mapWrapper: {
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
        paddingRight: 20,
        position: 'relative',
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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e5e5',
        borderRadius: 12,
    },
    buttonTop: {
        flex: 1,
    },
    buttonBottom: {
        flex: 1,
    },
    active: {
        backgroundColor: '#7A3BDF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
});