import * as Location from 'expo-location';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { ICard, IRoomDetailed } from '@/models/interfaces';
import React, { useContext, useEffect, useState } from 'react';
import Svg, { Line } from 'react-native-svg';
import { TeacherContext, TeacherContextType } from './context/TeacherContext';
import { getLatitude, getLongitude } from 'geolib';

import GPSLogger from './GPSLogger';
import { serverConfig } from '@/config/server';

interface Marker { id: number; x: number; y: number; name: string; floor: 'OG' | 'UG'; }
interface MapsOfKaindorfProps { onQrPress?: () => void; floor: 'OG' | 'UG'; showLogger?: boolean; cards: ICard[]; }

const pictureOG = require('@/assets/images/OG.png');
const pictureUG = require('@/assets/images/UG.png');

const isMobile = Dimensions.get('window').width < 650;
const MAP_MOBILE_SIZE = Math.round(Dimensions.get('window').width * 0.9);
const MAP_DESKTOP_WIDTH = Math.round(Dimensions.get('window').width * 0.7);
const MAP_DESKTOP_HEIGHT = Math.round(Dimensions.get('window').height * 0.55);

const MapsOfKaindorf = ({ floor, showLogger, cards }: MapsOfKaindorfProps) => {
    const { selectedTeacher } = useContext<TeacherContextType>(TeacherContext);

    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [userLocation, setUserLocation] = useState({ latitude: 46.801649, longitude: 15.5419766 });
    const [userPosition, setUserPosition] = useState({ x: 210, y: 190 });
    const [teacherRoom, setTeacherRoom] = useState<IRoomDetailed | null>(null);

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const lastTranslateX = useSharedValue(0);
    const lastTranslateY = useSharedValue(0);

    const MIN_SCALE = 1;
    const MAX_SCALE = 2.2;

    //
    //  GPS TRACKING
    //
    useEffect(() => {
        let lastLocation: Location.LocationObjectCoords | null = null;

        const start = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.Highest, timeInterval: 1000, distanceInterval: 1 },
                loc => {
                    const { latitude, longitude } = loc.coords;
                    if (!lastLocation) { lastLocation = loc.coords; return; }

                    const dLat = latitude - lastLocation.latitude;
                    const dLon = longitude - lastLocation.longitude;

                    const METERS_PER_LAT = 0.000010;
                    const METERS_PER_LON = 0.000013;
                    const PIXELS_PER_METER = 2;

                    let metersY = dLat / METERS_PER_LAT;
                    let metersX = dLon / METERS_PER_LON;

                    const MAX_STEP = 10;
                    metersX = Math.max(Math.min(metersX, MAX_STEP), -MAX_STEP);
                    metersY = Math.max(Math.min(metersY, MAX_STEP), -MAX_STEP);

                    // weichere Bewegung
                    setUserPosition(prev => ({
                        x: prev.x * 0.85 + (prev.x + metersX * PIXELS_PER_METER) * 0.15,
                        y: prev.y * 0.85 + (prev.y - metersY * PIXELS_PER_METER) * 0.15,
                    }));

                    lastLocation = loc.coords;
                    setUserLocation({ latitude, longitude });
                }
            );
        };

        start();
    }, []);

    //
    // FETCH TEACHER ROOM
    //
    useEffect(() => {
        if (!selectedTeacher?.id) {
            setTeacherRoom(null);
            setSelectedMarker(null);
            return;
        }

        fetch(`https://${serverConfig.dns}/rooms/${selectedTeacher.assignedRoomId}`)
            .then(res => res.json())
            .then((room: IRoomDetailed) => {
                const card = cards.find(c => c.id === room.cardId);
                if (!card) return;

                const floorAt = card.title === 'OG' ? 'OG' : 'UG';

                setTeacherRoom(room);
                setSelectedMarker({
                    id: room.id,
                    x: room.x,
                    y: room.y,
                    name: `${selectedTeacher.attributes.firstname} ${selectedTeacher.attributes.lastname}`,
                    floor: floorAt
                });
            })
            .catch(() => {
                setTeacherRoom(null);
                setSelectedMarker(null);
            });
    }, [selectedTeacher]);

    //
    // RESET PAN + ZOOM WHEN FLOOR SWITCHES
    //
    useEffect(() => {
        scale.value = withTiming(1);
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
    }, [floor]);

    //
    // GESTURES
    //
    const pinchGesture = Gesture.Pinch()
        .onUpdate(event => {
            const next = scale.value * event.scale;
            scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
        });

    const panGesture = Gesture.Pan()
        .onUpdate(event => {
            if (scale.value <= 1.01) return;

            translateX.value = lastTranslateX.value + event.translationX;
            translateY.value = lastTranslateY.value + event.translationY;
        })
        .onEnd(() => {
            lastTranslateX.value = translateX.value;
            lastTranslateY.value = translateY.value;
        });

    //
    // ANIMATED STYLE
    //
    const animatedInnerStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }));

    //
    // PATHFINDING
    //
    const STAIR_UG = { x: 185, y: 180 };
    const STAIR_OG = { x: 50, y: 50 };

    const calculatePaths = () => {
        if (!selectedMarker) return { pathUG: null, pathOG: null };

        const userFloor = "UG"; // User startet immer im UG
        const teacherFloor = selectedMarker.floor;

        //
        // —————————————————————————————————————————————
        // FALL A: Lehrer ist im UG
        // —————————————————————————————————————————————
        //
        if (teacherFloor === "UG") {
            return {
                pathUG: [
                    { x: userPosition.x, y: userPosition.y },
                    { x: selectedMarker.x, y: selectedMarker.y }
                ],
                pathOG: null
            };
        }

        //
        // —————————————————————————————————————————————
        // FALL B: Lehrer ist im OG & User ist im UG
        // —————————————————————————————————————————————
        //
        return {
            pathUG: [
                { x: userPosition.x, y: userPosition.y },
                { x: STAIR_UG.x, y: STAIR_UG.y }
            ],
            pathOG: [
                { x: STAIR_OG.x, y: STAIR_OG.y },
                { x: selectedMarker.x, y: selectedMarker.y }
            ]
        };
    };

    const { pathUG, pathOG } = calculatePaths();
    const mapImage = floor === 'OG' ? pictureOG : pictureUG;

    const outerWidth = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_WIDTH;
    const outerHeight = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT;

    //
    // REVERSE SCALING → Icons bleiben normal groß
    //
    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 1 / scale.value }]
    }));

    return (
        <View style={[styles.container, { width: outerWidth }]}>
            <View style={[styles.mapContainer, { width: outerWidth, height: outerHeight }]}>

                <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
                    <Animated.View style={[styles.innerContent, animatedInnerStyle]}>

                        <Image
                            source={mapImage}
                            style={{ width: outerWidth, height: outerHeight }}
                            resizeMode="contain"
                        />

                        {/* TEACHER MARKER */}
                        {selectedMarker && selectedMarker.floor === floor && (
                            <TouchableOpacity
                                activeOpacity={0.9}
                                style={[styles.marker, { left: selectedMarker.x - 15, top: selectedMarker.y - 15 }]}
                            >
                                <Animated.Image
                                    source={
                                        selectedTeacher?.attributes.image_url
                                            ? { uri: selectedTeacher.attributes.image_url }
                                            : require('@/assets/images/Teacher.png')
                                    }
                                    style={[styles.teacherImage, iconStyle]}
                                />
                            </TouchableOpacity>
                        )}

                        {/* USER MARKER */}
                        {(floor === "UG" && getLatitude(userLocation) !== 0 && getLongitude(userLocation) !== 0) && (
                            <Animated.View
                                style={[
                                    styles.userArrow,
                                    {
                                        left: userPosition.x - 25,
                                        top: userPosition.y - 25,
                                    },
                                    iconStyle
                                ]}
                            >
                                <Image
                                    source={require('@/assets/images/user.png')}
                                    style={styles.arrowImage}
                                />
                            </Animated.View>
                        )}

                        {/* NAVIGATION PATH */}
                        {/* UG PATH */}
                        {floor === "UG" && pathUG && (
                            <Svg style={StyleSheet.absoluteFill}>
                                {pathUG.map((point, index) => {
                                    if (index === 0) return null;
                                    const prev = pathUG[index - 1];

                                    return (
                                        <Line
                                            key={`ug-${index}`}
                                            x1={prev.x}
                                            y1={prev.y}
                                            x2={point.x}
                                            y2={point.y}
                                            stroke="rgba(0,102,255,0.75)"
                                            strokeWidth={4}
                                            strokeDasharray="5,5"
                                            strokeLinecap="round"
                                        />
                                    );
                                })}
                            </Svg>
                        )}

                        {/* OG PATH */}
                        {floor === "OG" && pathOG && (
                            <Svg style={StyleSheet.absoluteFill}>
                                {pathOG.map((point, index) => {
                                    if (index === 0) return null;
                                    const prev = pathOG[index - 1];

                                    return (
                                        <Line
                                            key={`og-${index}`}
                                            x1={prev.x}
                                            y1={prev.y}
                                            x2={point.x}
                                            y2={point.y}
                                            stroke="rgba(0,102,255,0.75)"
                                            strokeWidth={4}
                                            strokeDasharray="5,5"
                                            strokeLinecap="round"
                                        />
                                    );
                                })}
                            </Svg>
                        )}

                    </Animated.View>
                </GestureDetector>
            </View>

            {showLogger && <GPSLogger />}
        </View>
    );
};

export default MapsOfKaindorf;

const styles = StyleSheet.create({
    container: { alignItems: 'center', width: '100%' },
    mapContainer: {
        overflow: 'hidden',
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContent: { position: 'absolute', left: 0, top: 0 },
    marker: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    teacherImage: {
        width: 26,
        height: 26,
        borderRadius: 13
    },
    userArrow: {
        position: 'absolute',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowImage: { width: '100%', height: '100%', resizeMode: 'contain' },
});