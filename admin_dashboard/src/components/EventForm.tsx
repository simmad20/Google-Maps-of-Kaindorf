import React, {useState, useEffect} from 'react';
import {IEvent} from "../models/interfaces.ts";
import EventService from "../services/EventService.tsx";

interface IEventForm {
    eventToEdit?: IEvent;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function EventForm({eventToEdit, onSuccess, onCancel}: IEventForm) {

    const [event, setEvent] = useState<Partial<IEvent>>({
        name: '',
        description: '',
        startDateTime: '',
        endDateTime: '',
        themeColor: '#3B82F6',
        announcement: ''
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (eventToEdit) {
            setEvent({
                ...eventToEdit,
                startDateTime: formatDateForInput(eventToEdit.startDateTime),
                endDateTime: formatDateForInput(eventToEdit.endDateTime),
            });
        }
    }, [eventToEdit]);

    const formatDateForInput = (date?: string | Date) => {
        if (!date) return '';
        const d = new Date(date);
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
    };

    const formatDateForBackend = (date: string) => {
        return new Date(date).toISOString();
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const {name, value, type, checked} = e.target as HTMLInputElement;

        setEvent(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            if (!event.name?.trim()) {
                throw new Error('event-name is required');
            }

            if (!event.startDateTime) {
                throw new Error('start- and enddate are required');
            }

            const payload: IEvent = {
                ...event,
                startDateTime: formatDateForBackend(event.startDateTime as string),
                endDateTime: event.endDateTime
                    ? formatDateForBackend(event.endDateTime as string)
                    : undefined
            } as IEvent;

            if (eventToEdit?.id) {
                await EventService.updateEvent({...payload, id: eventToEdit.id});
                setSuccess('Successfully updated event!');
            } else {
                await EventService.createEvent(payload);
                setSuccess('Successfully created event!');
            }

            setTimeout(() => {
                onSuccess?.();
            }, 1200);

        } catch (err) {
            setError((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6">
                {eventToEdit ? 'edit event' : 'create new event'}
            </h2>

            {error && <p className="mb-4 text-red-600">{error}</p>}
            {success && <p className="mb-4 text-green-600">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name */}
                <input
                    name="name"
                    placeholder="event-name *"
                    value={event.name || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                />

                {/* Start */}
                <input
                    type="datetime-local"
                    name="startDateTime"
                    value={event.startDateTime as string || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                    required
                />

                {/* Ende */}
                <input
                    type="datetime-local"
                    name="endDateTime"
                    value={event.endDateTime as string || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                />

                {/* Beschreibung */}
                <textarea
                    name="description"
                    placeholder="description"
                    rows={3}
                    value={event.description || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                />

                {/* Announcement */}
                <textarea
                    name="announcement"
                    placeholder="Admin-announcement (Banner / Push)"
                    rows={2}
                    value={event.announcement || ''}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-lg"
                />

                {/* Theme Color */}
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Theme-Color</label>
                    <input
                        type="color"
                        name="themeColor"
                        value={event.themeColor || '#3B82F6'}
                        onChange={handleInputChange}
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    {onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2"
                        >
                            cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        {submitting ? 'saving…' : 'save'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EventForm;