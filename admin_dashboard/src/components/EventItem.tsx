import { IEvent } from "../models/interfaces.ts";

interface IEventItem {
    event: IEvent;
    isSelected?: boolean;
    onClick?: () => void;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

function EventItem({
                       event,
                       isSelected = false,
                       onClick,
                       showActions = false,
                       onEdit,
                       onDelete
                   }: IEventItem) {

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('de-DE', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    const truncateWords = (text: string, maxWords: number): string => {
        const words = text.trim().split(/\s+/);

        if (words.length <= maxWords) return text;

        return words.slice(0, maxWords).join(' ') + ' …';
    };


    return (
        <div
            className={`
                rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-200 transform
                ${isSelected
                ? 'ring-2 ring-blue-500 ring-offset-2 scale-[1.02] bg-blue-50'
                : 'bg-white hover:shadow-lg hover:-translate-y-1'
            }
            `}
            onClick={handleClick}
        >
            <div className="flex justify-between items-center gap-2">
                <h3 className="font-bold text-lg text-gray-800 truncate">
                    {event.name}
                </h3>

                <div className="flex items-center gap-2">
                    {/* Aktiv-Badge */}
                    {event.active && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full
                             bg-green-100 text-green-700">
                AKTIV
            </span>
                    )}

                    {/* Selected-Indikator */}
                    {isSelected && (
                        <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Beschreibung */}
                {event.description && (
                    <div className="mb-4">
                        <p className="text-gray-600 text-sm">
                            {truncateWords(event.description, 20)}
                        </p>
                    </div>
                )}

                {/* Zeitangabe */}
                <div className="flex items-center text-gray-500 text-sm mb-3">
                    <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{formatDate(event.startDateTime)}</span>
                </div>


                {showActions && (
                    <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
                        {onEdit && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onEdit();
                                }}
                                className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                Bearbeiten
                            </button>
                        )}
                        {onDelete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDelete();
                                }}
                                className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                            >
                                Löschen
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EventItem;