import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View, Image} from 'react-native';
import Animated, {Easing, useSharedValue, withTiming, useAnimatedStyle} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import PropTypes from "prop-types";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

HandwrittenFont.propTypes = {
    text: PropTypes.string.isRequired,
    finishScreen: PropTypes.func
}

interface IHandwrittenFont {
    text: string
    finishScreen?: () => void
}

export default function HandwrittenFont({text, finishScreen}: IHandwrittenFont) {
    const [displayedText, setDisplayedText] = useState(''); // Text that is currently displayed

    const opacity = useSharedValue(0);

    useEffect(() => {
        if (finishScreen !== undefined && displayedText === text) {
            finishScreen();
        }
    });

    useEffect(() => {
        let currentText = '';
        text.split('').forEach((letter, index) => {
            setTimeout(() => {
                currentText += letter;
                setDisplayedText(currentText);
            }, index * 300);
        });

        opacity.value = withTiming(1, {
            duration: 2000,
            easing: Easing.ease,
        });

        // Hide the splash screen once the text is fully displayed
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, text.length * 300 + 500); // Adjust timing based on text length

    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.mapsOfContainer}>
                <Text style={styles.mapsOfText}>Maps</Text>
                <Text style={styles.mapsOfText}>of</Text>
                <Text style={styles.icon}><FontAwesome6 name="map-location" size={50} color="#a453ec"/></Text>
            </View>
            <View style={styles.handwrittenContainer}>
                <Animated.Text style={[styles.handwrittenText, animatedStyle]}>
                    {displayedText}
                </Animated.Text></View>
            <View style={styles.footerContainer}>
                <Text style={styles.madeByText}>made by</Text>
                <Image style={styles.roomgatorLogo}
                       source={require('../assets/images/roomgator-logo_cutted.png')}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2d283e'
    },
    handwrittenText: {
        fontSize: 35,
        fontFamily: 'Nice',
        color: 'white'
    },
    mapsOfContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapsOfText: {
        fontSize: 40,
        fontFamily: 'MontserratLight',
        color: '#a453ec'
    },
    handwrittenContainer: {
        flex: 2
    },
    icon: {
        marginTop: 10
    },
    footerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    madeByText:{
        fontSize: 16,
        color: 'white',
        marginRight: 30,
        fontFamily: 'MontserratLight',
    },
    roomgatorLogo: {
        height: 40,
        width: '30%'
    }
});
