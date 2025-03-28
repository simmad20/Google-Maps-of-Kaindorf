import React, {createContext, useEffect, useState} from 'react';
import {ITeacher} from '../models/interfaces.ts';
import TeacherService from '../services/TeacherService.tsx';

export interface TeacherContextType {
    teachers: ITeacher[];
    addTeacherToRoom: (teacher_id: number, room_id: number) => void;
    reload: () => void;
}

export const TeacherContext = createContext<TeacherContextType>({
    teachers: [],
    addTeacherToRoom: () => {
    },
    reload: () => {
    },
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

    const addTeacherToRoom = (teacher_id: number, room_id: number) => {
       console.log(room_id);
    };

    useEffect(() => {
        reload();
    }, []);

    return (
        <TeacherContext.Provider value={{teachers, addTeacherToRoom, reload}}>
            {children}
        </TeacherContext.Provider>
    );
};

export default TeacherProvider;