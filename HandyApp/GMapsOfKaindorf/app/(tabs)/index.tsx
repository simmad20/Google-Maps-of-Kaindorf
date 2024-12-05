import {StyleSheet, Platform, Text, Button, Pressable} from 'react-native';
import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useContext, useEffect} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
    const {language, texts, switchLanguage} = useContext<LanguageContextType>(LanguageContext);

    return (
        <ParallaxScrollView
            headerBackgroundColor={{light: 'transparent', dark: 'transparent'}} // Set background color of the header
            headerImage={(
                <ThemedView style={styles.headerTextContainer}>
                    <Text>
                        <Text style={styles.headerText}>Maps of Kaindorf</Text><Text style={styles.headerGear}><Icon
                        name="gear" size={30} color='#a453ec'/></Text>
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
                <ThemedText type="subtitle">{texts.desc}</ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">{texts.nav}</ThemedText>
            </ThemedView>
            <Pressable style={styles.switchLanguageButton}
                       onPress={() => switchLanguage()}><Text style={styles.buttonText}>{texts.otherLanguage}</Text></Pressable>
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
    headerGear: {
        marginLeft: 20
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
    switchLanguageButton: {
        backgroundColor: '#2d283e',
        padding: 15,
        width: 100,
        borderRadius: 7,
    },
    buttonText:{
        color: '#a453ec',
        fontSize: 17,
        fontWeight:'bold',
        textAlign: "center"
    }
});

