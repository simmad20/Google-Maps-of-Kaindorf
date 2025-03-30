import React, { useCallback } from 'react';
import { IRoom } from '../models/interfaces.ts';
import Room from './Room';

const imageWidth: number = 1868;
const imageHeight: number = 373;

interface IMap {
    clickPosition: { x: number, y: number } | null;
    updateClickPosition: (x: number, y: number) => void;
    rooms: IRoom[];
    onTeacherAssign: (teacherId: number, roomId: number) => void;
}

function Map({ clickPosition, updateClickPosition, rooms, onTeacherAssign }: IMap) {
    const handleDrop = useCallback((data: { roomId: number; teacherId: number }) => {
        onTeacherAssign(data.teacherId, data.roomId);
    }, [onTeacherAssign]);

    const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const relativeX = Math.round((x / rect.width) * imageWidth);
        const relativeY = Math.round((y / rect.height) * imageHeight);
        updateClickPosition(relativeX, relativeY);
    }, [updateClickPosition]);

    return (
        <div
            style={{
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
                cursor: 'pointer',
            }}
            onClick={handleImageClick}
        >
            {clickPosition && (
                <div style={{
                    position: 'absolute',
                    top: `${(clickPosition.y / imageHeight) * 100}%`,
                    left: `${(clickPosition.x / imageWidth) * 100}%`,
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                }}/>
            )}

            {rooms.map((room: IRoom) => {
                const roomStyle: React.CSSProperties = {
                    top: `${(room.y / imageHeight) * 100}%`,
                    left: `${(room.x / imageWidth) * 100}%`,
                    width: `${(room.width / imageWidth) * 100}%`,
                    height: `${(room.height / imageHeight) * 100}%`,
                    position: 'absolute',
                };

                return (
                    <Room
                        key={room.id}
                        id={room.id}
                        label={room.name}
                        teacher_ids={room.teacher_ids || []}
                        onDrop={handleDrop}
                        style={roomStyle}
                    />
                );
            })}
        </div>
    );
}

export default Map;