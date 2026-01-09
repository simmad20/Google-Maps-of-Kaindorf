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
var react_native_1 = require("react-native");
var react_native_gesture_handler_1 = require("react-native-gesture-handler");
var react_1 = require("react");
var react_native_svg_1 = require("react-native-svg");
var TeacherContext_1 = require("./context/TeacherContext");
var geolib_1 = require("geolib");
var GPSLogger_1 = require("./GPSLogger");
var server_1 = require("../config/server");
// assets
var pictureOG = require('@/assets/images/OG.png');
var pictureUG = require('@/assets/images/UG.png');
// responsive sizes
var isMobile = react_native_1.Dimensions.get('window').width < 650;
var MAP_MOBILE_SIZE = Math.round(react_native_1.Dimensions.get('window').width * 0.90);
var MAP_DESKTOP_WIDTH = Math.round(react_native_1.Dimensions.get('window').width * 0.70);
var MAP_DESKTOP_HEIGHT = Math.round(react_native_1.Dimensions.get('window').height * 0.55);
var MapsOfKaindorf = function (_a) {
    var onQrPress = _a.onQrPress, floor = _a.floor, showLogger = _a.showLogger;
    var selectedTeacher = (0, react_1.useContext)(TeacherContext_1.TeacherContext).selectedTeacher;
    var _b = (0, react_1.useState)(null), selectedMarker = _b[0], setSelectedMarker = _b[1];
    var _c = (0, react_1.useState)({ latitude: 46.801649, longitude: 15.5419766 }), userLocation = _c[0], setUserLocation = _c[1];
    var _d = (0, react_1.useState)({ x: (isMobile ? MAP_MOBILE_SIZE / 2 : MAP_DESKTOP_WIDTH / 2), y: 110 }), userPosition = _d[0], setUserPosition = _d[1];
    var _e = (0, react_1.useState)(null), teacherRoom = _e[0], setTeacherRoom = _e[1];
    var scale = (0, react_native_reanimated_1.useSharedValue)(1);
    var translateX = (0, react_native_reanimated_1.useSharedValue)(0);
    var translateY = (0, react_native_reanimated_1.useSharedValue)(0);
    var lastTranslateX = (0, react_native_reanimated_1.useSharedValue)(0);
    var lastTranslateY = (0, react_native_reanimated_1.useSharedValue)(0);
    var MIN_SCALE = 1;
    var MAX_SCALE = 4;
    // GPS tracking (unchanged / guard)
    (0, react_1.useEffect)(function () {
        var lastLocation = null;
        var start = function () { return __awaiter(void 0, void 0, void 0, function () {
            var status;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Location.requestForegroundPermissionsAsync()];
                    case 1:
                        status = (_a.sent()).status;
                        if (status !== "granted") {
                            console.log("❌ GPS permission denied");
                            return [2 /*return*/];
                        }
                        return [4 /*yield*/, Location.watchPositionAsync({ accuracy: Location.Accuracy.Highest, timeInterval: 1000, distanceInterval: 1 }, function (loc) {
                                var _a = loc.coords, latitude = _a.latitude, longitude = _a.longitude;
                                if (!lastLocation) {
                                    lastLocation = loc.coords;
                                    return;
                                }
                                var dLat = latitude - lastLocation.latitude;
                                var dLon = longitude - lastLocation.longitude;
                                var METERS_PER_LAT = 0.000010;
                                var METERS_PER_LON = 0.000013;
                                var PIXELS_PER_METER = 2;
                                var metersY = dLat / METERS_PER_LAT;
                                var metersX = dLon / METERS_PER_LON;
                                var MAX_STEP = 15;
                                metersX = Math.max(Math.min(metersX, MAX_STEP), -MAX_STEP);
                                metersY = Math.max(Math.min(metersY, MAX_STEP), -MAX_STEP);
                                setUserPosition(function (prev) { return ({
                                    x: prev.x * 0.8 + (prev.x + metersX * PIXELS_PER_METER) * 0.2,
                                    y: prev.y * 0.8 + (prev.y - metersY * PIXELS_PER_METER) * 0.2,
                                }); });
                                lastLocation = loc.coords;
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); };
        start();
    }, []);
    // fetch teacher room (kept)
    (0, react_1.useEffect)(function () {
        if (!(selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.id)) {
            setTeacherRoom(null);
            setSelectedMarker(null);
            return;
        }
        fetch("http://".concat(server_1.serverConfig.ip, ":").concat(server_1.serverConfig.port, "/teachers/").concat(selectedTeacher.id))
            .then(function (res) { return res.json(); })
            .then(function (room) {
            // reuse your scaling helper if desired
            var scaledRoom = hardScaleXY(room);
            setTeacherRoom(scaledRoom);
            setSelectedMarker({
                id: scaledRoom.id,
                x: scaledRoom.x,
                y: scaledRoom.y,
                name: "".concat(selectedTeacher.title || '', " ").concat(selectedTeacher.firstname, " ").concat(selectedTeacher.lastname)
            });
        })
            .catch(function () { setTeacherRoom(null); setSelectedMarker(null); });
    }, [selectedTeacher]);
    (0, react_1.useEffect)(function () {
        if (floor === 'OG') {
            scale.value = 2;
        }
        else {
            scale.value = 1;
        }
        translateX.value = 0;
        translateY.value = 0;
        lastTranslateX.value = 0;
        lastTranslateY.value = 0;
    }, [floor]);
    // gestures: pinch & pan (only affect innerContent)
    var pinchGesture = react_native_gesture_handler_1.Gesture.Pinch()
        .onUpdate(function (event) {
        scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, event.scale * scale.value));
    })
        .onEnd(function () {
        scale.value = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale.value));
    });
    var panGesture = react_native_gesture_handler_1.Gesture.Pan()
        .onUpdate(function (event) {
        if (scale.value > 1.01) {
            translateX.value = lastTranslateX.value + event.translationX;
            translateY.value = lastTranslateY.value + event.translationY;
        }
    })
        .onEnd(function () {
        lastTranslateX.value = translateX.value;
        lastTranslateY.value = translateY.value;
    });
    var animatedInnerStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [
            { translateX: translateX.value },
            { translateY: translateY.value },
            { scale: scale.value },
        ],
    }); });
    // helper: keep your original hardScaleXY
    var hardScaleXY = function (room) {
        if (!room)
            return room;
        room.x = (room.x / 4) - (room.x * 0.04);
        while (room.y > 120 || room.y < 90) {
            if (room.y > 120)
                room.y = (room.y / 1.1);
            if (room.y < 90)
                room.y = (room.y * 1.1);
        }
        return room;
    };
    // markers
    var markers = teacherRoom ? [{
            id: teacherRoom.id,
            y: teacherRoom.y,
            x: teacherRoom.x,
            name: "".concat((selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.title) || '', " ").concat(selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.firstname, " ").concat(selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.lastname)
        }] : [];
    // path calculation (kept)
    var calculatePath = function () {
        if (!selectedMarker || !userPosition)
            return null;
        var centralPathY = (isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT) * 0.45;
        var path = [];
        var userX = userPosition.x, userY = userPosition.y;
        var teacherX = selectedMarker.x, teacherY = selectedMarker.y;
        if (userY !== centralPathY)
            path.push({ x: userX, y: centralPathY });
        if (userX !== teacherX)
            path.push({ x: teacherX, y: centralPathY });
        if (teacherY !== centralPathY)
            path.push({ x: teacherX, y: teacherY });
        return path;
    };
    var path = calculatePath();
    var mapImage = floor === 'OG' ? pictureOG : pictureUG;
    // sizes for outer container (fixed)
    var outerWidth = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_WIDTH;
    var outerHeight = isMobile ? MAP_MOBILE_SIZE : MAP_DESKTOP_HEIGHT;
    return (<react_native_1.View style={[styles.container, { width: outerWidth }]}>
            {/* Fixed outer container: map is centered below title */}
            <react_native_1.View style={[styles.mapContainer, { width: outerWidth, height: outerHeight }]}>
                {/* GestureDetector applies to the inner content so only image & markers scale */}
                <react_native_gesture_handler_1.GestureDetector gesture={react_native_gesture_handler_1.Gesture.Simultaneous(panGesture, pinchGesture)}>
                    <react_native_reanimated_1.default.View style={[styles.innerContent, animatedInnerStyle]}>
                        {/* Map image */}
                        <react_native_1.Image source={mapImage} style={[styles.mapImage, { width: outerWidth, height: outerHeight }]} resizeMode="contain"/>

                        {/* Teacher markers (positioned absolutely relative to inner content)
Note: marker.x / y should be correct pixel coords compatible with your map image dimensions */}
                        {markers.map(function (marker) {
            var _a;
            return (<react_native_1.TouchableOpacity key={marker.id} style={[styles.marker, { left: marker.x - 15, top: marker.y - 15 }]} onPress={function () { return setSelectedMarker(marker); }} activeOpacity={0.9}>
                                <react_native_1.Image source={((_a = selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.image_url) === null || _a === void 0 ? void 0 : _a.length) < 1 ? require('@/assets/images/Teacher.png') : { uri: selectedTeacher === null || selectedTeacher === void 0 ? void 0 : selectedTeacher.image_url }} style={styles.teacherImage}/>
                            </react_native_1.TouchableOpacity>);
        })}

                        {/* user arrow */}
                        {((0, geolib_1.getLatitude)(userLocation) !== 0 && (0, geolib_1.getLongitude)(userLocation) !== 0) && (<react_native_1.View style={[styles.userArrow, { left: userPosition.x - 25, top: userPosition.y - 25 }]}>
                                <react_native_1.Image source={require('@/assets/images/user.png')} style={styles.arrowImage}/>
                            </react_native_1.View>)}

                        {/* path lines */}
                        {path && (<react_native_svg_1.default style={react_native_1.StyleSheet.absoluteFill}>
                                {path.map(function (point, index) {
                var prevPoint = index === 0 ? userPosition : path[index - 1];
                return (<react_native_svg_1.Line key={index} x1={prevPoint.x} y1={prevPoint.y} x2={point.x} y2={point.y} stroke="rgba(0, 102, 255, 0.75)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,5"/>);
            })}
                            </react_native_svg_1.default>)}
                    </react_native_reanimated_1.default.View>
                </react_native_gesture_handler_1.GestureDetector>
            </react_native_1.View>

            {/* Selected marker info */}
            {selectedMarker && (<react_native_1.View style={styles.infoBox}>
                    <react_native_1.Text style={styles.infoText}>Selected Location:</react_native_1.Text>
                    <react_native_1.Text>{selectedMarker.name}</react_native_1.Text>
                </react_native_1.View>)}

            {/* optional GPS logger */}
            {showLogger && (<GPSLogger_1.default />)}
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
