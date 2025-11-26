import React, {useCallback, useEffect, useState} from 'react';
import { IRoom } from '../models/interfaces.ts';
import Room from './Room';

interface IMap {
    path: string
    clickPosition: { x: number, y: number } | null;
    updateClickPosition: (x: number, y: number) => void;
    rooms: IRoom[];
    onTeacherAssign: (teacherId: string, roomId: string) => void;
}

function Map({path, clickPosition, updateClickPosition, rooms, onTeacherAssign }: IMap) {
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0
    });

    // Bildgröße ermitteln
    useEffect(() => {
        const img = new Image();
        img.src = path;

        img.onload = () => {
            console.log('Bildgröße:', {
                width: img.naturalWidth,
                height: img.naturalHeight
            });

            setImageDimensions({
                width: img.naturalWidth,
                height: img.naturalHeight
            });
        };

        img.onerror = () => {
            console.warn('Bild konnte nicht geladen werden, verwende Standardgrößen');
        };
    }, [path]);

    const handleDrop = useCallback((data: { roomId: string; objectId: string }) => {
        onTeacherAssign(data.objectId, data.roomId);
    }, [onTeacherAssign]);

    const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const relativeX = Math.round((x / rect.width) * imageDimensions.width);
        const relativeY = Math.round((y / rect.height) * imageDimensions.height);
        updateClickPosition(relativeX, relativeY);
    }, [updateClickPosition, imageDimensions.width, imageDimensions.height]);

    return (
        <div
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
                width: '100vw',
                aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                backgroundImage: 'url('+path+')',
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
                    top: `${(clickPosition.y / imageDimensions.height) * 100}%`,
                    left: `${(clickPosition.x / imageDimensions.width) * 100}%`,
                    width: '10px',
                    height: '10px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                }}/>
            )}

            {rooms.map((room: IRoom) => {
                const roomStyle: React.CSSProperties = {
                    top: `${(room.y / imageDimensions.height) * 100}%`,
                    left: `${(room.x / imageDimensions.width) * 100}%`,
                    width: `${(room.width / imageDimensions.width) * 100}%`,
                    height: `${(room.height / imageDimensions.height) * 100}%`,
                    position: 'absolute',
                };

                return (
                    <Room
                        key={room.id}
                        id={room.id}
                        label={room.name}
                        teacher_ids={room.assignedObjectIds || []}
                        onDrop={handleDrop}
                        style={roomStyle}
                    />
                );
            })}
        </div>
    );
}

export default Map;