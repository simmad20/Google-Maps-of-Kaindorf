import React from 'react';
import Navbar from "./Navbar.tsx";
import TeacherProvider from "../context/ObjectContext.tsx";
import {Outlet} from "react-router-dom";
import ObjectProvider from "../context/ObjectContext.tsx";

function Layout() {
    return (
        <React.Fragment>
                <ObjectProvider>
                    <Navbar/>
                    <Outlet/>
                    <footer className="w-full py-10 text-center text-gray-500 border-t">
                        <p>© 2025 Indoor Navigation Project — All rights reserved.</p>
                    </footer>
                </ObjectProvider>
        </React.Fragment>
    );
}

export default Layout;