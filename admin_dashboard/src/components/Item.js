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
var react_dnd_1 = require("react-dnd");
var prop_types_1 = require("prop-types");
var fa_1 = require("react-icons/fa");
var react_1 = require("react");
var TeacherContext_tsx_1 = require("../context/TeacherContext.tsx");
Item.propTypes = {
    item: prop_types_1.default.object.isRequired,
    handleClick: prop_types_1.default.func.isRequired,
    showDelete: prop_types_1.default.bool
};
function Item(_a) {
    var _this = this;
    var item = _a.item, handleClick = _a.handleClick, _b = _a.showDelete, showDelete = _b === void 0 ? false : _b;
    var handleDelete = (0, react_1.useContext)(TeacherContext_tsx_1.TeacherContext).handleDelete;
    var _c = (0, react_dnd_1.useDrag)(function () { return ({
        type: "ITEM",
        item: { id: item.id, label: item.abbreviation, img_url: item.image_url },
        collect: function (monitor) { return ({
            isDragging: monitor.isDragging(),
        }); },
    }); }, [item.id]), isDragging = _c[0].isDragging, drag = _c[1];
    var deleteItem = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.stopPropagation();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, handleDelete(item.id)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Fehler beim Löschen:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (<div onClick={function () { return handleClick(item); }} ref={drag} className={"flex items-center gap-4 p-4 ".concat(isDragging ? "opacity-50" : "hover:bg-gray-100")} style={{ cursor: "move" }}>
            <img className="w-20 h-20 rounded-full object-cover" src={item.image_url} alt={"".concat(item.abbreviation, " profile")}/>
            <div className="flex-1 flex flex-col">
                <div className="font-bold">{item.abbreviation}</div>
                <div className="text-gray-600">
                    {item.title && "".concat(item.title, " ")}
                    {item.firstname} {item.lastname}
                </div>
            </div>

            {showDelete && (<button onClick={deleteItem} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full" aria-label="Lehrer löschen">
                    <fa_1.FaTrash size={16}/>
                </button>)}
        </div>);
}
exports.default = Item;
