import React from 'react';
import Room from './Room';

const Map: React.FC = () => {

    const rooms = [
        {id: 'room1', label: 'Room 101', style: {top: '50px', left: '150px', width: '100px', height: '80px'}},
        {id: 'room2', label: 'Room 102', style: {top: '150px', left: '250px', width: '100px', height: '80px'}},
        {id: 'room3', label: 'Room 103', style: {top: '250px', left: '350px', width: '100px', height: '80px'}},
    ];

    const handleDrop = (data: { roomId: string; item: any }) => {
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
                    <Room key={room.id} id={room.id} label={room.label} onDrop={handleDrop} style={room.style}/>
                ))}
            </div>
        </React.Fragment>
    );
};

export default Map;
