import React from 'react';
import {
    Pressable,
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { Image } from 'expo-image';
import {IObject, IObjectType, IObjectField} from '@/models/interfaces';
import {Ionicons} from '@expo/vector-icons';

interface Props {
    item: IObject;
    objectType: IObjectType;
    onPress: (object: IObject) => void;
    accentColor?: string;
}

export default function ObjectListItem({
                                           item,
                                           objectType,
                                           onPress,
                                           accentColor = '#7A3BDF',
                                       }: Props) {

    const cardFields: IObjectField[] = objectType.schema
        .filter((f: IObjectField) => f.card?.visible)
        .sort((a: IObjectField, b: IObjectField) => a.card.order - b.card.order);

    const imageField = cardFields.find(f => f.type === "image");
    const imageUrl = imageField
        ? item.attributes[imageField.key]
        : undefined;

    // Finde das Hauptanzeigefeld (normalerweise Name)
    const nameField = cardFields.find(f =>
        f.type !== 'image' &&
        (f.key.includes('name') || f.key.includes('firstname') || f.key.includes('lastname'))
    ) || cardFields.find(f => f.type !== 'image');

    // Finde das Subtitle-Feld
    const subtitleField = cardFields.find(f =>
        f.type !== 'image' &&
        f !== nameField &&
        (f.key.includes('room') || f.key.includes('subject') || f.key.includes('title'))
    );

    return (
        <Pressable
            onPress={() => onPress(item)}
            style={({pressed}) => [
                styles.container,
                pressed && styles.pressed,
                { borderLeftColor: accentColor }
            ]}
            accessibilityRole="button"
            accessibilityLabel={objectType.displayName}
        >
            <View
                style={[
                    styles.avatar,
                    {backgroundColor: accentColor},
                ]}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.avatarImage}
                    placeholder={require('@/assets/images/avatar_image_placeholder.jpeg')}
                    contentFit="cover"
                    transition={300}
                />
                <View style={[styles.avatarBadge, { backgroundColor: accentColor }]}>
                    <Ionicons name="person" size={12} color="#fff" />
                </View>
            </View>

            <View style={styles.content}>
                {nameField && (
                    <Text
                        style={styles.nameText}
                        numberOfLines={1}
                    >
                        {item.attributes?.[nameField.key]}
                    </Text>
                )}

                {subtitleField && item.attributes?.[subtitleField.key] && (
                    <Text
                        style={styles.subtitleText}
                        numberOfLines={1}
                    >
                        {item.attributes[subtitleField.key]}
                    </Text>
                )}

                {/* Restliche Felder als Tags */}
                <View style={styles.tagsContainer}>
                    {cardFields
                        .filter(f => f.type !== 'image' && f !== nameField && f !== subtitleField)
                        .slice(0, 2) // Nur max 2 Tags anzeigen
                        .map(field => (
                            <View
                                key={field.key}
                                style={[styles.tag, { backgroundColor: accentColor + '20' }]}
                            >
                                <Text style={[styles.tagText, { color: accentColor }]}>
                                    {item.attributes?.[field.key]}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>

            <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color={accentColor} />
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 12,
        marginHorizontal: 12,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    pressed: {
        transform: [{ scale: 0.98 }],
        backgroundColor: '#f8f9fa',
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 2,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 20,
        height: 20,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    content: {
        flex: 1,
        gap: 4,
    },
    nameText: {
        color: '#2d283e',
        fontSize: 16,
        fontWeight: '600',
    },
    subtitleText: {
        color: '#666',
        fontSize: 14,
    },
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 4,
    },
    tag: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    tagText: {
        fontSize: 11,
        fontWeight: '500',
    },
    arrowContainer: {
        marginLeft: 8,
    },
});