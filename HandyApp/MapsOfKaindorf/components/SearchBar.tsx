import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
}

export default function SearchBar({ value, onChangeText }: Props) {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={18} color="#888" />

            <TextInput
                style={styles.input}
                placeholder="Lehrer suchen..."
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
            />

            {value.length > 0 && (
                <Pressable onPress={() => onChangeText('')}>
                    <Ionicons name="close-circle" size={18} color="#888" />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1f1b2e',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    input: {
        flex: 1,
        color: '#fff',
        marginHorizontal: 8,
    },
});
