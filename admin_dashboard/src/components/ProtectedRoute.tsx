import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface IProtectedRoute {
    children: JSX.Element;
    allowedRoles?: string[];
}

export default function ProtectedRoute({
                                           children,
                                           allowedRoles,
                                       }: IProtectedRoute) {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/auth" replace />;
    }

    if (allowedRoles && user) {
        const hasRole = user.roles.some((r: string) =>
            allowedRoles.includes(r)
        );

        if (!hasRole) {
            return <Navigate to="/" replace />;
        }
    }

    return children;
}