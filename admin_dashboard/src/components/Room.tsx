import React, { CSSProperties, useContext} from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';
import { TeacherContext, TeacherContextType } from "../context/TeacherContext.tsx";

interface RoomProps {
    id: number;
    label: string;
    teacher_ids?: number[];  // Neue Prop für Lehrer-IDs
    onDrop: (data: { roomId: number; teacherId: number }) => void; // Vereinfachte onDrop-Signatur
    style: CSSProperties;
}

const Room: React.FC<RoomProps> = ({ id, label, teacher_ids = [], onDrop, style }) => {
    const { teachers } = useContext<TeacherContextType>(TeacherContext);
    const navigate = useNavigate();

    // Berechne zugewiesene Lehrer direkt ohne State
    const assignedTeachers = React.useMemo(() => {
        return teachers.filter(teacher => teacher_ids.includes(teacher.id));
    }, [teachers, teacher_ids]); // Kein setState mehr

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'ITEM',
        drop: (item: { id: number; label: string }) => {
            onDrop({ roomId: id, teacherId: item.id });
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
        backgroundColor: isOver ? 'rgba(255, 255, 0, 0.2)' : 'rgba(255, 255, 255, 0.8)',
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
                        {assignedTeachers[0].abbreviation}
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