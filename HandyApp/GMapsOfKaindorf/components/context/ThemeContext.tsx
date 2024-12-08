import React, {createContext, useState, useContext, ReactNode} from 'react';
import {useColorScheme} from "@/hooks/useColorScheme";

export interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
    isDarkMode: false,
    toggleTheme: () => null
});

export const ThemeProvider = ({children}: { children: ReactNode }) => {
    const scheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(scheme === "dark");

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{isDarkMode, toggleTheme}}>
            {children}
        </ThemeContext.Provider>
    );
};
