import * as Location from 'expo-location';

import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import { TeacherContext, TeacherContextType } from './context/TeacherContext';

import GPSLogger from './GPSLogger';
import { IRoomDetailed } from '@/models/interfaces';
import { serverConfig } from '@/config/server';

const pictureOG = require('@/assets/images/OG.png');
const pictureUG = require('@/assets/images/UG.png');

interface Marker { id: number; y: number; x: number; name: string; }
interface MapsOfKaindorfProps { onQrPress?: () => void; floor: 'OG' | 'UG'; showLogger?: boolean; }

export default function MapsOfKaindorf({ floor, showLogger }: MapsOfKaindorfProps) {
    const { selectedTeacher } = useContext<TeacherContextType>(TeacherContext);

    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [userPosition, setUserPosition] = useState({ x: 200, y: 110 });
    const [teacherRoom, setTeacherRoom] = useState<IRoomDetailed | null>(null);

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    useEffect(() => {
        if (!selectedTeacher?.id) return;
        fetch(`http://${serverConfig.ip}:${serverConfig.port}/teachers/${selectedTeacher.id}`)
            .then(res => res.json())
            .then((room: IRoomDetailed) => {
                setTeacherRoom(room);
                setSelectedMarker({ id: room.id, x: room.x, y: room.y, name: `${selectedTeacher.firstname} ${selectedTeacher.lastname}` });
            });
    }, [selectedTeacher]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }]
    }));

    const mapImage = floor === 'OG' ? pictureOG : pictureUG;
    const outerWidth = Dimensions.get('window').width * 0.9;
    const outerHeight = Dimensions.get('window').width * 0.9;

    return (
        <View style={[styles.container, { width: outerWidth }]}>
            <View style={[styles.mapContainer, { width: outerWidth, height: outerHeight }]}>
                <GestureDetector gesture={Gesture.Pan().onUpdate((e: any) => { translateX.value += e.translationX; translateY.value += e.translationY; })}>
                    <Animated.View style={[styles.innerContent, animatedStyle]}>
                        <Image source={mapImage} style={{ width: outerWidth, height: outerHeight }} resizeMode="contain" />
                        {selectedMarker && (
                            <TouchableOpacity style={{ position: 'absolute', left: selectedMarker.x, top: selectedMarker.y }}>
                                <Image source={selectedTeacher?.image_url ? { uri: selectedTeacher.image_url } : require('@/assets/images/Teacher.png')} style={styles.teacherImage} />
                            </TouchableOpacity>
                        )}
                    </Animated.View>
                </GestureDetector>
            </View>
            {selectedMarker && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Selected Location:</Text>
                    <Text>{selectedMarker.name}</Text>
                </View>
            )}
            {showLogger && <GPSLogger />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', width: '100%' },
    mapContainer: { overflow: 'hidden', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
    innerContent: { position: 'absolute', left: 0, top: 0 },
    teacherImage: { width: 26, height: 26, borderRadius: 13 },
    infoBox: { marginTop: 8, backgroundColor: 'rgba(255,255,255,0.9)', padding: 8, borderRadius: 8 },
    infoText: { fontWeight: '700', marginBottom: 4 },
});