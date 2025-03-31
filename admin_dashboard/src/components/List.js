"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Item_tsx_1 = require("./Item.tsx");
var prop_types_1 = require("prop-types");
List.propTypes = {
    items: prop_types_1.default.array.isRequired,
    handleClick: prop_types_1.default.func.isRequired,
    showDelete: prop_types_1.default.bool.isRequired
};
function List(_a) {
    var items = _a.items, handleClick = _a.handleClick, showDelete = _a.showDelete;
    return (<div className="h-96 w-80 lg:w-64 lg:mt-16 lg:ms-3 overflow-y-scroll relative max-w-sm bg-white rounded-xl flex flex-col divide-y dark:divide-slate-200/5 border border-purple-700">
            {items.map(function (item) { return <Item_tsx_1.default key={item.id} item={item} handleClick={handleClick} showDelete={showDelete}/>; })}
        </div>);
}
exports.default = List;
