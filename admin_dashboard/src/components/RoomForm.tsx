import React, {useState} from 'react';
import {IRoom} from '../models/interfaces.ts';

interface RoomFormProps {
    initialData?: IRoom;
    clickPosition?: { x: number, y: number };
    onSubmit: (data: Omit<IRoom, 'id' | 'teacher_ids'>) => void;
    onClose: () => void;
    isPositionEditable?: boolean;
}

const RoomForm: React.FC<RoomFormProps> = ({
                                               initialData,
                                               clickPosition,
                                               onSubmit,
                                               onClose,
                                               isPositionEditable = true
                                           }) => {
    const [formData, setFormData] = useState<Omit<IRoom, 'id' | 'teacher_ids'>>(
        initialData || {
            room_number: '',
            name: '',
            x: clickPosition?.x || 0,
            y: clickPosition?.y || 0,
            width: 15,
            height: 15
        }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'x' || name === 'y' || name === 'width' || name === 'height'
                ? Number(value)
                : value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    {initialData ? 'Raum bearbeiten' : 'Neuen Raum erstellen'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Raumnummer
                            </label>
                            <input
                                type="text"
                                name="room_number"
                                value={formData.room_number}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
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
                                className="w-full p-2 border rounded"
                                required
                            />
                        </div>

                        {isPositionEditable ? (
                            <>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        X-Position
                                    </label>
                                    <input
                                        type="number"
                                        name="x"
                                        value={formData.x}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Y-Position
                                    </label>
                                    <input
                                        type="number"
                                        name="y"
                                        value={formData.y}
                                        onChange={handleChange}
                                        className="w-full p-2 border rounded"
                                        required
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-gray-500">
                                Position: X={formData.x}, Y={formData.y}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Breite
                            </label>
                            <input
                                type="number"
                                name="width"
                                value={formData.width}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Höhe
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                className="w-full p-2 border rounded"
                                required
                                min="0"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation(); // Sicherheitshalber
                                onClose();
                            }}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Abbrechen
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {initialData ? 'Speichern' : 'Erstellen'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RoomForm;