import React from 'react';
import Navbar from "./Navbar.tsx";
import TeacherProvider from "../context/TeacherContext.tsx";
import {Outlet} from "react-router-dom";

function Layout() {
    return (
        <React.Fragment>
                <TeacherProvider>
                    <Navbar/>
                    <Outlet/>
                </TeacherProvider>
        </React.Fragment>
    );
}

export default Layout;