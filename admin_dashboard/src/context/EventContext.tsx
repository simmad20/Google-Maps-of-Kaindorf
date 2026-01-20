import React, {createContext, useState, useContext, useEffect, ReactNode} from 'react';
import {IEvent} from '../models/interfaces.ts';
import EventService from '../services/EventService.tsx';

export interface EventContextType {
    events: IEvent[];
    selectedEvent: IEvent | undefined;
    loading: boolean;
    loadEvents: () => Promise<void>;
    selectEvent: (event: IEvent) => void;
    createEvent: () => void;
    activateEvent: (eventId: string) => Promise<void>;
    editEvent: (event: IEvent) => void;
    deleteEvent: (eventId: string) => Promise<boolean>;
    isCreating: boolean;
    isEditing: boolean;
    editingEvent: IEvent | undefined;
    finishEventForm: () => void;
}

export const EventContext = createContext<EventContextType>({
    events: [],
    selectedEvent: undefined,
    loading: false,
    loadEvents: async () => {
    },
    selectEvent: () => {
    },
    createEvent: () => {
    },
    activateEvent: async () => {
    },
    editEvent: () => {
    },
    deleteEvent: async () => false,
    isCreating: false,
    isEditing: false,
    editingEvent: undefined,
    finishEventForm: () => {
    }
});

interface EventProviderProps {
    children: ReactNode;
    initialEventId?: string;
}

export const EventProvider: React.FC<EventProviderProps> = ({children, initialEventId}) => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<IEvent | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingEvent, setEditingEvent] = useState<IEvent | undefined>(undefined);

    const loadEvents = async () => {
        try {
            setLoading(true);
            const fetchedEvents = await EventService.fetchAllEvents();
            setEvents(fetchedEvents);

            // Automatisch erstes Event auswählen, wenn noch keins ausgewählt ist
            if (fetchedEvents.length > 0 && !selectedEvent) {
                if (initialEventId) {
                    const initialEvent = fetchedEvents.find(e => e.id === initialEventId);
                        if (initialEvent) {
                            setSelectedEvent(initialEvent);
                        } else {
                            setSelectedEvent(fetchedEvents[0]);
                        }
                } else {
                    setSelectedEvent(fetchedEvents[0]);
                }
            }
        } catch (error) {
            console.error('Error loading events:', error);
        } finally {
            setLoading(false);
        }
    };

    const selectEvent = (event: IEvent) => {
        setSelectedEvent(event);
    };

    const createEvent = () => {
        setIsCreating(true);
        setIsEditing(false);
        setEditingEvent(undefined);
    };

    const editEvent = (event: IEvent) => {
        setIsEditing(true);
        setIsCreating(false);
        setEditingEvent(event);
    };

    const deleteEvent = async (eventId: string): Promise<boolean> => {
        try {
            await EventService.deleteEvent(eventId);
            await loadEvents();

            // Nach Löschung anderes Event auswählen
            const remainingEvents = events.filter(e => e.id !== eventId);
            if (remainingEvents.length > 0) {
                setSelectedEvent(remainingEvents[0]);
            } else {
                setSelectedEvent(undefined);
                setIsCreating(true); // Keine Events mehr -> Erstellmodus aktivieren
            }
            return true;
        } catch (error) {
            console.error('Error deleting event:', error);
            return false;
        }
    };

    const activateEvent = async (eventId: string) => {
        try {
            const activatedEvent = await EventService.activateEvent(eventId);

            const updatedEvents = events.map(e => ({
                ...e,
                active: e.id === activatedEvent.id
            }));

            setEvents(updatedEvents);

            setSelectedEvent(
                updatedEvents.find(e => e.id === activatedEvent.id)
            );
        } catch (error) {
            console.error("Error activating event:", error);
            alert("Event konnte nicht aktiviert werden");
        }
    };


    const finishEventForm = () => {
        setIsCreating(false);
        setIsEditing(false);
        setEditingEvent(undefined);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    return (
        <EventContext.Provider value={{
            events,
            selectedEvent,
            loading,
            loadEvents,
            selectEvent,
            createEvent,
            activateEvent,
            editEvent,
            deleteEvent,
            isCreating,
            isEditing,
            editingEvent,
            finishEventForm
        }}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvents = () => useContext(EventContext);