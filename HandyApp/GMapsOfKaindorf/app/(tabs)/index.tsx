import {StyleSheet, Platform, Text, Button, Pressable} from 'react-native';
import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useContext, useEffect} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";
import Icon from 'react-native-vector-icons/FontAwesome';
import {useRouter} from "expo-router";

export default function HomeScreen() {
    const {language, texts, switchLanguage} = useContext<LanguageContextType>(LanguageContext);
    const router = useRouter();

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: 'transparent', dark: 'transparent'}} // Set background color of the header
            headerImage={(
                <ThemedView style={styles.headerTextContainer}>
                    <ThemedText style={styles.headerTextOuter}>
                        <ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText>
                        <Pressable style={styles.headerGear} onPress={() => router.push('/settings')}><Icon
                            name="gear" size={25} color='#a453ec'/>
                        </Pressable>
                    </ThemedText>
                </ThemedView>
            )}
            headerHeight={80}
        >
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">{texts.greeting}</ThemedText>
                <HelloWave/>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="default">{texts.desc}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="default">{texts.nav}</ThemedText>
            </ThemedView>
            <Pressable style={styles.switchLanguageButton}
                       onPress={() => switchLanguage()}><ThemedText
                style={styles.buttonText}>{texts.otherLanguage}</ThemedText></Pressable>
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
    headerTextOuter: {},
    headerText: {
        color: '#a453ec', // Text color
        fontSize: 24, // Adjust the font size as needed
        fontFamily: 'Nice'
    },
    headerGear: {
        marginLeft: 20
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
        fontFamily: 'Montserrat'
    },
    switchLanguageButton: {
        backgroundColor: '#2d283e',
        padding: 5,
        width: 100,
        borderRadius: 7,
    },
    buttonText: {
        color: '#a453ec',
        fontSize: 14,
        textAlign: "center",
    }
});

