import * as Location from 'expo-location';

import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import {ActivityIndicator, Image, StyleSheet, Text as RNText, View, useWindowDimensions, Platform} from 'react-native';
import { ObjectContext, ObjectContextType } from "@/components/context/ObjectContext";
import React, { useContext, useEffect, useState } from 'react';
import Svg, { Circle, G, Line, Rect, Text } from 'react-native-svg';
import { getLatitude, getLongitude } from 'geolib';

import { API_URL } from "@/config";
import GPSLogger from './GPSLogger';
import { IRoom } from '@/models/interfaces';
import { useEvent } from '@/components/context/EventContext';
import { useRef } from 'react';
import NavNodeService, { INavNode as ApiNavNode, IStairConnection } from '@/services/NavNodeService';
import RoomService from "@/services/RoomService";
import AuthService from "@/services/AuthService";

const IMAGE_ASSETS: { [key: string]: any } = {
    'EG.png': require('@/assets/images/EG.png'),
    'OG.png': require('@/assets/images/OG.png')
};

type NodeType = 'HALLWAY' | 'STAIRS' | 'NORMAL';

interface NavNode {
    id: string;
    x: number;
    y: number;
    cardId: string;
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
    cardId: string;
}

interface MapsOfKaindorfProps {
    isFullscreen: boolean;
    activeCardId: string;
    qrPosition?: { x: number; y: number; cardId: string } | null;
    onReachStairs?: () => void;
    showLogger?: boolean;
}

const getCardImageSize = (card: { title?: string; imageWidth?: number; imageHeight?: number } | undefined) => {
    if (!card) return { width: 2331, height: 2029 };
    if (card.imageWidth && card.imageHeight) return { width: card.imageWidth, height: card.imageHeight };
    if (card.title === 'OG') return { width: 2336, height: 467 };
    return { width: 2331, height: 2029 };
};

