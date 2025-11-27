import { ThemeContext, ThemeContextType } from '@/components/context/ThemeContext';

import { Colors } from '@/constants/Colors';
import { useContext } from 'react';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const { isDarkMode } = useContext<ThemeContextType>(ThemeContext);
  const theme = isDarkMode ? 'dark' : 'light';
  return props[theme] ?? Colors[theme][colorName];
}