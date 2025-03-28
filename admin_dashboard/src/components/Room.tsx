import React, {CSSProperties, useContext, useEffect, useState} from 'react';
import {useDrop} from 'react-dnd';
import {useNavigate} from 'react-router-dom';
import {TeacherContext, TeacherContextType} from "../context/TeacherContext.tsx";
import {ITeacher} from "../models/interfaces.ts";

interface RoomProps {
    id: number;
    label: string;
    onDrop: (data: { roomId: number; item: { id: number; label: string }[] }) => void; // erwartet ein Array von Lehrern
    style: CSSProperties;
}

const Room: React.FC<RoomProps> = ({id, label, onDrop, style}) => {
    console.log("Raumid "+id);
    const {teachers, addTeacherToRoom} = useContext<TeacherContextType>(TeacherContext);
    const [droppedItems, setDroppedItems] = useState<{
        id: number;
        label: string
    }[]>(teachers.filter((teacher: ITeacher) => teacher.room_id === id).map((teacher: ITeacher) => {
        return {id: teacher.room_id, label: teacher.abbreviation}
    }));
    const [showDetails, setShowDetails] = useState(false); // Zustand für das Anzeigen der Details
    const navigate = useNavigate();

    useEffect(() => {
        console.log(droppedItems);
    }, []);

    const [{isOver}, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item: { id: number; label: string, img_url: string }) => {
            // Nur hinzufügen, wenn der Lehrer noch nicht im Raum ist
            console.log("In der Room Komponente: "+id);
            addTeacherToRoom(item.id, id);
            setDroppedItems((prevDroppedItems) => {
                // Verhindert das Hinzufügen von doppelten Lehrern
                if (prevDroppedItems.some((droppedItem) => droppedItem.id === item.id)) {
                    return prevDroppedItems;
                }
                // Gibt ein neues Array mit den alten und neuen Lehrern zurück
                return [...prevDroppedItems, item];
            });
            // Benachrichtigen des Elternteils über das neue Set von Lehrern im Raum
            onDrop({roomId: id, item: [...droppedItems, item]});
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const roomStyle: CSSProperties = {
        ...style,
        position: 'absolute',
        backgroundColor: isOver ? 'rgba(255, 255, 0, 0.2)' : 'transparent',
        border: '1px solid #ccc',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '10px',
    };

    // Wenn auf das Icon geklickt wird, Details anzeigen
    const handleIconClick = () => {
        setShowDetails(true); // Schaltet die Anzeige der Lehrerdetails um
        navigate(`/room/${id}`); // Navigiert zur Detailansicht des Raums
    };

    return (
        <div ref={drop} style={roomStyle} title={label} className={id+""}>
            <h3>{label}</h3>
            <div>
                {/* Anzeige der Lehrerliste im Raum */}
                {droppedItems.length === 1 && (
                    // Wenn nur 1 Lehrer im Raum ist, das Kürzel anzeigen
                    <div style={{margin: '5px', background: 'lightblue', padding: '5px', borderRadius: '4px'}}>
                        {droppedItems[0].label} {/* Das Kürzel des Lehrers */}
                    </div>
                )}
                {droppedItems.length > 1 && (
                    // Wenn mehr als 1 Lehrer im Raum ist, ein Icon anzeigen
                    <div
                        onClick={handleIconClick}
                        style={{
                            cursor: 'pointer',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            borderRadius: '50%',
                            padding: '5px',
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                        }}
                    >
                        <span style={{...style, fontSize: '20px', color: 'blue'}}>👨‍🏫</span> {/* Icon */}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Room;