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
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var BASE_URL = 'http://localhost:3000/rooms';
var RoomService = /** @class */ (function () {
    function RoomService() {
    }
    RoomService.fetchAllRooms = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_1, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(BASE_URL)];
                    case 1:
                        response = _a.sent();
                        if (response.status !== axios_1.HttpStatusCode.Ok) {
                            throw Error("Error response fetching all rooms: " + response.status);
                        }
                        return [2 /*return*/, response.data];
                    case 2:
                        err_1 = _a.sent();
                        error = err_1;
                        console.error("Error fetching all rooms: " + error.message);
                        throw error;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.fetchDetailedRoom = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_2, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get("".concat(BASE_URL, "/").concat(id))];
                    case 1:
                        response = _a.sent();
                        if (response.status !== axios_1.HttpStatusCode.Ok) {
                            throw Error("Error response fetching detailed room: " + response.status);
                        }
                        return [2 /*return*/, response.data];
                    case 2:
                        err_2 = _a.sent();
                        error = err_2;
                        console.error("Error fetching detailed room: " + error.message);
                        throw error;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.createRoom = function (room) {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_3, error;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.post(BASE_URL, room)];
                    case 1:
                        response = _a.sent();
                        if (response.status !== axios_1.HttpStatusCode.Created) {
                            throw Error("Error response creating room: " + response.status);
                        }
                        return [2 /*return*/, response.data];
                    case 2:
                        err_3 = _a.sent();
                        error = err_3;
                        console.error("Error creating room: " + error.message);
                        throw error;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.updateRoom = function (room) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var response, err_4, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.put("".concat(BASE_URL, "/").concat(room.id), room)];
                    case 1:
                        response = _c.sent();
                        if (response.status !== axios_1.HttpStatusCode.Ok) {
                            throw Error("Error response updating room: " + response.status);
                        }
                        return [2 /*return*/, response.data];
                    case 2:
                        err_4 = _c.sent();
                        error = err_4;
                        if (axios_1.default.isAxiosError(error)) {
                            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === axios_1.HttpStatusCode.NotFound) {
                                throw new Error('Room not found');
                            }
                            if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === axios_1.HttpStatusCode.BadRequest) {
                                throw new Error('Invalid room data');
                            }
                        }
                        console.error("Error updating room: " + error.message);
                        throw error;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.deleteRoom = function (id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var response, err_5, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.delete("".concat(BASE_URL, "/").concat(id))];
                    case 1:
                        response = _c.sent();
                        if (response.status !== axios_1.HttpStatusCode.NoContent) {
                            throw new Error("Unexpected status code: ".concat(response.status));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_5 = _c.sent();
                        error = err_5;
                        if (axios_1.default.isAxiosError(error)) {
                            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === axios_1.HttpStatusCode.NotFound) {
                                throw new Error('Room not found');
                            }
                            if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === axios_1.HttpStatusCode.BadRequest) {
                                throw new Error('Invalid room ID');
                            }
                        }
                        console.error("Error deleting room:", error);
                        throw error;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    RoomService.deleteAssignedTeacherRoom = function (room_id, teacher_id) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var response, err_6, error;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.delete("".concat(BASE_URL, "/assigned"), {
                                data: { room_id: room_id, teacher_id: teacher_id }, // Hier gehören die Daten hin
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1:
                        response = _c.sent();
                        if (response.status !== axios_1.HttpStatusCode.NoContent) {
                            throw new Error("Unexpected status code: ".concat(response.status));
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        err_6 = _c.sent();
                        error = err_6;
                        if (axios_1.default.isAxiosError(error)) {
                            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === axios_1.HttpStatusCode.NotFound) {
                                throw new Error('Room not found');
                            }
                            if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === axios_1.HttpStatusCode.BadRequest) {
                                throw new Error('Invalid room ID');
                            }
                        }
                        console.error("Error deleting room:", error);
                        throw error;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return RoomService;
}());
exports.default = RoomService;
atus !== axios_1.HttpStatusCode.Ok;
{
    throw Error("Error response fetching detailed room: " + response.status);
}
return response.data;
try { }
catch (err) {
    var error = err;
    console.error("Error fetching detailed room: " + error.message);
    throw error;
}
async;
createRoom(room, (Omit));
Promise < interfaces_ts_1.IRoom > {
    try: {
        const: response = await axios_1.default.post(BASE_URL, room),
        if: function (response) { },
        : .status !== axios_1.HttpStatusCode.Created
    }
};
{
    throw Error("Error response creating room: " + response.status);
}
return response.data;
try { }
catch (err) {
    var error = err;
    console.error("Error creating room: " + error.message);
    throw error;
}
async;
updateRoom(room, interfaces_ts_1.IRoom);
Promise < interfaces_ts_1.IRoom > {
    try: {
        const: response = await axios_1.default.put("".concat(BASE_URL, "/").concat(room.id), room),
        if: function (response) { },
        : .status !== axios_1.HttpStatusCode.Ok
    }
};
{
    throw Error("Error response updating room: " + response.status);
}
return response.data;
try { }
catch (err) {
    var error = err;
    if (axios_1.default.isAxiosError(error)) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === axios_1.HttpStatusCode.NotFound) {
            throw new Error('Room not found');
        }
        if (((_b = error.response) === null || _b === void 0 ? void 0 : _b.status) === axios_1.HttpStatusCode.BadRequest) {
            throw new Error('Invalid room data');
        }
    }
    console.error("Error updating room: " + error.message);
    throw error;
}
async;
deleteRoom(id, number);
Promise < void  > {
    try: {
        const: response = await axios_1.default.delete("".concat(BASE_URL, "/").concat(id)),
        if: function (response) { },
        : .status !== axios_1.HttpStatusCode.NoContent
    }
};
{
    throw new Error("Unexpected status code: ".concat(response.status));
}
try { }
catch (err) {
    var error = err;
    if (axios_1.default.isAxiosError(error)) {
        if (((_c = error.response) === null || _c === void 0 ? void 0 : _c.status) === axios_1.HttpStatusCode.NotFound) {
            throw new Error('Room not found');
        }
        if (((_d = error.response) === null || _d === void 0 ? void 0 : _d.status) === axios_1.HttpStatusCode.BadRequest) {
            throw new Error('Invalid room ID');
        }
    }
    console.error("Error deleting room:", error);
    throw error;
}
async;
deleteAssignedTeacherRoom(room_id, number, teacher_id, number);
Promise < void  > {
    try: {
        const: response = await axios_1.default.delete("".concat(BASE_URL, "/assigned"), {
            data: { room_id: room_id, teacher_id: teacher_id }, // Hier gehören die Daten hin
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        if: function (response) { },
        : .status !== axios_1.HttpStatusCode.NoContent
    }
};
{
    throw new Error("Unexpected status code: ".concat(response.status));
}
try { }
catch (err) {
    var error = err;
    if (axios_1.default.isAxiosError(error)) {
        if (((_e = error.response) === null || _e === void 0 ? void 0 : _e.status) === axios_1.HttpStatusCode.NotFound) {
            throw new Error('Room not found');
        }
        if (((_f = error.response) === null || _f === void 0 ? void 0 : _f.status) === axios_1.HttpStatusCode.BadRequest) {
            throw new Error('Invalid room ID');
        }
    }
    console.error("Error deleting room:", error);
    throw error;
}
exports.default = RoomService;
