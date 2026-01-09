import React from 'react';
import {
    Pressable,
    Text,
    View,
    StyleSheet,
} from 'react-native';
import { IObject, IObjectType, IObjectField } from '@/models/interfaces';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    item: IObject;
    objectType: IObjectType;
    onPress: (object: IObject) => void;
    showDelete?: boolean;
    onDelete?: (id: string) => void;
}

export default function ObjectListItem({
                                           item,
                                           objectType,
                                           onPress,
                                           showDelete = false,
                                           onDelete,
                                       }: Props) {

    /** sichtbare Card-Felder */
    const cardFields: IObjectField[] = objectType.schema
        .filter(f => f.card?.visible)
        .sort((a, b) => a.card.order - b.card.order);

    /** Image Field (optional) */
    const imageField = cardFields.find(f => f.type === 'image');
    const imageUrl = imageField
        ? item.attributes?.[imageField.key]
        : undefined;

    /** Fallback Initial (z. B. Lehrer: Nachname) */
    const fallbackText =
        item.attributes?.last_name?.[0] ??
        item.attributes?.name?.[0] ??
        '?';

    return (
        <Pressable
            onPress={() => onPress(item)}
            style={({ pressed }) => [
                styles.container,
                pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={objectType.displayName}
        >
            {/* Avatar / Image */}
            <View
                style={[
                    styles.avatar,
                    { backgroundColor: objectType.color ?? '#a453ec' },
                ]}
            >
                <Text style={styles.avatarText}>
                    {fallbackText}
                </Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {cardFields.map(field =>
                    field.type !== 'image' ? (
                        <Text
                            key={field.key}
                            style={styles.fieldText}
                            numberOfLines={1}
                        >
                            {item.attributes?.[field.key]}
                        </Text>
                    ) : null
                )}
            </View>

            {/* Delete Button (optional) */}
            {showDelete && onDelete && (
                <Pressable
                    onPress={() => onDelete(item.id)}
                    hitSlop={10}
                >
                    <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#ff6b6b"
                    />
                </Pressable>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 14,
        backgroundColor: '#2d283e',
        marginBottom: 10,
    },
    pressed: {
        opacity: 0.75,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    avatarText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    content: {
        flex: 1,
        gap: 2,
    },
    fieldText: {
        color: '#fff',
        fontSize: 15,
    },
});
