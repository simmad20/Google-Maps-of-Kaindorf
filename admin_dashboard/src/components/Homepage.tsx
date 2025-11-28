import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import Map from "./Map.tsx";
import List from "./List.tsx";
import Form from "./Form.tsx";
import RoomForm from "./RoomForm.tsx";
import {ICard, IObject, IRoom, ITeacher} from "../models/interfaces.ts";
import {TeacherContext, TeacherContextType} from "../context/TeacherContext.tsx";
import {IoCloseSharp, IoSearch} from "react-icons/io5";
import RoomService from "../services/RoomService.tsx";
import TeacherService from "../services/TeacherService.tsx";
import {useLocation} from "react-router-dom";
import CardService from "../services/CardService.tsx";
import {API_URL} from "../config.ts";

function Homepage() {
    const {teachers, reload, searchTeachers, clearSearch, isSearching} = useContext<TeacherContextType>(TeacherContext);
    const [showForm, setShowForm] = useState<boolean>(false);
    const [showEditButton, setShowEditButton] = useState<boolean>(true);
    const [clickedTeacher, setClickedTeacher] = useState<ITeacher | undefined>(undefined);
    const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);
    const [showRoomForm, setShowRoomForm] = useState<boolean>(false);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
    const [cards, setCards] = useState<ICard[]>([]);
    const [selectedCard, setSelectedCard] = useState<ICard | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState<string>(''); // Lokaler Suchzustand

    console.log(teachers);

    const location = useLocation();

    const createOrEditTeacher = (teacher: IObject, isCreating: boolean) => {
        setShowForm(false);
        setShowEditButton(true);

        const url = isCreating
            ? API_URL+'/objects/6915b227c4dcbd5a4b392aef'
            : API_URL+`/objects/6915b227c4dcbd5a4b392aef/${teacher.id}`;

        fetch(url, {
            method: isCreating ? 'POST' : 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(teacher.attributes)   // ❗ kein { teacher: ... }
        })
            .then((response) => response.json())
            .then((result: ITeacher) => {
                reload();
                console.log(result);
            });

        setClickedTeacher(undefined);
    };

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
        if (typeof selectedCard !== "undefined") {
            console.log(selectedCard);
            RoomService.fetchAllRoomsFromCard(selectedCard.id)
                .then((r: IRoom[]) => {
                    console.log(r);
                    setRooms(r);
                })
                .catch((err: Error) => {
                    console.log(err);
                });
        }
    };

    const getCards = () => {
        CardService.fetchAllCards()
            .then((c: ICard[]) => {
                setCards(c);
                setSelectedCard(prev => prev ?? c[0]);
            })
            .catch((err: Error) => {
                console.log(err);
            })
    }

    const handleTeacherAssign = useCallback(async (teacherId: string, roomId: string) => {
        try {
            await TeacherService.addTeacherToRoom(teacherId, roomId);

            // 🟢 Nur Räume der ausgewählten Karte neu laden!
            if (selectedCard) {
                const updatedRooms = await RoomService.fetchAllRoomsFromCard(selectedCard.id);
                setRooms(updatedRooms);
            }

        } catch (error) {
            console.error("Fehler bei Zuordnung:", error);
        }
    }, [selectedCard]);

    const handleCreateRoom = (roomData: Omit<IRoom, 'id' | 'assignedObjectIds'>) => {
        if (typeof selectedCard !== "undefined") {
            RoomService.createRoom(roomData, selectedCard?.id)
                .then((newRoom: IRoom) => {
                    setRooms(prevRooms => [...prevRooms, newRoom]);
                    setShowRoomForm(false);
                    setClickPosition(null);
                })
                .catch((error: Error) => {
                    console.error("Error creating room:", error.message);
                });
        }
    }

    const handleEditRoom = (roomData: Omit<IRoom, 'id' | 'assignedObjectIds'>) => {
        if (!editingRoom) return;

        RoomService.updateRoom({
            ...roomData,
            id: editingRoom.id,
            assignedObjectIds: editingRoom.assignedObjectIds || []
        })
            .then((updatedRoom: IRoom) => {
                setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
                setEditingRoom(null);
            })
            .catch((error: Error) => {
                console.error("Error updating room:", error.message);
            });
    }

    const updatePreview = (previewRoom: IRoom) => {
        setRooms((prevState) => {
            return prevState.map((r: IRoom) => r.id === previewRoom.id ? previewRoom : r)
        });
    }

    const handleCardChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCard(cards.find((c: ICard) => c.id === e.target.value));
    }

    const handleClickPosition = (x: number, y: number) => {
        setClickPosition({x, y});
        setRooms(prevState => [...prevState.filter((r: IRoom) => r.id !== '123'), {
            id: '123',
            roomNumber: '',
            name: '',
            x,
            y,
            width: 50,
            height: 30,
            assignedObjectIds: [],
            cardId: selectedCard?.id || ''
        }]);
    }

    // Suchfunktionen
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim()) {
            searchTeachers(value);
        } else {
            clearSearch();
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchTeachers(searchTerm);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        clearSearch();
    };

    useEffect(() => {
        if (!location.state?.editingRoom) return;

        const room = location.state.editingRoom;
        setEditingRoom(room);

        if (cards.length > 0) {
            const card = cards.find((c: ICard) => c.id === room.cardId);
            if (card) setSelectedCard(card);
        }
    }, [location.state, cards]);

    useEffect(() => {
        getCards();
    }, []);

    useEffect(() => {
        getRooms();
    }, [selectedCard]);

    return (
        <React.Fragment>
            {showForm ? <Form createOrEdit={createOrEditTeacher} item={clickedTeacher} goBack={back}/> :
                <div className="mt-5 flex flex-col lg:flex-row gap-4">
                    {/* Linke Spalte - Teacher List */}
                    <div className="lg:w-1/6 flex flex-col items-center">
                        {/* Suchfeld */}
                        <div className="w-full mb-4 px-2">
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Lehrer suchen..."
                                        value={searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {searchTerm && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <IoCloseSharp size={18}/>
                                        </button>
                                    )}
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <IoSearch size={18}/>
                                    </button>
                                </div>
                            </form>
                            {isSearching && (
                                <div className="text-sm text-gray-500 mt-1">Suche läuft...</div>
                            )}
                        </div>

                        {showEditButton &&
                            <button
                                onClick={() => setShowEditButton(false)}
                                className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5"
                            >
                                Edit
                            </button>
                        }
                        <List
                            items={teachers}
                            handleClick={handleClickOfItem}
                            showDelete={!showEditButton}
                        />
                        {!showEditButton &&
                            <button
                                onClick={() => setShowForm(true)}
                                className="homeButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5"
                            >
                                Create
                            </button>
                        }
                    </div>

                    {/* Rechte Spalte - Map und RoomForm */}
                    <div className="lg:w-5/6 flex flex-col items-center">
                        {/* Klick-Position Controls */}
                        {clickPosition && (!showRoomForm) &&
                            <div className="flex items-center py-1 mb-2">
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

                        <select onChange={handleCardChange} value={selectedCard?.id || ''}>
                            {cards.map((card: ICard) => <option key={card.id} value={card.id}>{card.title}</option>)}
                        </select>

                        {selectedCard && <div className="w-full">
                            <Map
                                path={selectedCard.imagePath}
                                onTeacherAssign={handleTeacherAssign}
                                rooms={rooms}
                                clickPosition={clickPosition}
                                updateClickPosition={(x: number, y: number) => handleClickPosition(x, y)}
                            />
                        </div>}

                        {/* RoomForm direkt unter der Map - INNERHALB der rechten Spalte */}
                        {showRoomForm && clickPosition && (
                            <div className="w-full max-w-md mt-4">
                                <RoomForm
                                    key={1}
                                    clickPosition={clickPosition}
                                    onClose={() => {
                                        setShowRoomForm(false);
                                        getRooms();
                                    }}
                                    onSubmit={handleCreateRoom}
                                    isPositionEditable={false}
                                    onUpdate={updatePreview}
                                />
                            </div>
                        )}

                        {(editingRoom !== null) && (
                            <div className="w-full max-w-md mt-4">
                                <RoomForm
                                    key={2}
                                    initialData={editingRoom}
                                    onClose={() => {
                                        setEditingRoom(null);
                                        getRooms();
                                    }}
                                    onSubmit={handleEditRoom}
                                    isPositionEditable={true}
                                    onUpdate={updatePreview}
                                />
                            </div>
                        )}
                    </div>
                </div>
            }
        </React.Fragment>
    );
}

export default Homepage;