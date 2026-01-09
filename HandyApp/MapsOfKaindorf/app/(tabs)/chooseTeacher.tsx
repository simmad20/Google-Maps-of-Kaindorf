import {useContext} from "react";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";
import {IObject} from "@/models/interfaces";
import {SafeAreaView, StyleSheet} from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import ObjectSelection from "@/components/ObjectSelection";
import {ObjectContext, ObjectContextType} from "@/components/context/ObjectContext";

export default function ChooseTeacherScreen() {
    const {texts} = useContext<LanguageContextType>(LanguageContext);
    const {setSelectedObject} = useContext<ObjectContextType>(ObjectContext);

    const handleTeacherSelect = (object: IObject) => {
        console.log("Selected object:", object);
        // Navigation / State / Weiterverarbeitung
        setSelectedObject(object);
    };

    return (
        <SafeAreaView style={{flex: 1}}>
            <ParallaxScrollView
                headerBackgroundColor={{light: 'transparent', dark: 'transparent'}}
                headerHeight={80}
                headerImage={
                    <ThemedView style={styles.headerTextContainer}>
                        <ThemedText style={styles.headerText}>Maps of Kaindorf</ThemedText>
                    </ThemedView>
                }
            >
                <ThemedView style={styles.titleContainer}>
                    <ThemedText type="title">{texts.selectText}</ThemedText>
                </ThemedView>

                <ObjectSelection
                    onSelect={handleTeacherSelect}
                />
            </ParallaxScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderBottomWidth: 3,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: '#a453ec',
    },
    headerText: {
        color: '#a453ec',
        fontSize: 24,
        fontFamily: 'Nice',
    },
    titleContainer: {
        marginVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

