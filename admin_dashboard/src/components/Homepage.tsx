import React, {useCallback, useContext, useEffect, useState} from 'react';
import Map from "./Map.tsx";
import List from "./List.tsx";
import Form from "./Form.tsx";
import RoomForm from "./RoomForm.tsx"; // Neue Komponente importieren
import {IRoom, ITeacher} from "../models/interfaces.ts";
import {TeacherContext, TeacherContextType} from "../context/TeacherContext.tsx";
import {IoCloseSharp} from "react-icons/io5";
import RoomService from "../services/RoomService.tsx";
import TeacherService from "../services/TeacherService.tsx";

function Homepage() {
    const {teachers, reload} = useContext<TeacherContextType>(TeacherContext);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showEditButton, setShowEditButton] = useState<boolean>(true);
    const [clickedTeacher, setClickedTeacher] = useState<ITeacher | undefined>(undefined);
    const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);
    const [showRoomForm, setShowRoomForm] = useState<boolean>(false); // Neuer State für Room Form
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);

    const createOrEditTeacher = (teacher: ITeacher, isCreating: boolean) => {
        setShowForm(false);
        setShowEditButton(true);
        fetch('http://localhost:3000/teachers', {
            method: isCreating ? 'POST' : 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({teacher: teacher})
        }).then((response) => response.json())
            .then((result: ITeacher) => {
                reload();
                console.log(result);
            });
        setClickedTeacher(undefined);
    }
    const handleClickOfItem = (item: ITeacher) => {
        if (!showEditButton) {
            setClickedTeacher(item);
            setShowForm(true);
        }
    }

    const back = () => {
        setClickedTeacher(undefined);
        setShowForm(false);
        setShowEditButton(true);
    }

    const getRooms = () => {
        RoomService.fetchAllRooms()
            .then((r: IRoom[]) => {
                setRooms(r);
            })
            .catch((err: Error) => {
                console.log(err);
            });
    };

    const handleTeacherAssign = useCallback(async (teacherId: number, roomId: number) => {
        try {
            await TeacherService.addTeacherToRoom(teacherId, roomId);
            const updatedRooms: IRoom[] = await RoomService.fetchAllRooms();
            setRooms(updatedRooms);
        } catch (error) {
            console.error("Fehler bei Zuordnung:", error);
        }
    }, []);

    const handleCreateRoom = (roomData: Omit<IRoom, 'id'>) => {
        RoomService.createRoom(roomData)
            .then((newRoom: IRoom) => {
                setRooms(prevRooms => [...prevRooms, newRoom]);
                setShowRoomForm(false);
                setClickPosition(null);
            })
            .catch((error: Error) => {
                console.error("Error creating room:", error.message);
            });
    }

// Neue Funktion für Raum-Bearbeitung
    const handleEditRoom = (roomData: Omit<IRoom, 'id' | 'teacher_ids'>) => {
        if (!editingRoom) return;

        RoomService.updateRoom({
            ...roomData,
            id: editingRoom.id,
            teacher_ids: editingRoom.teacher_ids || []
        })
            .then((updatedRoom: IRoom) => {
                setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
                setEditingRoom(null);
            })
            .catch((error: Error) => {
                console.error("Error updating room:", error.message);
            });
    }
    useEffect(() => {
        console.log("Editing room state changed:", editingRoom);
    }, [editingRoom]);

    useEffect(() => {
        getRooms();
    }, []);

    return (
        <React.Fragment>
            {showForm ? <Form createOrEdit={createOrEditTeacher} item={clickedTeacher} goBack={back}/> :
                <div className="mt-5 flex flex-wrap-reverse">
                    <div className="basis-1/6 mx-auto lg:mx-0 flex flex-col items-center">
                        {showEditButton &&
                            <button onClick={() => setShowEditButton(false)}
                                    className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Edit
                            </button>}
                        <List items={teachers} handleClick={handleClickOfItem}
                              showDelete={!showEditButton}/>
                        {(!showEditButton) &&
                            <button onClick={() => setShowForm(true)}
                                    className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5">
                                Create
                            </button>}
                    </div>

                    <div className="basis-1/4 flex flex-col items-center">
                        {clickPosition &&
                            <div className="flex items-center py-1">
                                <button
                                    className="homeButton bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                                    onClick={() => setShowRoomForm(true)}
                                >
                                    New room
                                </button>
                                <button className="ms-5" onClick={() => setClickPosition(null)}>
                                    <IoCloseSharp/>
                                </button>
                            </div>
                        }
                        <Map
                            onTeacherAssign={handleTeacherAssign}
                            rooms={rooms}
                            clickPosition={clickPosition}
                            updateClickPosition={(x: number, y: number) => setClickPosition({x, y})}
                        />
                    </div>

                    {showRoomForm && clickPosition && (
                        <RoomForm
                            key={1}
                            clickPosition={clickPosition}
                            onClose={() => setShowRoomForm(false)}
                            onSubmit={handleCreateRoom}
                            isPositionEditable={false}
                        />
                    )}

                    {(editingRoom !==null)&& (
                        <RoomForm
                            key={2}
                            initialData={editingRoom}
                            onClose={() => setEditingRoom(null)}
                            onSubmit={handleEditRoom}
                            isPositionEditable={true}
                        />
                    )}
                </div>
            }
        </React.Fragment>
    );
}

export default Homepage;