import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapsOfKaindorf from '@/components/MapsOfKaindorf';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import QRScanner from '@/components/QRScanner';
import { ThemedText } from '@/components/ThemedText';

const logo = require('@/assets/images/logo.png');

const TabTwoScreen: React.FC = () => {
    const [qrVisible, setQrVisible] = useState(false);
    const [floor, setFloor] = useState<'OG' | 'UG'>('OG');

    const openQr = () => setQrVisible(true);
    const closeQr = () => setQrVisible(false);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{ light: '#ffffff', dark: '#222' }}
            headerImage={
                <View style={styles.headerContainer}>
                    {/* Logo Header */}
                    <Image source={logo} style={styles.logo} resizeMode="cover" />
                </View>
            }
        >
            {/* Title + QR Row */}
            <View style={styles.titleRow}>
                <ThemedText type="title">Find your Way</ThemedText>

                <TouchableOpacity style={styles.qrCircle} onPress={openQr}>
                    <Ionicons name="qr-code-outline" size={26} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Map + Floor Buttons */}
            <View style={styles.mapWrapper}>
                {/* GestureHandlerRootView --> GestureDetector funktioniert */}
                <GestureHandlerRootView style={styles.mapContainerWrapper}>
                    <MapsOfKaindorf floor={floor} onQrPress={openQr} showLogger={false} />
                </GestureHandlerRootView>

                <View style={styles.verticalButtonWrapper}>
                    <TouchableOpacity
                        onPress={() => setFloor('OG')}
                        style={[styles.longButton, styles.buttonTop, floor === 'OG' && styles.active]}
                    >
                        <ThemedText style={styles.buttonText}>OG</ThemedText>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => setFloor('UG')}
                        style={[styles.longButton, styles.buttonBottom, floor === 'UG' && styles.active]}
                    >
                        <ThemedText style={styles.buttonText}>UG</ThemedText>
                    </TouchableOpacity>
                </View>
            </View>

            {/* QR Scanner Modal */}
            {qrVisible && (
                <QRScanner
                    visible={qrVisible}
                    onClose={closeQr}
                    onScan={() => closeQr()}
                />
            )}
        </ParallaxScrollView>
    );
};

export default TabTwoScreen;

const isMobile = Dimensions.get('window').width < 650;
const MAP_HEIGHT = Dimensions.get('window').height * 0.476;
const HEADER_HEIGHT = 150;

const styles = StyleSheet.create({
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
    rightBar: {
        position: 'absolute',
        right: 14,
        top: isMobile ? '38%' : '30%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 12,
    },
    verticalButtonWrapper: {
        position: 'absolute',
        right: -25,
        top: 0,
        height: MAP_HEIGHT,
    },
    longButton: {
        width: 38,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e5e5e5',
        borderRadius: 12,
    },
    buttonTop: {
        height: MAP_HEIGHT / 2 - 6,
    },
    buttonBottom: {
        height: MAP_HEIGHT / 2 - 6,
    },
    active: {
        backgroundColor: '#7A3BDF',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
    },
});