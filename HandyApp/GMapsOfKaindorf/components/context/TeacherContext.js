"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherContext = void 0;
var react_1 = require("react");
var defaultTeacher = {
    id: '', title: '', firstname: '', lastname: '',
    abbreviation: '', image_url: ''
};
exports.TeacherContext = (0, react_1.createContext)({
    selectedTeacher: defaultTeacher,
    setSelectedTeacher: function (teacher) { return null; }
});
var TeacherProvider = function (_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(defaultTeacher), selectedTeacher = _b[0], setSelectedTeacher = _b[1];
    return (<exports.TeacherContext.Provider value={{ selectedTeacher: selectedTeacher, setSelectedTeacher: setSelectedTeacher }}>
			{children}
		</exports.TeacherContext.Provider>);
};
exports.default = TeacherProvider;
