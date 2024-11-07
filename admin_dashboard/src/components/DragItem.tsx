import React from 'react';
import { useDrag } from 'react-dnd';

interface DragItemProps {
    id: string;
    label: string;
}

const DragItem: React.FC<DragItemProps> = ({ id, label }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ITEM',
        item: { id, label },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div ref={drag} style={{ opacity: isDragging ? 0.5 : 1, cursor: 'move', padding: '5px', background: 'lightblue', borderRadius: '4px' }}>
            {label}
        </div>
    );
};

export default DragItem;
