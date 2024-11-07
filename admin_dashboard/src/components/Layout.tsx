import React from 'react';
import Navbar from "./Navbar.tsx";
import Homepage from "./Homepage.tsx";

function Layout() {
    return (
        <React.Fragment>
            <Navbar/>
            <Homepage/>
        </React.Fragment>
    );
}

export default Layout;