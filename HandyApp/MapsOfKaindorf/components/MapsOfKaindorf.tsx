import * as Location from 'expo-location';
import * as ScreenOrientation from 'expo-screen-orientation';

import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ObjectContext, ObjectContextType } from "@/components/context/ObjectContext";
import React, { useContext, useEffect, useState } from 'react';
import Svg, { Circle, G, Line, Rect, Text } from 'react-native-svg';
import { getLatitude, getLongitude } from 'geolib';

import GPSLogger from './GPSLogger';
import { IRoom } from '@/models/interfaces';
import { serverConfig } from '../config/server';
import { useEvent } from '@/components/context/EventContext';
import { useRef } from 'react';

type NodeType = 'HALLWAY' | 'STAIRS' | 'NORMAL';
type Floor = 'OG' | 'UG';
interface NavNode {
    id: string;
    x: number;
    y: number;
    floor: Floor;
    neighbors: string[];
    type?: NodeType;
}

interface Marker {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    floor: 'OG' | 'UG';
}

interface MapsOfKaindorfProps {
    isFullscreen: boolean;
    floor: 'OG' | 'UG';
    qrPosition?: {
        x: number;
        y: number;
        floor: 'OG' | 'UG';
    } | null;
    onReachStairs?: () => void;
    showLogger?: boolean;
}

