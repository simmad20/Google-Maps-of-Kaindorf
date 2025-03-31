"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
var react_router_dom_1 = require("react-router-dom");
var Layout_tsx_1 = require("./components/Layout.tsx");
var Homepage_tsx_1 = require("./components/Homepage.tsx");
var RoomDetails_tsx_1 = require("./components/RoomDetails.tsx");
var RoomList_tsx_1 = require("./components/RoomList.tsx");
function App() {
    return (<>
            <react_router_dom_1.Routes>
                <react_router_dom_1.Route path="/" element={<Layout_tsx_1.default />}>
                    <react_router_dom_1.Route index element={<Homepage_tsx_1.default />}/>
                    <react_router_dom_1.Route path="/room/:id" element={<RoomDetails_tsx_1.default />}/>
                    <react_router_dom_1.Route path="/rooms" element={<RoomList_tsx_1.default />}/>
                </react_router_dom_1.Route>
            </react_router_dom_1.Routes>
        </>);
}
exports.default = App;
