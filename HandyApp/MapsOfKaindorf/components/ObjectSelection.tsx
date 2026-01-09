import React, {useContext, useMemo, useState, useCallback, useEffect} from 'react';
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
    const { objects, selectedType, searchObjects } =
        useContext<ObjectContextType>(ObjectContext);

    if(typeof selectedType==="undefined"){
        return;
    }

    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        searchObjects(searchText);
    }, [selectedType, searchText]);

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
                data={objects}
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