const MapsOfKaindorf = ({ isFullscreen, floor, qrPosition, showLogger, onReachStairs }: MapsOfKaindorfProps) => {
    //
    // ROOT CONTEXTS
    //
    const { selectedObject, selectedType, cards } = useContext<ObjectContextType>(ObjectContext);
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const { activeEvent } = useEvent();

    //
    // IMAGE ASSETS
    //
    const pictureOG = require('@/assets/images/OG.png');
    const pictureUG = require('@/assets/images/UG.png');
    const mapImage = floor === 'OG' ? pictureOG : pictureUG;

    useEffect(() => {
        console.log("floor in mapsofkaindorf: " + floor);
    }, [floor]);

    const imageField = selectedType?.schema?.find(f => f.type === "image");
    const imageUrl = imageField ? selectedObject?.attributes[imageField.key] : undefined;

    //
    // State Variables
    //
    const [selectedMarker, setSelectedMarker] = useState<Marker | null>(null);
    const [avatarSize, setAvatarsize] = useState<number | undefined>(undefined);
    const [userLocation, setUserLocation] = useState({ latitude: 46.801649, longitude: 15.5419766 });
    const [teacherRoom, setTeacherRoom] = useState<IRoom | null>(null);
    const [freeMovementMode, setFreeMovementMode] = useState(true);
    const [isCompassActive, setIsCompassActive] = useState(false);
    const [showNodeInfo, setShowNodeInfo] = useState(false);
    const [hasSnapped, setHasSnapped] = useState(false);
    const [heading, setHeading] = useState(0);
    const [sensorWorking, setSensorWorking] = useState(true);
    const [userPosition, setUserPosition] = useState({
        x: 1410,
        y: 1120,
        floor: 'UG' as 'UG' | 'OG'
    });

    //
    // Refs and Shared Values
    //
    const scale = useSharedValue(1.6);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const lastTranslateX = useSharedValue(0);
    const lastTranslateY = useSharedValue(0);
    const smoothedHeading = useRef(0);
    const hasInitializedPosition = useRef(false);
    const lastFloorSwitchTime = useRef<number>(0);
    const lastStepTime = useRef(0);
    const headingRef = useRef(0);
    const lastTsRef = useRef<number>(Date.now());
    const magRef = useRef(0);
    const fallbackRotationRef = useRef<number | null>(null);

    // Responsive Map-Größen berechnen
    const isMobile = windowWidth < 650;
    const MAP_MOBILE_SIZE = Math.round(windowWidth * 0.9);
    const MAP_DESKTOP_WIDTH = Math.round(windowWidth * 0.7);
    const MAP_DESKTOP_HEIGHT = Math.round(windowHeight * 0.55);

    const outerWidth = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_WIDTH;
    const outerHeight = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT;

    // KONSTANTEN FÜR NAVIGATON
    const FILTER_ALPHA = 0.97;
    const DEADZONE = 0.03;
    const MAX_GYRO_STEP = 8;
    const INITIAL_SCALE = 1.6;
    const PIXELS_PER_METER = 3.5;
    const STEP_LENGTH_METERS = 0.75;
    const STEP_IN_PIXELS = STEP_LENGTH_METERS * PIXELS_PER_METER;
    const [imageDimensions, setImageDimensions] = useState({
        width: outerWidth,
        height: outerHeight
    });

    //
    // PIXEL TO PERCENT TO PIXEL CONVERSION
    //
    const percentToPixel = (
        room: { x: number; y: number, floor: 'OG' | 'UG' },
    ) => {
        const originalImageWidth = room.floor === 'OG' ? 2336 : 2331;  // Deine bekannten Werte
        const originalImageHeight = room.floor === 'OG' ? 467 : 2029;  // Deine bekannten Werte

        // PROZENT berechnen (genau wie im React Code!)
        const percentX = (room.x / originalImageWidth) * 100;
        const percentY = (room.y / originalImageHeight) * 100;

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

        return { x: pixelX, y: pixelY };
    };

    //
    // INITIAL USER POSITION AND SCALE
    //
    useEffect(() => {
        if (hasInitializedPosition.current) return;

        const userPixel = percentToPixel(userPosition);
        
        setUserPosition({
            x: userPixel.x,
            y: userPixel.y,
            floor: 'UG',
        });

        hasInitializedPosition.current = true;
    }, []);

    //
    // GRAPH DEFINITIONS
    //
    const MIN_SCALE = 1;
    const MAX_SCALE = 3.2;

    const UG_YWay = percentToPixel({ x: 0, y: 1079, floor: 'UG' as Floor }).y;
    const OG_YWay = percentToPixel({ x: 0, y: 162, floor: 'OG' as Floor }).y;

    const COOLDOWN_MS = 15000;
    const GRID_STEP = 10;

    //
    // NODES AND GRAPHS
    //
    const STAIR_CONFIG = [
        // Stairs between UG and OG
        // Group 1 MAIN Stairs:
        { id: 'stair_main_ug', x: 1258, y: 1167, floor: 'UG' as Floor, connectsTo: 'OG' },
        { id: 'stair_main_og', x: 1251, y: 251, floor: 'OG' as Floor, connectsTo: 'UG' },

        //Group 2:
        { id: 'stair_1_ug', x: 816, y: 1157, floor: 'UG' as Floor, connectsTo: 'OG' },
        { id: 'stair_1_og', x: 810, y: 247, floor: 'OG' as Floor, connectsTo: 'UG' },

        //Group 3:
        { id: 'stair_2_ug', x: 316, y: 1158, floor: 'UG' as Floor, connectsTo: 'OG' },
        { id: 'stair_2_og', x: 311, y: 243, floor: 'OG' as Floor, connectsTo: 'UG' },

        //Group 4:
        { id: 'stair_3_ug', x: 1870, y: 1152, floor: 'UG' as Floor, connectsTo: 'OG' },
        { id: 'stair_3_og', x: 1863, y: 240, floor: 'OG' as Floor, connectsTo: 'UG' },
    ];

    const STAIR_PAIRS = [
        ['stair_main_ug', 'stair_main_og'],
        ['stair_1_ug', 'stair_1_og'],
        ['stair_2_ug', 'stair_2_og'],
        ['stair_3_ug', 'stair_3_og'],
    ];

    const NAV_NODES = React.useMemo(() => {

        /* ================================
        BASIC NODE GENERATORS
        ================================= */

        const generateLine = (
            floor: Floor,
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            step: number,
            prefix: string,
            type: NodeType = 'HALLWAY'
        ): NavNode[] => {

            const nodes: NavNode[] = [];
            const len = Math.hypot(x2 - x1, y2 - y1);
            const steps = Math.floor(len / step);

            let prev: NavNode | null = null;

            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                const x = x1 + (x2 - x1) * t;
                const y = y1 + (y2 - y1) * t;

                const node: NavNode = {
                    id: `${prefix}_${Math.round(x)}_${Math.round(y)}`,
                    x,
                    y,
                    floor,
                    neighbors: [],
                    type
                };

                if (prev) {
                    node.neighbors.push(prev.id);
                    prev.neighbors.push(node.id);
                }

                nodes.push(node);
                prev = node;
            }

            return nodes;
        };

        const generateDiagonal45 = (
            floor: Floor,
            startX: number,
            startY: number,
            endX: number,
            step: number,
            prefix: string,
            direction: 'UP' | 'DOWN',
            type: NodeType = 'HALLWAY'
        ): NavNode[] => {

            const nodes: NavNode[] = [];

            const dx = endX - startX;
            const length = Math.abs(dx);
            const steps = Math.floor(length / step);

            const dirX = dx > 0 ? 1 : -1;
            const dirY = direction === 'UP' ? -1 : 1;

            let prev: NavNode | null = null;

            for (let i = 0; i <= steps; i++) {
                const x = startX + dirX * i * step;
                const y = startY + dirY * i * step;

                const node: NavNode = {
                    id: `${prefix}_${Math.round(x)}_${Math.round(y)}`,
                    x,
                    y,
                    floor,
                    neighbors: [],
                    type
                };

                if (prev) {
                    node.neighbors.push(prev.id);
                    prev.neighbors.push(node.id);
                }

                nodes.push(node);
                prev = node;
            }

            return nodes;
        };

        /* ================================
        FLOOR BASE DATA
        ================================= */

        const nodesUG: NavNode[] = [];
        const nodesOG: NavNode[] = [];

        // ===== MAIN HALLWAYS (GRID) =====
        const minUGX = percentToPixel({ x: 192, y: 0, floor: 'UG' }).x;
        const maxUGX = percentToPixel({ x: 2157, y: 0, floor: 'UG' }).x;
        const minOGX = percentToPixel({ x: 170, y: 0, floor: 'OG' }).x;
        const maxOGX = percentToPixel({ x: 2141, y: 0, floor: 'OG' }).x;

        nodesUG.push(...generateLine('UG', minUGX, UG_YWay, maxUGX, UG_YWay, GRID_STEP, 'ug'));
        nodesOG.push(...generateLine('OG', minOGX, OG_YWay, maxOGX, OG_YWay, GRID_STEP, 'og'));

        nodesUG.forEach(n => n.y == UG_YWay ? n.type = 'HALLWAY' : null);
        nodesOG.forEach(n => n.y == OG_YWay ? n.type = 'HALLWAY' : null);

        /* ================================
        VERTICAL HALLWAYS UG
        ================================= */

        nodesUG.push(...generateLine(
            'UG',
            percentToPixel({ x: 270, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 573, floor: 'UG' }).y,
            percentToPixel({ x: 270, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1083, floor: 'UG' }).y,
            GRID_STEP,
            'ug_v1'
        ));

        nodesUG.push(...generateLine(
            'UG',
            percentToPixel({ x: 770, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 517, floor: 'UG' }).y,
            percentToPixel({ x: 770, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1077, floor: 'UG' }).y,
            GRID_STEP,
            'ug_v2'
        ));

        nodesUG.push(...generateLine(
            'UG',
            percentToPixel({ x: 1272, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 523, floor: 'UG' }).y,
            percentToPixel({ x: 1272, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1081, floor: 'UG' }).y,
            GRID_STEP,
            'ug_v3'
        ));

        nodesUG.push(...generateLine(
            'UG',
            percentToPixel({ x: 1771, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 565, floor: 'UG' }).y,
            percentToPixel({ x: 1771, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1077, floor: 'UG' }).y,
            GRID_STEP,
            'ug_v4'
        ));

        nodesUG.push(...generateLine(
            'UG',
            percentToPixel({ x: 744, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1428, floor: 'UG' }).y,
            percentToPixel({ x: 744, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1979, floor: 'UG' }).y,
            GRID_STEP,
            'ug_v5'
        ));

        /* ================================
        HORIZONTAL HALLWAYS UG
        ================================= */
        nodesUG.push(...generateLine(
            'UG',
            percentToPixel({ x: 1649, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 565, floor: 'UG' }).y,
            percentToPixel({ x: 2213, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 565, floor: 'UG' }).y,
            GRID_STEP,
            'ug_h1'
        ));

        nodesUG.push(...generateLine(
            'UG',
            percentToPixel({ x: 693, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1431, floor: 'UG' }).y,
            percentToPixel({ x: 1100, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1431, floor: 'UG' }).y,
            GRID_STEP,
            'ug_h2'
        ));

        /* ================================
        DIAGONAL HALLWAYS UG (45°)
        ================================= */

        const diagStep = GRID_STEP / Math.sqrt(2);

        // Diagonale 1 (aufwärts)
        nodesUG.push(...generateDiagonal45(
            'UG',
            percentToPixel({ x: 1055, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1470, floor: 'UG' }).y,
            percentToPixel({ x: 1457, y: 0, floor: 'UG' }).x,
            diagStep,
            'ug_d1',
            'UP'
        ));

        // Diagonale 2 (abwärts)
        nodesUG.push(...generateDiagonal45(
            'UG',
            percentToPixel({ x: 1141, y: 0, floor: 'UG' }).x,
            percentToPixel({ x: 0, y: 1382, floor: 'UG' }).y,
            percentToPixel({ x: 1481, y: 0, floor: 'UG' }).x,
            diagStep,
            'ug_d2',
            'DOWN'
        ));

        /* ================================
        STAIRS
        ================================= */

        const stairNodes: NavNode[] = STAIR_CONFIG.map(s => ({
            id: s.id,
            x: percentToPixel({ x: s.x, y: s.y, floor: s.floor }).x,
            y: percentToPixel({ x: s.x, y: s.y, floor: s.floor }).y,
            floor: s.floor,
            neighbors: [],
            type: 'STAIRS',
        }));

        const ALL = [...nodesUG, ...nodesOG, ...stairNodes];

        /* ================================
        AUTO CONNECTIONS
        ================================= */

        ALL.forEach(a => {
            ALL.forEach(b => {
                if (a === b) return;
                if (a.floor !== b.floor) return;

                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < GRID_STEP * 1.2) {
                    if (!a.neighbors.includes(b.id)) a.neighbors.push(b.id);
                }
            });
        });

        // stairs connect UG <-> OG
        STAIR_PAIRS.forEach(([ugId, ogId]) => {
            const ug = ALL.find(n => n.id === ugId);
            const og = ALL.find(n => n.id === ogId);
            if (ug && og) {
                ug.neighbors.push(og.id);
                og.neighbors.push(ug.id);
            }
        });

        return ALL;
    }, []);

    const nodeCost = (node: NavNode) => {
        switch (node.type) {
            case 'HALLWAY':
                return 0.6;
            case 'STAIRS':
                return 4.0;
            default:
                return 1.0;
        }
    };

    const distance = (a: NavNode, b: NavNode) => {
        const base = Math.hypot(a.x - b.x, a.y - b.y);
        const floorPenalty = a.floor !== b.floor ? 1000 : 0;

        return base * nodeCost(b) + floorPenalty;
    };

    const findClosestNode = (
        x: number,
        y: number,
        floor: Floor,
        avoidStairs: boolean = false
    ) => {
        let best: NavNode | null = null;
        let bestDist = Infinity;

        for (const node of NAV_NODES) {
            if (node.floor !== floor) continue;
            if (avoidStairs && node.type === 'STAIRS') continue;

            const d = Math.hypot(node.x - x, node.y - y);
            if (d < bestDist) {
                best = node;
                bestDist = d;
            }
        }

        if (!best && avoidStairs) {
            return findClosestNode(x, y, floor, false);
        }

        return best!;
    };

    const getNodeColor = (node: NavNode) => {
        switch (node.type) {
            case 'HALLWAY':
                return '#4CAF50';
            case 'STAIRS':
                return '#FF9800';
            default:
                return '#FF6B6B';
        }
    };

    const { pathUG, pathOG } = React.useMemo(() => {
        if (!selectedMarker) return { pathUG: null, pathOG: null };

        // Finde die nächstgelegenen Einstiegspunkte im Graph
        const sameFloor = userPosition.floor === selectedMarker.floor;
        const startNode = findClosestNode(userPosition.x, userPosition.y, userPosition.floor);
        const targetNode = findClosestNode(selectedMarker.x + (selectedMarker.width / 2), selectedMarker.y  + (selectedMarker.height / 2), selectedMarker.floor, sameFloor);

        // Wir erstellen eine lokale Kopie der Nodes für A*, 
        // um die "User" und "Target" Positionen temporär zu verbinden
        const startAnchor: NavNode = {
            id: 'user',
            x: userPosition.x,
            y: userPosition.y,
            floor: userPosition.floor,
            neighbors: [startNode.id], // User -> Graph
        };

        const targetAnchor: NavNode = {
            id: 'target',
            x: selectedMarker.x + (selectedMarker.width / 2),
            y: selectedMarker.y + (selectedMarker.height / 2),
            floor: selectedMarker.floor,
            neighbors: [],
        };

        // WICHTIG: Erstelle ein Mapping, damit wir schnell auf Nodes zugreifen können
        // Wir fügen die Anker hinzu und machen die Verbindung zum Target bidirektional
        const nodesMap = new Map<string, NavNode>();
        NAV_NODES.forEach(n => nodesMap.set(n.id, { ...n }));
        nodesMap.set(startAnchor.id, startAnchor);
        nodesMap.set(targetAnchor.id, targetAnchor);

        // Verbinde den Ziel-Node im Graph mit dem virtuellen 'target' Punkt
        const targetNodeInMap = nodesMap.get(targetNode.id);
        if (targetNodeInMap) {
            targetNodeInMap.neighbors = [...targetNodeInMap.neighbors, 'target'];
        }

        const aStarLocal = (startId: string, goalId: string): NavNode[] => {
            const open = new Set<string>([startId]);
            const cameFrom = new Map<string, string>();
            const gScore = new Map<string, number>([[startId, 0]]);
            const fScore = new Map<string, number>([[startId, distance(nodesMap.get(startId)!, nodesMap.get(goalId)!)]]);

            while (open.size > 0) {
                // Finde Node mit niedrigstem fScore
                let currentId = [...open].reduce((a, b) =>
                    (fScore.get(a) ?? Infinity) < (fScore.get(b) ?? Infinity) ? a : b
                );

                if (currentId === goalId) {
                    const path: NavNode[] = [];
                    let curr: string | undefined = currentId;
                    while (curr) {
                        path.unshift(nodesMap.get(curr)!);
                        curr = cameFrom.get(curr);
                    }
                    return path;
                }

                open.delete(currentId);
                const current = nodesMap.get(currentId)!;

                for (const neighborId of current.neighbors) {
                    const neighbor = nodesMap.get(neighborId);
                    if (!neighbor) continue;
                    
                    const tentativeGScore = (gScore.get(currentId) ?? Infinity) + distance(current, neighbor);
                    
                    if (tentativeGScore < (gScore.get(neighborId) ?? Infinity)) {
                        cameFrom.set(neighborId, currentId);
                        gScore.set(neighborId, tentativeGScore);
                        fScore.set(neighborId, tentativeGScore + distance(neighbor, nodesMap.get(goalId)!));
                        open.add(neighborId);
                    }
                }
            }
            return [];
        };

        const fullPath = aStarLocal('user', 'target');

        // Pfade für die Anzeige trennen
        const pUG = fullPath.filter(p => p.floor === 'UG').map(p => ({ x: p.x, y: p.y }));
        const pOG = fullPath.filter(p => p.floor === 'OG').map(p => ({ x: p.x, y: p.y }));

        console.log("Calculated paths:", { pUG, pOG });
        return { pathUG: pUG.length > 0 ? pUG : null, pathOG: pOG.length > 0 ? pOG : null };
    }, [userPosition, selectedMarker]);

    const handleStepTaken = () => {
        const correctedHeading = (smoothedHeading.current + 180) % 360;
        const angleRad = (correctedHeading * Math.PI) / 180;

        setUserPosition(prevPos => {
            const dx = Math.sin(angleRad) * STEP_IN_PIXELS;
            const dy = -Math.cos(angleRad) * STEP_IN_PIXELS;

            let newX = prevPos.x + dx;
            let newY = prevPos.y + dy;

            return {
                ...prevPos,
                x: newX,
                y: newY
            };
        });
    };

    // Schritt-Erkennung starten
    useEffect(() => {
        // Accelerometer Interval schnell setzen für präzise Peaks
        Accelerometer.setUpdateInterval(20); 

        const subscription = Accelerometer.addListener(({ x, y, z }) => {
            // Magnitude berechnen (Gesamtbeschleunigung)
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            
            // Threshold für einen Schritt (ca. 1.2G - 1.3G ist typisch beim Gehen)
            const THRESHOLD = 1.25; 
            const NOW = Date.now();

            // Einfacher Peak-Detektor mit Debounce (mind. 300ms zwischen Schritten)
            if (magnitude > THRESHOLD && (NOW - lastStepTime.current > 350)) {
                lastStepTime.current = NOW;
                
                // SCHRITT ERKANNT! -> Führe Bewegung aus
                handleStepTaken();
            }
        });

        return () => subscription.remove();
    }, []);

    const normalizeAngle = (angle: number) => {
        return (angle % 360 + 360) % 360;
    };

    const shortestAngleDiff = (target: number, current: number) => {
        let diff = target - current;
        while (diff > 180) diff -= 360;
        while (diff < -180) diff += 360;
        return diff;
    };

    const getDominantAxis = (data: { x: number; y: number; z: number }) => {
        const axes = [
            { v: Math.abs(data.x), raw: data.x },
            { v: Math.abs(data.y), raw: data.y },
            { v: Math.abs(data.z), raw: data.z },
        ];
        axes.sort((a, b) => b.v - a.v);
        return axes[0].raw; // stärkste Rotationsachse
    };

    //
    //  SENSOR FUSION (COMPASS + GYRO)
    //
    useEffect(() => {
        let magSubscription: any = null;
        let gyroSubscription: any = null;

        let magOk = false;
        let gyroOk = false;

        console.log("[SENSOR] Init start");

        const startSensors = async () => {
            try {
                Magnetometer.setUpdateInterval(120);
                Gyroscope.setUpdateInterval(25);

                // MAGNETOMETER
                try {
                    magSubscription = Magnetometer.addListener(data => {
                        magOk = true;

                        const { x, y } = data;
                        let angle = Math.atan2(y, x) * (180 / Math.PI);
                        angle = normalizeAngle(angle + 4);
                        magRef.current = angle;
                    });

                    console.log("[SENSOR] Magnetometer subscribed");
                } catch (e) {
                    console.log("[SENSOR] Magnetometer FAILED", e);
                }

                // GYROSCOPE
                try {
                    gyroSubscription = Gyroscope.addListener(data => {
                        gyroOk = true;

                        const now = Date.now();
                        const dt = (now - lastTsRef.current) / 1000;
                        lastTsRef.current = now;

                        if (dt <= 0 || dt > 0.2) return;

                        const rot = getDominantAxis(data);
                        let gyroDelta = rot * (180 / Math.PI) * dt;

                        if (Math.abs(gyroDelta) < DEADZONE) return;
                        if (Math.abs(gyroDelta) > MAX_GYRO_STEP) {
                            gyroDelta = MAX_GYRO_STEP * Math.sign(gyroDelta);
                        }

                        if (headingRef.current === 0) {
                            headingRef.current = magRef.current;
                        }

                        let predicted = headingRef.current + gyroDelta;
                        const mag = magRef.current;
                        const diff = shortestAngleDiff(mag, predicted);

                        const fused =
                            predicted * FILTER_ALPHA +
                            (predicted + diff) * (1 - FILTER_ALPHA);

                        headingRef.current = normalizeAngle(fused);
                        setHeading(headingRef.current);
                    });

                    console.log("[SENSOR] Gyroscope subscribed");
                } catch (e) {
                    console.log("[SENSOR] Gyroscope FAILED", e);
                }

                // CHECK OB SENSOR FUNKTIONIERT
                setTimeout(() => {
                    if (!magOk || !gyroOk) {
                        console.log("[SENSOR] ❌ Sensor failed → fallback rotation active");
                        setSensorWorking(false);
                    } else {
                        console.log("[SENSOR] ✅ Sensors working");
                        setSensorWorking(true);
                    }
                }, 1500);

            } catch (e) {
                console.log("[SENSOR] ❌ TOTAL FAILURE → fallback rotation", e);
                setSensorWorking(false);
            }
        };

        startSensors();

        return () => {
            magSubscription?.remove();
            gyroSubscription?.remove();
            if (fallbackRotationRef.current) {
                clearInterval(fallbackRotationRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (!sensorWorking) {
            console.log("[FALLBACK] Auto-rotation enabled");

            fallbackRotationRef.current = setInterval(() => {
                headingRef.current = normalizeAngle(headingRef.current + 2); // speed
                setHeading(headingRef.current);
            }, 50); // smooth rotation
        } else {
            console.log("[FALLBACK] Auto-rotation disabled");

            if (fallbackRotationRef.current) {
                clearInterval(fallbackRotationRef.current);
                fallbackRotationRef.current = null;
            }
        }
    }, [sensorWorking]);

    const toggleFullscreen = async () => {
        if (!isFullscreen) {
            // Zu Vollbild wechseln
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
            );
        } else {
            // Zurück zu Portrait
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
        }
        //setIsFullscreen(!isFullscreen);
    };

    // Funktion um Vollbild zu schließen
    const closeFullscreen = async () => {
        if (isFullscreen) {
            await ScreenOrientation.lockAsync(
                ScreenOrientation.OrientationLock.PORTRAIT_UP
            );
            //setIsFullscreen(false);
        }
    };

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
        let closestPoint = { x: userPosition.x, y: userPosition.y }; // Fallback auf User Position

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
                closestPoint = { x: projectedX, y: projectedY };
            }
        }

        const movementStrength = Math.sqrt(metersNorth * metersNorth + metersEast * metersEast) * 5;

        if (movementStrength > 0.5 && closestSegmentIndex < currentPath.length - 1) {
            let targetSegmentIndex = closestSegmentIndex;

            const segmentStart = currentPath[targetSegmentIndex];
            const segmentEnd = currentPath[targetSegmentIndex + 1];

            // Sicherstellen dass Punkte existieren
            if (!segmentStart || !segmentEnd) {
                return { x: closestPoint.x, y: closestPoint.y };
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
                return { x: closestPoint.x, y: closestPoint.y };
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

        return { x: closestPoint.x, y: closestPoint.y };
    };

    //
    //  GPS TRACKING
    //
    useEffect(() => {
        if (!isCompassActive) return; // GPS nur verwenden wenn Kompass an ist
        let lastLocation: Location.LocationObjectCoords | null = null;
        let isMounted = true;

        const start = async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") return;

            await Location.watchPositionAsync(
                {
                    accuracy: Location.Accuracy.Highest,
                    timeInterval: 10,
                    distanceInterval: 1
                },
                (loc) => {
                    if (!isMounted) return;

                    const { latitude, longitude } = loc.coords;

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
                            if (isCompassActive && isFullscreen) {
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

                            // Wir snappen nicht mehr auf GPS-Koordinaten (da diese ungenau sind),
                            // sondern wir schauen, ob die neue Pixel-Position nah an einem Graph-Knoten ist.
                            // if (!hasSnapped) {
                            //     // Finde den nächsten Knoten im aktuellen Stockwerk basierend auf Pixeln
                            //     const closestNode = findClosestNode(newPosition.x, newPosition.y, userPosition.floor);
                                
                            //     // Wenn wir näher als 30 Pixel an einem Knoten sind, snappe dorthin
                            //     const distToNode = Math.hypot(newPosition.x - closestNode.x, newPosition.y - closestNode.y);
                                
                            //     if (distToNode < 30) { 
                            //         newPosition = { x: closestNode.x, y: closestNode.y };
                            //         setHasSnapped(true);
                            //         console.log("Snapped to Node:", closestNode.id);
                            //     }
                            // }
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
                        setUserLocation({ latitude, longitude });
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

    //
    //  Floor Switching Logik
    //
    useEffect(() => {
        const now = Date.now();
        if ((now - lastFloorSwitchTime.current) <= COOLDOWN_MS) return;

        for (const [ugId, ogId] of STAIR_PAIRS) {
            const currentId = userPosition.floor === 'UG' ? ugId : ogId;
            const targetId  = userPosition.floor === 'UG' ? ogId : ugId;

            const currentStair = STAIR_CONFIG.find(s => s.id === currentId);
            const targetStair  = STAIR_CONFIG.find(s => s.id === targetId);

            if (!currentStair || !targetStair) continue;

            const stairPixelPos = percentToPixel({
                x: currentStair.x,
                y: currentStair.y,
                floor: currentStair.floor
            });

            const dist = Math.hypot(
                userPosition.x - stairPixelPos.x,
                userPosition.y - stairPixelPos.y
            );

            if (dist <= 10) {
                const destPixelPos = percentToPixel({
                    x: targetStair.x,
                    y: targetStair.y,
                    floor: targetStair.floor
                });

                lastFloorSwitchTime.current = now;

                setUserPosition({
                    x: destPixelPos.x,
                    y: destPixelPos.y,
                    floor: targetStair.floor
                });

                if (onReachStairs) onReachStairs();

                console.log("FLOOR SWITCH:", userPosition.floor, "→", targetStair.floor);
                break;
            }
        }
    }, [userPosition]);

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
                    width: (room.width / originalImageWidth) * renderedWidth,
                    height: (room.height / originalImageHeight) * renderedHeight,
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
        if (!selectedMarker) return;
        setAvatarsize(Math.min(
            selectedMarker.width,
            selectedMarker.height
        )); // 100 % vom Raum
    }, [selectedMarker]);

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
                            console.log('Bildgröße über getSize:', { width, height });
                            setImageDimensions({
                                width,
                                height
                            });
                        },
                        (getSizeError) => {
                            console.warn('getSize fehlgeschlagen:', getSizeError);
                            // Endgültiger Fallback
                            if (floor === 'OG') {
                                setImageDimensions({ width: 2336, height: 467 });
                            } else {
                                setImageDimensions({ width: 2331, height: 2029 });
                            }
                        }
                    );
                } else {
                    // Direkter Fallback
                    if (floor === 'OG') {
                        setImageDimensions({ width: 2336, height: 467 });
                    } else {
                        setImageDimensions({ width: 2331, height: 2029 });
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
        scale.value = withTiming(INITIAL_SCALE);
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

            if (floor === 'OG') {
                translateY.value = withTiming(0);
                lastTranslateY.value = 0;
            } else {
                lastTranslateY.value = translateY.value;
            }
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
    // USER ARROW STYLE MIT ROTATION - KORRIGIERT
    //
    const userArrowStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: 1 / scale.value },
            { rotate: `${heading}deg` },
        ],
    }));

    // Separate Style für Teacher Image
    const teacherImageStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: 1.5 / scale.value }
        ],
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

                        {selectedMarker && selectedMarker.floor === floor && avatarSize && (
                            <Animated.View
                                style={[
                                    {
                                        position: 'absolute',
                                        left: selectedMarker.x,
                                        top: selectedMarker.y,
                                        width: selectedMarker.width,
                                        height: selectedMarker.height,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    teacherImageStyle
                                ]}
                            >
                                {/* MARKER IN DER MITTE DES RAUMS */}
                                <View
                                    style={[
                                        styles.marker,
                                        {
                                            width: avatarSize,
                                            height: avatarSize,
                                            borderRadius: avatarSize / 2,
                                        }
                                    ]}
                                >
                                    <Image
                                        source={{ uri: imageUrl ?? '' }}
                                        style={{
                                            width: avatarSize - 4,
                                            height: avatarSize - 4,
                                            borderRadius: (avatarSize - 4) / 2,
                                        }}
                                    />
                                </View>

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

                        {/* NODES */}
                        {(isFullscreen && isCompassActive) && (
                            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                                {NAV_NODES.filter(n => n.floor === floor).map((node) => (
                                    <React.Fragment key={node.id}>
                                        {/* Äußerer Kreis */}
                                        <Circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={8}
                                            fill={getNodeColor(node)}
                                            stroke="#FFFFFF"
                                            strokeWidth={2}
                                            opacity={0.8}
                                        />

                                        {/* Innerer Punkt */}
                                        <Circle
                                            cx={node.x}
                                            cy={node.y}
                                            r={4}
                                            fill="#FFFFFF"
                                            opacity={0.9}
                                        />

                                        {/* NODE NAME LABEL */}
                                        {showNodeInfo && <G>
                                            {/* Kleiner halbtransparenter Hintergrund für bessere Lesbarkeit */}
                                            <Rect
                                                x={node.x - 15}
                                                y={node.y - 28}
                                                width={30}
                                                height={14}
                                                fill="rgba(255, 255, 255, 0.7)"
                                                rx={3}
                                            />
                                            <Text
                                                x={node.x}
                                                y={node.y - 17}
                                                fill="#000000"
                                                fontSize="10"
                                                fontWeight="bold"
                                                textAnchor="middle"
                                            >
                                                {node.id}
                                            </Text>
                                        </G>}
                                    </React.Fragment>
                                ))}
                            </Svg>
                        )}

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

            {showLogger && <GPSLogger />}
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
        shadowOffset: { width: 0, height: 2 },
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