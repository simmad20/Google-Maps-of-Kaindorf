import { CameraView, useCameraPermissions } from 'expo-camera';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';

interface QRScannerProps {
    visible: boolean;
    onClose: () => void;
    onScan: (data: string) => void;
}

export default function QRScanner({ visible, onClose, onScan }: QRScannerProps) {
    const [permission, requestPermission] = useCameraPermissions();

    useEffect(() => {
        if (permission && !permission.granted) requestPermission();
    }, [permission]);

    if (!visible) return null;
    if (!permission) return <View style={styles.center}><Text>Loading permission...</Text></View>;
    if (!permission.granted) {
        return (
            <View style={styles.center}>
                <Text>Keine Kameraberechtigung</Text>
                <TouchableOpacity style={styles.actionBtn} onPress={requestPermission}>
                    <Text style={styles.actionText}>Erlauben</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#777' }]} onPress={onClose}>
                    <Text style={styles.actionText}>Abbrechen</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { width, height } = Dimensions.get('window');
    const overlaySize = width * 0.7;

    return (
        <View style={styles.overlay}>
            <CameraView
                style={StyleSheet.absoluteFill}
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={(result: any) => {
                    if (result.data) { onScan(result.data); onClose(); }
                }}
            />

            {/* QR Overlay */}
            <View style={styles.overlayMask}>
                <View style={{ flex: 1 }} />
                <View style={styles.overlayRow}>
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
                    <View style={[styles.qrFrame, { width: overlaySize, height: overlaySize, borderRadius: 12 }]} />
                    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
                </View>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }} />
            </View>

            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFillObject, zIndex: 9999, marginTop: 40 },
    closeBtn: { position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 30, zIndex: 10000 },
    closeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    actionBtn: { marginTop: 15, backgroundColor: '#a453ec', padding: 12, borderRadius: 8, minWidth: 120, alignItems: 'center' },
    actionText: { color: '#fff', fontWeight: 'bold' },
    overlayMask: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    overlayRow: { flexDirection: 'row', alignItems: 'center' },
    qrFrame: { borderWidth: 3, borderColor: '#a453ec', backgroundColor: 'transparent' },
});