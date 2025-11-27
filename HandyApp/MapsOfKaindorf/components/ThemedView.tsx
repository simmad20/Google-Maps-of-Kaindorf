import { View as DefaultView, ViewProps as RNViewProps } from 'react-native';

import { useThemeColor } from '@/components/useThemeColor';

export type ThemedViewProps = RNViewProps & {
    lightColor?: string;
    darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

    return (
        <DefaultView
            style={[
                lightColor || darkColor ? { backgroundColor } : {},
                style
            ]}
            {...otherProps}
        />
    );
}