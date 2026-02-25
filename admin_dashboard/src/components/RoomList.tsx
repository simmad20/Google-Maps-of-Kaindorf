import {useEffect, useState} from 'react';
import {IRoom} from "../models/interfaces.ts";
import {Link, useNavigate} from "react-router-dom";
import {IoTrashOutline, IoArrowBack, IoPencil} from "react-icons/io5";
import RoomService from "../services/RoomService.tsx";
import {useEvents} from "../context/EventContext.tsx";
import {useAuth} from "../context/AuthContext.tsx";

const RoomList = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const {selectedEvent} = useEvents();
    const {isViewer} = useAuth();
    const navigate = useNavigate();

    const getRooms = () => {
        RoomService.fetchAllRooms(typeof selectedEvent === "undefined" ? "" : selectedEvent.id)
            .then((r: IRoom[]) => setRooms(r))
            .catch((err: Error) => console.log(err));
    };

    const handleDeleteRoom = async (roomId: string) => {
        try {
            await RoomService.deleteRoom(roomId);
            setRooms(prev => prev.filter(room => room.id !== roomId));
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    };

    const handleEditRoom = (room: IRoom) => {
        navigate('/map', {state: {editingRoom: room}});
    };

    useEffect(() => {
        getRooms();
    }, [selectedEvent]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
                <Link to="/"
                      className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                    <IoArrowBack size={20}/>
                </Link>
                <h1 className="text-xl font-semibold text-gray-900">Room Management</h1>
            </div>

            <div className="bg-white rounded-xl border border-gray-200">
                {rooms.length === 0 ? (
                    <div className="px-6 py-12 text-center text-sm text-gray-400">
                        No rooms found for the selected event.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {rooms.map((room) => (
                            <li key={room.id}
                                className="px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">{room.name}</span>
                                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                            Room {room.roomNumber}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                        Position: {room.x}, {room.y} &mdash; Size: {room.width} x {room.height}
                                    </div>
                                </div>
                                {!isViewer&&<div className="flex items-center gap-1">
                                    <button
                                        onClick={() => handleEditRoom(room)}
                                        className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                        title="Edit room"
                                    >
                                        <IoPencil size={16}/>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete room"
                                    >
                                        <IoTrashOutline size={16}/>
                                    </button>
                                </div>}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RoomList;