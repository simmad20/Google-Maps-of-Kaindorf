import * as Location from 'expo-location';

import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Gyroscope, Magnetometer } from 'expo-sensors';
import React, { useContext, useEffect, useState } from 'react';
import Svg, { Line } from 'react-native-svg';
import { TeacherContext, TeacherContextType } from './context/TeacherContext';
import { getLatitude, getLongitude } from 'geolib';

import { IRoomDetailed } from '@/models/interfaces';
import { serverConfig } from '@/config/server';

interface Marker {
    id: number;
    y: number;
    x: number;
    name: string;
}

export default function MapsOfKaindorf() {
    const { selectedTeacher } = useContext<TeacherContextType>(TeacherContext);
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [userLocation, setUserLocation] = useState({ latitude: 46.801649, longitude: 15.5419766 });
    const [userPosition, setUserPosition] = useState({ x: Dimensions.get('window').width / 2, y: 110 });
    const [mapHeight, setMapHeight] = useState(Dimensions.get('window').height * 0.4);
    const [teacherRoom, setTeacherRoom] = useState<IRoomDetailed | null>(null);

    const picture = require('@/assets/images/OG.png');
    const scale = useSharedValue(3);
    const translateX = useSharedValue(0);
    const lastTranslateX = useSharedValue(0);
    const centralPathY = mapHeight * 0.45;

    useEffect(() => {
        const requestLocationPermission = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Location permission not granted');
                return;
            }

            const locationWatcher = await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.High,
                    timeInterval: 1000,
                    distanceInterval: 1,
                },
                (newLocation) => {
                    const { latitude, longitude } = newLocation.coords;
                    setUserLocation({ latitude, longitude });
                }
            );

            return () => locationWatcher.remove();
        };

        requestLocationPermission();

        const magnetometerSubscription = Magnetometer.addListener((data) => {
            // Magnetometer logic if needed
        });

        const gyroscopeSubscription = Gyroscope.addListener((gyroData) => {
            // Gyroscope logic if needed
        });

        return () => {
            magnetometerSubscription.remove();
            gyroscopeSubscription.remove();
        };
    }, []);

	const hardScaleXY = (room: IRoomDetailed) => {
		room.x = (room.x / 4) - (room.x * 0.04);
		while(room.y > 120 || room.y < 90) {
			if (room.y > 120) room.y = (room.y / 1.1);
			if (room.y < 90) room.y = (room.y * 1.1);
		}
		return room;
	}

    useEffect(() => {
        if (selectedTeacher?.id) {
            fetch(`http://${serverConfig.ip}:${serverConfig.port}/teachers/${selectedTeacher.id}`)
                .then(res => res.json())
                .then((room: IRoomDetailed) => {
					console.log(room);
					const scaledRoom = hardScaleXY(room);
                    setTeacherRoom(scaledRoom);
					console.log(scaledRoom);
                    setSelectedMarker({
                        id: scaledRoom.id,
                        x: scaledRoom.x,
                        y: scaledRoom.y,
                        name: `${selectedTeacher.title || ''} ${selectedTeacher.firstname} ${selectedTeacher.lastname}`
                    });
                })
                .catch(error => {
                    setTeacherRoom(null);
                    setSelectedMarker(null);
                });
        } else {
            setTeacherRoom(null);
            setSelectedMarker(null);
        }
    }, [selectedTeacher]);

    const markers: Marker[] = teacherRoom ? [{
        id: teacherRoom ? teacherRoom.id : -1,
        y: teacherRoom ? teacherRoom.y : 95,
        x: teacherRoom ? teacherRoom.x : Dimensions.get('window').width / 2,
        name: teacherRoom ? `${selectedTeacher?.title || ''} ${selectedTeacher?.firstname} ${selectedTeacher?.lastname}` : ""
    }] : [];

    const pinchGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = event.scale;
        })
        .onEnd(() => {
            scale.value = withSpring(3);
        });

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            if (lastTranslateX.value + event.translationX < 417.06840032339096 &&
                lastTranslateX.value + event.translationX > -417.06840032339096) {
                translateX.value = lastTranslateX.value + event.translationX;
            }
        })
        .onEnd(() => {
            lastTranslateX.value = translateX.value;
        });

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { translateX: translateX.value },
            { scale: scale.value },
        ],
    }));

    const calculatePath = () => {
        if (!selectedMarker || !userPosition) return null;

        const path = [];
        const { x: userX, y: userY } = userPosition;
        const { x: teacherX, y: teacherY } = selectedMarker;

        if (userY !== centralPathY) path.push({ x: userX, y: centralPathY });
        if (userX !== teacherX) path.push({ x: teacherX, y: centralPathY });
        if (teacherY !== centralPathY) path.push({ x: teacherX, y: teacherY });

        return path;
    };

    const path = calculatePath();

    return (
        <View style={styles.container} id='map'>
            <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
                <Animated.View style={[styles.mapContainer, { height: mapHeight }, animatedStyle]}>
                    <Image
                        source={picture}
                        style={styles.mapImage}
                        resizeMode="contain"
                        onLayout={(event) => {
                            const { height } = Image.resolveAssetSource(picture);
                            setMapHeight(height / 2);
                        }}
                    />

                    {markers.map(marker => (
                        <TouchableOpacity
                            key={marker.id}
                            style={[styles.marker, { top: marker.y, left: marker.x }]}
                        >
                            <Image
                                source={selectedTeacher?.image_url?.length < 1
                                    ? require('@/assets/images/Teacher.png')
                                    : { uri: selectedTeacher?.image_url }}
                                style={styles.teacherImage}
                            />
                        </TouchableOpacity>
                    ))}

                    {(getLatitude(userLocation) !== 0 && getLongitude(userLocation) !== 0) && (
                        <Animated.View style={[styles.userArrow, { top: userPosition.y, left: userPosition.x }]}>
                            <Image source={require('@/assets/images/user.png')} style={styles.arrowImage} />
                        </Animated.View>
                    )}

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
                                        fill="none"
                                        strokeDasharray="5, 5"
                                    />
                                );
                            })}
                        </Svg>
                    )}
                </Animated.View>
            </GestureDetector>

            {selectedMarker && (
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Selected Location:</Text>
                    <Text>Name: {selectedMarker.name}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.resetButton} onPress={() => setSelectedMarker(null)}>
                <Text style={styles.resetButtonText}>Reset Location</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    mapContainer: {
        width: Dimensions.get('window').width,
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    marker: {
        position: 'absolute',
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    teacherImage: {
        width: 20,
        height: 20,
        borderRadius: 15,
        transform: [{ translateX: -15 }, { translateY: -15 }],
    },
    userArrow: {
        position: 'absolute',
        width: 50,
        height: 50,
        marginLeft: -25,
        marginTop: -25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    arrowImage: {
        width: '40%',
        height: '40%',
        resizeMode: 'contain',
        transform: [{ translateX: 0.5 }, { translateY: 3 }],
    },
    infoBox: {
        position: 'absolute',
        bottom: 80,
        left: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 10,
        borderRadius: 8,
    },
    infoText: {
        fontWeight: 'bold',
        marginBottom: 5,
    },
    resetButton: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    resetButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});