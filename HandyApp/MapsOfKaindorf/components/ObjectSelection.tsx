import React, {useContext, useCallback, useEffect, useState} from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    Animated,
    Platform
} from 'react-native';
import { ObjectContext, ObjectContextType } from '@/components/context/ObjectContext';
import { IObject } from '@/models/interfaces';
import SearchBar from './SearchBar';
import ObjectListItem from './ObjectListItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEvent } from '@/components/context/EventContext';
import ObjectTypeSelector from "@/components/ObjectTypeSelector";
import Icon from 'react-native-vector-icons/FontAwesome';
import { useTheme } from '@/app/hooks/useTheme';

interface ObjectSelectionProps {
    onSelect: (object: IObject) => void;
    accentColor?: string;
}

export default function ObjectSelection({ onSelect, accentColor }: ObjectSelectionProps) {
    const { objects, selectedType, searchObjects } =
        useContext<ObjectContextType>(ObjectContext);
    const { activeEvent } = useEvent();
    const { isDarkMode } = useTheme();
    const [searchText, setSearchText] = useState('');
    const [scrollY] = useState(new Animated.Value(0));
    const [searchExpanded, setSearchExpanded] = useState(false);

    const themeColor = accentColor || activeEvent?.themeColor || '#7A3BDF';

    // Theme-basierte Farben
    const themeColors = {
        background: isDarkMode ? '#0f172a' : '#f8fafc',
        cardBackground: isDarkMode ? '#1e293b' : '#ffffff',
        textPrimary: isDarkMode ? '#f1f5f9' : '#1e293b',
        textSecondary: isDarkMode ? '#cbd5e1' : '#64748b',
        border: isDarkMode ? '#334155' : '#e2e8f0',
        gradientStart: isDarkMode ? '#0f172a' : '#f8fafc',
        gradientEnd: isDarkMode ? '#1e293b' : '#f8fafc',
    };

    const getColorWithAlpha = (color: string, alpha: number) => {
        const alphaValue = isDarkMode ? Math.min(alpha + 0.1, 0.9) : alpha;
        return `${color}${Math.floor(alphaValue * 255).toString(16).padStart(2, '0')}`;
    };

    useEffect(() => {
        searchObjects(searchText);
    }, [selectedType, searchText]);

    const renderItem = useCallback(
        ({ item, index }: { item: IObject; index: number }) => (
            <ObjectListItem
                item={item}
                objectType={selectedType}
                onPress={onSelect}
                accentColor={themeColor}
                index={index}
                isDarkMode={isDarkMode}
            />
        ),
        [onSelect, selectedType, themeColor, isDarkMode]
    );

    const headerOpacity = scrollY.interpolate({
        inputRange: [0, 50, 100],
        outputRange: [1, 0.5, 0],
        extrapolate: 'clamp',
    });

    if (!selectedType) {
        return (
            <ThemedView style={[styles.emptyContainer, { backgroundColor: themeColors.background }]}>
                <View style={[styles.emptyIcon, {
                    backgroundColor: getColorWithAlpha(themeColor, 0.15),
                    borderColor: themeColors.border
                }]}>
                    <Icon name="search" size={32} color={themeColor} />
                </View>
                <ThemedText style={[styles.emptyTitle, { color: themeColors.textPrimary }]}>
                    Kein Objekttyp ausgewählt
                </ThemedText>
                <ThemedText style={[styles.emptyText, { color: themeColors.textSecondary }]}>
                    Wähle zuerst eine Kategorie aus
                </ThemedText>
            </ThemedView>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            {/* Sticky Header */}
            <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
                    <ObjectTypeSelector accentColor={themeColor} />
            </Animated.View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <SearchBar
                    value={searchText}
                    placeholder={`${selectedType.name} suchen...`}
                    onChangeText={setSearchText}
                    accentColor={themeColor}
                    expanded={searchExpanded}
                    onFocus={() => setSearchExpanded(true)}
                    onBlur={() => setSearchExpanded(false)}
                    isDarkMode={isDarkMode}
                />
            </View>

            {/* Results Count */}
            {searchText.length > 0 && (
                <ThemedView style={[styles.resultsInfo, {
                    backgroundColor: themeColors.cardBackground,
                    borderColor: themeColors.border
                }]}>
                    <ThemedText style={[styles.resultsText, { color: themeColors.textSecondary }]}>
                        {objects.length} {objects.length === 1 ? 'Ergebnis' : 'Ergebnisse'} für "{searchText}"
                    </ThemedText>
                </ThemedView>
            )}

            {/* Object List */}
            <FlatList
                data={objects}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                ListEmptyComponent={
                    <ThemedView style={[styles.emptyListContainer, {
                        backgroundColor: themeColors.cardBackground,
                        borderColor: themeColors.border
                    }]}>
                        <View style={[styles.emptyListIcon, { backgroundColor: getColorWithAlpha(themeColor, 0.1) }]}>
                            <Icon name="users" size={40} color={themeColor} />
                        </View>
                        <ThemedText style={[styles.emptyListTitle, { color: themeColors.textPrimary }]}>
                            Keine Einträge gefunden
                        </ThemedText>
                        <ThemedText style={[styles.emptyListText, { color: themeColors.textSecondary }]}>
                            {searchText
                                ? `Keine ${selectedType.name} für "${searchText}" gefunden`
                                : `Keine ${selectedType.name} verfügbar`}
                        </ThemedText>
                    </ThemedView>
                }
                ListHeaderComponent={
                    <ThemedText style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
                        Verfügbare {selectedType.displayName}
                    </ThemedText>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    stickyHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 12,
    },
    headerGradient: {
        borderRadius: 16,
        padding: 2,
        borderWidth: 1,
    },
    searchContainer: {
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 100 : 80,
        paddingBottom: 12,
    },
    resultsInfo: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 20,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
    },
    resultsText: {
        fontSize: 13,
        fontWeight: '500',
    },
    list: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 16,
        marginTop: 8,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    emptyIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyText: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
    },
    emptyListContainer: {
        alignItems: 'center',
        padding: 40,
        borderRadius: 20,
        marginTop: 20,
        borderWidth: 1,
    },
    emptyListIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    emptyListTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    emptyListText: {
        fontSize: 14,
        textAlign: 'center',
        lineHeight: 20,
    },
});