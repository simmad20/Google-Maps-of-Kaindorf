import React from 'react';
import Navbar from "./Navbar.tsx";
import Home from "./Home.tsx";

function Layout() {
    return (
        <React.Fragment>
            <Navbar/>
            <Home/>
        </React.Fragment>
    );
}

export default Layout;