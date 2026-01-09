import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { IObject, IObjectType, IObjectField } from "@/models/interfaces";

interface IItem {
    item: IObject;
    objectType: IObjectType;
    handleClick: (object: IObject) => void;
    showDelete?: boolean;
}

const Item: React.FC<IItem> = ({ item, objectType, handleClick }) => {
    const cardFields: IObjectField[] = objectType.schema
        .filter((f) => f.card?.visible)
        .sort((a, b) => a.card.order - b.card.order);

    const imageField = cardFields.find((f) => f.type === "image");
    const imageUrl = imageField
        ? item.attributes[imageField.key]
        : undefined;

    return (
        <TouchableOpacity
            onPress={() => handleClick(item)}
            activeOpacity={0.7}
            style={styles.container}
        >
            {imageUrl && (
                <Image
                    source={{ uri: imageUrl }}
                    style={styles.image}
                    accessibilityLabel={`${objectType.displayName} image`}
                />
            )}

            <View style={styles.content}>
                {cardFields.map(
                    (field) =>
                        field.type !== "image" && (
                            <Text
                                key={field.key}
                                style={[
                                    styles.text,
                                    { color: objectType.color },
                                ]}
                            >
                                {item.attributes[field.key]}
                            </Text>
                        )
                )}
            </View>
        </TouchableOpacity>
    );
};

export default Item;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        padding: 16,
        borderRadius: 12,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 40,
        resizeMode: "cover",
    },
    content: {
        flex: 1,
        flexDirection: "column",
        gap: 4,
    },
    text: {
        fontSize: 14,
    },
});
