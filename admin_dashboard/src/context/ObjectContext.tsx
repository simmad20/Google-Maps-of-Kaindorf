import React, {createContext, useEffect, useState} from 'react';
import {IObject, IObjectType} from '../models/interfaces.ts';
import ObjectTypeService from "../services/ObjectTypeService.tsx";
import ObjectService from "../services/ObjectService.tsx";

export interface ObjectContextType {
    objects: IObject[];
    types: IObjectType[];
    selectedType: IObjectType | undefined;
    updateSelectedType: (type: IObjectType | undefined) => void;
    reload: () => void;
    reloadTypes: () => void;
    handleDelete: (object_id: string) => Promise<void>;
    searchTeachers: (searchTerm: string) => void; // Neue Suchfunktion
    clearSearch: () => void; // Suchfunktion zurücksetzen
    isSearching: boolean; // Loading state für Suche
}

export const ObjectContext = createContext<ObjectContextType>({
    objects: [],
    types: [],
    selectedType: undefined,
    updateSelectedType: () => {

    },
    reload: () => {
    },
    reloadTypes: () => {

    },
    handleDelete: async () => {
    },
    searchTeachers: () => {
    },
    clearSearch: () => {
    },
    isSearching: false
});

interface IObjectProvider {
    children?: React.ReactNode;
}

const ObjectProvider = ({children}: IObjectProvider) => {
    const [objects, setObjects] = useState<IObject[]>([]);
    const [types, setTypes] = useState<IObjectType[]>([]);
    const [selectedType, setSelectedType] = useState<IObjectType | undefined>(undefined);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');

    const reloadTypes = () => {
        ObjectTypeService.fetchAllObjectTypes()
            .then((t: IObjectType[]) => {
                console.log(t);
                setTypes(t);
                setSelectedType(t[0]);
            })
            .catch((err: Error) => {
                console.error(err);
            })
    }

    const reload = () => {
        if (typeof selectedType !== "undefined") {
            ObjectService.fetchAllObjectsByType(selectedType.id)
                .then((t: IObject[]) => {
                    console.log(objects);
                    setObjects(t);
                    setCurrentSearchTerm('');
                })
                .catch((err: Error) => {
                    console.error(err);
                });
        }
    };

    const searchTeachers = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            reload();
            return;
        }

        setIsSearching(true);
        setCurrentSearchTerm(searchTerm);

        ObjectService.searchTeachers(searchTerm)
            .then((t: IObject[]) => {
                console.log(t);
                setObjects(t);
            })
            .catch((err: Error) => {
                console.log('Suche fehlgeschlagen:', err);
                reload(); // Fallback zu allen Lehrern
            })
            .finally(() => {
                setIsSearching(false);
            });
    };

    const clearSearch = () => {
        reload();
    };

    const updateSelectedType = (type: IObjectType | undefined) => {
        setSelectedType(type);
    }

    const handleDelete = async (objectId: string) => {
        try {
            await ObjectService.deleteObject(objectId);
            // Nach Löschen aktualisieren - wenn gesucht wurde, Suche beibehalten
            if (currentSearchTerm) {
                searchTeachers(currentSearchTerm);
            } else {
                reload();
            }
        } catch (error) {
            console.error("Löschen fehlgeschlagen:", error);
        }
    };

    useEffect(() => {
        reloadTypes();
    }, []);

    useEffect(() => {
        reload();
    }, [selectedType]);

    return (
        <ObjectContext.Provider value={{
            objects,
            types,
            selectedType,
            updateSelectedType,
            reload,
            reloadTypes,
            handleDelete,
            searchTeachers,
            clearSearch,
            isSearching
        }}>
            {children}
        </ObjectContext.Provider>
    );
};

export default ObjectProvider;