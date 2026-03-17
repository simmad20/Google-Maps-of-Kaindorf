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
                        <p className="mb-2">© {new Date().getFullYear()} Indoor Navigation Project — All rights
                            reserved.</p>
                        <div className="flex justify-center gap-6">
                            <a href="/imprint" className="hover:stext-purple-600 transition">Imprint</a>
                            <a href="/policy" className="hover:text-purple-600 transition">Privacy Policy</a>
                        </div>
                    </footer>
                </ObjectProvider>
            </EventProvider>
        </React.Fragment>
    );
}

export default Layout;