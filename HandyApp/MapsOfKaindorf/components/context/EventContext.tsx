import React, {createContext, useState, useContext, useEffect, ReactNode} from 'react';
import {IEvent} from '@/models/interfaces';
import EventService from '@/services/EventService';

export interface EventContextType {
    activeEvent?: IEvent;
    loading: boolean;
    loadActiveEvent: () => Promise<void>;
}

const EventContext = createContext<EventContextType>({
    activeEvent: undefined,
    loading: false,
    loadActiveEvent: async () => {
    }
});

export const EventProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [activeEvent, setActiveEvent] = useState<IEvent | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);

    const loadActiveEvent = async () => {
        setLoading(true);
        try {
            const event = await EventService.fetchActiveEvent();
            setActiveEvent(event);
        } catch (err) {
            console.error('Error loading active event:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadActiveEvent();
    }, []);

    return (
        <EventContext.Provider value={{activeEvent, loading, loadActiveEvent}}>
            {children}
        </EventContext.Provider>
    );
};

export const useEvent = () => useContext(EventContext);