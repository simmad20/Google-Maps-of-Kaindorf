import React, {useState, useEffect} from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, StatusBar
} from 'react-native';
import {CameraView, Camera} from 'expo-camera';
import {LinearGradient} from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome';
import AuthService from '../services/AuthService';

interface WelcomeScreenProps {
    onJoinSuccess: () => void;
}

export default function WelcomeScreen({onJoinSuccess}: WelcomeScreenProps) {
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    useEffect(() => {
        (async () => {
            const {status} = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const handleQRScan = async ({data}: { data: string }) => {
        if (isJoining) return;
        setIsJoining(true);
        setIsScanning(false);

        try {
            await AuthService.joinTenant(data);
            Alert.alert(
                '✅ Erfolgreich!',
                'Du bist jetzt verbunden.',
                [{text: 'Weiter', onPress: onJoinSuccess}]
            );
        } catch (err: any) {
            Alert.alert('❌ Fehler', err.message || 'Ungültiger QR-Code');
            setIsJoining(false);
        }
    };

    const joinKaindorf = async () => {
        setIsJoining(true);
        try {
            await AuthService.joinKaindorf();
            Alert.alert(
                '✅ Erfolgreich!',
                'Du bist jetzt verbunden.',
                [{text: 'Weiter', onPress: onJoinSuccess}]
            );
        } catch (err: any) {
            Alert.alert('❌ Fehler', err.message);
            setIsJoining(false);
        }
    }

    if (hasPermission === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7A3BDF"/>
            </View>
        );
    }

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Icon name="camera" size={60} color="#ccc"/>
                <Text style={styles.errorText}>Kamera-Zugriff verweigert</Text>
                <Text style={styles.errorSubtext}>
                    Bitte erlaube Kamera-Zugriff in den Einstellungen
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"/>

            {/* Header */}
            <LinearGradient colors={['#7A3BDF', '#5B21B6']} style={styles.header}>
                <Icon name="map-marker" size={48} color="#fff"/>
                <Text style={styles.title}>Maps of Kaindorf</Text>
                <Text style={styles.subtitle}>Indoor Navigation</Text>
            </LinearGradient>

            {/* Content */}
            <View style={styles.content}>
                {!isScanning ? (
                    <>
                        <View style={styles.iconCircle}>
                            <Icon name="qrcode" size={64} color="#7A3BDF"/>
                        </View>
                        <Text style={styles.welcomeTitle}>Willkommen! 👋</Text>
                        <Text style={styles.welcomeText}>
                            Scanne den QR-Code deiner Organisation,{'\n'}um loszulegen.
                        </Text>


                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => setIsScanning(true)}
                            disabled={isJoining}
                        >
                            <LinearGradient
                                colors={['#7A3BDF', '#5B21B6']}
                                style={styles.scanButtonGradient}
                            >
                                <Icon name="qrcode" size={20} color="#fff"/>
                                <Text style={styles.scanButtonText}>QR-Code scannen</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={styles.divider}>
                            <View style={styles.dividerLine}/>
                            <Text style={styles.dividerText}>oder</Text>
                            <View style={styles.dividerLine}/>
                        </View>
                        <TouchableOpacity
                            style={styles.kaindorfButton}
                            onPress={joinKaindorf}
                            disabled={isJoining}
                        >
                            {isJoining ? (
                                <ActivityIndicator size="small" color="#7A3BDF"/>
                            ) : (
                                <>
                                    <Icon name="map-marker" size={18} color="#7A3BDF"/>
                                    <Text style={styles.kaindorfButtonText}>Kaindorf joinen</Text>
                                </>
                            )}
                        </TouchableOpacity>
                    </>
                ) : (
                    <>
                        <View style={styles.cameraContainer}>
                            <CameraView
                                style={styles.camera}
                                facing="back"
                                onBarcodeScanned={handleQRScan}
                            >
                                <View style={styles.scanOverlay}>
                                    <View style={styles.scanFrame}/>
                                    <Text style={styles.scanHint}>
                                        Richte den QR-Code im Rahmen aus
                                    </Text>
                                </View>
                            </CameraView>
                        </View>

                        {isJoining && (
                            <View style={styles.joiningOverlay}>
                                <ActivityIndicator size="large" color="#fff"/>
                                <Text style={styles.joiningText}>Verbinde...</Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setIsScanning(false)}
                            disabled={isJoining}
                        >
                            <Icon name="times" size={16} color="#7A3BDF"/>
                            <Text style={styles.cancelButtonText}>Abbrechen</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff'},
    loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    header: {paddingTop: 60, paddingBottom: 40, alignItems: 'center'},
    title: {fontSize: 28, fontWeight: '800', color: '#fff', marginTop: 16},
    subtitle: {fontSize: 16, color: 'rgba(255,255,255,0.9)', marginTop: 4},
    content: {flex: 1, paddingHorizontal: 24, paddingTop: 40, alignItems: 'center'},
    iconCircle: {
        width: 120, height: 120, borderRadius: 60, backgroundColor: '#f3f4f6',
        justifyContent: 'center', alignItems: 'center', marginBottom: 32
    },
    welcomeTitle: {fontSize: 24, fontWeight: '700', color: '#1f2937', marginBottom: 16},
    welcomeText: {fontSize: 16, color: '#6b7280', textAlign: 'center', marginBottom: 40},
    scanButton: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#7A3BDF',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6
    },
    kaindorfButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginTop: 16,
        marginBottom: 24,
        width: '100%',
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#7A3BDF',
        backgroundColor: '#fff',
    },
    kaindorfButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7A3BDF',
    },
    scanButtonGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 18,
        gap: 12
    },
    scanButtonText: {fontSize: 18, fontWeight: '700', color: '#fff'},
    cameraContainer: {width: '100%', height: 400, borderRadius: 24, overflow: 'hidden', marginBottom: 24},
    camera: {flex: 1},
    scanOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center'},
    scanFrame: {width: 250, height: 250, borderWidth: 3, borderColor: '#fff', borderRadius: 24},
    scanHint: {marginTop: 24, fontSize: 16, color: '#fff', fontWeight: '600'},
    joiningOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    },
    joiningText: {marginTop: 16, fontSize: 16, color: '#fff', fontWeight: '600'},
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#f3f4f6'
    },
    cancelButtonText: {fontSize: 16, fontWeight: '600', color: '#7A3BDF'},
    footerText: {fontSize: 14, color: '#9ca3af', textAlign: 'center'},
    errorText: {fontSize: 18, fontWeight: '600', color: '#ef4444', marginTop: 16},
    errorSubtext: {fontSize: 14, color: '#9ca3af', marginTop: 8, textAlign: 'center'},
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginVertical: 16,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#e5e7eb',
    },
    dividerText: {
        marginHorizontal: 12,
        fontSize: 14,
        color: '#9ca3af',
        fontWeight: '500',
    }
});