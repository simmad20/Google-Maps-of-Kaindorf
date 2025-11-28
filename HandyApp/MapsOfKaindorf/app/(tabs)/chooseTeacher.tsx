import { Image, StyleSheet, View } from 'react-native';
import { LanguageContext, LanguageContextType } from '@/components/context/LanguageContext';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { SafeAreaView } from 'react-native-safe-area-context';
import TeacherSelection from '@/components/TeacherSelection';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useContext } from 'react';

const logo = require('@/assets/images/logo.png');

export default function ChooseTeacherScreen() {
    const { texts } = useContext<LanguageContextType>(LanguageContext);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ParallaxScrollView
                headerBackgroundColor={{ light: '#ffffff', dark: '#2d2929ff' }}
                headerImage={
                    <View style={styles.headerContainer}>
                        <Image source={logo} style={styles.logo} resizeMode="cover" />
                    </View>
                }
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