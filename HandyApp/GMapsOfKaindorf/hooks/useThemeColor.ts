/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import {useColorScheme} from 'react-native';

import {Colors} from '@/constants/Colors';
import {useContext} from "react";
import {ThemeContext, ThemeContextType} from "@/components/context/ThemeContext";

export function useThemeColor(
    props: { light?: string; dark?: string },
    colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
    const {isDarkMode} = useContext<ThemeContextType>(ThemeContext)
    const theme = isDarkMode ? 'dark' : 'light';
    const colorFromProps = props[theme];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return Colors[theme][colorName];
    }
}
