import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

interface IPublicOnlyRoute {
    children: React.ReactNode;
}

export default function PublicOnlyRoute({ children }: IPublicOnlyRoute) {
    const { user } = useAuth();

    if (user) {
        return <Navigate to="/map" replace />;
    }

    return <>{children}</>;
}