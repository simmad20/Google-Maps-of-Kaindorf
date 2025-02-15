import React, {useEffect, useState} from 'react';
import Room from './Room';
import {IRoom} from "../models/interfaces.ts";

const imageWidth: number = 1868;
const imageHeight: number = 373;

const roomsMock = [
    {
        id: 1,
        name: 'A',
        x: 45,
        y: 162,
        width: 19,
        height: 19,
    },
    {
        id: 2,
        name: 'B',
        x: 116,
        y: 163,
        width: 16,
        height: 19,
    },
    {
        id: 3,
        name: 'I',
        x: 1613,
        y: 168,
        width: 4,
        height: 19,
    },
    {
        id: 4,
        name: 'C',
        x: 193,
        y: 179,
        width: 16,
        height: 19,
    },
    {
        id: 5,
        name: 'D',
        x: 313,
        y: 183,
        width: 16,
        height: 19,
    },
    {
        id: 6,
        name: 'E',
        x: 437,
        y: 184,
        width: 15,
        height: 20,
    },
    {
        id: 7,
        name: 'F',
        x: 717,
        y: 176,
        width: 13,
        height: 19,
    },
    {
        id: 8,
        name: 'G',
        x: 843,
        y: 181,
        width: 17,
        height: 18,
    },
];

const Map: React.FC = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/rooms")
            .then((response: Response) => response.json())
            .then((roomsList: IRoom[]) => {
                console.log(roomsList);
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
                width: '100vw',
                aspectRatio: `${imageWidth} / ${imageHeight}`,
                backgroundImage: 'url(/OG.png)',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                overflow: 'hidden'
            }}>
                {roomsMock.map((room) => {
                    const roomStyle: React.CSSProperties = {
                        top: `${(room.y / imageHeight) * 100}%`,
                        left: `${(room.x / imageWidth) * 100}%`,
                        width: `${(room.width / imageWidth) * 100}%`,
                        height: `${(room.height / imageHeight) * 100}%`,
                        position: 'absolute' // Korrekter Typ für `position`
                    };
                        return (<Room key={room.id} id={room.id} label={room.name} onDrop={handleDrop}
                                      style={roomStyle ?? {}}/>);
                    }
                )}
            </div>
        </React.Fragment>
    );
};

export default Map;