import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import Map from "./Map.tsx";
import List from "./List.tsx";
import RoomForm from "./RoomForm.tsx";
import {ICard, IObject, IObjectType, IRoom} from "../models/interfaces.ts";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import {IoCloseSharp, IoSearch} from "react-icons/io5";
import RoomService from "../services/RoomService.tsx";
import {useLocation} from "react-router-dom";
import CardService from "../services/CardService.tsx";
import DynamicObjectForm from "./DynamicObjectForm.tsx";
import ObjectService from "../services/ObjectService.tsx";
import EventManagement from "./EventManagement.tsx";
import {useEvents} from "../context/EventContext.tsx";

function MapManager() {
    const {
        objects,
        types,
        selectedType,
        updateSelectedType,
        updateSearchTerm,
        searchObjects,
        clearSearch,
        isSearching,
        searchTerm
    } = useContext<ObjectContextType>(ObjectContext);

    const {selectedEvent} = useEvents();

    const [showForm, setShowForm] = useState<boolean>(false);
    const [showEditButton, setShowEditButton] = useState<boolean>(true);
    const [clickedObject, setClickedObject] = useState<IObject | undefined>(undefined);
    const [clickPosition, setClickPosition] = useState<{ x: number, y: number } | null>(null);
    const [showRoomForm, setShowRoomForm] = useState<boolean>(false);
    const [rooms, setRooms] = useState<IRoom[]>([]);
    const [editingRoom, setEditingRoom] = useState<IRoom | null>(null);
    const [cards, setCards] = useState<ICard[]>([]);
    const [selectedCard, setSelectedCard] = useState<ICard | undefined>(undefined);

    console.log(objects);

    const location = useLocation();

    const handleClickOfItem = (item: IObject) => {
        if (!showEditButton) {
            setClickedObject(item);
            setShowForm(true);
        }
    }

    const back = () => {
        setClickedObject(undefined);
        setShowForm(false);
    }

    const getRooms = () => {
        if (typeof selectedCard !== "undefined" && typeof selectedEvent !== "undefined") {
            console.log(selectedCard);
            RoomService.fetchAllRoomsFromCard(selectedCard.id, selectedEvent.id)
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

    useEffect(() => {
        getCards()
    }, [selectedEvent]);

    const handleTeacherAssign = useCallback(async (objectId: string, roomId: string) => {
        if (!selectedEvent) return;
        try {
            console.log(selectedEvent);
            await ObjectService.addObjectToRoom(objectId, roomId, selectedEvent.id);

            if (selectedCard) {
                const updatedRooms = await RoomService.fetchAllRoomsFromCard(selectedCard.id, selectedEvent.id);
                setRooms(updatedRooms);
            }

        } catch (error) {
            console.error("Fehler bei Zuordnung:", error);
        }
    }, [selectedCard, selectedEvent]);

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

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateSearchTerm(value);

        if (value.trim()) {
            searchObjects(value);
        } else {
            clearSearch();
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            searchObjects(searchTerm);
        }
    };

    const handleClearSearch = () => {
        updateSearchTerm('');
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
        getRooms();
    }, [selectedCard, selectedEvent]);

    return (
        <React.Fragment>
            {(showForm && selectedType) ?
                <DynamicObjectForm
                    item={clickedObject}
                    type={selectedType}
                    onSubmit={() => {
                    }}
                    goBack={back}
                />
                :
                <div className="mt-5 flex flex-col gap-4 w-full">
                    {/* Header mit Event und Card Selection */}
                    <div className="lg:w-5/6 flex flex-col md:flex-row gap-4 items-center justify-between px-4">

                        {/* Event Management */}
                        <EventManagement
                            onEventSelect={() => {
                            }}
                            className="flex-grow"
                        />

                        {/* Card Selection */}
                        <div className="w-full md:w-auto">
                            <select
                                onChange={handleCardChange}
                                value={selectedCard?.id || ''}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {cards.map((card: ICard) => (
                                    <option key={card.id} value={card.id}>
                                        {card.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Room Creation */}
                    <div className="lg:w-5/6 flex flex-col items-center">
                        {clickPosition && (!showRoomForm) &&
                            <div className="flex items-center py-1 mb-2">
                                <button
                                    className="modifyButton bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                                    onClick={() => setShowRoomForm(true)}
                                >
                                    New room
                                </button>
                                <button className="ms-5" onClick={() => setClickPosition(null)}>
                                    <IoCloseSharp/>
                                </button>
                            </div>
                        }

                        {/* Map */}
                        {selectedCard && (
                            <div className="w-full">
                                <Map
                                    path={selectedCard.imagePath}
                                    onTeacherAssign={handleTeacherAssign}
                                    rooms={rooms}
                                    clickPosition={clickPosition}
                                    updateClickPosition={(x: number, y: number) => handleClickPosition(x, y)}
                                />
                            </div>
                        )}

                        {/* Room Forms */}
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

                    {/* Type Selection and Search */}
                    <div className="mx-auto flex flex-col items-center gap-4">
                        {types ? (
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600">Typ:</span>
                                    <select
                                        onChange={(e) => updateSelectedType(types.find((t: IObjectType) => t.id === e.target.value))}
                                        value={selectedType?.id || ''}
                                        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Choose object type...</option>
                                        {types.map((t: IObjectType) => (
                                            <option key={t.id} value={t.id}>
                                                {t.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Search */}
                                {selectedType && (
                                    <div className="w-64">
                                        <form onSubmit={handleSearchSubmit} className="relative">
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder={`Search ${selectedType.name}`}
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
                                                    className="absolute right-2 top-1/2 transform-translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    <IoSearch size={18}/>
                                                </button>
                                            </div>
                                        </form>
                                        {isSearching && (
                                            <div className="text-sm text-gray-500 mt-1">Suche läuft...</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-gray-500">You have to make an object type to create objects</div>
                        )}
                    </div>

                    {/* Object Management */}
                    {selectedType && (
                        <div className="w-full flex flex-col items-center">
                            {/* Edit/Create Buttons */}
                            {showEditButton ? (
                                <button
                                    onClick={() => setShowEditButton(false)}
                                    className="modifyButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5 mb-2"
                                >
                                    Edit
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="modifyButton mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5 mb-2"
                                    >
                                        Create
                                    </button>
                                    <button
                                        className="p-2 text-gray-500 hover:text-gray-700"
                                        onClick={() => setShowEditButton(true)}
                                    >
                                        <IoCloseSharp size={20}/>
                                    </button>
                                </div>
                            )}

                            {/* Object List */}
                            <div className="w-full px-4">
                                <List
                                    items={objects}
                                    handleClick={handleClickOfItem}
                                    showDelete={!showEditButton}
                                />
                            </div>
                        </div>
                    )}
                </div>
            }
        </React.Fragment>
    );
}

export default MapManager;