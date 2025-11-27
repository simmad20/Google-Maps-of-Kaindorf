import { ThemeContext, ThemeContextType } from '@/components/context/ThemeContext';

import { Colors } from '@/constants/Colors';
import { useContext } from 'react';

type Theme = 'light' | 'dark';

type ThemeProps = {
  light?: string;
  dark?: string;
};

export function useThemeColor(
  props: ThemeProps,
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
): string {
  const { isDarkMode } = useContext<ThemeContextType>(ThemeContext);
  const theme: Theme = isDarkMode ? 'dark' : 'light';

  if (!props) return Colors[theme][colorName];

  return props[theme] ?? Colors[theme][colorName];
}