// screens/ChooseTeacherScreen.tsx
import {useContext} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";
import {IObject} from "@/models/interfaces";
import {SafeAreaView, StyleSheet, TouchableOpacity} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import ObjectSelection from "@/components/ObjectSelection";
import {ObjectContext, ObjectContextType} from "@/components/context/ObjectContext";
import {useEvent} from '@/components/context/EventContext';
import {useRouter} from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function ChooseTeacherScreen() {
    const {texts} = useContext<LanguageContextType>(LanguageContext);
    const {setSelectedObject} = useContext<ObjectContextType>(ObjectContext);
    const { activeEvent } = useEvent();
    const router = useRouter();

    const handleTeacherSelect = (object: IObject) => {
        console.log("Selected object:", object);
        setSelectedObject(object);
        router.push('/map');
    };

    const accent = activeEvent?.themeColor ?? '#7A3BDF';

    return (
        <SafeAreaView style={{flex: 1}}>
            <ParallaxScrollView
                headerBackgroundColor={{light: 'transparent', dark: 'transparent'}}
                headerHeight={100}
                headerImage={
                    <ThemedView style={[
                        styles.headerContainer,
                        { backgroundColor: accent }
                    ]}>
                        <ThemedView style={styles.headerContent}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                            >
                                <Icon name="arrow-left" size={20} color="#fff" />
                            </TouchableOpacity>
                            <ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => router.push('/settings')}
                            >
                                <Icon name="gear" size={20} color="#fff" />
                            </TouchableOpacity>
                        </ThemedView>
                    </ThemedView>
                }
            >
                <ThemedView style={styles.contentContainer}>
                    <ThemedView style={styles.titleContainer}>
                        <ThemedText type="title" style={styles.title}>
                            {texts.selectText || 'Lehrer auswählen'}
                        </ThemedText>
                        <ThemedText style={styles.subtitle}>
                            Wählen Sie ihr gewünschtes Suchobjekt für die Navigation
                        </ThemedText>
                    </ThemedView>

                    <ThemedView style={styles.selectionContainer}>
                        <ObjectSelection
                            onSelect={handleTeacherSelect}
                            accentColor={accent}
                        />
                    </ThemedView>
                </ThemedView>
            </ParallaxScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 20,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 40,
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        fontFamily: 'Nice',
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingsButton: {
        padding: 8,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
    },
    titleContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    title: {
        color: '#2d283e',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    selectionContainer: {
        flex: 1,
    },
});