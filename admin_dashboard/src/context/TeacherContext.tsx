import React, {createContext, useEffect, useState} from 'react';
import {IObject} from '../models/interfaces.ts';
import TeacherService from '../services/TeacherService.tsx';

export interface TeacherContextType {
    teachers: IObject[];
    reload: () => void;
    handleDelete: (teacher_id: number) => Promise<void>;
    searchTeachers: (searchTerm: string) => void; // Neue Suchfunktion
    clearSearch: () => void; // Suchfunktion zurücksetzen
    isSearching: boolean; // Loading state für Suche
}

export const TeacherContext = createContext<TeacherContextType>({
    teachers: [],
    reload: () => {},
    handleDelete: async () => {},
    searchTeachers: () => {},
    clearSearch: () => {},
    isSearching: false
});

interface ITeacherProvider {
    children?: React.ReactNode;
}

const TeacherProvider = ({children}: ITeacherProvider) => {
    const [teachers, setTeachers] = useState<IObject[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [currentSearchTerm, setCurrentSearchTerm] = useState<string>('');

    const reload = () => {
        TeacherService.fetchAllTeachers()
            .then((t: IObject[]) => {
                console.log(teachers);
                setTeachers(t);
                setCurrentSearchTerm('');
            })
            .catch((err: Error) => {
                console.log(err);
            });
    };

    const searchTeachers = (searchTerm: string) => {
        if (!searchTerm.trim()) {
            reload();
            return;
        }

        setIsSearching(true);
        setCurrentSearchTerm(searchTerm);

        TeacherService.searchTeachers(searchTerm)
            .then((t: IObject[]) => {
                console.log(t);
                setTeachers(t);
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

    const handleDelete = async (teacherId: number) => {
        try {
            await TeacherService.deleteTeacher(teacherId);
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
        reload();
    }, []);

    return (
        <TeacherContext.Provider value={{
            teachers,
            reload,
            handleDelete,
            searchTeachers,
            clearSearch,
            isSearching
        }}>
            {children}
        </TeacherContext.Provider>
    );
};

export default TeacherProvider;