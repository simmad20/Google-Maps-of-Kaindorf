import {Text, type TextProps, StyleSheet} from 'react-native';

import {useThemeColor} from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
    lightColor?: string;
    darkColor?: string;
    type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
                               style,
                               lightColor,
                               darkColor,
                               type = 'default',
                               ...rest
                           }: ThemedTextProps) {
    const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');

    return (
        <Text
            style={[
                {color},
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
    text: {
        fontFamily: 'Montserrat',
        fontWeight: 'semibold'
    },
    default: {
        fontSize: 16,
        lineHeight: 24,
        fontFamily: 'Montserrat'
    },
    defaultSemiBold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
        fontFamily: 'Montserrat'
    },
    title: {
        fontSize: 32,
        fontWeight: 'semibold',
        lineHeight: 32,
        fontFamily: 'Montserrat'
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Montserrat'
    },
    link: {
        lineHeight: 30,
        fontSize: 16,
        color: '#0a7ea4',
        fontFamily: 'Montserrat'
    },
});
