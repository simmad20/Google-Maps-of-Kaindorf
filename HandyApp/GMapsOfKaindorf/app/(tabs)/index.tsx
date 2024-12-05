import {StyleSheet, Platform, Text} from 'react-native';
import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useContext} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";

export default function HomeScreen() {
    const {language, texts, switchLanguage} = useContext<LanguageContextType>(LanguageContext);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: '#2d283e', dark: '#2d283e'}} // Set background color of the header
            headerImage={(
                <ThemedView style={styles.headerTextContainer}>
                    <Text style={styles.headerText}>
                        Maps of Kaindorf
                    </Text>
                </ThemedView>
            )}
            headerHeight={70}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">{texts.greeting}</ThemedText>
                <HelloWave/>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 1: Try it</ThemedText>
                <ThemedText>
                    Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
                    Press{' '}
                    <ThemedText type="defaultSemiBold">
                        {Platform.select({ios: 'cmd + d', android: 'cmd + m'})}
                    </ThemedText>{' '}
                    to open developer tools.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 2: Explore</ThemedText>
                <ThemedText>
                    Tap the Explore tab to learn more about what's included in this starter app.
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
                <ThemedText>
                    When you're ready, run{' '}
                    <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
                    <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
                    <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
                    <ThemedText type="defaultSemiBold">app-example</ThemedText>.
                </ThemedText>
            </ThemedView>
        </ParallaxScrollView>
    );
}

const styles = StyleSheet.create({
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e', // Background color of the header
        height: 70, // Adjust as needed for header height
    },
    headerText: {
        color: '#a453ec', // Text color
        fontSize: 25, // Adjust the font size as needed
        fontFamily: 'Nice'
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
});