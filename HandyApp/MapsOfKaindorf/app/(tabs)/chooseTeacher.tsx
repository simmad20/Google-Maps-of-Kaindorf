import { LanguageContext, LanguageContextType } from '@/components/context/LanguageContext';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import TeacherSelection from '@/components/TeacherSelection';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext } from 'react';

export default function ChooseTeacherScreen() {
    const { texts } = useContext<LanguageContextType>(LanguageContext);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: 'transparent', dark: 'transparent' }}
                headerImage={
                    <ThemedView style={styles.headerTextContainer}>
                        <ThemedText style={styles.headerTextOuter}>
                            <ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText>
                        </ThemedText>
                    </ThemedView>
                }
                headerHeight={80}
            >
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">{texts.selectText}</ThemedText>
                </ThemedView>
                <TeacherSelection />
            </ParallaxScrollView>
        </SafeAreaView>
    );
}

const HEADER_HEIGHT = 150;

const styles = StyleSheet.create({
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderRightColor: '#a453ec',
        borderLeftColor: '#a453ec',
        borderRightWidth: 3,
        borderLeftWidth: 3,
        borderBottomWidth: 3,
        borderBottomColor: '#a453ec',
    },
    headerTextOuter: {},
    headerText: {
        color: '#a453ec',
        fontSize: 24,
        fontFamily: 'Nice',
    },
    headerGear: { marginLeft: 20 },
    headerContainer: {
        width: '100%',
        height: HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: '100%',
        height: '100%'
    },
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
});