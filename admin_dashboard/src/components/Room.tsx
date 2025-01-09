import React, {CSSProperties, useState} from 'react';
import {useDrop} from 'react-dnd';

interface RoomProps {
    id: number;
    label: string;
    onDrop: (data: { roomId: number; item: any}) => void;
    style: CSSProperties;
}

const Room: React.FC<RoomProps> = ({id, label, onDrop, style}) => {
    const [droppedItem, setDroppedItem] = useState<{ id: number; label: string; img_url: string } | null>(null);

    const [{isOver}, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item: { id: number; label: string, img_url: string }) => {
            setDroppedItem(item);
            onDrop({roomId: id, item});
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const roomStyle: CSSProperties = {
        ...style,
        position: "absolute",
        backgroundColor: droppedItem ? 'rgba(0, 255, 0, 0.2)' : isOver ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
        border: '1px solid #ccc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    return (
        <div ref={drop} style={roomStyle} title={label}>
            {droppedItem && (
                <div style={{padding: '5px', background: 'lightblue', borderRadius: '4px'}}>
                    {droppedItem.label}
                    <img width="24px" src={droppedItem.img_url} alt="image of item not present"/>
                </div>
            )}
        </div>
    );
};

export default Room;