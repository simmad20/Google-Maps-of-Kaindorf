"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherContext = void 0;
var react_1 = require("react");
var defaultTeacher = {
    id: '', attributes: {
        title: '', firstname: '', lastname: '',
        abbreviation: '', image_url: ''
    },
    type: 'teacher', assignedRoomId: undefined
};
exports.TeacherContext = (0, react_1.createContext)({
    selectedTeacher: defaultTeacher,
    setSelectedTeacher: function (teacher) { return null; },
    teachers: [],
    setTeachers: function () { return null; },
    cards: [],
    setCards: function () { return null; }
});
var TeacherProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(defaultTeacher), selectedTeacher = _b[0], setSelectedTeacher = _b[1];
    var _c = (0, react_1.useState)([]), teachers = _c[0], setTeachers = _c[1];
    var _d = (0, react_1.useState)([]), cards = _d[0], setCards = _d[1];
    return (<exports.TeacherContext.Provider value={{ selectedTeacher: selectedTeacher, setSelectedTeacher: setSelectedTeacher, teachers: teachers, setTeachers: setTeachers, cards: cards, setCards: setCards }}>
			{children}
		</exports.TeacherContext.Provider>);
};
exports.default = TeacherProvider;
