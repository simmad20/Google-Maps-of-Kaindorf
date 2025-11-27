import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { LanguageContext, LanguageContextType } from '@/components/context/LanguageContext';
import React, { useContext, useState } from 'react';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapsOfKaindorf from '@/components/MapsOfKaindorf';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import QRScanner from '@/components/QRScanner';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';

const logo = require('@/assets/images/logo.png');

export default function MapScreen() {
    const { texts } = useContext<LanguageContextType>(LanguageContext);
    const [qrVisible, setQrVisible] = useState(false);
    const [floor, setFloor] = useState<'OG' | 'UG'>('OG');

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#ffffff', dark: '#2d2929ff' }}
                headerImage={
                    <View style={styles.headerContainer}>
                        <Image source={logo} style={styles.logo} resizeMode="cover" />
                    </View>
                }
            >
                <View style={styles.titleRow}>
                    <ThemedText type="title">{texts.mapTitle}</ThemedText>
                    <TouchableOpacity style={styles.qrCircle} onPress={() => setQrVisible(true)}>
                        <Ionicons name="qr-code-outline" size={26} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.mapWrapper}>
                    <GestureHandlerRootView style={styles.mapContainerWrapper}>
                        <MapsOfKaindorf floor={floor} onQrPress={() => setQrVisible(true)} showLogger={false} />
                    </GestureHandlerRootView>
                    <View style={styles.verticalButtonWrapper}>
                        <TouchableOpacity onPress={() => setFloor('OG')} style={[styles.longButton, styles.buttonTop, floor === 'OG' && styles.active]}>
                            <ThemedText style={styles.buttonText}>OG</ThemedText>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setFloor('UG')} style={[styles.longButton, styles.buttonBottom, floor === 'UG' && styles.active]}>
                            <ThemedText style={styles.buttonText}>UG</ThemedText>
                        </TouchableOpacity>
                    </View>
                </View>

                {qrVisible && <QRScanner visible={qrVisible} onClose={() => setQrVisible(false)} onScan={() => setQrVisible(false)} />}
            </ParallaxScrollView>
        </SafeAreaView>
    );
}

const isMobile = Dimensions.get('window').width < 650;
const MAP_HEIGHT = Dimensions.get('window').height * 0.476;
const HEADER_HEIGHT = 150;

const styles = StyleSheet.create({
    headerContainer: { width: '100%', height: HEADER_HEIGHT, justifyContent: 'center', alignItems: 'center' },
    logo: { width: '100%', height: '100%' },
    titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
    qrCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#7A3BDF', justifyContent: 'center', alignItems: 'center', elevation: 4 },
    mapWrapper: { marginTop: 20, width: '100%', alignItems: 'center', paddingRight: 20, position: 'relative' },
    mapContainerWrapper: { width: '100%', alignItems: 'center' },
    verticalButtonWrapper: { position: 'absolute', right: -25, top: 0, height: MAP_HEIGHT },
    longButton: { width: 38, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e5e5e5', borderRadius: 12 },
    buttonTop: { height: MAP_HEIGHT / 2 - 6 },
    buttonBottom: { height: MAP_HEIGHT / 2 - 6 },
    active: { backgroundColor: '#7A3BDF' },
    buttonText: { color: '#fff', fontWeight: '700' },
});