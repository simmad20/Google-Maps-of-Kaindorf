import React, { ReactNode, createContext, useState } from 'react';

import { useColorScheme as useSystemColorScheme } from 'react-native';

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => null,
});

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const systemScheme = useSystemColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemScheme === 'dark');

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};