import React from 'react';
import Navbar from "./Navbar.tsx";
import {Outlet} from "react-router-dom";
import ObjectProvider from "../context/ObjectContext.tsx";
import {EventProvider} from "../context/EventContext.tsx";

function Layout() {
    return (
        <React.Fragment>
            <EventProvider>
                <ObjectProvider>
                    <Navbar/>
                    <Outlet/>
                    <footer className="w-full py-10 text-center text-gray-500 border-t">
                        <p>© 2025 Indoor Navigation Project — All rights reserved.</p>
                    </footer>
                </ObjectProvider>
            </EventProvider>
        </React.Fragment>
    );
}

export default Layout;