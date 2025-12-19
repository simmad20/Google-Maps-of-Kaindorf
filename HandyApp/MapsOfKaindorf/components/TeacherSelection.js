"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeacherSelection;
var react_native_1 = require("react-native");
var react_1 = require("react");
var TeacherContext_1 = require("./context/TeacherContext");
var picker_1 = require("@react-native-picker/picker");
var server_1 = require("../config/server");
function TeacherSelection() {
    var defaultTeacher = {
        id: '', attributes: {
            title: '', firstname: '', lastname: '',
            abbreviation: '', image_url: ''
        },
        type: 'teacher', assignedRoomId: undefined
    };
    var _a = (0, react_1.useContext)(TeacherContext_1.TeacherContext), selectedTeacher = _a.selectedTeacher, setSelectedTeacher = _a.setSelectedTeacher, teachers = _a.teachers, setTeachers = _a.setTeachers, cards = _a.cards, setCards = _a.setCards;
    var _b = (0, react_1.useState)(false), imageError = _b[0], setImageError = _b[1];
    // Fetch Room Cards
    (0, react_1.useEffect)(function () {
        if (teachers.length > 0)
            return;
        fetch("https://".concat(server_1.serverConfig.dns, "/objects/teacher"))
            .then(function (res) { return res.json(); })
            .then(function (teacherList) {
            setTeachers(teacherList.filter(function (teacher) { return teacher.assignedRoomId !== null; }));
        }).catch(function () { return setTeachers([]); });
        if (cards.length > 0)
            return;
        fetch("https://".concat(server_1.serverConfig.dns, "/cards"))
            .then(function (res) { return res.json(); })
            .then(function (cards) {
            setCards(cards);
        })
            .catch(function () { console.log('Failed to fetch cards'); });
    }, []);
    var handleTeacherChange = function (teacherId) {
        if (teacherId === 'Select a teacher') {
            setSelectedTeacher(defaultTeacher);
        }
        else {
            var teacher = teachers.find(function (t) { return t.id === teacherId; });
            if (teacher)
                setSelectedTeacher(teacher);
        }
    };
    return (<react_native_1.ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
            <react_native_1.View style={react_native_1.Platform.OS === 'ios' ? styles.pickerContainerIOS : styles.pickerContainerAndroid}>
                <picker_1.Picker selectedValue={selectedTeacher.id || 'Select a teacher'} onValueChange={handleTeacherChange} style={styles.picker} mode="dialog">
                    <picker_1.Picker.Item label="Select a teacher" value="Select a teacher"/>
                    {teachers.map(function (t) {
            var _a;
            return (<picker_1.Picker.Item key={t.id} label={"".concat((_a = t.attributes.title) !== null && _a !== void 0 ? _a : '', " ").concat(t.attributes.firstname, " ").concat(t.attributes.lastname).trim()} value={t.id}/>);
        })}
                </picker_1.Picker>
            </react_native_1.View>

            <react_native_1.View style={styles.imageContainer}>
                <react_native_1.Image style={styles.image} source={imageError || !selectedTeacher.attributes.image_url
            ? require('@/assets/images/Teacher.png')
            : { uri: selectedTeacher.attributes.image_url }} resizeMode="contain" onError={function () { return setImageError(true); }}/>
            </react_native_1.View>
        </react_native_1.ScrollView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickerContainerIOS: {
        height: 170,
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    pickerContainerAndroid: {
        height: 50,
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: 250,
        color: 'black'
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    image: {
        width: 300,
        height: 300
    },
});
