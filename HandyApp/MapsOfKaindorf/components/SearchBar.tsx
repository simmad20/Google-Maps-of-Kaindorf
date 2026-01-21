import React from 'react';
import { View, TextInput, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvent } from '@/components/context/EventContext';
import { useTheme } from '@/app/hooks/useTheme';

interface Props {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    accentColor?: string;
    expanded?: boolean;
    onFocus?: () => void;
    onBlur?: () => void;
    isDarkMode?: boolean;
}

export default function SearchBar({
                                      value,
                                      onChangeText,
                                      placeholder = "Lehrer suchen...",
                                      accentColor,
                                      expanded = false,
                                      onFocus,
                                      onBlur,
                                      isDarkMode: propIsDarkMode
                                  }: Props) {
    const { activeEvent } = useEvent();
    const { isDarkMode: contextIsDarkMode } = useTheme();

    const isDarkMode = propIsDarkMode ?? contextIsDarkMode;
    const themeColor = accentColor || activeEvent?.themeColor || '#7A3BDF';

    // Theme-basierte Farben
    const themeColors = {
        background: isDarkMode ? '#1e293b' : '#ffffff',
        textPrimary: isDarkMode ? '#f1f5f9' : '#1e293b',
        textSecondary: isDarkMode ? '#94a3b8' : '#64748b',
        placeholder: isDarkMode ? '#64748b' : '#999',
        border: isDarkMode ? '#475569' : themeColor + '40',
        shadow: isDarkMode ? '#000000' : '#000',
    };

    const getColorWithAlpha = (color: string, alpha: number) => {
        const alphaValue = isDarkMode ? Math.min(alpha + 0.1, 0.9) : alpha;
        return `${color}${Math.floor(alphaValue * 255).toString(16).padStart(2, '0')}`;
    };

    const containerStyle = [
        styles.container,
        {
            backgroundColor: themeColors.background,
            borderColor: expanded ? themeColor : themeColors.border,
            shadowColor: themeColors.shadow,
            shadowOpacity: isDarkMode ? 0.2 : 0.05,
            elevation: isDarkMode ? 4 : 2,
        },
        expanded && styles.expandedContainer
    ];

    return (
        <View style={containerStyle}>
            <Ionicons
                name="search"
                size={18}
                color={expanded ? themeColor : themeColor}
                style={styles.searchIcon}
            />

            <TextInput
                style={[
                    styles.input,
                    {
                        color: themeColors.textPrimary,
                        backgroundColor: 'transparent'
                    }
                ]}
                placeholder={placeholder}
                placeholderTextColor={themeColors.placeholder}
                value={value}
                onChangeText={onChangeText}
                autoCorrect={false}
                autoCapitalize="none"
                selectionColor={getColorWithAlpha(themeColor, 0.3)}
                onFocus={onFocus}
                onBlur={onBlur}
                clearButtonMode="never"
                returnKeyType="search"
                enablesReturnKeyAutomatically={true}
            />

            {value.length > 0 && (
                <Pressable
                    onPress={() => onChangeText('')}
                    style={({ pressed }) => [
                        styles.clearButton,
                        pressed && styles.clearButtonPressed
                    ]}
                    hitSlop={8}
                >
                    <Ionicons
                        name="close-circle"
                        size={20}
                        color={isDarkMode ? '#94a3b8' : '#999'}
                    />
                </Pressable>
            )}

            {value.length === 0 && !expanded && (
                <View style={styles.hintContainer}>
                    <Ionicons
                        name="return-down-back"
                        size={14}
                        color={themeColors.textSecondary}
                    />
                    <View style={[styles.hintBadge, { backgroundColor: getColorWithAlpha(themeColor, 0.1) }]}>
                        <Ionicons
                            name="search-outline"
                            size={10}
                            color={themeColor}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        transitionProperty: 'border-color, shadow',
        transitionDuration: '200ms',
    },
    expandedContainer: {
        borderWidth: 2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        shadowOpacity: 0.1,
    },
    searchIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        marginHorizontal: 8,
        fontSize: 16,
        paddingVertical: 2,
        fontWeight: '500',
    },
    clearButton: {
        padding: 4,
        marginLeft: 4,
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    clearButtonPressed: {
        opacity: 0.7,
        transform: [{ scale: 0.9 }],
    },
    hintContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        opacity: 0.7,
    },
    hintBadge: {
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});