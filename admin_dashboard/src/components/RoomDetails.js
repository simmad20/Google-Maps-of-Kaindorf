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
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var fa_1 = require("react-icons/fa");
var RoomService_tsx_1 = require("../services/RoomService.tsx");
var RoomDetails = function () {
    var id = (0, react_router_dom_1.useParams)().id;
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(undefined), room = _a[0], setRoom = _a[1];
    var load = function () {
        RoomService_tsx_1.default.fetchDetailedRoom(id)
            .then(function (r) {
            setRoom(r);
        })
            .catch(function (err) {
            console.error(err);
        });
    };
    (0, react_1.useEffect)(function () {
        load();
    }, []);
    var handleDeleteTeacher = function (teacherId) { return __awaiter(void 0, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!room)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, RoomService_tsx_1.default.deleteAssignedTeacherRoom(Number(id), teacherId)];
                case 2:
                    _a.sent();
                    load();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error deleting teacher from room:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div className="min-h-screen bg-gray-50 p-6">
            {room && (<div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <button onClick={function () { return navigate(-1); }} className="flex items-center text-blue-600 hover:text-blue-800 mb-6">
                            <fa_1.FaArrowLeft className="mr-2"/>
                            Zurück
                        </button>

                        <h1 className="text-2xl font-bold flex items-center mb-6">
                            <fa_1.FaDoorOpen className="mr-3 text-indigo-600"/>
                            Raum {(room === null || room === void 0 ? void 0 : room.room_number) || id} {room.name && room.name} - {room.teachers.length} Teacher{room.teachers.length > 1 && 's'}
                        </h1>

                        {room.teachers.length > 0 ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {room.teachers.map(function (teacher) { return (<div key={teacher.id} className="border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-indigo-100 p-3 rounded-full mr-4 w-16 h-16 flex items-center justify-center">
                                                {teacher.image_url ? (<img src={teacher.image_url} className="w-12 h-12 object-cover rounded-full"/>) : (<fa_1.FaUserTie className="text-indigo-600 text-3xl"/>)}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {teacher.title} {teacher.firstname} {teacher.lastname}
                                                </h3>
                                                <p className="text-indigo-600">{teacher.abbreviation}</p>
                                            </div>
                                        </div>
                                        <button onClick={function () { return handleDeleteTeacher(teacher.id); }} className="text-red-600 hover:text-red-800">
                                            <fa_1.FaTrash />
                                        </button>
                                    </div>); })}
                            </div>) : (<p className="text-gray-500">Keine Lehrer in diesem Raum</p>)}
                    </div>
                </div>)}
        </div>);
};
exports.default = RoomDetails;
