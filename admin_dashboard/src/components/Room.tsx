import React, {CSSProperties, useContext} from 'react';
import {useDrop} from 'react-dnd';
import {useNavigate} from 'react-router-dom';
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import {IObject, IObjectType} from "../models/interfaces.ts";

interface RoomProps {
    id: string;
    label: string;
    object_ids?: string[];
    onDrop: (data: { roomId: string; objectId: string }) => void; // Vereinfachte onDrop-Signatur
    style: CSSProperties;
}

const Room: React.FC<RoomProps> = ({id, label, object_ids = [], onDrop, style}) => {
    const {objects, types, selectedType} = useContext<ObjectContextType>(ObjectContext);
    const navigate = useNavigate();

    console.log(object_ids);
    const assignedObjects = React.useMemo(() => {
        const idSet = new Set(object_ids);
        return objects.filter(o =>
            idSet.has(o.id)
        );
    }, [objects, object_ids]);



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
        const typeOfObject:IObjectType|undefined=types.find((t:IObjectType)=>t.id===object.typeId);

        if(!typeOfObject) return;

        return typeOfObject.schema
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