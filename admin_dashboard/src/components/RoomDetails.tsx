import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {FaArrowLeft, FaDoorOpen, FaUserTie, FaTrash} from 'react-icons/fa';
import {IObject, IRoomDetailed} from "../models/interfaces.ts";
import RoomService from "../services/RoomService.tsx";

const RoomDetails: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<IRoomDetailed | undefined>(undefined);

    const load = () => {
        console.log(id);
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

    const handleDeleteTeacher = async (teacherId: string) => {
        if (!room) return;
        try {
            await RoomService.deleteAssignedTeacherRoom(id, teacherId);
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
                            Room {room?.roomNumber || id} {room.name && room.name} - {room.assignedObjects.length} Teacher{room.assignedObjects.length > 1 && 's'}
                        </h1>

                        {room.assignedObjects.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {room.assignedObjects.map((teacher: IObject) => (
                                    <div key={teacher.id}
                                         className="border rounded-lg p-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div
                                                className="bg-indigo-100 p-3 rounded-full mr-4 w-16 h-16 flex items-center justify-center">
                                                {teacher.attributes.image_url ? (
                                                    <img src={teacher.attributes.image_url}
                                                         className="w-12 h-12 object-cover rounded-full"/>
                                                ) : (
                                                    <FaUserTie className="text-indigo-600 text-3xl"/>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">
                                                    {teacher.attributes.title} {teacher.attributes.firstname} {teacher.attributes.lastname}
                                                </h3>
                                                <p className="text-indigo-600">{teacher.attributes.abbreviation}</p>
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