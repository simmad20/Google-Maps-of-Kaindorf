import {Image, Platform, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {Picker} from '@react-native-picker/picker';
import {ThemedView} from "@/components/ThemedView";
import {ThemedText} from "@/components/ThemedText";
import {LanguageContext, LanguageContextType} from "@/components/context/LanguageContext";

export function setFeedback(feedback : typeof Feedback){

}

export default function Feedback() {
    const {language, texts, switchLanguage} = useContext<LanguageContextType>(LanguageContext);
    const [show, setShow] = useState(true);

    useEffect(() => {}, [show]);

    if(show){
        return (
            <ThemedView>
                <ThemedText style={styles.text}>{texts.feedback}</ThemedText>
                <ThemedText style={styles.emoji}>
                    <Text onPress={() => setFeedback('GOOD')}>😊</Text>
                    <Text onPress={() => setFeedback('MID')}>😑</Text>
                    <Text onPress={() => setFeedback('BAD')}>☹️️</Text>
                </ThemedText>
            </ThemedView>
        );
    }else{
        return(
            <></>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3
    },
    emoji:{
        fontSize:40,
        lineHeight:50,
        textAlign:"center"
    },
    text:{
        textAlign:"center"
    }
});
