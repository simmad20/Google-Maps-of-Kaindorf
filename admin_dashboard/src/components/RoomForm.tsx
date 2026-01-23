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
        initialData || {
            id: '123',
            roomNumber: '',
            name: '',
            x: clickPosition?.x || 0,
            y: clickPosition?.y || 0,
            width: 50,
            height: 30,
            assignedObjectIds: [],
            cardId: ""
        }
    );

    const {selectedEvent} = useEvents();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        const updatedRoom: IRoom = {
            ...formData,
            [name]: name === 'x' || name === 'y' || name === 'width' || name === 'height'
                ? Number(value)
                : value
        };
        setFormData(updatedRoom);
        onUpdate?.(updatedRoom);
    };

    const updateForOnlyEvent = (event: ChangeEvent<HTMLInputElement>) => {
        if (!selectedEvent) return;
        const isChecked = event.target.checked;
        const updatedRoom = {
            ...formData,
            eventId: isChecked ? selectedEvent.id : undefined
        };

        console.log(updatedRoom);

        setFormData(updatedRoom);
        onUpdate?.(updatedRoom);
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="w-full max-w-md mt-4 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                    {initialData ? 'Raum bearbeiten' : 'Neuen Raum erstellen'}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <IoCloseSharp size={20}/>
                </button>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-3 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Raumnummer *
                        </label>
                        <input
                            type="text"
                            name="roomNumber"
                            value={formData.roomNumber}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                            placeholder="z.B. 1.1.15"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="z.B. Physik Labor"
                        />
                    </div>

                    {isPositionEditable ? (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    X-Position *
                                </label>
                                <input
                                    type="number"
                                    name="x"
                                    value={formData.x}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Y-Position *
                                </label>
                                <input
                                    type="number"
                                    name="y"
                                    value={formData.y}
                                    onChange={handleChange}
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    required
                                    min="0"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                            <span className="font-medium">Position festgelegt:</span> X={formData.x}, Y={formData.y}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Breite *
                            </label>
                            <input
                                type="number"
                                name="width"
                                value={formData.width}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                min="10"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Höhe *
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                                min="10"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">only in event</label>
                        <input type="checkbox" checked={typeof formData.eventId !== "undefined"&&formData.eventId!==null}
                               onChange={updateForOnlyEvent}/>
                    </div>

                    {/* Aktuelle Werte Anzeige */}
                    <div className="p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                        <div className="font-medium">Aktuelle Werte:</div>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                            <div>Position: {formData.x}×{formData.y}</div>
                            <div>Größe: {formData.width}×{formData.height}</div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                        Abbrechen
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        {initialData ? 'Speichern' : 'Raum erstellen'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoomForm;