import {PropsWithChildren, ReactElement, useContext} from 'react';
import {SafeAreaView, StyleSheet, useColorScheme, View} from 'react-native';
import Animated, {
    interpolate,
    useAnimatedRef,
    useAnimatedStyle,
    useScrollViewOffset,
} from 'react-native-reanimated';

import {ThemedView} from '@/components/ThemedView';
import {ThemeContext, ThemeContextType} from "@/components/context/ThemeContext";

type Props = PropsWithChildren<{
    headerImage: ReactElement;
    headerBackgroundColor: { dark: string; light: string };
    headerHeight?: number
}>;

export default function ParallaxScrollView({
                                               children,
                                               headerImage,
                                               headerBackgroundColor,
                                               headerHeight
                                           }: Props) {
    const {isDarkMode} = useContext<ThemeContextType>(ThemeContext)
    const scrollRef = useAnimatedRef<Animated.ScrollView>();
    const scrollOffset = useScrollViewOffset(scrollRef);
    const HEADER_HEIGHT = typeof headerHeight === "undefined" ? 150 : headerHeight;

    const headerAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateY: interpolate(
                        scrollOffset.value,
                        [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
                        [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
                    ),
                },
                {
                    scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });

    return (
        <SafeAreaView style={styles.safeContainer}>
            <ThemedView style={styles.container}>
                <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
                    <Animated.View
                        style={[
                            styles.header,
                            {
                                backgroundColor: headerBackgroundColor[isDarkMode ? "dark" : "light"],
                                height: HEADER_HEIGHT
                            },
                            headerAnimatedStyle,
                        ]}>
                        {headerImage}
                    </Animated.View>
                    <ThemedView style={styles.content}>{children}</ThemedView>
                </Animated.ScrollView>
            </ThemedView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeContainer: {
        flex: 1
    },
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: 'white'
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden'
    },
});
