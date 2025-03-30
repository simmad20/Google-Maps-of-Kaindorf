import React, {createContext, useEffect, useState} from 'react';
import {ITeacher} from '../models/interfaces.ts';
import TeacherService from '../services/TeacherService.tsx';

export interface TeacherContextType {
    teachers: ITeacher[];
    reload: () => void;
    handleDelete: (teacher_id: number) => Promise<void>
}

export const TeacherContext = createContext<TeacherContextType>({
    teachers: [],
    reload: () => {
    },
    handleDelete: async () => {

    }
});

interface ITeacherProvider {
    children?: React.ReactNode;
}

const TeacherProvider = ({children}: ITeacherProvider) => {
    const [teachers, setTeachers] = useState<ITeacher[]>([]);

    const reload = () => {
        TeacherService.fetchAllTeachers()
            .then((t: ITeacher[]) => {
                setTeachers(t);
            })
            .catch((err: Error) => {
                console.log(err);
            });
    };
    const handleDelete = async (teacherId: number) => {
        try {
            await TeacherService.deleteTeacher(teacherId);

            reload();
        } catch (error) {
            console.error("Löschen fehlgeschlagen:", error);
        }
    };
    useEffect(() => {
        reload();
    }, []);

    return (
        <TeacherContext.Provider value={{teachers, reload, handleDelete}}>
            {children}
        </TeacherContext.Provider>
    );
};

export default TeacherProvider;