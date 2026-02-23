import React, {ChangeEvent, useState} from 'react';
import {IRoom} from '../models/interfaces.ts';
import {IoCloseSharp} from "react-icons/io5";
import {useEvents} from "../context/EventContext.tsx";

interface RoomFormProps {
    initialData?: IRoom;
    clickPosition?: { x: number, y: number };
    onSubmit: (data: Omit<IRoom, 'id' | 'assignedObjectIds'>) => void;
    onClose: () => void;
    isPositionEditable?: boolean;
    onUpdate?: (previewRoom: IRoom) => void;
}

const RoomForm: React.FC<RoomFormProps> = ({
                                               initialData,
                                               clickPosition,
                                               onSubmit,
                                               onClose,
                                               isPositionEditable = true,
                                               onUpdate
                                           }) => {
    const [formData, setFormData] = useState<IRoom>(
        initialData ?? {
            id: '123',
            roomNumber: '',
            name: '',
            x: clickPosition?.x ?? 0,
            y: clickPosition?.y ?? 0,
            width: 50,
            height: 30,
            assignedObjectIds: [],
            cardId: ''
        }
    );

    const {selectedEvent} = useEvents();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const updated: IRoom = {
            ...formData,
            [name]: ['x', 'y', 'width', 'height'].includes(name) ? Number(value) : value
        };
        setFormData(updated);
        onUpdate?.(updated);
    };

    const handleEventScopeChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!selectedEvent) return;
        const updated = {
            ...formData,
            eventId: e.target.checked ? selectedEvent.id : undefined
        };
        setFormData(updated);
        onUpdate?.(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">
                    {initialData ? 'Edit Room' : 'Create Room'}
                </h2>
                <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <IoCloseSharp size={18} />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-4 space-y-4">
                {/* Room number */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Room number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        required
                        placeholder="e.g. 1.1.15"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Name */}
                <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Physics Lab"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                </div>

                {/* Position */}
                {isPositionEditable ? (
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                X position <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="x"
                                value={formData.x}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1.5">
                                Y position <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="y"
                                value={formData.y}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                ) : (
                    <div className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-500">
                        Position fixed at X={formData.x}, Y={formData.y}
                    </div>
                )}

                {/* Size */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Width <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="width"
                            value={formData.width}
                            onChange={handleChange}
                            required
                            min="10"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1.5">
                            Height <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            required
                            min="10"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Event scope toggle */}
                {selectedEvent && (
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={formData.eventId !== undefined && formData.eventId !== null}
                            onChange={handleEventScopeChange}
                            className="w-4 h-4 accent-purple-600"
                        />
                        <span className="text-xs text-gray-600 group-hover:text-gray-800 transition-colors">
                            Visible only in current event ({selectedEvent.name})
                        </span>
                    </label>
                )}

                {/* Current values summary */}
                <div className="px-3 py-2 bg-gray-50 border border-gray-100 rounded-lg text-xs text-gray-400">
                    Position: {formData.x} × {formData.y} &nbsp;&mdash;&nbsp; Size: {formData.width} × {formData.height}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-1 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                        {initialData ? 'Save changes' : 'Create room'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoomForm;