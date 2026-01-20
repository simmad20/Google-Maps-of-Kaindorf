import React, { useState } from 'react';
import { IEvent } from '../models/interfaces.ts';
import EventItem from './EventItem.tsx';
import EventForm from './EventForm.tsx';
import {useEvents} from "../context/EventContext.tsx";

interface EventManagementProps {
    onEventSelect?: (event: IEvent) => void;
    className?: string;
}

const EventManagement: React.FC<EventManagementProps> = ({
                                                             onEventSelect,
                                                             className = ''
                                                         }) => {
    const {
        events,
        selectedEvent,
        loading,
        selectEvent,
        createEvent,
        activateEvent,
        editEvent,
        deleteEvent,
        loadEvents,
        isCreating,
        isEditing,
        editingEvent,
        finishEventForm
    } = useEvents();

    const [showEventSelector, setShowEventSelector] = useState(false);

    const handleEventSelect = (event: IEvent) => {
        selectEvent(event);
        if (onEventSelect) {
            onEventSelect(event);
        }
        setShowEventSelector(false);
    };

    const handleCreateNew = () => {
        createEvent();
    };

    const handleEditEvent = () => {
        if (selectedEvent) {
            editEvent(selectedEvent);
        }
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent || !selectedEvent.id) return;

        if (window.confirm(`Möchten Sie das Event "${selectedEvent.name}" wirklich löschen?`)) {
            const success = await deleteEvent(selectedEvent.id);
            if (!success) {
                alert('Event konnte nicht gelöscht werden');
            }
        }
    };

    const handleEventFormSuccess = async () => {
        await loadEvents();
        finishEventForm();
    };

    const handleEventFormCancel = () => {
        finishEventForm();
    };

    if (isCreating || isEditing) {
        return (
            <div className={className}>
                <EventForm
                    eventToEdit={editingEvent}
                    onSuccess={handleEventFormSuccess}
                    onCancel={handleEventFormCancel}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className={className}>
                <div className="text-center py-4">Events werden geladen...</div>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            {/* Event Display und Actions */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {selectedEvent && (
                    <EventItem
                        event={selectedEvent}
                        isSelected={true}
                        onClick={() => setShowEventSelector(!showEventSelector)}
                        showActions={false}
                    />
                )}

                {!selectedEvent && events.length === 0 && (
                    <div className="text-gray-500 italic">Keine Events vorhanden</div>
                )}

                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={handleCreateNew}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                    >
                        + Neues Event
                    </button>

                    {selectedEvent && (
                        <>
                            {!selectedEvent.active && (
                                <button
                                    onClick={() => activateEvent(selectedEvent.id!)}
                                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
                                >
                                    Aktiv setzen
                                </button>
                            )}

                            {selectedEvent.active && (
                                <span className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                Aktives Event
            </span>
                            )}

                            <button
                                onClick={handleEditEvent}
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                                Bearbeiten
                            </button>

                            <button
                                onClick={handleDeleteEvent}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                Löschen
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Event Dropdown */}
            {showEventSelector && events.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-full max-w-md bg-white rounded-xl shadow-xl z-50 border border-gray-200">
                    <div className="p-2 max-h-80 overflow-y-auto">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="mb-2 last:mb-0 cursor-pointer"
                                onClick={() => handleEventSelect(event)}
                            >
                                <EventItem
                                    event={event}
                                    isSelected={event.id === selectedEvent?.id}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-between">
                        <span className="text-sm text-gray-500">
                            {events.length} Event(s)
                        </span>
                        <button
                            onClick={() => setShowEventSelector(false)}
                            className="text-sm text-gray-500 hover:text-gray-700"
                        >
                            Schließen
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;