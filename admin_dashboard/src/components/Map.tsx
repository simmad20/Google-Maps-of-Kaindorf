import React, {useCallback, useEffect, useState} from 'react';
import {IRoom} from '../models/interfaces.ts';
import Room from './Room';
import AuthService from '../services/AuthService.tsx';
import {API_URL} from '../config.ts';

interface IMap {
    path: string;
    clickPosition: { x: number, y: number } | null;
    updateClickPosition: (x: number, y: number) => void;
    rooms: IRoom[];
    onTeacherAssign: (teacherId: string, roomId: string) => void;
    /** When true, drag-and-drop assignment onto rooms is silently blocked. */
    assignDisabled?: boolean;
}

function Map({path, clickPosition, updateClickPosition, rooms, onTeacherAssign, assignDisabled = false}: IMap) {
    const [imageDimensions, setImageDimensions] = useState({width: 0, height: 0});
    const [imageBlobUrl, setImageBlobUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!path) return;

        let objectUrl: string | null = null;

        const fetchImage = async () => {
            try {
                const token = AuthService.getToken();
                const fullUrl = path.startsWith('http') ? path : `${API_URL}${path}`;

                const res = await fetch(fullUrl, {
                    headers: token ? {Authorization: `Bearer ${token}`} : {}
                });

                if (!res.ok) throw new Error(`Image load failed: ${res.status}`);

                const blob = await res.blob();
                objectUrl = URL.createObjectURL(blob);
                setImageBlobUrl(objectUrl);

                const img = new Image();
                img.onload = () => setImageDimensions({width: img.naturalWidth, height: img.naturalHeight});
                img.src = objectUrl;
            } catch (err) {
                console.error('Failed to load map image:', err);
            }
        };

        fetchImage();

        return () => {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
        };
    }, [path]);

    /**
     * Drop handler passed to each Room.
     * When assignDisabled is true the handler is a no-op — the drop silently
     * does nothing. The MapManager overlay prevents the drag visually.
     */
    const handleDrop = useCallback((data: {roomId: string; objectId: string}) => {
        if (assignDisabled) return;
        onTeacherAssign(data.objectId, data.roomId);
    }, [onTeacherAssign, assignDisabled]);

    const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const relativeX = Math.round((x / rect.width) * imageDimensions.width);
        const relativeY = Math.round((y / rect.height) * imageDimensions.height);
        updateClickPosition(relativeX, relativeY);
    }, [updateClickPosition, imageDimensions.width, imageDimensions.height]);

    if (!imageBlobUrl) {
        return (
            <div className="w-full flex items-center justify-center py-20 text-gray-400 border border-gray-200 rounded-xl bg-gray-50">
                <p className="text-sm">Loading floor plan...</p>
            </div>
        );
    }

    return (
        <div
            style={{
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
                width: '100%',
                aspectRatio: `${imageDimensions.width} / ${imageDimensions.height}`,
                backgroundImage: `url(${imageBlobUrl})`,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                overflow: 'hidden',
                cursor: 'crosshair',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
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
                    backgroundColor: '#7c3aed',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: '0 0 0 3px rgba(124,58,237,0.3)',
                }}/>
            )}

            {rooms.map((room: IRoom) => (
                <Room
                    key={room.id}
                    id={room.id}
                    label={room.name}
                    object_ids={room.assignedObjectIds || []}
                    onDrop={handleDrop}
                    style={{
                        top: `${(room.y / imageDimensions.height) * 100}%`,
                        left: `${(room.x / imageDimensions.width) * 100}%`,
                        width: `${(room.width / imageDimensions.width) * 100}%`,
                        height: `${(room.height / imageDimensions.height) * 100}%`,
                        position: 'absolute',
                    }}
                />
            ))}
        </div>
    );
}

export default Map;
