import {StyleSheet, Platform, Text, Button} from 'react-native';
import {HelloWave} from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import {ThemedText} from '@/components/ThemedText';
import {ThemedView} from '@/components/ThemedView';
import {useContext, useEffect} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";

export default function HomeScreen() {
    const {language, oldTexts, switchLanguage} = useContext<LanguageContextType>(LanguageContext);

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
                <ThemedText type="title">{oldTexts.greeting}</ThemedText>
                <HelloWave/>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">{oldTexts.step1.title}</ThemedText>
                <ThemedText>
                    {oldTexts.step1.desc.normal1}
                    <ThemedText type="defaultSemiBold">{oldTexts.step1.desc.bold1}</ThemedText>
                    {oldTexts.step1.desc.normal2}
                    <ThemedText type="defaultSemiBold">{Platform.select({ios: 'cmd + d', android: 'cmd + m'})}</ThemedText>
                    {oldTexts.step1.desc.normal3}
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">{oldTexts.step2.title}</ThemedText>
                <ThemedText>
                    {oldTexts.step2.desc.normal1}
                </ThemedText>
            </ThemedView>
            <ThemedView style={styles.stepContainer}>
                <ThemedText type="subtitle">{oldTexts.step3.title}</ThemedText>
                <ThemedText>
                    {oldTexts.step3.desc.normal1}
                    <ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold1}</ThemedText>
                    {oldTexts.step3.desc.normal2}
                    <ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold2}</ThemedText>
                    {oldTexts.step3.desc.normal3}
                    <ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold3}</ThemedText>
                    {oldTexts.step3.desc.normal4}
                    <ThemedText type="defaultSemiBold">{oldTexts.step3.desc.bold4}</ThemedText>
                    {oldTexts.step3.desc.normal5}
                </ThemedText>
            </ThemedView>
            <Button title={oldTexts.otherLanguage} onPress={() => switchLanguage()}/>
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