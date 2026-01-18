import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from '@/components/context/EventContext';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
}

export default function SearchBar({ value, onChangeText, placeholder = "Lehrer suchen..." }: Props) {
    const { activeEvent } = useEvent();
    const themeColor = activeEvent?.themeColor || '#7A3BDF';

    return (
        <View style={[styles.container, { borderColor: themeColor + '40' }]}>
            <Ionicons name="search" size={18} color={themeColor} />

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                selectionColor={themeColor}
            />

            {value.length > 0 && (
                <Pressable
                    onPress={() => onChangeText('')}
                    style={({ pressed }) => [
                        styles.clearButton,
                        pressed && { opacity: 0.6 }
                    ]}
                >
                    <Ionicons name="close-circle" size={20} color="#999" />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginHorizontal: 16,
        marginBottom: 16,
        borderWidth: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    input: {
        flex: 1,
        color: '#333',
        marginHorizontal: 12,
        fontSize: 16,
        paddingVertical: 2,
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
    },
});