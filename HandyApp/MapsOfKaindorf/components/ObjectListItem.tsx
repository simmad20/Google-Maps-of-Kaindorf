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
}

export default function ObjectListItem({
                                           item,
                                           objectType,
                                           onPress,
                                       }: Props) {

    const cardFields: IObjectField[] = objectType.schema
        .filter((f: IObjectField) => f.card?.visible)
        .sort((a: IObjectField, b: IObjectField) => a.card.order - b.card.order);


    const imageField = cardFields.find(f => f.type === "image");
    const imageUrl = imageField
        ? item.attributes[imageField.key]
        : undefined;


    return (
        <Pressable
            onPress={() => onPress(item)}
            style={({pressed}) => [
                styles.container,
                pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={objectType.displayName}
        >
            <View
                style={[
                    styles.avatar,
                    {backgroundColor: objectType.color ?? '#a453ec'},
                ]}
            >
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.avatarImage}
                    placeholder={require('@/assets/images/avatar_image_placeholder.jpeg')}
                    contentFit="cover"
                    transition={300}
                />
            </View>

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
        overflow: 'hidden'
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
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
