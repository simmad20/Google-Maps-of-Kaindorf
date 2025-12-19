"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Location = require("expo-location");
var react_native_reanimated_1 = require("react-native-reanimated");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_native_1 = require("react-native");
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var TeacherContext_1 = require("./context/TeacherContext");
var geolib_1 = require("geolib");
var GPSLogger_1 = require("./GPSLogger");
var expo_sensors_1 = require("expo-sensors");
var server_1 = require("../config/server");
var react_2 = require("react");
var pictureOG = require('@/assets/images/OG.png');
var pictureUG = require('@/assets/images/UG.png');
var MapsOfKaindorf = function (_a) {
    var floor = _a.floor, showLogger = _a.showLogger, onReachStairs = _a.onReachStairs;
    var _b = (0, react_1.useContext)(TeacherContext_1.TeacherContext), selectedTeacher = _b.selectedTeacher, cards = _b.cards;
    var _c = (0, react_native_1.useWindowDimensions)(), windowWidth = _c.width, windowHeight = _c.height;
    // Responsive Map-Größen berechnen
    var isMobile = windowWidth < 650;
    var MAP_MOBILE_SIZE = Math.round(windowWidth * 0.9);
    var MAP_DESKTOP_WIDTH = Math.round(windowWidth * 0.7);
    var MAP_DESKTOP_HEIGHT = Math.round(windowHeight * 0.55);
    var outerWidth = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_WIDTH;
    var outerHeight = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT;
    var _d = (0, react_1.useState)(null), selectedMarker = _d[0], setSelectedMarker = _d[1];
    var _e = (0, react_1.useState)({ latitude: 46.801649, longitude: 15.5419766 }), userLocation = _e[0], setUserLocation = _e[1];
    var _f = (0, react_1.useState)({
        x: 210,
        y: 190,
        floor: 'UG'
    }), userPosition = _f[0], setUserPosition = _f[1];
    var _g = (0, react_1.useState)(null), teacherRoom = _g[0], setTeacherRoom = _g[1];
    var _h = (0, react_1.useState)(false), freeMovementMode = _h[0], setFreeMovementMode = _h[1];
    var _j = (0, react_1.useState)(false), isCompassActive = _j[0], setIsCompassActive = _j[1];
    var _k = (0, react_1.useState)(false), hasSnapped = _k[0], setHasSnapped = _k[1];
    var _l = (0, react_1.useState)(0), heading = _l[0], setHeading = _l[1];
    var _m = (0, react_1.useState)({
        width: outerWidth,
        height: outerHeight
    }), imageDimensions = _m[0], setImageDimensions = _m[1];
    var smoothedHeading = (0, react_2.useRef)(0);
    var lastPosition = (0, react_2.useRef)({ x: 210, y: 190 });
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    var translateX = (0, react_native_reanimated_1.useSharedValue)(0);
    var translateY = (0, react_native_reanimated_1.useSharedValue)(0);
    var lastTranslateX = (0, react_native_reanimated_1.useSharedValue)(0);
    var lastTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    var MIN_SCALE = 1;
    var MAX_SCALE = 2.2;
    var UG_YWay = 180;
    var OG_YWay = 165;
    //
    // PATHFINDING
    //
    var STAIR_UG = { x: 185, y: 198 };
    var STAIR_OG = { x: 190, y: 175 };
    //
    // CHECKPOINTS
    //
    var checkpointsUG = [
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
    var checkpointsOG = [
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
    var mapImage = floor === 'OG' ? pictureOG : pictureUG;
    var checkpoints = floor === "UG" ? checkpointsUG : checkpointsOG;
    var _o = react_1.default.useMemo(function () {
        if (!selectedMarker)
            return { pathUG: null, pathOG: null };
        var teacherFloor = selectedMarker.floor;
        var userFloor = userPosition.floor;
        console.log('Path calculation:', {
            userFloor: userFloor,
            teacherFloor: teacherFloor,
            userPosition: userPosition,
            teacherPosition: { x: selectedMarker.x, y: selectedMarker.y }
        });
        // LEHRER IM UG
        if (teacherFloor === "UG") {
            if (userFloor === "UG") {
                // BEIDE IM UG
                if (userPosition.x < 50 && Math.abs(userPosition.y - UG_YWay) < 5) {
                    // User ist schon im Gang → direkter Pfad
                    return {
                        pathUG: [
                            { x: userPosition.x, y: userPosition.y },
                            { x: selectedMarker.x, y: selectedMarker.y }
                        ],
                        pathOG: null
                    };
                }
                else {
                    // User ist nicht im Gang → gehe zuerst zum Gang
                    return {
                        pathUG: [
                            { x: userPosition.x, y: userPosition.y },
                            { x: userPosition.x, y: UG_YWay }, // Vertikal zum Gang
                            { x: selectedMarker.x, y: UG_YWay }, // Horizontal im Gang
                            { x: selectedMarker.x, y: selectedMarker.y } // Vertikal zum Raum
                        ],
                        pathOG: null
                    };
                }
            }
            else {
                // USER IM OG, LEHRER IM UG → gehe zu Treppe UG
                return {
                    pathUG: [
                        { x: STAIR_UG.x, y: STAIR_UG.y }, // Start an UG Treppe
                        { x: STAIR_UG.x, y: UG_YWay }, // Vertikal zum Gang
                        { x: selectedMarker.x, y: UG_YWay }, // Horizontal im Gang  
                        { x: selectedMarker.x, y: selectedMarker.y } // Vertikal zum Raum
                    ],
                    pathOG: [
                        { x: userPosition.x, y: userPosition.y },
                        { x: STAIR_OG.x, y: STAIR_OG.y } // Zum OG Treppenabgang
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
                            { x: userPosition.x, y: userPosition.y },
                            { x: selectedMarker.x, y: selectedMarker.y }
                        ]
                    };
                }
                else {
                    // User ist nicht im Gang → gehe zuerst zum Gang
                    return {
                        pathUG: null,
                        pathOG: [
                            { x: userPosition.x, y: userPosition.y },
                            { x: userPosition.x, y: OG_YWay }, // Vertikal zum Gang
                            { x: selectedMarker.x, y: OG_YWay }, // Horizontal im Gang
                            { x: selectedMarker.x, y: selectedMarker.y } // Vertikal zum Raum
                        ]
                    };
                }
            }
            else {
                // USER IM UG, LEHRER IM OG → gehe zu Treppe OG
                return {
                    pathUG: [
                        { x: userPosition.x, y: userPosition.y },
                        { x: userPosition.x, y: UG_YWay }, // Vertikal zum UG Gang
                        { x: STAIR_UG.x, y: UG_YWay }, // Horizontal zur UG Treppe
                        { x: STAIR_UG.x, y: STAIR_UG.y } // Vertikal zur Treppe
                    ],
                    pathOG: [
                        { x: STAIR_OG.x, y: STAIR_OG.y }, // Start an OG Treppe
                        { x: STAIR_OG.x, y: OG_YWay }, // Vertikal zum Gang
                        { x: selectedMarker.x, y: OG_YWay }, // Horizontal im Gang
                        { x: selectedMarker.x, y: selectedMarker.y } // Vertikal zum Raum
                    ]
                };
            }
        }
        return { pathUG: null, pathOG: null };
    }, [userPosition, selectedMarker]), pathUG = _o.pathUG, pathOG = _o.pathOG;
    //
    //  COMPASS HEADING - VERBESSERTE VERSION
    //
    (0, react_1.useEffect)(function () {
        var subscription = null;
        var isMounted = true;
        var startCompass = function () { return __awaiter(void 0, void 0, void 0, function () {
            var isAvailable, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, expo_sensors_1.Magnetometer.isAvailableAsync()];
                    case 1:
                        isAvailable = _a.sent();
                        if (!isAvailable) {
                            console.log('Magnetometer is not available on this device');
                            return [2 /*return*/];
                        }
                        console.log('Starting compass...');
                        // Setze Update-Intervall zuerst
                        expo_sensors_1.Magnetometer.setUpdateInterval(100);
                        subscription = expo_sensors_1.Magnetometer.addListener(function (data) {
                            if (!isMounted)
                                return;
                            var x = data.x, y = data.y;
                            // Kompass-Winkel berechnen (in Grad)
                            var angle = Math.atan2(y, x) * (180 / Math.PI);
                            // Auf 0-360 Grad normalisieren
                            var normalized = (angle + 360) % 360;
                            // Magnetischen Norden zu geografischen Norden korrigieren (ungefähr)
                            // Dies variiert je nach Standort - für Österreich ca. +2° bis +4°
                            var magneticDeclination = 3; // Grad für Österreich
                            var corrected = (normalized + magneticDeclination) % 360;
                            // Erste Initialisierung
                            if (smoothedHeading.current === 0) {
                                smoothedHeading.current = corrected;
                            }
                            // Unterschied zum letzten Wert berechnen
                            var diff = Math.abs(corrected - smoothedHeading.current);
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
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Error starting compass:', error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        startCompass();
        return function () {
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
    var moveAlongPath = function (metersNorth, metersEast, currentPath) {
        // VERBESSERTE FEHLERBEHANDLUNG
        if (!currentPath || currentPath.length < 2) {
            console.log('No valid path available, using free movement');
            return {
                x: userPosition.x + metersEast * 2,
                y: userPosition.y - metersNorth * 2
            };
        }
        // VERBESSERT: Ignoriere die ersten Punkte und gehe direkt zum Hauptpfad
        var startIndex = 0;
        // Sicherstellen dass currentPath Punkte hat
        if (currentPath.length === 0) {
            return {
                x: userPosition.x + metersEast * 2,
                y: userPosition.y - metersNorth * 2
            };
        }
        // Wenn wir sehr nahe am Start sind, überspringe den ersten Punkt
        var distanceToStart = Math.sqrt(Math.pow(userPosition.x - currentPath[0].x, 2) +
            Math.pow(userPosition.y - currentPath[0].y, 2));
        if (distanceToStart < 20 && currentPath.length > 1) {
            startIndex = 1;
        }
        // Wenn wir nahe am zweiten Punkt sind, überspringe die ersten beiden
        if (startIndex === 1 && currentPath.length > 2) {
            var distanceToSecond = Math.sqrt(Math.pow(userPosition.x - currentPath[1].x, 2) +
                Math.pow(userPosition.y - currentPath[1].y, 2));
            if (distanceToSecond < 15) {
                startIndex = 2;
            }
        }
        // Finde den nächsten Punkt auf dem RESTLICHEN Pfad
        var closestSegmentIndex = startIndex;
        var closestDistance = Infinity;
        var closestPoint = { x: userPosition.x, y: userPosition.y }; // Fallback auf User Position
        for (var i = startIndex; i < currentPath.length - 1; i++) {
            var start = currentPath[i];
            var end = currentPath[i + 1];
            // Sicherstellen dass Punkte existieren
            if (!start || !end)
                continue;
            var segmentLength = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
            if (segmentLength === 0)
                continue;
            var t = Math.max(0, Math.min(1, ((userPosition.x - start.x) * (end.x - start.x) +
                (userPosition.y - start.y) * (end.y - start.y)) /
                (segmentLength * segmentLength)));
            var projectedX = start.x + t * (end.x - start.x);
            var projectedY = start.y + t * (end.y - start.y);
            var distance = Math.sqrt(Math.pow(userPosition.x - projectedX, 2) +
                Math.pow(userPosition.y - projectedY, 2));
            if (distance < closestDistance) {
                closestDistance = distance;
                closestSegmentIndex = i;
                closestPoint = { x: projectedX, y: projectedY };
            }
        }
        var movementStrength = Math.sqrt(metersNorth * metersNorth + metersEast * metersEast) * 5;
        if (movementStrength > 0.5 && closestSegmentIndex < currentPath.length - 1) {
            var targetSegmentIndex = closestSegmentIndex;
            var segmentStart = currentPath[targetSegmentIndex];
            var segmentEnd = currentPath[targetSegmentIndex + 1];
            // Sicherstellen dass Punkte existieren
            if (!segmentStart || !segmentEnd) {
                return { x: closestPoint.x, y: closestPoint.y };
            }
            var toUserX = userPosition.x - segmentStart.x;
            var toUserY = userPosition.y - segmentStart.y;
            var segmentX = segmentEnd.x - segmentStart.x;
            var segmentY = segmentEnd.y - segmentStart.y;
            var dotProduct = toUserX * segmentX + toUserY * segmentY;
            if (dotProduct < 0 && targetSegmentIndex < currentPath.length - 2) {
                targetSegmentIndex++;
            }
            // Sicherstellen dass targetPoint existiert
            if (targetSegmentIndex + 1 >= currentPath.length) {
                return { x: closestPoint.x, y: closestPoint.y };
            }
            var targetPoint = currentPath[targetSegmentIndex + 1];
            var directionX = targetPoint.x - userPosition.x;
            var directionY = targetPoint.y - userPosition.y;
            var directionLength = Math.sqrt(directionX * directionX + directionY * directionY);
            if (directionLength > 0) {
                var normalizedX = directionX / directionLength;
                var normalizedY = directionY / directionLength;
                var maxMovement = Math.min(movementStrength, directionLength);
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
    (0, react_1.useEffect)(function () {
        var lastLocation = null;
        var isMounted = true;
        var start = function () { return __awaiter(void 0, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Location.requestForegroundPermissionsAsync()];
                    case 1:
                        status = (_a.sent()).status;
                        if (status !== "granted")
                            return [2 /*return*/];
                        return [4 /*yield*/, Location.watchPositionAsync({
                                accuracy: Location.Accuracy.Highest,
                                timeInterval: 1000,
                                distanceInterval: 1
                            }, function (loc) {
                                if (!isMounted)
                                    return;
                                var _a = loc.coords, latitude = _a.latitude, longitude = _a.longitude;
                                if (!lastLocation) {
                                    lastLocation = loc.coords;
                                    return;
                                }
                                var dLat = latitude - lastLocation.latitude;
                                var dLon = longitude - lastLocation.longitude;
                                var METERS_PER_LAT = 0.000010;
                                var METERS_PER_LON = 0.000013;
                                var metersNorth = dLat / METERS_PER_LAT;
                                var metersEast = dLon / METERS_PER_LON;
                                var MAX_STEP = 10;
                                metersNorth = Math.max(Math.min(metersNorth, MAX_STEP), -MAX_STEP);
                                metersEast = Math.max(Math.min(metersEast, MAX_STEP), -MAX_STEP);
                                var newPosition;
                                try {
                                    if (freeMovementMode) {
                                        // FREIE BEWEGUNG MIT SNAP
                                        if (isCompassActive) {
                                            var headingRad = (heading * Math.PI) / 180;
                                            var moveX = metersEast * Math.cos(headingRad) - metersNorth * Math.sin(headingRad);
                                            var moveY = metersEast * Math.sin(headingRad) + metersNorth * Math.cos(headingRad);
                                            newPosition = {
                                                x: userPosition.x + moveX * 2,
                                                y: userPosition.y - moveY * 2
                                            };
                                        }
                                        else {
                                            newPosition = {
                                                x: userPosition.x + metersEast * 2,
                                                y: userPosition.y - metersNorth * 2
                                            };
                                        }
                                        // NUR IM FREE MODUS: Snap zu Checkpoints
                                        if (!hasSnapped) {
                                            var allCP = floor === 'UG' ? checkpointsUG : checkpointsOG;
                                            for (var _i = 0, allCP_1 = allCP; _i < allCP_1.length; _i++) {
                                                var cp = allCP_1[_i];
                                                var distLat = Math.abs(cp.latitude - latitude);
                                                var distLon = Math.abs(cp.longitude - longitude);
                                                var meterLat = distLat / 0.000010;
                                                var meterLon = distLon / 0.000013;
                                                var distance = Math.sqrt(meterLat * meterLat + meterLon * meterLon);
                                                if (distance < 3) {
                                                    newPosition = { x: cp.x, y: cp.y };
                                                    setHasSnapped(true);
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    else {
                                        // PATH-BASIERTE BEWEGUNG - MIT FEHLERBEHANDLUNG
                                        var currentPath = floor === "UG" ? pathUG : pathOG;
                                        // Sicherstellen dass ein gültiger Pfad existiert
                                        if (!currentPath || currentPath.length < 2) {
                                            // Fallback auf freie Bewegung
                                            newPosition = {
                                                x: userPosition.x + metersEast * 2,
                                                y: userPosition.y - metersNorth * 2
                                            };
                                        }
                                        else {
                                            newPosition = moveAlongPath(metersNorth, metersEast, currentPath);
                                        }
                                    }
                                    // Sanfte Bewegung anwenden
                                    setUserPosition(function (prev) { return ({
                                        x: prev.x * 0.3 + newPosition.x * 0.7,
                                        y: prev.y * 0.3 + newPosition.y * 0.7,
                                        floor: prev.floor
                                    }); });
                                    lastLocation = loc.coords;
                                    setUserLocation({ latitude: latitude, longitude: longitude });
                                    // UG → OG FLOOR SWITCH
                                    if (floor === "UG" &&
                                        Math.abs(userPosition.x - STAIR_UG.x) < 8 &&
                                        Math.abs(userPosition.y - STAIR_UG.y) < 8) {
                                        console.log("Reached UG stairs → switching to OG...");
                                        onReachStairs === null || onReachStairs === void 0 ? void 0 : onReachStairs();
                                        setUserPosition(function (prev) { return ({ x: STAIR_OG.x, y: STAIR_OG.y, floor: 'OG' }); });
                                        setHasSnapped(false);
                                        return;
                                    }
                                }
                                catch (error) {
                                    console.error('Error in GPS tracking:', error);
                                    // Fallback auf freie Bewegung bei Fehlern
                                    setUserPosition(function (prev) { return ({
                                        x: prev.x + metersEast * 2,
                                        y: prev.y - metersNorth * 2,
                                        floor: prev.floor
                                    }); });
                                }
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        start();
        return function () {
            isMounted = false;
        };
    }, [heading, isCompassActive, floor, freeMovementMode, pathUG, pathOG, hasSnapped]);
    //
    // FETCH TEACHER ROOM
    //
    (0, react_1.useEffect)(function () {
        if (!(selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.id)) {
            setTeacherRoom(null);
            setSelectedMarker(null);
            return;
        }
        fetch("https://".concat(server_1.serverConfig.dns, "/rooms/").concat(selectedTeacher.assignedRoomId))
            .then(function (res) { return res.json(); })
            .then(function (room) {
            var card = cards.find(function (c) { return c.id === room.cardId; });
            if (!card)
                return;
            var floorAt = card.title === 'OG' ? 'OG' : 'UG';
            // Original image sizes
            var originalImageWidth = floorAt === 'OG' ? 2336 : 2331;
            var originalImageHeight = floorAt === 'OG' ? 467 : 2029;
            // Direkte Pixel-Koordinaten verwenden (skaliert für die aktuelle Map-Größe)
            var scaledX = (room.x / originalImageWidth) * outerWidth + 9;
            var scaledY = floorAt === 'OG' ? (room.y > OG_YWay ? (OG_YWay + 7) : (OG_YWay - 12)) : ((room.y / originalImageHeight) * outerHeight + ((room.y / originalImageHeight) * outerHeight > UG_YWay ? 5 : 15));
            console.log('Teacher room coordinates:', scaledX, scaledY);
            setTeacherRoom(room);
            setSelectedMarker({
                id: room.id,
                x: scaledX,
                y: scaledY,
                name: "".concat(selectedTeacher.attributes.firstname, " ").concat(selectedTeacher.attributes.lastname),
                floor: floorAt
            });
        })
            .catch(function () {
            setTeacherRoom(null);
            setSelectedMarker(null);
        });
    }, [selectedTeacher, imageDimensions, cards, outerWidth, outerHeight]);
    //
    // RESET PAN + ZOOM WHEN FLOOR SWITCHES
    //
    (0, react_1.useEffect)(function () {
        scale.value = (0, react_native_reanimated_1.withTiming)(1);
        translateX.value = (0, react_native_reanimated_1.withTiming)(0);
        translateY.value = (0, react_native_reanimated_1.withTiming)(0);
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
    }, [floor]);
    //
    // GESTURES
    //
    var pinchGesture = react_native_gesture_handler_1.Gesture.Pinch()
        .onUpdate(function (event) {
        var next = scale.value * event.scale;
        scale.value = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    });
    var panGesture = react_native_gesture_handler_1.Gesture.Pan()
        .onUpdate(function (event) {
        if (scale.value <= 1.01)
            return;
        translateX.value = lastTranslateX.value + event.translationX;
        translateY.value = lastTranslateY.value + event.translationY;
    })
        .onEnd(function () {
        lastTranslateX.value = translateX.value;
        lastTranslateY.value = translateY.value;
    });
    //
    // ANIMATED STYLE
    //
    var animatedInnerStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }); });
    //
    // USER ARROW STYLE MIT ROTATION - KORRIGIERT
    //
    var userArrowStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [
            { scale: 1 / scale.value },
            { rotate: isCompassActive ? "".concat(heading, "deg") : '0deg' },
        ],
    }); });
    // Separate Style für Teacher Image
    var teacherImageStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [
            { scale: 1 / scale.value }
        ],
    }); });
    return (<react_native_1.View style={[styles.container, { width: outerWidth }]}>
            <react_native_1.View style={[styles.mapContainer, { width: outerWidth, height: outerHeight }]}>

                <react_native_gesture_handler_1.GestureDetector gesture={react_native_gesture_handler_1.Gesture.Simultaneous(panGesture, pinchGesture)}>
                    <react_native_reanimated_1.default.View style={[styles.innerContent, animatedInnerStyle]}>

                        <react_native_1.Image source={mapImage} style={{ width: outerWidth, height: outerHeight }} resizeMode="contain"/>

                        {/* TEACHER MARKER */}
                        {selectedMarker && selectedMarker.floor === floor && (<react_native_1.TouchableOpacity activeOpacity={0.9} style={[
                styles.marker,
                {
                    left: selectedMarker.x - 15,
                    top: selectedMarker.y - 15
                }
            ]}>
                                <react_native_reanimated_1.default.Image source={(selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.attributes.image_url)
                ? { uri: selectedTeacher.attributes.image_url }
                : require('@/assets/images/Teacher.png')} style={[styles.teacherImage, teacherImageStyle]}/>
                            </react_native_1.TouchableOpacity>)}

                        {/* USER MARKER MIT ROTATION */}
                        {(userPosition.floor === floor && (0, geolib_1.getLatitude)(userLocation) !== 0 && (0, geolib_1.getLongitude)(userLocation) !== 0) && (<react_native_reanimated_1.default.View style={[
                styles.userArrow,
                {
                    left: userPosition.x - 25,
                    top: userPosition.y - 25,
                },
                userArrowStyle
            ]}>
                                <react_native_1.Image source={require('@/assets/images/user.png')} style={styles.arrowImage}/>
                            </react_native_reanimated_1.default.View>)}

                        {/* COMPASS STATUS ANZEIGE */}
                        {showLogger &&
            <react_native_1.View style={styles.compassStatus}>
                                <react_native_1.View style={[styles.statusDot, { backgroundColor: isCompassActive ? '#4CAF50' : '#f44336' }]}/>
                                <react_native_reanimated_1.default.Text style={styles.compassText}>
                                    {isCompassActive ? "Heading: ".concat(Math.round(heading), "\u00B0") : 'Compass inactive'}
                                </react_native_reanimated_1.default.Text>
                            </react_native_1.View>}

                        {/* CHECKPOINTS */}
                        {showLogger &&
            <react_native_svg_1.default style={react_native_1.StyleSheet.absoluteFill}>
                                {showLogger && checkpoints.map(function (checkpoint) { return (<react_1.default.Fragment key={checkpoint.id}>
                                        <react_native_svg_1.Circle cx={checkpoint.x} cy={checkpoint.y} r={8} fill="#FF6B6B" stroke="#FFFFFF" strokeWidth={2} opacity={0.8}/>
                                        <react_native_svg_1.Circle cx={checkpoint.x} cy={checkpoint.y} r={4} fill="#FFFFFF" opacity={0.9}/>
                                    </react_1.default.Fragment>); })}
                            </react_native_svg_1.default>}

                        {/* NAVIGATION PATH - KORRIGIERT */}
                        {/* Zeige UG Path nur an wenn floor UG ist */}
                        {floor === "UG" && pathUG && (<react_native_svg_1.default style={react_native_1.StyleSheet.absoluteFill}>
                                {pathUG.map(function (point, index) {
                if (index === 0)
                    return null;
                var prev = pathUG[index - 1];
                return (<react_native_svg_1.Line key={"ug-".concat(index)} x1={prev.x} y1={prev.y} x2={point.x} y2={point.y} stroke="rgba(0,102,255,0.75)" strokeWidth={4} strokeDasharray="5,5" strokeLinecap="round"/>);
            })}
                            </react_native_svg_1.default>)}

                        {/* Zeige OG Path nur an wenn floor OG ist */}
                        {floor === "OG" && pathOG && (<react_native_svg_1.default style={react_native_1.StyleSheet.absoluteFill}>
                                {pathOG.map(function (point, index) {
                if (index === 0)
                    return null;
                var prev = pathOG[index - 1];
                return (<react_native_svg_1.Line key={"og-".concat(index)} x1={prev.x} y1={prev.y} x2={point.x} y2={point.y} stroke="rgba(0,102,255,0.75)" strokeWidth={4} strokeDasharray="5,5" strokeLinecap="round"/>);
            })}
                            </react_native_svg_1.default>)}

                    </react_native_reanimated_1.default.View>
                </react_native_gesture_handler_1.GestureDetector>
            </react_native_1.View>

            {showLogger && <GPSLogger_1.default />}
        </react_native_1.View>);
};
exports.default = MapsOfKaindorf;
var styles = react_native_1.StyleSheet.create({
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
        position: 'absolute',
        left: 0,
        top: 0
    },
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
    arrowImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain'
    },
    compassStatus: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 8,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 8,
    },
    compassText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
    },
});
