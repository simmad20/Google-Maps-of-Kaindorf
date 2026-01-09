import React, {createContext, useEffect, useState} from 'react';
import {IObject, IObjectType} from '@/models/interfaces';
import ObjectTypeService from "@/services/ObjectTypeService";
import ObjectService from "@/services/ObjectService";

export interface ObjectContextType {
    objects: IObject[];
    types: IObjectType[];
    selectedType: IObjectType | undefined;
    updateSelectedType: (type: IObjectType | undefined) => void;
    reload: () => void;
    reloadTypes: () => void;
    searchObjects: (searchTerm: string) => void;
    clearSearch: () => void;
    isSearching: boolean;
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
    searchObjects: () => {
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
                setSelectedType(t[0]); //0 = Lehrer, 1 = Stände
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

    const updateSelectedType = (type: IObjectType | undefined) => {
        setSelectedType(type);
    }

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
            searchObjects,
            clearSearch,
            isSearching
        }}>
            {children}
        </ObjectContext.Provider>
    );
};

export default ObjectProvider;