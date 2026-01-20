import {useEffect, useState} from 'react';
import {IRoom} from "../models/interfaces.ts";
import {Link, useNavigate} from "react-router-dom";
import {IoTrashBin, IoArrowBack, IoPencil} from "react-icons/io5";
import RoomService from "../services/RoomService.tsx";
import {useEvents} from "../context/EventContext.tsx";

const RoomList = () => {
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const {selectedEvent}=useEvents();
    const navigate = useNavigate();

    const getRooms = () => {
        if(selectedEvent){
            RoomService.fetchAllRooms(selectedEvent.id)
                .then((r: IRoom[]) => setRooms(r))
                .catch((err: Error) => console.log(err));
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        try {
            await RoomService.deleteRoom(roomId);
            setRooms(prev => prev.filter(room => room.id !== roomId));
        } catch (error) {
            console.error("Error deleting room:", error);
        }
    };

    const handleEditRoom = (room: IRoom) => {
        navigate('/map', {state: {editingRoom: room}});
    };

    useEffect(() => {
        getRooms();
    }, [selectedEvent]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
                <Link to="/" className="mr-4">
                    <IoArrowBack size={24}/>
                </Link>
                <h1 className="text-2xl font-bold">Raumverwaltung</h1>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
                {rooms.length === 0 ? (
                    <p className="text-gray-500">Keine Räume vorhanden</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {rooms.map((room) => (
                            <li key={room.id} className="py-3 flex justify-between items-center">
                                <div>
                                    <span className="font-medium">{room.name}</span>
                                    <span className="text-gray-500 ml-2">(Raum {room.roomNumber})</span>
                                    <div className="text-sm text-gray-400">
                                        Position: X={room.x}, Y={room.y} | Größe: {room.width}x{room.height}
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleEditRoom(room)}
                                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-50"
                                        title="Raum bearbeiten"
                                    >
                                        <IoPencil size={18}/>
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50"
                                        title="Raum löschen"
                                    >
                                        <IoTrashBin size={18}/>
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default RoomList;