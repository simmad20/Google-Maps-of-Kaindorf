import React, {CSSProperties, useContext} from 'react';
import {useDrop} from 'react-dnd';
import {useNavigate} from 'react-router-dom';
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import {IObject} from "../models/interfaces.ts";

interface RoomProps {
    id: string;
    label: string;
    object_ids?: string[];  // Neue Prop für Lehrer-IDs
    onDrop: (data: { roomId: string; objectId: string }) => void; // Vereinfachte onDrop-Signatur
    style: CSSProperties;
}

const Room: React.FC<RoomProps> = ({id, label, object_ids = [], onDrop, style}) => {
    const {objects, selectedType} = useContext<ObjectContextType>(ObjectContext);
    const navigate = useNavigate();

    // Berechne zugewiesene Lehrer direkt ohne State
    const assignedObjects = React.useMemo(() => {
        return objects.filter((o: IObject) => (typeof o.assignedRoomId !== "undefined" && object_ids.includes(o.id
        ) && o.typeId === selectedType?.id));
    }, [objects, object_ids, selectedType?.id]); // Kein setState mehr

    console.log(assignedObjects);

    const [{isOver}, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item: { id: string; label: string }) => {
            onDrop({roomId: id.toString(), objectId: item.id});
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));
    const handleIconClick = () => {
        navigate(`/room/${id}`);
    };

    const roomStyle: CSSProperties = {
        ...style,
        backgroundColor: isOver ? 'rgba(255, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)'
    };

    const getMarkerLabel = (object: IObject) => {
        if (!selectedType) return "";

        return selectedType.schema
            .filter(field => field.marker?.visible)
            .sort((a, b) => a.marker.order - b.marker.order)
            .map(field => object.attributes[field.key])
            .filter(Boolean)
            .join(" ");
    };


    return (
        <div
            ref={drop}
            className="room-container"
            style={roomStyle}
            title={label}
        >
            {label && <h3 className="room-label">{label}</h3>}

            <div className="room-objects">
                {assignedObjects.length === 1 && (
                    <div
                        className="single-object-badge"
                        onClick={handleIconClick}
                        style={{
                            backgroundColor: selectedType?.color ?? "#6366f1"
                        }}
                    >
                        {getMarkerLabel(assignedObjects[0])}
                    </div>
                )}

                {assignedObjects.length > 1 && (
                    <div
                        className="object-icon-container"
                        onClick={handleIconClick}
                        style={{
                            backgroundColor: selectedType?.color ?? "#6366f1"
                        }}
                    >
            <span className="object-icon">
                {assignedObjects.length}
            </span>
                    </div>
                )}
            </div>

        </div>
    );
};

export default Room;