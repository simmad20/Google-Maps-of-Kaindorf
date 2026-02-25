import {createContext, useContext, useEffect, useState} from "react";
import authService from "../services/AuthService";
import {IAuthResponse, IUser} from "../models/interfaces";
import AuthService from "../services/AuthService";
import {API_URL} from "../config.ts";

interface AuthContextType {
    user: IUser | null;
    isViewer: boolean;
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({children}: { children: React.ReactNode }) {
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

    useEffect(() => {
        const refreshToken = AuthService.getRefreshToken();
        if (!refreshToken) return;

        fetch(`${API_URL}/auth/refresh`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({refreshToken})
        })
            .then(res => res.json())
            .then((data: IAuthResponse) => {
                AuthService.saveAuth(data);
                setUser(AuthService.getUser());
            })
            .catch(() => {
                AuthService.clearAuth();
                setUser(null);
            });
    }, []);

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