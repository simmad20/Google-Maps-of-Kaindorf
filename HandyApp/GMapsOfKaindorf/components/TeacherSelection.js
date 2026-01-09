"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TeacherSelection;
var react_native_1 = require("react-native");
var react_1 = require("react");
var TeacherContext_1 = require("./context/TeacherContext");
var picker_1 = require("@react-native-picker/picker");
var server_1 = require("../config/server");
function TeacherSelection() {
    var _a;
    var defaultTeacher = {
        id: '', title: '', firstname: '', lastname: '',
        abbreviation: '', image_url: ''
    };
    var _b = (0, react_1.useState)([]), teachers = _b[0], setTeachers = _b[1];
    var _c = (0, react_1.useContext)(TeacherContext_1.TeacherContext), selectedTeacher = _c.selectedTeacher, setSelectedTeacher = _c.setSelectedTeacher; // Context verwenden
    var _d = (0, react_1.useState)(false), imageError = _d[0], setImageError = _d[1];
    var fetchTeachers = function () {
        fetch("http://".concat(server_1.serverConfig.ip, ":").concat(server_1.serverConfig.port, "/teachers"))
            .then(function (res) { return res.json(); })
            .then(function (teacherList) {
            setTeachers(teacherList);
            console.log(teacherList);
        });
    };
    (0, react_1.useEffect)(function () {
        fetchTeachers();
    }, []);
    var handleTeacherChange = function (itemValue) {
        if (itemValue === 'Select a teacher') {
            setSelectedTeacher(defaultTeacher);
        }
        else {
            var teacher = teachers.find(function (t) { return t.id === itemValue; });
            if (teacher) {
                setSelectedTeacher(teacher);
                // fetch(`http://${serverConfig.ip}:${serverConfig.port}/roomOfTeacher`+ teacher.id)
                // .then((res) => res.json())
                // .then((teacherList: ITeacher[]) => {
                // 		setTeachers(teacherList);
                // 		console.log(teacherList);
                // 	}
                // );
            }
        }
    };
    var handleImageError = function () {
        setImageError(true);
    };
    (0, react_1.useEffect)(function () {
        console.log(teachers);
    });
    return (<react_native_1.ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
			<react_native_1.View style={react_native_1.Platform.OS === 'ios' ? styles.pickerContainerIOS : styles.pickerContainerAndroid}>
				<picker_1.Picker selectedValue={"".concat((_a = selectedTeacher.title) !== null && _a !== void 0 ? _a : '', " ").concat(selectedTeacher.firstname, " ").concat(selectedTeacher.lastname)} onValueChange={handleTeacherChange} style={styles.picker} mode="dialog">
					<picker_1.Picker.Item label="Select a teacher" value="Select a teacher"/>
					{teachers.map(function (teacher) {
            var _a;
            return (<picker_1.Picker.Item key={teacher.id} label={"".concat((_a = teacher.title) !== null && _a !== void 0 ? _a : '', " ").concat(teacher.firstname, " ").concat(teacher.lastname).trim()} value={teacher.id}/>);
        })}
				</picker_1.Picker>
			</react_native_1.View>
			<react_native_1.View style={styles.imageContainer}>
				<react_native_1.Image style={styles.image} source={(imageError || selectedTeacher.image_url.length < 1)
            ? require('@/assets/images/Teacher.png')
            : { uri: selectedTeacher.image_url }} resizeMode="contain" onError={handleImageError}/>
			</react_native_1.View>
		</react_native_1.ScrollView>);
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3
    },
    pickerContainerIOS: {
        height: 170,
        width: 250,
        backgroundColor: '#ffffff',
        color: '#000000'
    },
    pickerContainerAndroid: {
        height: 50,
        width: 250,
        backgroundColor: '#ffffff',
        color: '#000000'
    },
    picker: {
        height: 50,
        width: 250,
        color: 'black',
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    image: {
        width: 300,
        height: 300,
    },
});
