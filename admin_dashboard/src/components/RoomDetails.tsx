import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {TeacherContext} from '../context/TeacherContext.tsx';
import {ITeacher} from '../models/interfaces.ts';

const RoomDetails: React.FC = () => {
    const {id} = useParams();
    const {teachers} = useContext(TeacherContext);
    const [roomTeachers, setRoomTeachers] = useState<ITeacher[]>([]);

    useEffect(() => {
        if (id) {
            const filteredTeachers = teachers.filter((teacher) => teacher.room_id === parseInt(id));
            setRoomTeachers(filteredTeachers);
        }
    }, [id, teachers]);

    return (
        <div style={{padding: '20px'}}>
            <h2>Lehrer im Raum {id}</h2>
            <ul>
                {roomTeachers.map((teacher) => (
                    <li key={teacher.id}>{teacher.abbreviation}</li>
                ))}
            </ul>
        </div>
    );
};

export default RoomDetails;