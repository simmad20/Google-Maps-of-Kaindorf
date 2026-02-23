import { useState } from "react";
import logo from "../assets/roomgator-logo_cutted.png";
import {Link, useNavigate} from "react-router-dom";
import { FaUsersGear } from "react-icons/fa6";
import {useAuth} from "../context/AuthContext.tsx";
import { IoLogOutOutline, IoLogInOutline } from 'react-icons/io5';

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/auth');
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
                                to="/map"
                                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                            >
                                My map
                            </Link>
                            <Link
                                to="/rooms"
                                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                            >
                                Manage rooms
                            </Link>
                            <Link
                                to="/types"
                                className="text-white hover:text-gray-200 px-3 py-2 rounded-md text-sm font-medium transition duration-150"
                            >
                                Object types
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:flex md:items-center gap-3">
                        {user && (
                            <button onClick={() => navigate('/tenant')} className="p-1 rounded-full text-white hover:text-gray-200 transition">
                                <FaUsersGear size={25} />
                            </button>
                        )}
                        {user ? (
                            <button onClick={handleLogout} title="Logout" className="p-1 rounded-full text-white hover:text-gray-200 transition">
                                <IoLogOutOutline size={25} />
                            </button>
                        ) : (
                            <button onClick={() => navigate('/auth')} title="Login" className="p-1 rounded-full text-white hover:text-gray-200 transition">
                                <IoLogInOutline size={25} />
                            </button>
                        )}
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
            <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bgDark bg-opacity-95">
                    <Link to="/map" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition"
                          onClick={() => setIsOpen(false)}>My map</Link>
                    <Link to="/rooms" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition"
                          onClick={() => setIsOpen(false)}>Manage rooms</Link>
                    <Link to="/types" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition"
                          onClick={() => setIsOpen(false)}>Object types</Link>

                    {/* Tenant + Logout im Mobile-Menü */}
                    {user && (
                        <button onClick={() => { navigate('/tenant'); setIsOpen(false); }}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition">
                            <FaUsersGear size={18} /> Tenant Settings
                        </button>
                    )}
                    {user ? (
                        <button onClick={() => { handleLogout(); setIsOpen(false); }}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition">
                            <IoLogOutOutline size={18} /> Logout
                        </button>
                    ) : (
                        <button onClick={() => { navigate('/auth'); setIsOpen(false); }}
                                className="flex items-center gap-2 w-full px-3 py-2 rounded-md text-base font-medium text-white hover:text-gray-200 hover:bg-gray-700 transition">
                            <IoLogInOutline size={18} /> Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;