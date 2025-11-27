import { Text as DefaultText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/components/useThemeColor';

export type ThemedTextProps = RNTextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: ThemedTextProps) {
    const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

    return (
        <DefaultText
            style={[
                { color },
                styles.text,
                type === 'default' ? styles.default : undefined,
                type === 'title' ? styles.title : undefined,
                type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
                type === 'subtitle' ? styles.subtitle : undefined,
                type === 'link' ? styles.link : undefined,
                style,
            ]}
            {...rest}
        />
    );
}

const styles = StyleSheet.create({
    text: { fontFamily: 'Montserrat' },
    default: { fontSize: 16, lineHeight: 24 },
    defaultSemiBold: { fontSize: 16, lineHeight: 24, fontWeight: '600' },
    title: { fontSize: 32, fontWeight: '600', lineHeight: 32 },
    subtitle: { fontSize: 20, fontWeight: 'bold' },
    link: { fontSize: 16, lineHeight: 30, color: '#0a7ea4' },
});