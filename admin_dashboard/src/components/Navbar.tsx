import React, {useState} from "react";
import logo from "../assets/roomgator-logo_cutted.png";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <React.Fragment>
            <div className="flex flex-wrap w-full navbar kanit-regular">
                <section className="relative mx-auto">
                    <nav className="flex justify-between w-screen bgDark">
                        <div className="px-5 xl:px-12 py-6 flex w-full items-center">
                            <a className="text-3xl font-bold font-heading" href="#">
                                <img src={logo} width="140px"/>
                            </a>
                            <ul className="hidden md:flex px-4 mx-auto space-x-12">
                                <li><a className="hover:text-gray-200" href="#">Indoor map</a></li>
                                <li><a className="hover:text-gray-200" href="#">List</a></li>
                                <li><a className="hover:text-gray-200" href="#">Contact Us</a></li>
                            </ul>
                            <div className="hidden xl:flex items-center space-x-5 items-center">
                                <a className="hover:text-gray-200" href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                         viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                                    </svg>
                                </a>
                                <a className="flex items-center hover:text-gray-200" href="#">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200"
                                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div className="xl:hidden flex items-center mr-6">
                            <button onClick={toggleMenu} className="navbar-burger self-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:text-gray-200"
                                     fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                          d="M4 6h16M4 12h16M4 18h16"/>
                                </svg>
                            </button>
                        </div>
                    </nav>
                    {isOpen && (
                        <div className="w-full text-center p-4 xl:hidden bgDark">
                            <ul className="space-y-4">
                                <li><a href="#" className="hover:text-gray-200">Indoor map</a></li>
                                <li><a href="#" className="hover:text-gray-200">List</a></li>
                                <li><a href="#" className="hover:text-gray-200">Contact Us</a></li>
                            </ul>
                        </div>
                    )}
                </section>
            </div>

        </React.Fragment>
    );
}

export default Navbar;
