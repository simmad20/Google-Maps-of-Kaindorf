import { createContext, useContext,useState } from "react";
import authService from "../services/AuthService";
import { IUser } from "../models/interfaces";

interface AuthContextType {
    user: IUser | null;
    isViewer: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<IUser | null>(() => authService.getUser());

    const isViewer: boolean = !!user &&
        user.roles?.includes('ADMIN_VIEWER') === true &&
        !user.roles?.includes('ADMIN') &&
        !user.roles?.includes('SUPER_ADMIN');

    const login = async (username: string, password: string) => {
       await authService.login(username, password);
        setUser(authService.getUser());
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isViewer,
                isAuthenticated: !!user,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}