const MapsOfKaindorf = ({ isFullscreen, activeCardId, qrPosition, showLogger, onReachStairs }: MapsOfKaindorfProps) => {

    const { selectedObject, selectedType, cards } = useContext<ObjectContextType>(ObjectContext);
    const { width: windowWidth, height: windowHeight } = useWindowDimensions();
    const { activeEvent } = useEvent();

    const activeCard = cards.find(c => c.id === activeCardId);
    const imageField = selectedType?.schema?.find(f => f.type === "image");
    const imageUrl = imageField ? selectedObject?.attributes[imageField.key] : undefined;

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

    // Default position — overridden once the global start node is loaded
    const [userPosition, setUserPosition] = useState<{ x: number; y: number; cardId: string } | null>(null);

    const [navNodes, setNavNodes] = useState<NavNode[]>([]);
    const [stairConnections, setStairConnections] = useState<IStairConnection[]>([]);
    const [isLoadingNodes, setIsLoadingNodes] = useState(true);
    const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
    const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);


    // Track whether we placed the user on the start node yet
    const hasInitializedPosition = useRef(false);

    const scale = useSharedValue(1.6);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const lastTranslateX = useSharedValue(0);
    const lastTranslateY = useSharedValue(0);
    const smoothedHeading = useRef(0);
    const lastFloorSwitchTime = useRef<number>(0);
    const lastStepTime = useRef(0);
    const headingRef = useRef(0);
    const lastTsRef = useRef<number>(Date.now());
    const magRef = useRef(0);
    const fallbackRotationRef = useRef<number | null>(null);

    const isMobile = windowWidth < 650;
    const outerWidth  = isMobile ? Math.round(windowWidth * 0.9) : Math.round(windowWidth * 0.7);
    const outerHeight = isMobile ? Math.round(windowWidth * 0.9) : Math.round(windowHeight * 0.55);

    const FILTER_ALPHA  = 0.97;
    const DEADZONE      = 0.03;
    const MAX_GYRO_STEP = 8;
    const INITIAL_SCALE = 1.6;
    const STEP_IN_PIXELS = 0.75 * 3.5;
    const MIN_SCALE = 1;
    const MAX_SCALE = 3.2;
    const COOLDOWN_MS = 15000;

    // ─── Coordinate conversion ────────────────────────────────────────────────

    const percentToPixel = (pos: { x: number; y: number; cardId: string }) => {
        const card = cards.find(c => c.id === pos.cardId);
        const { width: origW, height: origH } = getCardImageSize(card);
        const pctX = (pos.x / origW) * 100;
        const pctY = (pos.y / origH) * 100;
        const containerAspect = outerWidth / outerHeight;
        const imageAspect = origW / origH;
        let renderedWidth, renderedHeight;
        if (containerAspect > imageAspect) {
            renderedHeight = outerHeight; renderedWidth = outerHeight * imageAspect;
        } else {
            renderedWidth = outerWidth; renderedHeight = outerWidth / imageAspect;
        }
        const offsetX = (outerWidth - renderedWidth) / 2;
        const offsetY = (outerHeight - renderedHeight) / 2;
        return {
            x: offsetX + (pctX / 100) * renderedWidth,
            y: offsetY + (pctY / 100) * renderedHeight,
            renderedWidth, renderedHeight, offsetX, offsetY,
        };
    };

    // ─── Load nodes + start node ──────────────────────────────────────────────

    useEffect(() => {
        const loadAll = async () => {
            if (cards.length === 0) return;
            try {
                setIsLoadingNodes(true);

                const cardIds = cards.map(c => c.id);
                const apiNodes = await NavNodeService.fetchNodesForAllCards(cardIds);

                const converted: NavNode[] = apiNodes.map(node => {
                    const pos = percentToPixel({ x: node.x, y: node.y, cardId: node.cardId });
                    return {
                        id: node.id,
                        x: pos.x,
                        y: pos.y,
                        cardId: node.cardId,
                        neighbors: node.neighbors,
                        type: node.type,
                    };
                });
                setNavNodes(converted);

                const connections = await NavNodeService.fetchStairConnections();
                setStairConnections(connections);

                // Every time navNodes reloads (e.g. on screen resize / activeEvent change),
                // refresh the stair-switch cooldown so freshly-loaded nodes don't immediately
                // trigger a card switch against the already-set userPosition.
                if (hasInitializedPosition.current) {
                    lastFloorSwitchTime.current = Date.now();
                }

                // ── Place user at the global start node ──────────────────────
                // Only do this once per app session (or until a QR override).
                if (!hasInitializedPosition.current) {
                    try {
                        // KEY FIX: fetchStartNode() returns the node with raw image-pixel coords
                        // (e.g. x:1317, y:1116 from the backend). These are NOT screen/render coords.
                        // userPosition must hold *rendered* pixel coords (post percentToPixel()).
                        // → Look the node up in `converted` which already has the correct rendered coords.
                        const startNodeInfo = await NavNodeService.fetchStartNode();

                        if (startNodeInfo) {
                            const convertedStartNode = converted.find(n => n.id === startNodeInfo.id);

                            if (convertedStartNode) {
                                console.log('[MapsOfKaindorf] Placing user at start node:', convertedStartNode.id,
                                    'card:', convertedStartNode.cardId,
                                    'rendered pos:', Math.round(convertedStartNode.x), Math.round(convertedStartNode.y));
                                setUserPosition({
                                    x: convertedStartNode.x,
                                    y: convertedStartNode.y,
                                    cardId: convertedStartNode.cardId,
                                });
                                // Stamp the stair-switch cooldown so that a stair node placed near
                                // the start position doesn't immediately teleport the user to another
                                // card on the very first render (lastFloorSwitchTime starts at 0).
                                lastFloorSwitchTime.current = Date.now();
                                hasInitializedPosition.current = true;
                            } else {
                                console.warn('[MapsOfKaindorf] Start node id', startNodeInfo.id,
                                    'not found in converted nodes — using fallback');
                                useFallbackPosition(converted);
                            }
                        } else {
                            console.warn('[MapsOfKaindorf] No start node configured — using fallback position');
                            useFallbackPosition(converted);
                        }
                    } catch (startErr) {
                        console.error('[MapsOfKaindorf] Could not fetch start node:', startErr);
                        useFallbackPosition(converted);
                    }
                }

                setIsLoadingNodes(false);
            } catch (error) {
                console.error('[MapsOfKaindorf] Error loading nodes:', error);
                setIsLoadingNodes(false);
            }
        };

        loadAll();
    }, [cards, activeEvent, outerWidth, outerHeight]);

    /** Fallback: centre of first card — used when no start node is configured */
    const useFallbackPosition = (converted: NavNode[]) => {
        if (cards.length === 0) return;
        const firstCard = cards[0];
        const pos = percentToPixel({ x: 1410, y: 1120, cardId: firstCard.id });
        setUserPosition({ x: pos.x, y: pos.y, cardId: firstCard.id });
        lastFloorSwitchTime.current = Date.now(); // prevent immediate stair-switch on spawn
        hasInitializedPosition.current = true;
    };

    // ─── QR override — always wins over start node ────────────────────────────

    useEffect(() => {
        if (!qrPosition) return;
        setUserPosition({ x: qrPosition.x, y: qrPosition.y, cardId: qrPosition.cardId });
        lastFloorSwitchTime.current = Date.now(); // prevent immediate stair-switch after QR snap
        setHasSnapped(false);
        // Don't reset hasInitializedPosition — the QR scan is a deliberate override
    }, [qrPosition]);

    // ─── Pathfinding helpers ──────────────────────────────────────────────────

    const nodeCost = (node: NavNode) => {
        switch (node.type) {
            case 'HALLWAY': return 0.6;
            case 'STAIRS':  return 4.0;
            default:        return 1.0;
        }
    };

    const findClosestNode = (x: number, y: number, cardId: string, avoidStairs = false): NavNode => {
        let best: NavNode | null = null, bestDist = Infinity;
        for (const node of navNodes) {
            if (node.cardId !== cardId) continue;
            if (avoidStairs && node.type === 'STAIRS') continue;
            const d = Math.hypot(node.x - x, node.y - y);
            if (d < bestDist) { best = node; bestDist = d; }
        }
        if (!best && avoidStairs) return findClosestNode(x, y, cardId, false);
        return best!;
    };

    const getNodeColor = (node: NavNode) => {
        switch (node.type) {
            case 'HALLWAY': return '#4CAF50';
            case 'STAIRS':  return '#FF9800';
            default:        return '#FF6B6B';
        }
    };

    // ─── A* Pathfinding ───────────────────────────────────────────────────────

    const pathsByCard = React.useMemo<Map<string, { x: number; y: number }[]>>(() => {
        if (!selectedMarker || navNodes.length === 0 || !userPosition) return new Map();

        const sameCard = userPosition.cardId === selectedMarker.cardId;
        const startNode = findClosestNode(userPosition.x, userPosition.y, userPosition.cardId);
        const targetNode = findClosestNode(
            selectedMarker.x + selectedMarker.width / 2,
            selectedMarker.y + selectedMarker.height / 2,
            selectedMarker.cardId,
            sameCard
        );
        if (!startNode || !targetNode) return new Map();

        const startAnchor: NavNode = {
            id: 'user', x: userPosition.x, y: userPosition.y,
            cardId: userPosition.cardId, neighbors: [startNode.id],
        };
        const targetAnchor: NavNode = {
            id: 'target',
            x: selectedMarker.x + selectedMarker.width / 2,
            y: selectedMarker.y + selectedMarker.height / 2,
            cardId: selectedMarker.cardId, neighbors: [],
        };

        const nodesMap = new Map<string, NavNode>();
        navNodes.forEach(n => nodesMap.set(n.id, { ...n, neighbors: [...n.neighbors] }));
        nodesMap.set('user', startAnchor);
        nodesMap.set('target', targetAnchor);

        const tNode = nodesMap.get(targetNode.id);
        if (tNode) tNode.neighbors = [...tNode.neighbors, 'target'];

        stairConnections.forEach(conn => {
            const n1 = nodesMap.get(conn.node1Id);
            const n2 = nodesMap.get(conn.node2Id);
            if (n1 && n2) {
                if (!n1.neighbors.includes(conn.node2Id)) n1.neighbors.push(conn.node2Id);
                if (!n2.neighbors.includes(conn.node1Id)) n2.neighbors.push(conn.node1Id);
            }
        });

        const calcDist = (a: NavNode, b: NavNode) =>
            a.cardId === b.cardId
                ? Math.hypot(a.x - b.x, a.y - b.y) * nodeCost(b)
                : 200 * nodeCost(b);

        const goal = nodesMap.get('target')!;
        const open = new Set<string>(['user']);
        const cameFrom = new Map<string, string>();
        const gScore = new Map<string, number>([['user', 0]]);
        const fScore = new Map<string, number>([['user', calcDist(startAnchor, goal)]]);

        let iter = 0;
        while (open.size > 0 && iter < 50000) {
            iter++;
            const current = [...open].reduce((a, b) =>
                (fScore.get(a) ?? Infinity) < (fScore.get(b) ?? Infinity) ? a : b);

            if (current === 'target') {
                const fullPath: NavNode[] = [];
                let c: string | undefined = 'target';
                while (c) { fullPath.unshift(nodesMap.get(c)!); c = cameFrom.get(c); }

                const result = new Map<string, { x: number; y: number }[]>();
                fullPath.forEach(node => {
                    const pts = result.get(node.cardId) ?? [];
                    pts.push({ x: node.x, y: node.y });
                    result.set(node.cardId, pts);
                });
                return result;
            }

            open.delete(current);
            const cur = nodesMap.get(current);
            if (!cur) continue;

            for (const nId of cur.neighbors) {
                const nb = nodesMap.get(nId);
                if (!nb) continue;
                const tg = (gScore.get(current) ?? Infinity) + calcDist(cur, nb);
                if (tg < (gScore.get(nId) ?? Infinity)) {
                    cameFrom.set(nId, current);
                    gScore.set(nId, tg);
                    fScore.set(nId, tg + calcDist(nb, goal));
                    open.add(nId);
                }
            }
        }

        return new Map();
    }, [userPosition, selectedMarker, navNodes, stairConnections]);

    const currentCardPath = pathsByCard.get(activeCardId) ?? null;

    // ─── Step counter ─────────────────────────────────────────────────────────

    const handleStepTaken = () => {
        const correctedHeading = (smoothedHeading.current + 180) % 360;
        const angleRad = (correctedHeading * Math.PI) / 180;
        setUserPosition(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                x: prev.x + Math.sin(angleRad) * STEP_IN_PIXELS,
                y: prev.y - Math.cos(angleRad) * STEP_IN_PIXELS,
            };
        });
    };

    useEffect(() => {
        if (Platform.OS === 'web') return;
        Accelerometer.setUpdateInterval(20);
        const sub = Accelerometer.addListener(({ x, y, z }) => {
            const mag = Math.sqrt(x*x + y*y + z*z);
            const now = Date.now();
            if (mag > 1.25 && now - lastStepTime.current > 350) {
                lastStepTime.current = now;
                handleStepTaken();
            }
        });
        return () => sub.remove();
    }, []);

    const normalizeAngle = (a: number) => (a % 360 + 360) % 360;
    const shortestAngle = (t: number, c: number) => { let d = t-c; while(d>180)d-=360; while(d<-180)d+=360; return d; };
    const getDominantAxis = (d: { x:number; y:number; z:number }) =>
        [d.x, d.y, d.z].map(v => ({ v: Math.abs(v), raw: v })).sort((a,b) => b.v - a.v)[0].raw;

    useEffect(() => {
        if (Platform.OS === 'web') return;
        let magSub: any, gyroSub: any, magOk = false, gyroOk = false;
        Magnetometer.setUpdateInterval(120);
        Gyroscope.setUpdateInterval(25);
        try {
            magSub = Magnetometer.addListener(({ x, y }) => {
                magOk = true;
                magRef.current = normalizeAngle(Math.atan2(y, x) * (180/Math.PI) + 4);
            });
        } catch(e) {}
        try {
            gyroSub = Gyroscope.addListener(data => {
                gyroOk = true;
                const now = Date.now(), dt = (now - lastTsRef.current) / 1000;
                lastTsRef.current = now;
                if (dt <= 0 || dt > 0.2) return;
                let delta = getDominantAxis(data) * (180/Math.PI) * dt;
                if (Math.abs(delta) < DEADZONE) return;
                if (Math.abs(delta) > MAX_GYRO_STEP) delta = MAX_GYRO_STEP * Math.sign(delta);
                if (!headingRef.current) headingRef.current = magRef.current;
                const predicted = headingRef.current + delta;
                headingRef.current = normalizeAngle(
                    predicted * FILTER_ALPHA + (predicted + shortestAngle(magRef.current, predicted)) * (1 - FILTER_ALPHA)
                );
                setHeading(headingRef.current);
            });
        } catch(e) {}
        setTimeout(() => setSensorWorking(magOk && gyroOk), 1500);
        return () => {
            magSub?.remove(); gyroSub?.remove();
            if (fallbackRotationRef.current) clearInterval(fallbackRotationRef.current);
        };
    }, []);

    useEffect(() => {
        if (!sensorWorking) {
            fallbackRotationRef.current = setInterval(() => {
                headingRef.current = normalizeAngle(headingRef.current + 2);
                setHeading(headingRef.current);
            }, 50);
        } else if (fallbackRotationRef.current) {
            clearInterval(fallbackRotationRef.current);
            fallbackRotationRef.current = null;
        }
    }, [sensorWorking]);

    // ─── GPS Movement ─────────────────────────────────────────────────────────

    const moveAlongPath = (mN: number, mE: number, path: { x: number; y: number }[]) => {
        if (!userPosition || path.length < 2) return userPosition ? { x: userPosition.x + mE*2, y: userPosition.y - mN*2 } : null;
        let startIdx = 0;
        if (Math.hypot(userPosition.x - path[0].x, userPosition.y - path[0].y) < 20 && path.length > 1) startIdx = 1;
        if (startIdx === 1 && path.length > 2 && Math.hypot(userPosition.x - path[1].x, userPosition.y - path[1].y) < 15) startIdx = 2;

        let bestIdx = startIdx, bestDist = Infinity, closest = { x: userPosition.x, y: userPosition.y };
        for (let i = startIdx; i < path.length - 1; i++) {
            const s = path[i], e = path[i+1];
            const sl = Math.hypot(e.x-s.x, e.y-s.y);
            if (sl === 0) continue;
            const t = Math.max(0, Math.min(1, ((userPosition.x-s.x)*(e.x-s.x)+(userPosition.y-s.y)*(e.y-s.y))/(sl*sl)));
            const px = s.x+t*(e.x-s.x), py = s.y+t*(e.y-s.y);
            const d = Math.hypot(userPosition.x-px, userPosition.y-py);
            if (d < bestDist) { bestDist = d; bestIdx = i; closest = { x: px, y: py }; }
        }

        const strength = Math.hypot(mN, mE) * 5;
        if (strength > 0.5 && bestIdx < path.length - 1) {
            const tp = path[bestIdx + 1];
            const dx = tp.x - userPosition.x, dy = tp.y - userPosition.y;
            const dl = Math.hypot(dx, dy);
            if (dl > 0) return { x: userPosition.x+(dx/dl)*Math.min(strength,dl), y: userPosition.y+(dy/dl)*Math.min(strength,dl) };
        }
        return closest;
    };

    useEffect(() => {
        if (!isCompassActive) return;
        let lastLoc: Location.LocationObjectCoords | null = null;
        let mounted = true;

        Location.requestForegroundPermissionsAsync().then(({ status }) => {
            if (status !== 'granted') return;
            Location.watchPositionAsync(
                { accuracy: Location.Accuracy.Highest, timeInterval: 10, distanceInterval: 1 },
                loc => {
                    if (!mounted || !userPosition) return;
                    const { latitude, longitude } = loc.coords;
                    if (!lastLoc) { lastLoc = loc.coords; return; }
                    let mN = Math.max(Math.min((latitude - lastLoc.latitude)/0.000010, 10), -10);
                    let mE = Math.max(Math.min((longitude - lastLoc.longitude)/0.000013, 10), -10);

                    let newPos: { x: number; y: number } | null = null;
                    if (freeMovementMode) {
                        if (isCompassActive && isFullscreen) {
                            const rad = heading * Math.PI / 180;
                            newPos = { x: userPosition.x+(mE*Math.cos(rad)-mN*Math.sin(rad))*2, y: userPosition.y-(mE*Math.sin(rad)+mN*Math.cos(rad))*2 };
                        } else {
                            newPos = { x: userPosition.x+mE*2, y: userPosition.y-mN*2 };
                        }
                    } else {
                        const userCardPath = pathsByCard.get(userPosition.cardId) ?? null;
                        newPos = userCardPath && userCardPath.length >= 2
                            ? moveAlongPath(mN, mE, userCardPath)
                            : { x: userPosition.x+mE*2, y: userPosition.y-mN*2 };
                    }

                    if (newPos) {
                        setUserPosition(prev => prev ? { x: prev.x*0.3+newPos!.x*0.7, y: prev.y*0.3+newPos!.y*0.7, cardId: prev.cardId } : prev);
                    }
                    lastLoc = loc.coords;
                    setUserLocation({ latitude, longitude });
                }
            );
        });

        return () => { mounted = false; };
    }, [heading, isCompassActive, freeMovementMode, pathsByCard, hasSnapped, userPosition]);

    // ─── Card Switching via Stair Connections ─────────────────────────────────

    useEffect(() => {
        if (!userPosition || navNodes.length === 0 || stairConnections.length === 0) return;
        const now = Date.now();
        if (now - lastFloorSwitchTime.current <= COOLDOWN_MS) return;

        for (const conn of stairConnections) {
            const n1 = navNodes.find(n => n.id === conn.node1Id);
            const n2 = navNodes.find(n => n.id === conn.node2Id);
            if (!n1 || !n2) continue;
            if (userPosition.cardId !== n1.cardId && userPosition.cardId !== n2.cardId) continue;

            const currentNode = userPosition.cardId === n1.cardId ? n1 : n2;
            const targetNode  = userPosition.cardId === n1.cardId ? n2 : n1;

            if (Math.hypot(userPosition.x - currentNode.x, userPosition.y - currentNode.y) <= 30) {
                lastFloorSwitchTime.current = now;
                setUserPosition({ x: targetNode.x, y: targetNode.y, cardId: targetNode.cardId });
                if (onReachStairs) onReachStairs();
                console.log('[CARD SWITCH]', conn.name, ':', userPosition.cardId, '→', targetNode.cardId);
                break;
            }
        }
    }, [userPosition, navNodes, stairConnections]);

    // ─── Marker / image handling ──────────────────────────────────────────────

    const updateMarker = () => {
        if (!selectedObject?.id) {
            setTeacherRoom(null);
            setSelectedMarker(null);
            return;
        }

        if (!activeEvent?.id) return;

        RoomService.fetchRoomsForEvent(activeEvent.id)
            .then((rooms: IRoom[]) => {
                const room = rooms.find(r => r.assignedObjectIds.includes(selectedObject.id));
                if (!room) {
                    setTeacherRoom(null);
                    setSelectedMarker(null);
                    return;
                }
                const card = cards.find(c => c.id === room.cardId);
                if (!card) return;
                const { width: origW, height: origH } = getCardImageSize(card);
                const pos = percentToPixel({ x: room.x, y: room.y, cardId: card.id });
                setTeacherRoom(room);
                setSelectedMarker({
                    id: room.id.toString(),
                    x: pos.x, y: pos.y,
                    width:  (room.width  / origW) * pos.renderedWidth,
                    height: (room.height / origH) * pos.renderedHeight,
                    name: `${selectedObject.attributes.firstname} ${selectedObject.attributes.lastname}`,
                    cardId: card.id,
                });
            })
            .catch(() => {
                setTeacherRoom(null);
                setSelectedMarker(null);
            });
    };

    useEffect(() => {
        if (!activeCard?.id) return;

        const fetchImage = async () => {
            try {
                const token = await AuthService.getToken();
                const fullUrl = `${API_URL}/cards/${activeCard.id}/image`;

                const res = await fetch(fullUrl, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                if (!res.ok) throw new Error(`Image load failed: ${res.status}`);

                // React Native: Blob als Base64 lesen statt createObjectURL
                const blob = await res.blob();
                const reader = new FileReader();
                reader.onload = () => {
                    const base64 = reader.result as string;
                    setImageBlobUrl(base64);
                    setImageDimensions(getCardImageSize(activeCard));
                };
                reader.readAsDataURL(blob);
            } catch (err) {
                console.error('Failed to load card image:', err);
                setImageDimensions(getCardImageSize(activeCard));
            }
        };

        fetchImage();
    }, [activeCardId]);

    useEffect(() => { if (!selectedMarker) return; setAvatarsize(Math.min(selectedMarker.width, selectedMarker.height)); }, [selectedMarker]);
    useEffect(() => { updateMarker(); }, [selectedObject]);
    useEffect(() => { updateMarker(); }, [imageDimensions, cards, outerWidth, outerHeight]);

    useEffect(() => {
        scale.value = withTiming(INITIAL_SCALE);
        translateX.value = withTiming(0); translateY.value = withTiming(0);
        lastTranslateX.value = 0; lastTranslateY.value = 0;
    }, [activeCardId]);

    // ─── Gestures ─────────────────────────────────────────────────────────────

    const pinchGesture = Gesture.Pinch().onUpdate(e => {
        scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale.value * e.scale));
    });

    const panGesture = Gesture.Pan()
        .onUpdate(e => {
            if (scale.value <= 1.01) return;
            translateX.value = lastTranslateX.value + e.translationX;
            translateY.value = lastTranslateY.value + e.translationY;
        })
        .onEnd(() => {
            lastTranslateX.value = translateX.value;
            lastTranslateY.value = translateY.value;
        });

    const animatedInnerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    }));
    const userArrowStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 1 / scale.value }, { rotate: `${heading}deg` }],
    }));
    const teacherImageStyle = useAnimatedStyle(() => ({
        transform: [{ scale: 1.5 / scale.value }],
    }));

    // ─── Loading state ────────────────────────────────────────────────────────

    if (isLoadingNodes || userPosition === null) {
        return (
            <View style={[styles.container, { width: outerWidth, height: outerHeight, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#7A3BDF" />
                <RNText style={{ marginTop: 10, color: '#666', fontSize: 14 }}>
                    {isLoadingNodes ? 'Loading navigation...' : 'Locating start position...'}
                </RNText>
            </View>
        );
    }

    // ─── Render ───────────────────────────────────────────────────────────────

    return (
        <View style={[styles.container, { width: outerWidth }]}>
            <View style={[styles.mapContainer, { width: outerWidth, height: outerHeight }]}>
                <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
                    <Animated.View style={[styles.innerContent, animatedInnerStyle]}>

                        <Image
                            source={imageBlobUrl ? { uri: imageBlobUrl } : IMAGE_ASSETS['EG.png']}
                            style={{ width: outerWidth, height: outerHeight }}
                            resizeMode="contain"
                        />

                        {/* Marker — only when on the active card */}
                        {selectedMarker && selectedMarker.cardId === activeCardId && avatarSize && (
                            <Animated.View style={[{
                                position: 'absolute', left: selectedMarker.x, top: selectedMarker.y,
                                width: selectedMarker.width, height: selectedMarker.height,
                                justifyContent: 'center', alignItems: 'center',
                            }, teacherImageStyle]}>
                                <View style={[styles.marker, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
                                    <Image
                                        source={{ uri: imageUrl ?? 'https://htl-kaindorf.at/_next/image?url=https%3A%2F%2Fkainneu.uber.space%2Fbackend%2Fwp-content%2Fuploads%2F2023%2F02%2FDIP-HARNISCH_Werner.jpg&w=1200&q=90' }}
                                        style={{ width: avatarSize-4, height: avatarSize-4, borderRadius: (avatarSize-4)/2 }}
                                    />
                                </View>
                            </Animated.View>
                        )}

                        {/* IUser arrow — only when user is on the active card */}
                        {userPosition.cardId === activeCardId &&
                            getLatitude(userLocation) !== 0 &&
                            getLongitude(userLocation) !== 0 && (
                                <Animated.View style={[styles.userArrow, { left: userPosition.x-25, top: userPosition.y-25 }, userArrowStyle]}>
                                    <Image source={require('@/assets/images/user.png')} style={styles.arrowImage} />
                                </Animated.View>
                            )}

                        {/* Nav nodes — only in fullscreen+compass mode, only active card */}
                        {isFullscreen && isCompassActive && navNodes.length > 0 && (
                            <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
                                {navNodes.filter(n => n.cardId === activeCardId).map(node => (
                                    <React.Fragment key={node.id}>
                                        <Circle cx={node.x} cy={node.y} r={8} fill={getNodeColor(node)} stroke="#FFFFFF" strokeWidth={2} opacity={0.8} />
                                        <Circle cx={node.x} cy={node.y} r={4} fill="#FFFFFF" opacity={0.9} />
                                        {showNodeInfo && <G>
                                            <Rect x={node.x-15} y={node.y-28} width={30} height={14} fill="rgba(255,255,255,0.7)" rx={3} />
                                            <Text x={node.x} y={node.y-17} fill="#000" fontSize="10" fontWeight="bold" textAnchor="middle">{node.id}</Text>
                                        </G>}
                                    </React.Fragment>
                                ))}
                            </Svg>
                        )}

                        {/* Navigation path for the active card */}
                        {currentCardPath && currentCardPath.length > 1 && (
                            <Svg style={StyleSheet.absoluteFill}>
                                {currentCardPath.map((point, i) => {
                                    if (i === 0) return null;
                                    const prev = currentCardPath[i - 1];
                                    return (
                                        <Line
                                            key={`path-${i}`}
                                            x1={prev.x} y1={prev.y}
                                            x2={point.x} y2={point.y}
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
    container:    { alignItems: 'center', width: '100%' },
    mapContainer: { overflow: 'hidden', borderRadius: 16, backgroundColor: '#f8f9fa', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e9ecef' },
    innerContent: { position: 'absolute', left: 0, top: 0 },
    marker:       { width: 34, height: 34, justifyContent: 'center', alignItems: 'center', borderRadius: 17, borderWidth: 2, borderColor: '#fff', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
    teacherImage: { width: 30, height: 30, borderRadius: 15 },
    userArrow:    { position: 'absolute', width: 50, height: 50, justifyContent: 'center', alignItems: 'center' },
    arrowImage:   { width: '100%', height: '100%', resizeMode: 'contain', tintColor: '#7A3BDF' },
    compassStatus:{ position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', padding: 10, borderRadius: 12, borderWidth: 1, borderColor: '#e9ecef' },
    statusDot:    { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    compassText:  { fontSize: 12, fontWeight: '600', color: '#333' },
});
