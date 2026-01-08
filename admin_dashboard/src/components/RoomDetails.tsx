import React, {useContext, useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {FaArrowLeft, FaDoorOpen} from 'react-icons/fa';
import {IObject, IObjectType, IRoomDetailed} from "../models/interfaces.ts";
import RoomService from "../services/RoomService.tsx";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import ObjectCard from "./ObjectCardRoomDetails.tsx";

const RoomDetails: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [room, setRoom] = useState<IRoomDetailed | undefined>(undefined);
    const {types}=useContext<ObjectContextType>(ObjectContext);

    const load = () => {
        if (typeof id !== "undefined") {
            console.log(id);
            RoomService.fetchDetailedRoom(id)
                .then((r: IRoomDetailed) => {
                    setRoom(r);
                })
                .catch((err: Error) => {
                    console.error(err);
                });
        }
    };

    useEffect(() => {
        load();
    }, []);

    const handleDeleteTeacher = async (objectId: string) => {
        if (!room) return;
        try {
            if (typeof id !== "undefined") {
                await RoomService.deleteAssignedObjectRoom(id, objectId);
                load();
            }
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
                                    {room.assignedObjects.map((object: IObject) => {
                                        const type = types.find((t:IObjectType) => t.id === object.typeId);
                                        if (!type) return null;

                                        return (
                                            <ObjectCard
                                                key={object.id}
                                                object={object}
                                                type={type}
                                                onDelete={handleDeleteTeacher}
                                            />
                                        );
                                    })}

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