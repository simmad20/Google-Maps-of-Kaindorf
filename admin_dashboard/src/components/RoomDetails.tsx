import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {FaArrowLeft, FaDoorOpen, FaUserTie, FaTrash} from 'react-icons/fa';
import {IRoomDetailed, ITeacher} from "../models/interfaces.ts";
import RoomService from "../services/RoomService.tsx";

const RoomDetails: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<IRoomDetailed | undefined>(undefined);

    const load = () => {
        RoomService.fetchDetailedRoom(id)
            .then((r: IRoomDetailed) => {
                setRoom(r);
            })
            .catch((err: Error) => {
                console.error(err);
            });
    };

    useEffect(() => {
        load();
    }, []);

    const handleDeleteTeacher = async (teacherId: number) => {
        if (!room) return;
        try {
            await RoomService.deleteAssignedTeacherRoom(Number(id), teacherId);
            load();
        } catch (error) {
            console.error("Error deleting teacher from room:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            {room && (
                <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="p-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
                        >
                            <FaArrowLeft className="mr-2"/>
                            Zurück
                        </button>

                        <h1 className="text-2xl font-bold flex items-center mb-6">
                            <FaDoorOpen className="mr-3 text-indigo-600"/>
                            Room {room?.room_number || id} {room.name && room.name} - {room.teachers.length} Teacher{room.teachers.length > 1 && 's'}
                        </h1>

                        {room.teachers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {room.teachers.map((teacher: ITeacher) => (
                                    <div key={teacher.id}
                                         className="border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div
                                                className="bg-indigo-100 p-3 rounded-full mr-4 w-16 h-16 flex items-center justify-center">
                                                {teacher.image_url ? (
                                                    <img src={teacher.image_url}
                                                         className="w-12 h-12 object-cover rounded-full"/>
                                                ) : (
                                                    <FaUserTie className="text-indigo-600 text-3xl"/>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {teacher.title} {teacher.firstname} {teacher.lastname}
                                                </h3>
                                                <p className="text-indigo-600">{teacher.abbreviation}</p>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDeleteTeacher(teacher.id)}
                                                className="text-red-600 hover:text-red-800">
                                            <FaTrash/>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Keine Lehrer in diesem Raum</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomDetails;