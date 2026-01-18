import React, { useContext } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { ObjectContext, ObjectContextType } from '@/components/context/ObjectContext';
import { useEvent } from '@/components/context/EventContext';

export default function ObjectTypeSelector() {
    const { types, selectedType, updateSelectedType } =
        useContext<ObjectContextType>(ObjectContext);

    const { activeEvent } = useEvent();
    const accent = activeEvent?.themeColor ?? '#7A3BDF';

    if (!types.length) return null;

    return (
        <View style={styles.container}>
            {types.map(type => {
                const isActive = selectedType?.id === type.id;

                return (
                    <Pressable
                        key={type.id}
                        onPress={() => updateSelectedType(type)}
                        style={[
                            styles.tab,
                            isActive && {
                                backgroundColor: accent,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                isActive && { color: '#fff' },
                            ]}
                            numberOfLines={1}
                        >
                            {type.displayName}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: 4,
        backgroundColor: '#f1f3f5',
        borderRadius: 12,
        marginHorizontal: 12,
        marginBottom: 12,
    },
    tab: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#444',
    },
});