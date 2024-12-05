import {StyleSheet, Platform, Text} from 'react-native';
import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useContext} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
    const {language, texts, switchLanguage} = useContext<LanguageContextType>(LanguageContext);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: 'transparent', dark: 'transparent'}} // Set background color of the header
            headerImage={(
                <ThemedView style={styles.headerTextContainer}>
                    <Text >
                        <Text style={styles.headerText}>Maps of Kaindorf</Text><Text><Icon name="gear" size={30} color='#a453ec'/></Text>
                    </Text>
                </ThemedView>
            )}
            headerHeight={80}
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
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderRightColor: '#a453ec',
        borderLeftColor: '#a453ec',
        borderRightWidth: 3,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderBottomColor: '#a453ec'
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