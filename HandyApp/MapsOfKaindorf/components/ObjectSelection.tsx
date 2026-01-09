import React, { useContext, useMemo, useState, useCallback } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
} from 'react-native';
import { ObjectContext, ObjectContextType } from '@/components/context/ObjectContext';
import { IObject } from '@/models/interfaces';
import SearchBar from './SearchBar';
import ObjectListItem from './ObjectListItem';
import { ThemedText } from '@/components/ThemedText';

interface ObjectSelectionProps {
    onSelect: (object: IObject) => void;
}

export default function ObjectSelection({ onSelect }: ObjectSelectionProps) {
    const { objects, selectedType } =
        useContext<ObjectContextType>(ObjectContext);

    if(typeof selectedType==="undefined"){
        return;
    }

    const [searchText, setSearchText] = useState('');

    const filteredAndSorted = useMemo(() => {
        if (!selectedType) return [];

        return objects
            .filter(o => o.typeId === selectedType.id)
            .filter(o => {
                const values = Object.values(o.attributes ?? {})
                    .join(' ')
                    .toLowerCase();

                return values.includes(searchText.toLowerCase());
            })
            .sort((a, b) => {
                const lastA = a.attributes?.last_name ?? '';
                const lastB = b.attributes?.last_name ?? '';

                if (lastA !== lastB) return lastA.localeCompare(lastB);

                return (a.attributes?.first_name ?? '')
                    .localeCompare(b.attributes?.first_name ?? '');
            });
    }, [objects, selectedType, searchText]);

    const renderItem = useCallback(
        ({ item }: { item: IObject }) => (
            <ObjectListItem
                item={item}
                objectType={selectedType}
                onPress={onSelect}
            />
        ),
        [onSelect, selectedType]
    );

    if (!selectedType) {
        return (
            <View style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                    Kein Objekttyp ausgewählt
                </ThemedText>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SearchBar
                value={searchText}
                onChangeText={setSearchText}
            />


            <FlatList
                data={filteredAndSorted}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>
                            Keine Einträge gefunden
                        </ThemedText>
                    </View>
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    list: {
        paddingBottom: 16,
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#aaa',
        fontSize: 14,
    },
});

