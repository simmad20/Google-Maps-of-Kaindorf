import * as Location from 'expo-location';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React, { useContext, useEffect, useState } from 'react';
import Svg, { Line } from 'react-native-svg';
import { TeacherContext, TeacherContextType } from './context/TeacherContext';
import { getLatitude, getLongitude } from 'geolib';

import GPSLogger from './GPSLogger';
import { IRoomDetailed } from '@/models/interfaces';
import { serverConfig } from '@/config/server';

// TYPES
interface Marker { id: number; y: number; x: number; name: string; }
interface MapsOfKaindorfProps { onQrPress?: () => void; floor: 'OG' | 'UG'; showLogger?: boolean; }

// assets
const pictureOG = require('@/assets/images/OG.png');
const pictureUG = require('@/assets/images/UG.png');

// responsive sizes
const isMobile = Dimensions.get('window').width < 650;
const MAP_MOBILE_SIZE = Math.round(Dimensions.get('window').width * 0.90);
const MAP_DESKTOP_WIDTH = Math.round(Dimensions.get('window').width * 0.70);
const MAP_DESKTOP_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);

const MapsOfKaindorf: React.FC<MapsOfKaindorfProps> = ({ onQrPress, floor, showLogger }) => {
    const { selectedTeacher } = useContext<TeacherContextType>(TeacherContext);

    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [userLocation, setUserLocation] = useState({ latitude: 46.801649, longitude: 15.5419766 });
    const [userPosition, setUserPosition] = useState({ x: (isMobile ? MAP_MOBILE_SIZE / 2 : MAP_DESKTOP_WIDTH / 2), y: 110 });
    const [teacherRoom, setTeacherRoom] = useState<IRoomDetailed | null>(null);

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const lastTranslateX = useSharedValue(0);
    const lastTranslateY = useSharedValue(0);
    const MIN_SCALE = 1;
    const MAX_SCALE = 4;

    // GPS tracking (unchanged / guard)
    useEffect(() => {
        let lastLocation: Location.LocationObjectCoords | null = null;
        const start = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") { console.log("❌ GPS permission denied"); return; }
            await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.Highest, timeInterval: 1000, distanceInterval: 1 },
                (loc) => {
                    const { latitude, longitude } = loc.coords;
                    if (!lastLocation) { lastLocation = loc.coords; return; }
                    const dLat = latitude - lastLocation.latitude;
                    const dLon = longitude - lastLocation.longitude;
                    const METERS_PER_LAT = 0.000010;
                    const METERS_PER_LON = 0.000013;
                    const PIXELS_PER_METER = 2;
                    let metersY = dLat / METERS_PER_LAT;
                    let metersX = dLon / METERS_PER_LON;
                    const MAX_STEP = 15;
                    metersX = Math.max(Math.min(metersX, MAX_STEP), -MAX_STEP);
                    metersY = Math.max(Math.min(metersY, MAX_STEP), -MAX_STEP);
                    setUserPosition(prev => ({
                        x: prev.x * 0.8 + (prev.x + metersX * PIXELS_PER_METER) * 0.2,
                        y: prev.y * 0.8 + (prev.y - metersY * PIXELS_PER_METER) * 0.2,
                    }));
                    lastLocation = loc.coords;
                }
            );
        };
        start();
    }, []);

    // fetch teacher room (kept)
    useEffect(() => {
        if (!selectedTeacher?.id) { setTeacherRoom(null); setSelectedMarker(null); return; }
        fetch(`http://${serverConfig.ip}:${serverConfig.port}/teachers/${selectedTeacher.id}`)
            .then(res => res.json())
            .then((room: IRoomDetailed) => {
                // reuse your scaling helper if desired
                const scaledRoom = hardScaleXY(room);
                setTeacherRoom(scaledRoom);
                setSelectedMarker({
                    id: scaledRoom.id,
                    x: scaledRoom.x,
                    y: scaledRoom.y,
                    name: `${selectedTeacher.title || ''} ${selectedTeacher.firstname} ${selectedTeacher.lastname}`
                });
            })
            .catch(() => { setTeacherRoom(null); setSelectedMarker(null); });
    }, [selectedTeacher]);

    useEffect(() => {
        if (floor === 'OG') {
            scale.value = 2;
        } else {
            scale.value = 1;
        }

        translateX.value = 0;
        translateY.value = 0;
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
    }, [floor]);

    // gestures: pinch & pan (only affect innerContent)
    const pinchGesture = Gesture.Pinch()
        .onUpdate(event => {
            scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, event.scale * scale.value));
        })
        .onEnd(() => {
            scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value));
        });

    const panGesture = Gesture.Pan()
        .onUpdate(event => {
            if (scale.value > 1.01) {
                translateX.value = lastTranslateX.value + event.translationX;
                translateY.value = lastTranslateY.value + event.translationY;
            }
        })
        .onEnd(() => {
            lastTranslateX.value = translateX.value;
            lastTranslateY.value = translateY.value;
        });

    const animatedInnerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    // helper: keep your original hardScaleXY
    const hardScaleXY = (room: IRoomDetailed) => {
        if (!room) return room;
        room.x = (room.x / 4) - (room.x * 0.04);
        while (room.y > 120 || room.y < 90) {
            if (room.y > 120) room.y = (room.y / 1.1);
            if (room.y < 90) room.y = (room.y * 1.1);
        }
        return room;
    };

    // markers
    const markers: Marker[] = teacherRoom ? [{
        id: teacherRoom.id,
        y: teacherRoom.y,
        x: teacherRoom.x,
        name: `${selectedTeacher?.title || ''} ${selectedTeacher?.firstname} ${selectedTeacher?.lastname}`
    }] : [];

    // path calculation (kept)
    const calculatePath = () => {
        if (!selectedMarker || !userPosition) return null;
        const centralPathY = (isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT) * 0.45;
        const path: { x: number; y: number }[] = [];
        const { x: userX, y: userY } = userPosition;
        const { x: teacherX, y: teacherY } = selectedMarker;
        if (userY !== centralPathY) path.push({ x: userX, y: centralPathY });
        if (userX !== teacherX) path.push({ x: teacherX, y: centralPathY });
        if (teacherY !== centralPathY) path.push({ x: teacherX, y: teacherY });
        return path;
    };
    const path = calculatePath();
    const mapImage = floor === 'OG' ? pictureOG : pictureUG;

    // sizes for outer container (fixed)
    const outerWidth = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_WIDTH;
    const outerHeight = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT;

    return (
        <View style={[styles.container, { width: outerWidth }]}>
            {/* Fixed outer container: map is centered below title */}
            <View style={[styles.mapContainer, { width: outerWidth, height: outerHeight }]}>
                {/* GestureDetector applies to the inner content so only image & markers scale */}
                <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
                    <Animated.View style={[styles.innerContent, animatedInnerStyle]}>
                        {/* Map image */}
                        <Image source={mapImage} style={[styles.mapImage, { width: outerWidth, height: outerHeight }]} resizeMode="contain" />

                        {/* Teacher markers (positioned absolutely relative to inner content)
                Note: marker.x / y should be correct pixel coords compatible with your map image dimensions */}
                        {markers.map(marker => (
                            <TouchableOpacity
                                key={marker.id}
                                style={[styles.marker, { left: marker.x - 15, top: marker.y - 15 }]}
                                onPress={() => setSelectedMarker(marker)}
                                activeOpacity={0.9}
                            >
                                <Image
                                    source={selectedTeacher?.image_url?.length < 1 ? require('@/assets/images/Teacher.png') : { uri: selectedTeacher?.image_url }}
                                    style={styles.teacherImage}
                                />
                            </TouchableOpacity>
                        ))}

                        {/* user arrow */}
                        {(getLatitude(userLocation) !== 0 && getLongitude(userLocation) !== 0) && (
                            <View style={[styles.userArrow, { left: userPosition.x - 25, top: userPosition.y - 25 }]}>
                                <Image source={require('@/assets/images/user.png')} style={styles.arrowImage} />
                            </View>
                        )}

                        {/* path lines */}
                        {path && (
                            <Svg style={StyleSheet.absoluteFill}>
                                {path.map((point, index) => {
                                    const prevPoint = index === 0 ? userPosition : path[index - 1];
                                    return (
                                        <Line
                                            key={index}
                                            x1={prevPoint.x}
                                            y1={prevPoint.y}
                                            x2={point.x}
                                            y2={point.y}
                                            stroke="rgba(0, 102, 255, 0.75)"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="5,5"
                                        />
                                    );
                                })}
                            </Svg>
                        )}
                    </Animated.View>
                </GestureDetector>
            </View>

            {/* Selected marker info */}
            {selectedMarker && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Selected Location:</Text>
                    <Text>{selectedMarker.name}</Text>
                </View>
            )}

            {/* optional GPS logger */}
            {showLogger && (<GPSLogger />)}
        </View>
    );
};

export default MapsOfKaindorf;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    mapContainer: {
        overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContent: {
        // inner content is absolutely sized to container; transforms apply here
        position: 'absolute',
        left: 0,
        top: 0,
        // width/height set inline to match outer container
    },
    mapImage: {
        // will be set inline to container size
    },
    marker: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teacherImage: {
        width: 26,
        height: 26,
        borderRadius: 13,
    },
    userArrow: {
        position: 'absolute',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    infoBox: {
        marginTop: 8,
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 8,
    },
    infoText: {
        fontWeight: '700',
        marginBottom: 4,
    },
});