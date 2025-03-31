"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var Navbar_tsx_1 = require("./Navbar.tsx");
var TeacherContext_tsx_1 = require("../context/TeacherContext.tsx");
var react_router_dom_1 = require("react-router-dom");
function Layout() {
    return (<react_1.default.Fragment>
                <TeacherContext_tsx_1.default>
                    <Navbar_tsx_1.default />
                    <react_router_dom_1.Outlet />
                </TeacherContext_tsx_1.default>
        </react_1.default.Fragment>);
}
exports.default = Layout;
