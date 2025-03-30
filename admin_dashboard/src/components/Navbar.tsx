import { useState } from "react";
import logo from "../assets/roomgator-logo_cutted.png";
import { Link } from "react-router-dom";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="bgDark w-full shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Logo und Hauptlinks */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <img src={logo} alt="Roomgator Logo" className="h-10" />
                        </Link>
                        <div className="hidden md:ml-6 md:flex md:items-center md:space-x-8">
                            <Link
                                to="/"
                                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                            >
                                Indoor map
                            </Link>
                            <Link
                                to="/rooms"
                                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                            >
                                Manage rooms
                            </Link>
                        </div>
                    </div>

                    {/* User Icon (Desktop) */}
                    <div className="hidden md:flex md:items-center">
                        <button className="p-1 rounded-full text-white hover:text-gray-200 focus:outline-none transition duration-150">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-gray-200 focus:outline-none transition duration-150"
                            aria-expanded="false"
                        >
                            <span className="sr-only">Open main menu</span>
                            {/* Hamburger icon */}
                            <svg
                                className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                            {/* Close icon */}
                            <svg
                                className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`}
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden transition-all duration-300 ease-in-out`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bgDark bg-opacity-95">
                    <Link
                        to="/"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition duration-150"
                        onClick={() => setIsOpen(false)}
                    >
                        Indoor map
                    </Link>
                    <Link
                        to="/rooms"
                        className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition duration-150"
                        onClick={() => setIsOpen(false)}
                    >
                        Manage rooms
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;