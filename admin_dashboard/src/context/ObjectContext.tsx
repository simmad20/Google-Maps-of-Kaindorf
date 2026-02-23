import React, {createContext, useEffect, useState} from 'react';
import {IObject, IObjectType} from '../models/interfaces.ts';
import ObjectTypeService from "../services/ObjectTypeService.tsx";
import ObjectService from "../services/ObjectService.tsx";
import {useAuth} from "./AuthContext.tsx";

export interface ObjectContextType {
    objects: IObject[];
    types: IObjectType[];
    selectedType: IObjectType | undefined;
    updateSelectedType: (type: IObjectType) => void;
    reload: () => void;
    reloadTypes: () => void;
    handleDelete: (object_id: string) => Promise<void>;
    searchObjects: (searchTerm: string) => void;
    clearSearch: () => void;
    isSearching: boolean;
    searchTerm: string;
    updateSearchTerm: (term: string) => void
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
    searchObjects: () => {
    },
    clearSearch: () => {
    },
    isSearching: false,
    searchTerm: '',
    updateSearchTerm: () => {

    }
});

interface IObjectProvider {
    children?: React.ReactNode;
}

const ObjectProvider = ({children}: IObjectProvider) => {
    const [objects, setObjects] = useState<IObject[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [types, setTypes] = useState<IObjectType[]>([]);
    const [selectedType, setSelectedType] = useState<IObjectType | undefined>(undefined);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');
    const {isAuthenticated} = useAuth();

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

    const searchObjects = (searchTerm: string) => {
        if (!searchTerm.trim() || typeof selectedType === "undefined") {
            reload();
            return;
        }

        setIsSearching(true);
        setCurrentSearchTerm(searchTerm);

        ObjectService.searchObjects(selectedType.id, searchTerm)
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

    const updateSelectedType = (type: IObjectType) => {
        setSelectedType(type);
    }

    const handleDelete = async (objectId: string) => {
        try {
            await ObjectService.deleteObject(objectId);
            // Nach Löschen aktualisieren - wenn gesucht wurde, Suche beibehalten
            if (currentSearchTerm) {
                searchObjects(currentSearchTerm);
            } else {
                reload();
            }
        } catch (error) {
            console.error("Löschen fehlgeschlagen:", error);
        }
    };

    const updateSearchTerm = (term: string) => {
        setSearchTerm(term);
    }

    useEffect(() => {
        if (!isAuthenticated) return;
        reloadTypes();
    }, [isAuthenticated]);

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
            searchObjects,
            clearSearch,
            isSearching,
            searchTerm,
            updateSearchTerm
        }}>
            {children}
        </ObjectContext.Provider>
    );
};

export default ObjectProvider;