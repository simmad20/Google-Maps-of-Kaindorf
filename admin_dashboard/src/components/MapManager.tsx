import React, {ChangeEvent, useCallback, useContext, useEffect, useState} from 'react';
import Map from "./Map.tsx";
import List from "./List.tsx";
import RoomForm from "./RoomForm.tsx";
import {ICard, IObject, IObjectType, IRoom} from "../models/interfaces.ts";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import {IoCloseSharp, IoSearch, IoAddCircleOutline, IoTrashOutline, IoWarningOutline} from "react-icons/io5";
import RoomService from "../services/RoomService.tsx";
import {useLocation} from "react-router-dom";
import CardService from "../services/CardService.tsx";
import DynamicObjectForm from "./DynamicObjectForm.tsx";
import ObjectService from "../services/ObjectService.tsx";
import EventManagement from "./EventManagement.tsx";
import {useEvents} from "../context/EventContext.tsx";
import NodeEditor from "./NodeEditor.tsx";
import CreateCardModal from "./CreateCardModal.tsx";
import {SELECTED_CONF, URL_START} from "../config.ts";
import {useAuth} from "../context/AuthContext.tsx";

function MapManager() {
    const {
        objects, types, selectedType, updateSelectedType,
        updateSearchTerm, searchObjects, clearSearch, isSearching, searchTerm
    } = useContext<ObjectContextType>(ObjectContext);

    const {selectedEvent} = useEvents();
    const {isViewer} = useAuth();

    const [showForm, setShowForm]               = useState<boolean>(false);
    const [showEditButton, setShowEditButton]   = useState<boolean>(true);
    const [showRoomForm, setShowRoomForm]       = useState<boolean>(false);
    const [showNodeEditor, setShowNodeEditor]   = useState(false);
    const [clickedObject, setClickedObject]     = useState<IObject | undefined>(undefined);
    const [clickPosition, setClickPosition]     = useState<{ x: number, y: number } | null>(null);
    const [rooms, setRooms]                     = useState<IRoom[]>([]);
    const [editingRoom, setEditingRoom]         = useState<IRoom | null>(null);
    const [cards, setCards]                     = useState<ICard[]>([]);
    const [selectedCard, setSelectedCard]       = useState<ICard | undefined>(undefined);
    const [showCreateCard, setShowCreateCard]   = useState(false);
    const [isDeletingCard, setIsDeletingCard]   = useState(false);
    const [deleteCardError, setDeleteCardError] = useState<string | null>(null);

    const location = useLocation();
    const canAssign = !!selectedEvent;

    const handleClickOfItem = (item: IObject) => {
        if (!showEditButton) { setClickedObject(item); setShowForm(true); }
    };

    const back = () => { setClickedObject(undefined); setShowForm(false); };

    const getRooms = () => {
        if (selectedCard) {
            RoomService.fetchAllRoomsFromCard(selectedCard.id, selectedEvent?.id ?? "")
                .then((r: IRoom[]) => setRooms(r))
                .catch((err: Error) => console.log(err));
        }
    };

    const getCards = () => {
        CardService.fetchAllCards()
            .then((c: ICard[]) => {
                setCards(c);
                setSelectedCard(prev => prev ?? c[0]);
            })
            .catch((err: Error) => console.log(err));
    };

    useEffect(() => { getCards(); }, [selectedEvent]);

    const handleTeacherAssign = useCallback(async (objectId: string, roomId: string) => {
        if (!selectedEvent) return;
        try {
            await ObjectService.addObjectToRoom(objectId, roomId, selectedEvent.id);
            if (selectedCard) {
                const updatedRooms = await RoomService.fetchAllRoomsFromCard(selectedCard.id, selectedEvent.id);
                setRooms(updatedRooms);
            }
        } catch (error) {
            console.error('Assignment error:', error);
        }
    }, [selectedCard, selectedEvent]);

    const handleCreateRoom = (roomData: Omit<IRoom, 'id' | 'assignedObjectIds'>) => {
        if (!selectedCard) return;
        RoomService.createRoom(roomData, selectedCard.id)
            .then((newRoom: IRoom) => {
                setRooms(prev => [...prev, newRoom]);
                setShowRoomForm(false);
                setClickPosition(null);
            })
            .catch((error: Error) => console.error('Error creating room:', error.message));
    };

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
            .catch((error: Error) => console.error('Error updating room:', error.message));
    };

    const updatePreview = (previewRoom: IRoom) => {
        setRooms(prev => prev.map(r => r.id === previewRoom.id ? previewRoom : r));
    };

    const handleCardChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedCard(cards.find(c => c.id === e.target.value));
        setDeleteCardError(null);
    };

    const handleClickPosition = (x: number, y: number) => {
        setClickPosition({x, y});
        setRooms(prev => [...prev.filter(r => r.id !== '123'), {
            id: '123', roomNumber: '', name: '', x, y,
            width: 50, height: 30, assignedObjectIds: [],
            cardId: selectedCard?.id || ''
        }]);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        updateSearchTerm(value);
        if (value.trim()) searchObjects(value); else clearSearch();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) searchObjects(searchTerm);
    };

    const handleClearSearch = () => { updateSearchTerm(''); clearSearch(); };

    useEffect(() => {
        if (!location.state?.editingRoom) return;
        const room = location.state.editingRoom;
        setEditingRoom(room);
        if (cards.length > 0) {
            const card = cards.find(c => c.id === room.cardId);
            if (card) setSelectedCard(card);
        }
    }, [location.state, cards]);

    useEffect(() => { getRooms(); }, [selectedCard, selectedEvent]);

    const handleCardCreated = (newCard: ICard) => {
        setCards(prev => [...prev, newCard]);
        setSelectedCard(newCard);
        setShowCreateCard(false);
    };

    const handleDeleteCard = async () => {
        if (!selectedCard) return;
        const confirmed = window.confirm(`Delete card "${selectedCard.title}"? This cannot be undone.`);
        if (!confirmed) return;
        setIsDeletingCard(true);
        setDeleteCardError(null);
        try {
            await CardService.deleteCard(selectedCard.id);
            const remaining = cards.filter(c => c.id !== selectedCard.id);
            setCards(remaining);
            setSelectedCard(remaining[0]);
            setRooms([]);
        } catch {
            setDeleteCardError('Could not delete card. Please try again.');
        } finally {
            setIsDeletingCard(false);
        }
    };

    return (
        <React.Fragment>
            {/* Tab Navigation */}
            <div className="flex gap-1 mb-0 border-b border-gray-200">
                <button
                    onClick={() => setShowNodeEditor(false)}
                    className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border border-b-0 transition-colors ${
                        !showNodeEditor
                            ? 'bg-white border-gray-200 text-purple-600 -mb-px z-10'
                            : 'bg-gray-50 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Rooms
                </button>
                {/* Node Editor für alle sichtbar, Viewer können nur lesen */}
                <button
                    onClick={() => setShowNodeEditor(true)}
                    className={`px-5 py-2.5 text-sm font-medium rounded-t-lg border border-b-0 transition-colors ${
                        showNodeEditor
                            ? 'bg-white border-gray-200 text-purple-600 -mb-px z-10'
                            : 'bg-gray-50 border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    Navigation Nodes
                </button>
            </div>

            {(showNodeEditor && selectedCard) ? (
                <NodeEditor
                    card={selectedCard}
                    allCards={cards}
                    onCardChange={(newCard:ICard) => setSelectedCard(newCard)}
                />
            ) : (showForm && selectedType) ? (
                <DynamicObjectForm item={clickedObject} type={selectedType} goBack={back}/>
            ) : (
                <div className="mt-4 flex flex-col gap-4 w-full">

                    {/* Header: Event + Card Selector */}
                    <div className="lg:w-5/6 flex flex-col md:flex-row gap-3 items-start md:items-center justify-between px-4">
                        <EventManagement onEventSelect={() => {}} className="flex-grow"/>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <select
                                onChange={handleCardChange}
                                value={selectedCard?.id || ''}
                                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                            >
                                {cards.length === 0 && <option value="">No cards available</option>}
                                {cards.map(card => (
                                    <option key={card.id} value={card.id}>{card.title}</option>
                                ))}
                            </select>

                            {!isViewer && (
                                <>
                                    <button
                                        onClick={() => setShowCreateCard(true)}
                                        title="Create new card"
                                        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors whitespace-nowrap"
                                    >
                                        <IoAddCircleOutline size={16}/>
                                        <span className="hidden sm:inline">New Card</span>
                                    </button>

                                    {selectedCard && (
                                        <button
                                            onClick={handleDeleteCard}
                                            disabled={isDeletingCard}
                                            title={`Delete card "${selectedCard.title}"`}
                                            className="flex items-center justify-center px-3 py-2 text-sm bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg transition-colors"
                                        >
                                            {isDeletingCard ? (
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                                </svg>
                                            ) : (
                                                <IoTrashOutline size={16}/>
                                            )}
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {deleteCardError && (
                        <div className="lg:w-5/6 px-4">
                            <div className="px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                {deleteCardError}
                            </div>
                        </div>
                    )}

                    {!canAssign && (
                        <div className="lg:w-5/6 px-4">
                            <div className="flex items-center gap-2.5 px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                <IoWarningOutline size={16} className="flex-shrink-0 text-amber-500"/>
                                <span>No event selected. Object assignment to rooms is disabled until an event is chosen.</span>
                            </div>
                        </div>
                    )}

                    <div className="lg:w-5/6 flex flex-col items-center px-4">
                        {clickPosition && !showRoomForm && !isViewer && (
                            <div className="flex items-center gap-3 py-2 mb-2">
                                <button
                                    className="px-4 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                                    onClick={() => setShowRoomForm(true)}
                                >
                                    Create room here
                                </button>
                                <button onClick={() => setClickPosition(null)} className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                                    <IoCloseSharp size={18}/>
                                </button>
                            </div>
                        )}

                        {selectedCard ? (
                            <div className="w-full relative">
                                <Map
                                    path={`${URL_START[SELECTED_CONF]}${selectedCard.imagePath}`}
                                    onTeacherAssign={handleTeacherAssign}
                                    rooms={rooms}
                                    clickPosition={clickPosition}
                                    updateClickPosition={handleClickPosition}
                                    assignDisabled={!canAssign || isViewer}
                                />
                            </div>
                        ) : (
                            <div className="w-full flex flex-col items-center justify-center py-20 gap-3 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                <div className="w-12 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                                    <IoAddCircleOutline size={24} className="text-gray-300"/>
                                </div>
                                <p className="text-sm font-medium text-gray-500">No floor plans uploaded yet</p>
                                <p className="text-xs text-gray-400">Click <strong>New Card</strong> above to upload a floor plan image.</p>
                            </div>
                        )}

                        {showRoomForm && clickPosition && !isViewer && (
                            <div className="w-full max-w-md mt-4">
                                <RoomForm
                                    key={1}
                                    clickPosition={clickPosition}
                                    onClose={() => { setShowRoomForm(false); getRooms(); }}
                                    onSubmit={handleCreateRoom}
                                    isPositionEditable={false}
                                    onUpdate={updatePreview}
                                />
                            </div>
                        )}

                        {editingRoom !== null && !isViewer && (
                            <div className="w-full max-w-md mt-4">
                                <RoomForm
                                    key={2}
                                    initialData={editingRoom}
                                    onClose={() => { setEditingRoom(null); getRooms(); }}
                                    onSubmit={handleEditRoom}
                                    isPositionEditable={true}
                                    onUpdate={updatePreview}
                                />
                            </div>
                        )}
                    </div>

                    {/* Object type filter + search */}
                    <div className="px-4 flex flex-col md:flex-row items-start md:items-center gap-3">
                        {types ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500 whitespace-nowrap">Object type:</span>
                                    <select
                                        onChange={e => updateSelectedType(types.find(t => t.id === e.target.value)!)}
                                        value={selectedType?.id || ''}
                                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                                    >
                                        <option value="">Select type...</option>
                                        {types.map((t: IObjectType) => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {selectedType && (
                                    <div className="w-64">
                                        <form onSubmit={handleSearchSubmit} className="relative">
                                            <input
                                                type="text"
                                                placeholder={`Search ${selectedType.name}...`}
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                className="w-full px-3 py-2 pr-16 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                            />
                                            {searchTerm && (
                                                <button type="button" onClick={handleClearSearch}
                                                        className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                    <IoCloseSharp size={16}/>
                                                </button>
                                            )}
                                            <button type="submit"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                                <IoSearch size={16}/>
                                            </button>
                                        </form>
                                        {isSearching && <p className="text-xs text-gray-400 mt-1">Searching...</p>}
                                    </div>
                                )}
                            </>
                        ) : (
                            <p className="text-sm text-gray-500">No object types defined. Create one under Object Types first.</p>
                        )}
                    </div>

                    {/* Object list */}
                    {selectedType && (
                        <div className="w-full flex flex-col items-start px-4 gap-3">
                            {!isViewer && (
                                showEditButton ? (
                                    <button
                                        onClick={() => setShowEditButton(false)}
                                        className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg transition-colors"
                                    >
                                        Edit objects
                                    </button>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                                        >
                                            Create new object
                                        </button>
                                        <button
                                            onClick={() => setShowEditButton(true)}
                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            <IoCloseSharp size={18}/>
                                        </button>
                                    </div>
                                )
                            )}
                            <div className="w-full">
                                <List
                                    items={objects}
                                    handleClick={handleClickOfItem}
                                    showDelete={!isViewer && !showEditButton}
                                />
                            </div>
                        </div>
                    )}
                </div>
            )}

            <CreateCardModal
                isOpen={showCreateCard}
                onClose={() => setShowCreateCard(false)}
                onCreated={handleCardCreated}
            />
        </React.Fragment>
    );
}

export default MapManager;