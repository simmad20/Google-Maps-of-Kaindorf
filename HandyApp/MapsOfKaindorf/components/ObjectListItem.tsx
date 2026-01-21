import React from 'react';
import {
    Pressable,
    View,
    StyleSheet,
    Animated
} from 'react-native';
import { Image } from 'expo-image';
import {IObject, IObjectType, IObjectField} from '@/models/interfaces';
import {Ionicons} from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    item: IObject;
    objectType: IObjectType;
    onPress: (object: IObject) => void;
    accentColor?: string;
    index?: number;
    isDarkMode?: boolean;
}

export default function ObjectListItem({
                                           item,
                                           objectType,
                                           onPress,
                                           accentColor = '#7A3BDF',
                                           index = 0,
                                           isDarkMode = false
                                       }: Props) {
    const cardFields: IObjectField[] = objectType.schema
        .filter((f: IObjectField) => f.card?.visible)
        .sort((a: IObjectField, b: IObjectField) => a.card.order - b.card.order);

    const imageField = cardFields.find(f => f.type === "image");
    const imageUrl = imageField
        ? item.attributes[imageField.key]
        : undefined;

    const nameField = cardFields.find(f =>
        f.type !== 'image' &&
        (f.key.includes('name') || f.key.includes('firstname') || f.key.includes('lastname'))
    ) || cardFields.find(f => f.type !== 'image');

    const subtitleField = cardFields.find(f =>
        f.type !== 'image' &&
        f !== nameField &&
        (f.key.includes('room') || f.key.includes('subject') || f.key.includes('title'))
    );

    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    // Theme-basierte Farben
    const themeColors = {
        cardBackground: isDarkMode ? '#1e293b' : '#ffffff',
        textPrimary: isDarkMode ? '#f1f5f9' : '#1e293b',
        textSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
        pressedBackground: isDarkMode ? '#334155' : '#f8fafc',
        border: isDarkMode ? '#475569' : '#e2e8f0',
    };

    const getColorWithAlpha = (color: string, alpha: number) => {
        const alphaValue = isDarkMode ? Math.min(alpha + 0.1, 0.9) : alpha;
        return `${color}${Math.floor(alphaValue * 255).toString(16).padStart(2, '0')}`;
    };

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.97,
            useNativeDriver: true,
            tension: 150,
            friction: 3,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 150,
            friction: 3,
        }).start();
    };

    return (
        <Animated.View style={[
            styles.container,
            {
                transform: [{ scale: scaleAnim }],
                opacity: 0.9 + (index % 10) * 0.01,
                backgroundColor: themeColors.cardBackground,
                shadowColor: isDarkMode ? '#000000' : '#000',
                shadowOpacity: isDarkMode ? 0.2 : 0.08,
            }
        ]}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={() => onPress(item)}
                style={({pressed}) => [
                    styles.pressableContent,
                    pressed && [styles.pressed, { backgroundColor: themeColors.pressedBackground }]
                ]}
                accessibilityRole="button"
            >
                {/* Avatar with Gradient */}
                <View style={styles.avatarContainer}>
                    <LinearGradient
                        colors={[
                            getColorWithAlpha(accentColor, 0.4),
                            getColorWithAlpha(accentColor, 0.2)
                        ]}
                        style={[styles.avatarGradient, { borderColor: themeColors.cardBackground }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        {imageUrl ? (
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.avatarImage}
                                placeholder={require('@/assets/images/avatar_image_placeholder.jpeg')}
                                contentFit="cover"
                                transition={300}
                            />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={24} color={accentColor} />
                            </View>
                        )}
                    </LinearGradient>
                    <View style={[styles.onlineIndicator, {
                        backgroundColor: accentColor,
                        borderColor: themeColors.cardBackground
                    }]} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                    {nameField && (
                        <ThemedText style={[styles.nameText, { color: themeColors.textPrimary }]} numberOfLines={1}>
                            {item.attributes?.[nameField.key]}
                        </ThemedText>
                    )}

                    {subtitleField && item.attributes?.[subtitleField.key] && (
                        <ThemedText style={[styles.subtitleText, { color: themeColors.textSecondary }]} numberOfLines={1}>
                            {item.attributes[subtitleField.key]}
                        </ThemedText>
                    )}

                    {/* Tags */}
                    <View style={styles.tagsContainer}>
                        {cardFields
                            .filter(f => f.type !== 'image' && f !== nameField && f !== subtitleField)
                            .slice(0, 3)
                            .map(field => (
                                <View
                                    key={field.key}
                                    style={[styles.tag, { backgroundColor: getColorWithAlpha(accentColor, 0.1) }]}
                                >
                                    <ThemedText style={[styles.tagText, { color: accentColor }]}>
                                        {item.attributes?.[field.key]}
                                    </ThemedText>
                                </View>
                            ))
                        }
                    </View>
                </View>

                {/* Arrow */}
                <View style={styles.arrowContainer}>
                    <LinearGradient
                        colors={[
                            getColorWithAlpha(accentColor, 0.3),
                            getColorWithAlpha(accentColor, 0.1)
                        ]}
                        style={[styles.arrowBackground, { borderColor: themeColors.border }]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Ionicons name="chevron-forward" size={18} color={accentColor} />
                    </LinearGradient>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 12,
        borderRadius: 20,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        elevation: 6,
    },
    pressableContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
    },
    pressed: {
        borderRadius: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginRight: 16,
    },
    avatarGradient: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
    },
    content: {
        flex: 1,
        gap: 6,
    },
    nameText: {
        fontSize: 17,
        fontWeight: '700',
    },
    subtitleText: {
        fontSize: 14,
        fontWeight: '500',
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    tag: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tagText: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.3,
    },
    arrowContainer: {
        marginLeft: 12,
    },
    arrowBackground: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
});