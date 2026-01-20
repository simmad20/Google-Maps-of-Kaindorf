import * as Location from 'expo-location';

import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {IRoom, IRoomDetailed} from '@/models/interfaces';
import {Image, StyleSheet, TouchableOpacity, View, useWindowDimensions} from 'react-native';
import {ObjectContext, ObjectContextType} from "@/components/context/ObjectContext";
import React, {useContext, useEffect, useState} from 'react';
import Svg, {Circle, Line} from 'react-native-svg';
import {getLatitude, getLongitude} from 'geolib';

import GPSLogger from './GPSLogger';
import {Magnetometer} from 'expo-sensors';
import {serverConfig} from '../config/server';
import {useEvent} from '@/components/context/EventContext';
import {useRef} from 'react';

interface Marker {
    id: string;
    x: number;
    y: number;
    name: string;
    floor: 'OG' | 'UG';
}

interface MapsOfKaindorfProps {
    floor: 'OG' | 'UG';
    qrPosition?: {
        x: number;
        y: number;
        floor: 'OG' | 'UG';
    } | null;
    onReachStairs?: () => void;
    showLogger?: boolean;
}

const MapsOfKaindorf = ({floor, qrPosition, showLogger, onReachStairs}: MapsOfKaindorfProps) => {
    const {selectedObject, selectedType, cards} = useContext<ObjectContextType>(ObjectContext);
    const {activeEvent} = useEvent();
    const {width: windowWidth, height: windowHeight} = useWindowDimensions();
    const pictureOG = require('@/assets/images/OG.png');
    const pictureUG = require('@/assets/images/UG.png');

    console.log("selected in map:");
    console.log(selectedObject);
    const imageField = selectedType?.schema?.find(f => f.type === "image");
    const imageUrl = imageField ? selectedObject?.attributes[imageField.key] : undefined;

    // Responsive Map-Größen berechnen
    const isMobile = windowWidth < 650;
    const MAP_MOBILE_SIZE = Math.round(windowWidth * 0.9);
    const MAP_DESKTOP_WIDTH = Math.round(windowWidth * 0.7);
    const MAP_DESKTOP_HEIGHT = Math.round(windowHeight * 0.55);

    const outerWidth = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_WIDTH;
    const outerHeight = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT;

    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [userLocation, setUserLocation] = useState({latitude: 46.801649, longitude: 15.5419766});
    const [userPosition, setUserPosition] = useState({
        x: 210,
        y: 190,
        floor: 'UG' as 'UG' | 'OG'
    });
    const [teacherRoom, setTeacherRoom] = useState<IRoom | null>(null);
    const [freeMovementMode, setFreeMovementMode] = useState(true);
    const [isCompassActive, setIsCompassActive] = useState(true);
    const [hasSnapped, setHasSnapped] = useState(false);
    const [heading, setHeading] = useState(0);
    const [imageDimensions, setImageDimensions] = useState({
        width: outerWidth,
        height: outerHeight
    });

    const smoothedHeading = useRef(0);
    const hasInitializedPosition = useRef(false);
    useEffect(() => {
        if (hasInitializedPosition.current) return;

        setUserPosition({
            x: 210,
            y: 190,
            floor: 'UG',
        });

        hasInitializedPosition.current = true;
    }, []);

    const lastPosition = useRef({x: 210, y: 190});
    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const lastTranslateX = useSharedValue(0);
    const lastTranslateY = useSharedValue(0);

    const MIN_SCALE = 1;
    const MAX_SCALE = 2.2;

    const UG_YWay = 180;
    const OG_YWay = 165;

    //
    // PATHFINDING
    //
    const STAIR_UG = {x: 185, y: 198};
    const STAIR_OG = {x: 190, y: 175};

    //
    // CHECKPOINTS
    //
    const checkpointsUG = [
        {
            id: 'ug-gang-1',
            x: 185,
            y: UG_YWay,
            latitude: 46.801645,
            longitude: 15.541960,
        },
        {
            id: 'ug-gang-2',
            x: 80,
            y: UG_YWay,
            latitude: 46.801650,
            longitude: 15.541990,
        }
    ];

    const checkpointsOG = [
        {
            id: 'og-gang-1',
            x: 190,
            y: OG_YWay,
            latitude: 46.801680,
            longitude: 15.541975,
        },
        {
            id: 'og-gang-2',
            x: 80,
            y: OG_YWay,
            latitude: 46.801690,
            longitude: 15.542000,
        }
    ];

    const mapImage = floor === 'OG' ? pictureOG : pictureUG;
    const checkpoints = floor === "UG" ? checkpointsUG : checkpointsOG;
    const {pathUG, pathOG} = React.useMemo(() => {
        if (!selectedMarker) return {pathUG: null, pathOG: null};

        const teacherFloor = selectedMarker.floor;
        const userFloor = userPosition.floor;

        console.log('Path calculation:', {
            userFloor,
            teacherFloor,
            userPosition: userPosition,
            teacherPosition: {x: selectedMarker.x, y: selectedMarker.y}
        });

        // LEHRER IM UG
        if (teacherFloor === "UG") {
            if (userFloor === "UG") {
                // BEIDE IM UG
                if (userPosition.x < 50 && Math.abs(userPosition.y - UG_YWay) < 5) {
                    // User ist schon im Gang → direkter Pfad
                    return {
                        pathUG: [
                            {x: userPosition.x, y: userPosition.y},
                            {x: selectedMarker.x, y: selectedMarker.y}
                        ],
                        pathOG: null
                    };
                } else {
                    // User ist nicht im Gang → gehe zuerst zum Gang
                    return {
                        pathUG: [
                            {x: userPosition.x, y: userPosition.y},
                            {x: userPosition.x, y: UG_YWay},        // Vertikal zum Gang
                            {x: selectedMarker.x, y: UG_YWay},      // Horizontal im Gang
                            {x: selectedMarker.x, y: selectedMarker.y} // Vertikal zum Raum
                        ],
                        pathOG: null
                    };
                }
            } else {
                // USER IM OG, LEHRER IM UG → gehe zu Treppe UG
                return {
                    pathUG: [
                        {x: STAIR_UG.x, y: STAIR_UG.y},            // Start an UG Treppe
                        {x: STAIR_UG.x, y: UG_YWay},               // Vertikal zum Gang
                        {x: selectedMarker.x, y: UG_YWay},         // Horizontal im Gang
                        {x: selectedMarker.x, y: selectedMarker.y}  // Vertikal zum Raum
                    ],
                    pathOG: [
                        {x: userPosition.x, y: userPosition.y},
                        {x: STAIR_OG.x, y: STAIR_OG.y}             // Zum OG Treppenabgang
                    ]
                };
            }
        }

        // LEHRER IM OG
        if (teacherFloor === "OG") {
            if (userFloor === "OG") {
                // BEIDE IM OG
                if (userPosition.x < 50 && Math.abs(userPosition.y - OG_YWay) < 5) {
                    // User ist schon im Gang → direkter Pfad
                    return {
                        pathUG: null,
                        pathOG: [
                            {x: userPosition.x, y: userPosition.y},
                            {x: selectedMarker.x, y: selectedMarker.y}
                        ]
                    };
                } else {
                    // User ist nicht im Gang → gehe zuerst zum Gang
                    return {
                        pathUG: null,
                        pathOG: [
                            {x: userPosition.x, y: userPosition.y},
                            {x: userPosition.x, y: OG_YWay},        // Vertikal zum Gang
                            {x: selectedMarker.x, y: OG_YWay},      // Horizontal im Gang
                            {x: selectedMarker.x, y: selectedMarker.y} // Vertikal zum Raum
                        ]
                    };
                }
            } else {
                // USER IM UG, LEHRER IM OG → gehe zu Treppe OG
                return {
                    pathUG: [
                        {x: userPosition.x, y: userPosition.y},
                        {x: userPosition.x, y: UG_YWay},           // Vertikal zum UG Gang
                        {x: STAIR_UG.x, y: UG_YWay},               // Horizontal zur UG Treppe
                        {x: STAIR_UG.x, y: STAIR_UG.y}             // Vertikal zur Treppe
                    ],
                    pathOG: [
                        {x: STAIR_OG.x, y: STAIR_OG.y},            // Start an OG Treppe
                        {x: STAIR_OG.x, y: OG_YWay},               // Vertikal zum Gang
                        {x: selectedMarker.x, y: OG_YWay},         // Horizontal im Gang
                        {x: selectedMarker.x, y: selectedMarker.y}  // Vertikal zum Raum
                    ]
                };
            }
        }

        return {pathUG: null, pathOG: null};
    }, [userPosition, selectedMarker]);

    //
    //  COMPASS HEADING - VERBESSERTE VERSION
    //
    useEffect(() => {
        let subscription: any = null;
        let isMounted = true;

        const startCompass = async () => {
            try {
                // Prüfe Verfügbarkeit
                const isAvailable = await Magnetometer.isAvailableAsync();
                if (!isAvailable) {
                    console.log('Magnetometer is not available on this device');
                    return;
                }

                console.log('Starting compass...');

                // Setze Update-Intervall zuerst
                Magnetometer.setUpdateInterval(100);

                subscription = Magnetometer.addListener((data) => {
                    if (!isMounted) return;

                    const {x, y} = data;

                    // Kompass-Winkel berechnen (in Grad)
                    let angle = Math.atan2(y, x) * (180 / Math.PI);

                    // Auf 0-360 Grad normalisieren
                    let normalized = (angle + 360) % 360;

                    // Magnetischen Norden zu geografischen Norden korrigieren (ungefähr)
                    // Dies variiert je nach Standort - für Österreich ca. +2° bis +4°
                    const magneticDeclination = 3; // Grad für Österreich
                    let corrected = (normalized + magneticDeclination) % 360;

                    // Erste Initialisierung
                    if (smoothedHeading.current === 0) {
                        smoothedHeading.current = corrected;
                    }

                    // Unterschied zum letzten Wert berechnen
                    let diff = Math.abs(corrected - smoothedHeading.current);

                    // Über den 0/360°-Übergang hinweg korrigieren
                    if (diff > 180) {
                        diff = 360 - diff;
                    }

                    // Große Sprünge ignorieren (Sensor-Rauschen)
                    if (diff > 30) {
                        return;
                    }

                    // Sanfte Glättung anwenden
                    smoothedHeading.current = smoothedHeading.current * 0.7 + corrected * 0.3;

                    if (isMounted) {
                        setHeading(smoothedHeading.current);
                        //setIsCompassActive(true);
                    }
                });

                console.log('Compass started successfully');

            } catch (error) {
                console.error('Error starting compass:', error);
            }
        };

        startCompass();

        return () => {
            isMounted = false;
            if (subscription) {
                subscription.remove();
                console.log('Compass stopped');
            }
        };
    }, []);

    //
    //  PATH-BASIERTE BEWEGUNG
    //
    const moveAlongPath = (metersNorth: number, metersEast: number, currentPath: { x: number, y: number }[] | null) => {
        // VERBESSERTE FEHLERBEHANDLUNG
        if (!currentPath || currentPath.length < 2) {
            console.log('No valid path available, using free movement');
            return {
                x: userPosition.x + metersEast * 2,
                y: userPosition.y - metersNorth * 2
            };
        }

        // VERBESSERT: Ignoriere die ersten Punkte und gehe direkt zum Hauptpfad
        let startIndex = 0;

        // Sicherstellen dass currentPath Punkte hat
        if (currentPath.length === 0) {
            return {
                x: userPosition.x + metersEast * 2,
                y: userPosition.y - metersNorth * 2
            };
        }

        // Wenn wir sehr nahe am Start sind, überspringe den ersten Punkt
        const distanceToStart = Math.sqrt(
            Math.pow(userPosition.x - currentPath[0].x, 2) +
            Math.pow(userPosition.y - currentPath[0].y, 2)
        );

        if (distanceToStart < 20 && currentPath.length > 1) {
            startIndex = 1;
        }

        // Wenn wir nahe am zweiten Punkt sind, überspringe die ersten beiden
        if (startIndex === 1 && currentPath.length > 2) {
            const distanceToSecond = Math.sqrt(
                Math.pow(userPosition.x - currentPath[1].x, 2) +
                Math.pow(userPosition.y - currentPath[1].y, 2)
            );

            if (distanceToSecond < 15) {
                startIndex = 2;
            }
        }

        // Finde den nächsten Punkt auf dem RESTLICHEN Pfad
        let closestSegmentIndex = startIndex;
        let closestDistance = Infinity;
        let closestPoint = {x: userPosition.x, y: userPosition.y}; // Fallback auf User Position

        for (let i = startIndex; i < currentPath.length - 1; i++) {
            const start = currentPath[i];
            const end = currentPath[i + 1];

            // Sicherstellen dass Punkte existieren
            if (!start || !end) continue;

            const segmentLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            if (segmentLength === 0) continue;

            const t = Math.max(0, Math.min(1,
                ((userPosition.x - start.x) * (end.x - start.x) +
                    (userPosition.y - start.y) * (end.y - start.y)) /
                (segmentLength * segmentLength)
            ));

            const projectedX = start.x + t * (end.x - start.x);
            const projectedY = start.y + t * (end.y - start.y);

            const distance = Math.sqrt(
                Math.pow(userPosition.x - projectedX, 2) +
                Math.pow(userPosition.y - projectedY, 2)
            );

            if (distance < closestDistance) {
                closestDistance = distance;
                closestSegmentIndex = i;
                closestPoint = {x: projectedX, y: projectedY};
            }
        }

        const movementStrength = Math.sqrt(metersNorth * metersNorth + metersEast * metersEast) * 5;

        if (movementStrength > 0.5 && closestSegmentIndex < currentPath.length - 1) {
            let targetSegmentIndex = closestSegmentIndex;

            const segmentStart = currentPath[targetSegmentIndex];
            const segmentEnd = currentPath[targetSegmentIndex + 1];

            // Sicherstellen dass Punkte existieren
            if (!segmentStart || !segmentEnd) {
                return {x: closestPoint.x, y: closestPoint.y};
            }

            const toUserX = userPosition.x - segmentStart.x;
            const toUserY = userPosition.y - segmentStart.y;
            const segmentX = segmentEnd.x - segmentStart.x;
            const segmentY = segmentEnd.y - segmentStart.y;
            const dotProduct = toUserX * segmentX + toUserY * segmentY;

            if (dotProduct < 0 && targetSegmentIndex < currentPath.length - 2) {
                targetSegmentIndex++;
            }

            // Sicherstellen dass targetPoint existiert
            if (targetSegmentIndex + 1 >= currentPath.length) {
                return {x: closestPoint.x, y: closestPoint.y};
            }

            const targetPoint = currentPath[targetSegmentIndex + 1];
            const directionX = targetPoint.x - userPosition.x;
            const directionY = targetPoint.y - userPosition.y;
            const directionLength = Math.sqrt(directionX * directionX + directionY * directionY);

            if (directionLength > 0) {
                const normalizedX = directionX / directionLength;
                const normalizedY = directionY / directionLength;

                const maxMovement = Math.min(movementStrength, directionLength);

                return {
                    x: userPosition.x + normalizedX * maxMovement,
                    y: userPosition.y + normalizedY * maxMovement
                };
            }
        }

        return {x: closestPoint.x, y: closestPoint.y};
    };

    //
    //  GPS TRACKING
    //
    useEffect(() => {
        let lastLocation: Location.LocationObjectCoords | null = null;
        let isMounted = true;

        const start = async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 1000,
                    distanceInterval: 1
                },
                (loc) => {
                    if (!isMounted) return;

                    const {latitude, longitude} = loc.coords;

                    if (!lastLocation) {
                        lastLocation = loc.coords;
                        return;
                    }

                    const dLat = latitude - lastLocation.latitude;
                    const dLon = longitude - lastLocation.longitude;

                    const METERS_PER_LAT = 0.000010;
                    const METERS_PER_LON = 0.000013;

                    let metersNorth = dLat / METERS_PER_LAT;
                    let metersEast = dLon / METERS_PER_LON;

                    const MAX_STEP = 10;
                    metersNorth = Math.max(Math.min(metersNorth, MAX_STEP), -MAX_STEP);
                    metersEast = Math.max(Math.min(metersEast, MAX_STEP), -MAX_STEP);

                    let newPosition: { x: any; y: any; };

                    try {
                        if (freeMovementMode) {
                            // FREIE BEWEGUNG MIT SNAP
                            if (isCompassActive) {
                                const headingRad = (heading * Math.PI) / 180;
                                const moveX = metersEast * Math.cos(headingRad) - metersNorth * Math.sin(headingRad);
                                const moveY = metersEast * Math.sin(headingRad) + metersNorth * Math.cos(headingRad);
                                newPosition = {
                                    x: userPosition.x + moveX * 2,
                                    y: userPosition.y - moveY * 2
                                };
                            } else {
                                newPosition = {
                                    x: userPosition.x + metersEast * 2,
                                    y: userPosition.y - metersNorth * 2
                                };
                            }

                            // NUR IM FREE MODUS: Snap zu Checkpoints
                            if (!hasSnapped) {
                                const allCP = floor === 'UG' ? checkpointsUG : checkpointsOG;
                                for (const cp of allCP) {
                                    const distLat = Math.abs(cp.latitude - latitude);
                                    const distLon = Math.abs(cp.longitude - longitude);
                                    const meterLat = distLat / METERS_PER_LAT;
                                    const meterLon = distLon / METERS_PER_LON;
                                    const distance = Math.sqrt(meterLat * meterLat + meterLon * meterLon);

                                    if (distance < 3) {
                                        newPosition = {x: cp.x, y: cp.y};
                                        setHasSnapped(true);
                                        break;
                                    }
                                }
                            }
                        } else {
                            // PATH-BASIERTE BEWEGUNG - MIT FEHLERBEHANDLUNG
                            const currentPath = floor === "UG" ? pathUG : pathOG;

                            // Sicherstellen dass ein gültiger Pfad existiert
                            if (!currentPath || currentPath.length < 2) {
                                // Fallback auf freie Bewegung
                                newPosition = {
                                    x: userPosition.x + metersEast * 2,
                                    y: userPosition.y - metersNorth * 2
                                };
                            } else {
                                newPosition = moveAlongPath(metersNorth, metersEast, currentPath);
                            }
                        }

                        // Sanfte Bewegung anwenden
                        setUserPosition(prev => ({
                            x: prev.x * 0.3 + newPosition.x * 0.7,
                            y: prev.y * 0.3 + newPosition.y * 0.7,
                            floor: prev.floor
                        }));

                        lastLocation = loc.coords;
                        setUserLocation({latitude, longitude});

                        // UG → OG FLOOR SWITCH
                        if (
                            floor === "UG" &&
                            Math.abs(userPosition.x - STAIR_UG.x) < 8 &&
                            Math.abs(userPosition.y - STAIR_UG.y) < 8
                        ) {
                            console.log("Reached UG stairs → switching to OG...");
                            onReachStairs?.();
                            setUserPosition(prev => ({x: STAIR_OG.x, y: STAIR_OG.y, floor: 'OG'}));
                            setHasSnapped(false);
                            return;
                        }
                    } catch (error) {
                        console.error('Error in GPS tracking:', error);
                        // Fallback auf freie Bewegung bei Fehlern
                        setUserPosition(prev => ({
                            x: prev.x + metersEast * 2,
                            y: prev.y - metersNorth * 2,
                            floor: prev.floor
                        }));
                    }
                }
            );
        };

        start();

        return () => {
            isMounted = false;
        };
    }, [heading, isCompassActive, floor, freeMovementMode, pathUG, pathOG, hasSnapped]);

    // Korrigierte updateMarker Funktion
    const updateMarker = () => {
        if (!selectedObject?.id) {
            console.log("No selectedObject id found");
            setTeacherRoom(null);
            setSelectedMarker(null);
            return;
        }

        console.log("Updating marker for selectedObject:", selectedObject);

        fetch(`${serverConfig.dns}/rooms?eventId=${activeEvent?.id}`)
            .then(res => res.json())
            .then((rooms: IRoom[]) => {
                console.log("Fetched rooms:", rooms);

                // Finde den Raum, der das ausgewählte Objekt enthält
                const room = rooms.find(r =>
                    r.assignedObjectIds.includes(selectedObject.id)
                );

                console.log("Found room for object:", room);

                if (!room) {
                    console.log("No room found for object");
                    setTeacherRoom(null);
                    setSelectedMarker(null);
                    return;
                }

                // Floor bestimmen
                const card = cards.find(c => c.id === room.cardId);
                if (!card) {
                    console.log("No card found for room");
                    return;
                }

                const floorAt = card.title === 'OG' ? 'OG' : 'UG';
                console.log("Floor determined:", floorAt);

                // WICHTIG: Genau wie im React Code - prozentuale Positionierung
                // Die room.x und room.y sind Pixel im ORIGINALBILD

                // Wir brauchen die originalen Bilddimensionen
                const originalImageWidth = floorAt === 'OG' ? 2336 : 2331;  // Deine bekannten Werte
                const originalImageHeight = floorAt === 'OG' ? 467 : 2029;  // Deine bekannten Werte

                // PROZENT berechnen (genau wie im React Code!)
                const percentX = (room.x / originalImageWidth) * 100;
                const percentY = (room.y / originalImageHeight) * 100;

                console.log("Prozentuale Position (wie im React Code):", {
                    roomCoords: { x: room.x, y: room.y },
                    originalImageSize: { width: originalImageWidth, height: originalImageHeight },
                    percentages: { x: percentX, y: percentY }
                });

                // Jetzt in Pixel für React Native umrechnen
                // ACHTUNG: outerWidth/outerHeight ist die Container-Größe mit dem Bild im "contain" Modus
                // Das bedeutet das Bild könnte kleiner sein als der Container!

                // Zuerst das tatsächliche Bild im Container berechnen (wegen resizeMode="contain")
                const containerAspect = outerWidth / outerHeight;
                const imageAspect = originalImageWidth / originalImageHeight;

                let renderedWidth, renderedHeight;

                if (containerAspect > imageAspect) {
                    // Container ist breiter als Bild -> Bild nimmt volle Höhe
                    renderedHeight = outerHeight;
                    renderedWidth = outerHeight * imageAspect;
                } else {
                    // Container ist höher als Bild -> Bild nimmt volle Breite
                    renderedWidth = outerWidth;
                    renderedHeight = outerWidth / imageAspect;
                }

                // Offset berechnen (weil Bild zentriert ist)
                const offsetX = (outerWidth - renderedWidth) / 2;
                const offsetY = (outerHeight - renderedHeight) / 2;

                // Finale Pixelposition berechnen
                const pixelX = offsetX + (percentX / 100) * renderedWidth;
                const pixelY = offsetY + (percentY / 100) * renderedHeight;

                console.log("Finale Position:", {
                    containerSize: { outerWidth, outerHeight },
                    renderedImageSize: { width: renderedWidth, height: renderedHeight },
                    imageOffset: { x: offsetX, y: offsetY },
                    pixelPosition: { x: pixelX, y: pixelY }
                });

                setTeacherRoom(room);
                setSelectedMarker({
                    id: room.id.toString(),
                    x: pixelX,
                    y: pixelY,
                    name: `${selectedObject.attributes.firstname} ${selectedObject.attributes.lastname}`,
                    floor: floorAt
                });
            })
            .catch((error) => {
                console.error("Error fetching rooms:", error);
                setTeacherRoom(null);
                setSelectedMarker(null);
            });
    }

    useEffect(() => {
        const mapImage = floor === 'OG' ? pictureOG : pictureUG;

        // Verwende require() direkt oder die importierte Variable
        if (mapImage) {
            try {
                // Methode 1: Direkt mit require() falls bekannt
                const imageSource = floor === 'OG'
                    ? require('@/assets/images/OG.png')
                    : require('@/assets/images/UG.png');

                // Extrahiere width und height
                if (imageSource && imageSource.width && imageSource.height) {
                    console.log('Bildgröße ermittelt:', {
                        width: imageSource.width,
                        height: imageSource.height
                    });
                    setImageDimensions({
                        width: imageSource.width,
                        height: imageSource.height
                    });
                    return;
                }
            } catch (e) {
                console.log('Erster Versuch fehlgeschlagen:', e);
            }

            try {
                // Methode 2: Mit Image.resolveAssetSource (korrekt)
                const resolvedSource = Image.resolveAssetSource(mapImage);
                if (resolvedSource && resolvedSource.width && resolvedSource.height) {
                    console.log('Bildgröße über resolveAssetSource:', {
                        width: resolvedSource.width,
                        height: resolvedSource.height
                    });
                    setImageDimensions({
                        width: resolvedSource.width,
                        height: resolvedSource.height
                    });
                }
            } catch (error) {
                console.warn('resolveAssetSource fehlgeschlagen:', error);

                // Methode 3: Fallback auf getSize mit URI
                const resolvedSource = Image.resolveAssetSource(mapImage);
                if (resolvedSource && resolvedSource.uri) {
                    Image.getSize(
                        resolvedSource.uri,
                        (width, height) => {
                            console.log('Bildgröße über getSize:', {width, height});
                            setImageDimensions({
                                width,
                                height
                            });
                        },
                        (getSizeError) => {
                            console.warn('getSize fehlgeschlagen:', getSizeError);
                            // Endgültiger Fallback
                            if (floor === 'OG') {
                                setImageDimensions({width: 2336, height: 467});
                            } else {
                                setImageDimensions({width: 2331, height: 2029});
                            }
                        }
                    );
                } else {
                    // Direkter Fallback
                    if (floor === 'OG') {
                        setImageDimensions({width: 2336, height: 467});
                    } else {
                        setImageDimensions({width: 2331, height: 2029});
                    }
                }
            }
        }
    }, [floor]);

    useEffect(() => {
        console.log("marker: ", selectedMarker);
        updateMarker();
    }, [selectedObject]);
    //
    // FETCH TEACHER ROOM
    //
    useEffect(() => {
        console.log(imageDimensions);
        updateMarker();
    }, [imageDimensions, cards, outerWidth, outerHeight]);

    //
    // UPDATE USER POSITION MIT QR SCAN
    //
    useEffect(() => {
        if (!qrPosition) return;

        setUserPosition(prev => ({
            ...prev,
            x: qrPosition.x,
            y: qrPosition.y,
            floor: qrPosition.floor,
        }));

        setHasSnapped(false);
    }, [qrPosition]);

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
            {translateX: translateX.value},
            {translateY: translateY.value},
            {scale: scale.value},
        ],
    }));

    //
    // USER ARROW STYLE MIT ROTATION - KORRIGIERT
    //
    const userArrowStyle = useAnimatedStyle(() => ({
        transform: [
            {scale: 1 / scale.value},
            {rotate: isCompassActive ? `${heading}deg` : '0deg'},
        ],
    }));

    // Separate Style für Teacher Image
    const teacherImageStyle = useAnimatedStyle(() => ({
        transform: [
            {scale: 1 / scale.value}
        ],
    }));

    return (
        <View style={[styles.container, {width: outerWidth}]}>
            <View style={[styles.mapContainer, {width: outerWidth, height: outerHeight}]}>

                <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
                    <Animated.View style={[styles.innerContent, animatedInnerStyle]}>

                        <Image
                            source={mapImage}
                            style={{width: outerWidth, height: outerHeight}}
                            resizeMode="contain"
                        />

                        {/* TEACHER MARKER */}
                        {selectedMarker && selectedMarker.floor === floor && (
                            <Animated.View
                                style={[
                                    styles.marker,
                                    {
                                        position: 'absolute',
                                        left: selectedMarker.x,
                                        top: selectedMarker.y,
                                        transform: [{ translateX: -17 }, { translateY: -17 }], // Zentrieren
                                    },
                                    teacherImageStyle
                                ]}
                            >
                                <Image
                                    source={{uri: imageUrl ?? require('@/assets/images/avatar_image_placeholder.jpeg')}}
                                    style={styles.teacherImage}
                                />
                            </Animated.View>
                        )}

                        {/* USER MARKER MIT ROTATION */}
                        {(userPosition.floor === floor && getLatitude(userLocation) !== 0 && getLongitude(userLocation) !== 0) && (
                            <Animated.View
                                style={[
                                    styles.userArrow,
                                    {
                                        left: userPosition.x - 25,
                                        top: userPosition.y - 25,
                                    },
                                    userArrowStyle
                                ]}
                            >
                                <Image
                                    source={require('@/assets/images/user.png')}
                                    style={styles.arrowImage}
                                />
                            </Animated.View>
                        )}

                        {/* COMPASS STATUS ANZEIGE */}
                        {showLogger &&
                            <View style={styles.compassStatus}>
                                <View
                                    style={[styles.statusDot, {backgroundColor: isCompassActive ? '#4CAF50' : '#f44336'}]}/>
                                <Animated.Text style={styles.compassText}>
                                    {isCompassActive ? `Heading: ${Math.round(heading)}°` : 'Compass inactive'}
                                </Animated.Text>
                            </View>
                        }

                        {/* CHECKPOINTS */}
                        {showLogger &&
                            <Svg style={StyleSheet.absoluteFill}>
                                {showLogger && checkpoints.map((checkpoint) => (
                                    <React.Fragment key={checkpoint.id}>
                                        <Circle
                                            cx={checkpoint.x}
                                            cy={checkpoint.y}
                                            r={8}
                                            fill="#FF6B6B"
                                            stroke="#FFFFFF"
                                            strokeWidth={2}
                                            opacity={0.8}
                                        />
                                        <Circle
                                            cx={checkpoint.x}
                                            cy={checkpoint.y}
                                            r={4}
                                            fill="#FFFFFF"
                                            opacity={0.9}
                                        />
                                    </React.Fragment>
                                ))}
                            </Svg>
                        }

                        {/* NAVIGATION PATH - KORRIGIERT */}
                        {/* Zeige UG Path nur an wenn floor UG ist */}
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

                        {/* Zeige OG Path nur an wenn floor OG ist */}
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

            {showLogger && <GPSLogger/>}
        </View>
    );
};

export default MapsOfKaindorf;

// components/MapsOfKaindorf.tsx (nur die styles ändern)
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    mapContainer: {
        overflow: 'hidden',
        borderRadius: 16, // Mehr abgerundet
        backgroundColor: '#f8f9fa', // Hellerer Hintergrund
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e9ecef', // Leichter Rand
    },
    innerContent: {
        position: 'absolute',
        left: 0,
        top: 0
    },
    marker: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 17,
        borderWidth: 2,
        borderColor: '#fff',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    teacherImage: {
        width: 30,
        height: 30,
        borderRadius: 15,
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
        tintColor: '#7A3BDF', // Farbe anpassen
    },
    compassStatus: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.95)', // Etwas transparenter
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e9ecef',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    compassText: {
        fontSize: 12,
        fontWeight: '600', // Etwas dicker
        color: '#333',
    },
});