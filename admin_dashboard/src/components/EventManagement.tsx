import React, {useState} from 'react';
import {IEvent} from '../models/interfaces.ts';
import EventItem from './EventItem.tsx';
import EventForm from './EventForm.tsx';
import {useEvents} from "../context/EventContext.tsx";
import {IoChevronDown} from "react-icons/io5";

interface EventManagementProps {
    onEventSelect?: (event: IEvent) => void;
    className?: string;
}

const EventManagement: React.FC<EventManagementProps> = ({onEventSelect, className = ''}) => {
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
        if (onEventSelect) onEventSelect(event);
        setShowEventSelector(false);
    };

    const handleDeleteEvent = async () => {
        if (!selectedEvent?.id) return;
        if (window.confirm(`Delete event "${selectedEvent.name}"? This cannot be undone.`)) {
            const success = await deleteEvent(selectedEvent.id);
            if (!success) alert('Could not delete event.');
        }
    };

    const handleEventFormSuccess = async () => {
        await loadEvents();
        finishEventForm();
    };

    if (isCreating || isEditing) {
        return (
            <div className={className}>
                <EventForm
                    eventToEdit={editingEvent}
                    onSuccess={handleEventFormSuccess}
                    onCancel={finishEventForm}
                />
            </div>
        );
    }

    if (loading) {
        return (
            <div className={className}>
                <p className="text-sm text-gray-400">Loading events...</p>
            </div>
        );
    }

    return (
        <div className={`relative ${className}`}>
            <div className="flex flex-wrap items-center gap-2">

                {/* Current event display */}
                {selectedEvent ? (
                    <button
                        onClick={() => setShowEventSelector(!showEventSelector)}
                        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:border-purple-400 transition-colors bg-white"
                    >
                        <span className="font-medium text-gray-800">{selectedEvent.name}</span>
                        {selectedEvent.active && (
                            <span className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full font-medium">
                                Active
                            </span>
                        )}
                        <IoChevronDown size={14} className={`text-gray-400 transition-transform ${showEventSelector ? 'rotate-180' : ''}`} />
                    </button>
                ) : (
                    <span className="text-sm text-gray-400 italic">No event selected</span>
                )}

                {/* Actions */}
                <button
                    onClick={createEvent}
                    className="px-3 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                >
                    New event
                </button>

                {selectedEvent && (
                    <>
                        {!selectedEvent.active && (
                            <button
                                onClick={() => activateEvent(selectedEvent.id!)}
                                className="px-3 py-2 text-sm border border-gray-300 text-gray-600 hover:border-purple-400 hover:text-purple-600 rounded-lg transition-colors"
                            >
                                Set active
                            </button>
                        )}
                        <button
                            onClick={() => editEvent(selectedEvent)}
                            className="px-3 py-2 text-sm border border-gray-300 text-gray-600 hover:border-gray-400 rounded-lg transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            onClick={handleDeleteEvent}
                            className="px-3 py-2 text-sm border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>

            {/* Dropdown */}
            {showEventSelector && events.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-xl shadow-lg z-50 border border-gray-200 overflow-hidden">
                    <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="cursor-pointer"
                                onClick={() => handleEventSelect(event)}
                            >
                                <EventItem
                                    event={event}
                                    isSelected={event.id === selectedEvent?.id}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                        <span className="text-xs text-gray-400">{events.length} event(s)</span>
                        <button
                            onClick={() => setShowEventSelector(false)}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventManagement;