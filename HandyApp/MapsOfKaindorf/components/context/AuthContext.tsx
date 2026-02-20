import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../../services/AuthService';

interface AuthContextType {
    isLoggedIn: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    onJoinSuccess: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        AuthService.isLoggedIn().then(loggedIn => {
            setIsLoggedIn(loggedIn);
            setIsLoading(false);
        });
    }, []);

    const logout = async () => {
        await AuthService.logout();
        setIsLoggedIn(false);
    };

    const onJoinSuccess = () => setIsLoggedIn(true);

    return (
        <AuthContext.Provider value={{ isLoggedIn, isLoading, logout, onJoinSuccess }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);