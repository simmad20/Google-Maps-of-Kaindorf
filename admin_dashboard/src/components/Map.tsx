import React, {useContext, useEffect, useState} from 'react';
import {IRoom} from '../models/interfaces.ts';
import RoomService from '../services/RoomService.tsx';
import {TeacherContext} from '../context/TeacherContext.tsx';
import Room from './Room';
import DragItem from './DragItem';
import item from "./Item.tsx";

const imageWidth: number = 1868;
const imageHeight: number = 373;

const Map: React.FC = () => {
    const {teachers, addTeacherToRoom} = useContext(TeacherContext);
    const [rooms, setRooms] = useState<IRoom[]>([]);

    const getRooms = () => {
        RoomService.fetchAllRooms()
            .then((r: IRoom[]) => {
                setRooms(r);
                //console.log();
            })
            .catch((err: Error) => {
                console.log(err);
            });
    };

    useEffect(() => {
        console.log(rooms)
    }, [rooms]);

    useEffect(() => {
        getRooms();
    }, []);

    const handleDrop = (data: { roomId: number; item: { id: number; label: string }[] }) => {
        // Mehrere Lehrer in den Raum hinzufügen
        //console.log(item);
        console.log(`Lehrer in Raum ${data.roomId} zugewiesen`);
        data.item.forEach((teacher) => {
            addTeacherToRoom(teacher.id, data.roomId);
        });
    };

    return (
        <div style={{
            marginLeft: 'auto',
            marginRight: 'auto',
            position: 'relative',
            width: '100vw',
            aspectRatio: `${imageWidth} / ${imageHeight}`,
            backgroundImage: 'url(/OG.png)',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            overflow: 'hidden',
        }}>
            {rooms.map((room: IRoom) => {
                const roomStyle: React.CSSProperties = {
                    top: `${(room.y / imageHeight) * 100}%`,
                    left: `${(room.x / imageWidth) * 100}%`,
                    width: `${(room.width / imageWidth) * 100}%`,
                    height: `${(room.height / imageHeight) * 100}%`,
                    position: 'absolute',
                };

                const assignedTeachers = teachers.filter((teacher) => teacher.room_id === room.id);
                /*console.log("" +
                    "#################################################\n\n\n" );
                console.log(room);*/
                return (
                    <React.Fragment key={room.id}>
                        <Room key={room.id} id={room.id} label={room.name} onDrop={handleDrop} style={roomStyle}/>
                        {assignedTeachers.map((teacher) => (
                            <div
                                key={teacher.id}
                                style={{
                                    position: 'absolute',
                                    top: `${(room.y / imageHeight) * 100 + 10}%`,
                                    left: `${(room.x / imageWidth) * 100 + 10}%`,
                                }}
                            >
                            </div>
                        ))}
                    </React.Fragment>
                );
            })}
        </div>
    );
};

export default Map;