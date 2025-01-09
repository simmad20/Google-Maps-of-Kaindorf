import React, {useEffect, useState} from 'react';
import Room from './Room';
import {IRoom} from "../models/interfaces.ts";

const Map: React.FC = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/rooms")
            .then((response: Response) => response.json())
            .then((roomsList: IRoom[]) => {
                setRooms(roomsList.map((room: IRoom) => {
                    if (room.room_number === "1.2.10") {
                        return {...room, style: {top: '162px', left: '270px', width: '36px', height: '40px'}};
                    }
                    return room;
                }))
            })
    }, []);

    const handleDrop = (data: { roomId: number; item: any }) => {
        console.log(`Dropped ${data.item.id} in ${data.roomId}`);
    };

    return (
        <React.Fragment>
            <div style={{
                marginLeft: "auto",
                marginRight: "auto",
                position: 'relative',
                width: '800px',
                height: '600px',
                backgroundImage: 'url(/kaindorfMap.png)',
                backgroundSize: 'cover'
            }}>
                {rooms.map((room) => (
                    <Room key={room.id} id={room.id} label={room.name} onDrop={handleDrop} style={room.style ?? {}}/>
                ))}
            </div>
        </React.Fragment>
    );
};

export default Map;
