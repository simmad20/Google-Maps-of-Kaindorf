import "./App.css";
import {Route, Routes} from "react-router-dom";

import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";

import MapManager from "./components/MapManager";
import RoomDetails from "./components/RoomDetails";
import RoomList from "./components/RoomList";

import ObjectTypesPage from "./pages/ObjectTypesPage";
import ObjectTypeCreateEditForm from "./pages/ObjectTypeCreateEditForm";

import TenantSettings from "./pages/TenantSettings";

import {AuthProvider} from "./context/AuthContext";
import VerifyEmail from "./pages/VerifyEmail.tsx";
import PublicOnlyRoute from "./components/PublicOnlyRoute.tsx";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    {/* Public */}
                    <Route index element={<Homepage/>}/>
                    <Route path="auth" element={
                        <PublicOnlyRoute>
                            <Login/>
                        </PublicOnlyRoute>
                    }/>
                    <Route path="register" element={
                        <PublicOnlyRoute>
                            <Login registering={true}/>
                        </PublicOnlyRoute>
                    }/>
                    <Route path="/verify-email" element={<VerifyEmail/>}/>

                    {/* ---------------- VIEW ROUTES ---------------- */}
                    {/* Viewer + Admin + SuperAdmin dürfen lesen */}

                    <Route
                        path="map"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN_VIEWER",
                                    "ADMIN",
                                    "SUPER_ADMIN",
                                ]}
                            >
                                <MapManager/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="rooms"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN_VIEWER",
                                    "ADMIN",
                                    "SUPER_ADMIN",
                                ]}
                            >
                                <RoomList/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="room/:id"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN_VIEWER",
                                    "ADMIN",
                                    "SUPER_ADMIN",
                                ]}
                            >
                                <RoomDetails/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="types"
                        element={
                            <ProtectedRoute
                                allowedRoles={[
                                    "ADMIN_VIEWER",
                                    "ADMIN",
                                    "SUPER_ADMIN",
                                ]}
                            >
                                <ObjectTypesPage/>
                            </ProtectedRoute>
                        }
                    />

                    {/* ---------------- EDIT ROUTES ---------------- */}
                    {/* Nur ADMIN + SUPER_ADMIN dürfen bearbeiten */}

                    <Route
                        path="createType"
                        element={
                            <ProtectedRoute
                                allowedRoles={["ADMIN", "SUPER_ADMIN"]}
                            >
                                <ObjectTypeCreateEditForm/>
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="tenant"
                        element={
                            <ProtectedRoute allowedRoles={["ADMIN_VIEWER", "ADMIN", "SUPER_ADMIN"]}>
                                <TenantSettings/>
                            </ProtectedRoute>
                        }
                    />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;