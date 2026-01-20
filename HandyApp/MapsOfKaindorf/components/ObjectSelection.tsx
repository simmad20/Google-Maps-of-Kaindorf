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
import { ThemedView } from '@/components/ThemedView';
import { useEvent } from '@/components/context/EventContext';
import ObjectTypeSelector from "@/components/ObjectTypeSelector";

interface ObjectSelectionProps {
    onSelect: (object: IObject) => void;
    accentColor?: string;
}

export default function ObjectSelection({ onSelect, accentColor }: ObjectSelectionProps) {
    const { objects, selectedType, searchObjects } =
        useContext<ObjectContextType>(ObjectContext);
    const { activeEvent } = useEvent();

    // Falls accentColor nicht übergeben wurde, ThemeColor vom Event verwenden
    const themeColor = accentColor || activeEvent?.themeColor || '#7A3BDF';

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
                accentColor={themeColor}
            />
        ),
        [onSelect, selectedType, themeColor]
    );

    if (!selectedType) {
        return (
            <ThemedView style={styles.emptyContainer}>
                <ThemedText style={styles.emptyText}>
                    Kein Objekttyp ausgewählt
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <View style={styles.container}>
            <ObjectTypeSelector />

            <SearchBar
                value={searchText}
                placeholder={selectedType.name+" suchen..."}
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
                    <ThemedView style={styles.emptyContainer}>
                        <ThemedText style={styles.emptyText}>
                            Keine Einträge gefunden
                        </ThemedText>
                    </ThemedView>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 4,
        paddingBottom: 24,
        flex: 1,
    },
    list: {
        paddingBottom: 16,
        paddingTop: 8,
    },
    emptyContainer: {
        marginTop: 40,
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        marginHorizontal: 16,
    },
    emptyText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
    },
});