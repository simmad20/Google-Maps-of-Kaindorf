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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Map_tsx_1 = require("./Map.tsx");
var List_tsx_1 = require("./List.tsx");
var Form_tsx_1 = require("./Form.tsx");
var RoomForm_tsx_1 = require("./RoomForm.tsx"); // Neue Komponente importieren
var TeacherContext_tsx_1 = require("../context/TeacherContext.tsx");
var io5_1 = require("react-icons/io5");
var RoomService_tsx_1 = require("../services/RoomService.tsx");
var TeacherService_tsx_1 = require("../services/TeacherService.tsx");
function Homepage() {
    var _this = this;
    var _a = (0, react_1.useContext)(TeacherContext_tsx_1.TeacherContext), teachers = _a.teachers, reload = _a.reload;
    var _b = (0, react_1.useState)(false), showForm = _b[0], setShowForm = _b[1];
    var _c = (0, react_1.useState)(true), showEditButton = _c[0], setShowEditButton = _c[1];
    var _d = (0, react_1.useState)(undefined), clickedTeacher = _d[0], setClickedTeacher = _d[1];
    var _e = (0, react_1.useState)(null), clickPosition = _e[0], setClickPosition = _e[1];
    var _f = (0, react_1.useState)(false), showRoomForm = _f[0], setShowRoomForm = _f[1]; // Neuer State für Room Form
    var _g = (0, react_1.useState)([]), rooms = _g[0], setRooms = _g[1];
    var _h = (0, react_1.useState)(null), editingRoom = _h[0], setEditingRoom = _h[1];
    var createOrEditTeacher = function (teacher, isCreating) {
        setShowForm(false);
        setShowEditButton(true);
        fetch('http://localhost:3000/teachers', {
            method: isCreating ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ teacher: teacher })
        }).then(function (response) { return response.json(); })
            .then(function (result) {
            reload();
            console.log(result);
        });
        setClickedTeacher(undefined);
    };
    var handleClickOfItem = function (item) {
        if (!showEditButton) {
            setClickedTeacher(item);
            setShowForm(true);
        }
    };
    var back = function () {
        setClickedTeacher(undefined);
        setShowForm(false);
        setShowEditButton(true);
    };
    var getRooms = function () {
        RoomService_tsx_1.default.fetchAllRooms()
            .then(function (r) {
            setRooms(r);
        })
            .catch(function (err) {
            console.log(err);
        });
    };
    var handleTeacherAssign = (0, react_1.useCallback)(function (teacherId, roomId) { return __awaiter(_this, void 0, void 0, function () {
        var updatedRooms, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, TeacherService_tsx_1.default.addTeacherToRoom(teacherId, roomId)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, RoomService_tsx_1.default.fetchAllRooms()];
                case 2:
                    updatedRooms = _a.sent();
                    setRooms(updatedRooms);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Fehler bei Zuordnung:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, []);
    var handleCreateRoom = function (roomData) {
        RoomService_tsx_1.default.createRoom(roomData)
            .then(function (newRoom) {
            setRooms(function (prevRooms) { return __spreadArray(__spreadArray([], prevRooms, true), [newRoom], false); });
            setShowRoomForm(false);
            setClickPosition(null);
        })
            .catch(function (error) {
            console.error("Error creating room:", error.message);
        });
    };
    // Neue Funktion für Raum-Bearbeitung
    var handleEditRoom = function (roomData) {
        if (!editingRoom)
            return;
        RoomService_tsx_1.default.updateRoom(__assign(__assign({}, roomData), { id: editingRoom.id, teacher_ids: editingRoom.teacher_ids || [] }))
            .then(function (updatedRoom) {
            setRooms(function (prev) { return prev.map(function (r) { return r.id === updatedRoom.id ? updatedRoom : r; }); });
            setEditingRoom(null);
        })
            .catch(function (error) {
            console.error("Error updating room:", error.message);
        });
    };
    (0, react_1.useEffect)(function () {
        console.log("Editing room state changed:", editingRoom);
    }, [editingRoom]);
    (0, react_1.useEffect)(function () {
        getRooms();
    }, []);
    return (<react_1.default.Fragment>
            {showForm ? <Form_tsx_1.default createOrEdit={createOrEditTeacher} item={clickedTeacher} goBack={back}/> :
            <div className="mt-5 flex flex-wrap-reverse">
                    <div className="basis-1/6 mx-auto lg:mx-0 flex flex-col items-center">
                        {showEditButton &&
                    <button onClick={function () { return setShowEditButton(false); }} className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Edit
                            </button>}
                        <List_tsx_1.default items={teachers} handleClick={handleClickOfItem} showDelete={!showEditButton}/>
                        {(!showEditButton) &&
                    <button onClick={function () { return setShowForm(true); }} className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Create
                            </button>}
                    </div>

                    <div className="basis-1/4 flex flex-col items-center">
                        {clickPosition &&
                    <div className="flex items-center py-1">
                                <button className="homeButton bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded" onClick={function () { return setShowRoomForm(true); }}>
                                    New room
                                </button>
                                <button className="ms-5" onClick={function () { return setClickPosition(null); }}>
                                    <io5_1.IoCloseSharp />
                                </button>
                            </div>}
                        <Map_tsx_1.default onTeacherAssign={handleTeacherAssign} rooms={rooms} clickPosition={clickPosition} updateClickPosition={function (x, y) { return setClickPosition({ x: x, y: y }); }}/>
                    </div>

                    {showRoomForm && clickPosition && (<RoomForm_tsx_1.default key={1} clickPosition={clickPosition} onClose={function () { return setShowRoomForm(false); }} onSubmit={handleCreateRoom} isPositionEditable={false}/>)}

                    {(editingRoom !== null) && (<RoomForm_tsx_1.default key={2} initialData={editingRoom} onClose={function () { return setEditingRoom(null); }} onSubmit={handleEditRoom} isPositionEditable={true}/>)}
                </div>}
        </react_1.default.Fragment>);
}
exports.default = Homepage;
var handleCreateRoom = function (roomData) {
    RoomService_tsx_1.default.createRoom(roomData)
        .then(function (newRoom) {
        setRooms(function (prevRooms) { return __spreadArray(__spreadArray([], prevRooms, true), [newRoom], false); });
        setShowRoomForm(false);
        setClickPosition(null);
    })
        .catch(function (error) {
        console.error("Error creating room:", error.message);
    });
};
// Neue Funktion für Raum-Bearbeitung
var handleEditRoom = function (roomData) {
    if (!editingRoom)
        return;
    RoomService_tsx_1.default.updateRoom(__assign(__assign({}, roomData), { id: editingRoom.id, teacher_ids: editingRoom.teacher_ids || [] }))
        .then(function (updatedRoom) {
        setRooms(function (prev) { return prev.map(function (r) { return r.id === updatedRoom.id ? updatedRoom : r; }); });
        setEditingRoom(null);
    })
        .catch(function (error) {
        console.error("Error updating room:", error.message);
    });
};
(0, react_1.useEffect)(function () {
    console.log("Editing room state changed:", editingRoom);
}, [editingRoom]);
(0, react_1.useEffect)(function () {
    getRooms();
}, []);
return (<react_1.default.Fragment>
            {showForm ? <Form_tsx_1.default createOrEdit={createOrEditTeacher} item={clickedTeacher} goBack={back}/> :
        <div className="mt-5 flex flex-wrap-reverse">
                    <div className="basis-1/6 mx-auto lg:mx-0 flex flex-col items-center">
                        {showEditButton &&
                <button onClick={function () { return setShowEditButton(false); }} className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Edit
                            </button>}
                        <List_tsx_1.default items={teachers} handleClick={handleClickOfItem} showDelete={!showEditButton}/>
                        {(!showEditButton) &&
                <button onClick={function () { return setShowForm(true); }} className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Create
                            </button>}
                    </div>

                    <div className="basis-1/4 flex flex-col items-center">
                        {clickPosition &&
                <div className="flex items-center py-1">
                                <button className="homeButton bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded" onClick={function () { return setShowRoomForm(true); }}>
                                    New room
                                </button>
                                <button className="ms-5" onClick={function () { return setClickPosition(null); }}>
                                    <io5_1.IoCloseSharp />
                                </button>
                            </div>}
                        <Map_tsx_1.default onTeacherAssign={handleTeacherAssign} rooms={rooms} clickPosition={clickPosition} updateClickPosition={function (x, y) { return setClickPosition({ x: x, y: y }); }}/>
                    </div>

                    {showRoomForm && clickPosition && (<RoomForm_tsx_1.default key={1} clickPosition={clickPosition} onClose={function () { return setShowRoomForm(false); }} onSubmit={handleCreateRoom} isPositionEditable={false}/>)}

                    {(editingRoom !== null) && (<RoomForm_tsx_1.default key={2} initialData={editingRoom} onClose={function () { return setEditingRoom(null); }} onSubmit={handleEditRoom} isPositionEditable={true}/>)}
                </div>}
        </react_1.default.Fragment>);
exports.default = Homepage;
