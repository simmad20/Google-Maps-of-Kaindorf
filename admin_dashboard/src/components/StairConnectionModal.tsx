import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface IStairConnectionModal {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
}

const StairConnectionModal =({
                                                                       isOpen,
                                                                       onClose,
                                                                       onConfirm
                                                                   }:IStairConnectionModal) => {
    const [name, setName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            setError('Please enter a name');
            return;
        }

        onConfirm(name.trim());
        setName('');
        setError('');
    };

    const handleClose = () => {
        setName('');
        setError('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-800">
                        🚶 Create Stair Connection
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Body */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Stair Connection Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setError('');
                            }}
                            placeholder="e.g. Main Stairs, North Stairs, Side Stairs..."
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                error ? 'border-red-500' : 'border-gray-300'
                            }`}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <p className="text-sm text-gray-700">
                            <strong>💡 Tip:</strong> Use descriptive names like
                            "Main Stairs", "North Stairs" or "Entrance Stairs" to easily
                            distinguish between different connections later.
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                        >
                            Create Connection
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StairConnectionModal;