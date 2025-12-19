"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = QRScanner;
var expo_camera_1 = require("expo-camera");
var react_native_1 = require("react-native");
var react_1 = require("react");
function QRScanner(_a) {
    var visible = _a.visible, onClose = _a.onClose, onScan = _a.onScan;
    var _b = (0, expo_camera_1.useCameraPermissions)(), permission = _b[0], requestPermission = _b[1];
    (0, react_1.useEffect)(function () {
        if (permission && !permission.granted)
            requestPermission();
    }, [permission]);
    if (!visible)
        return null;
    if (!permission)
        return <react_native_1.View style={styles.center}><react_native_1.Text>Loading permission...</react_native_1.Text></react_native_1.View>;
    if (!permission.granted) {
        return (<react_native_1.View style={styles.center}>
                <react_native_1.Text>Keine Kameraberechtigung</react_native_1.Text>
                <react_native_1.TouchableOpacity style={styles.actionBtn} onPress={requestPermission}>
                    <react_native_1.Text style={styles.actionText}>Erlauben</react_native_1.Text>
                </react_native_1.TouchableOpacity>
                <react_native_1.TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#777' }]} onPress={onClose}>
                    <react_native_1.Text style={styles.actionText}>Abbrechen</react_native_1.Text>
                </react_native_1.TouchableOpacity>
            </react_native_1.View>);
    }
    var _c = react_native_1.Dimensions.get('window'), width = _c.width, height = _c.height;
    var overlaySize = width * 0.7;
    return (<react_native_1.View style={styles.overlay}>
            <expo_camera_1.CameraView style={react_native_1.StyleSheet.absoluteFill} barcodeScannerSettings={{ barcodeTypes: ['qr'] }} onBarcodeScanned={function (result) {
            if (result.data) {
                onScan(result.data);
                onClose();
            }
        }}/>

            {/* QR Overlay */}
            <react_native_1.View style={styles.overlayMask}>
                <react_native_1.View style={{ flex: 1 }}/>
                <react_native_1.View style={styles.overlayRow}>
                    <react_native_1.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}/>
                    <react_native_1.View style={[styles.qrFrame, { width: overlaySize, height: overlaySize, borderRadius: 12 }]}/>
                    <react_native_1.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}/>
                </react_native_1.View>
                <react_native_1.View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' }}/>
            </react_native_1.View>

            <react_native_1.TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                <react_native_1.Text style={styles.closeText}>✕</react_native_1.Text>
            </react_native_1.TouchableOpacity>
        </react_native_1.View>);
}
var styles = react_native_1.StyleSheet.create({
    overlay: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { zIndex: 9999, marginTop: 40 }),
    closeBtn: { position: 'absolute', top: 40, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 30, zIndex: 10000 },
    closeText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' },
    actionBtn: { marginTop: 15, backgroundColor: '#a453ec', padding: 12, borderRadius: 8, minWidth: 120, alignItems: 'center' },
    actionText: { color: '#fff', fontWeight: 'bold' },
    overlayMask: __assign(__assign({}, react_native_1.StyleSheet.absoluteFillObject), { justifyContent: 'center', alignItems: 'center' }),
    overlayRow: { flexDirection: 'row', alignItems: 'center' },
    qrFrame: { borderWidth: 3, borderColor: '#a453ec', backgroundColor: 'transparent' },
});
