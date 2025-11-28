import React, {CSSProperties, useContext} from 'react';
import {useDrop} from 'react-dnd';
import {useNavigate} from 'react-router-dom';
import {TeacherContext, TeacherContextType} from "../context/TeacherContext.tsx";
import {IObject} from "../models/interfaces.ts";

interface RoomProps {
    id: string;
    label: string;
    teacher_ids?: string[];  // Neue Prop für Lehrer-IDs
    onDrop: (data: { roomId: string; objectId: string }) => void; // Vereinfachte onDrop-Signatur
    style: CSSProperties;
}

const Room: React.FC<RoomProps> = ({id, label, teacher_ids = [], onDrop, style}) => {
    const {teachers} = useContext<TeacherContextType>(TeacherContext);
    const navigate = useNavigate();

    // Berechne zugewiesene Lehrer direkt ohne State
    const assignedTeachers = React.useMemo(() => {
        return teachers.filter((teacher:IObject) => (typeof teacher.assignedRoomId !== "undefined" && teacher_ids.includes(teacher.id)));
    }, [teachers, teacher_ids]); // Kein setState mehr

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

    return (
        <div
            ref={drop}
            className="room-container"
            style={roomStyle}
            title={label}
        >
            {label && <h3 className="room-label">{label}</h3>}

            <div className="room-teachers">
                {assignedTeachers.length === 1 && (
                    <div className="single-teacher-badge" onClick={handleIconClick}>
                        {assignedTeachers[0].attributes.abbreviation}
                    </div>
                )}

                {assignedTeachers.length > 1 && (
                    <div
                        className="teacher-icon-container"
                        onClick={handleIconClick}
                    >
                        <span className="teacher-icon">{assignedTeachers.length}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Room;