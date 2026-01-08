import React from "react";
import {IObject, IObjectType, IObjectField} from "../models/interfaces.ts";
import {FaTrash} from "react-icons/fa";

interface ObjectCardProps {
    object: IObject;
    type: IObjectType;
    onDelete?: (objectId: string) => void;
}

const ObjectCard: React.FC<ObjectCardProps> = ({object, type, onDelete}) => {

    const cardFields: IObjectField[] = type.schema
        .filter(f => f.card?.visible)
        .sort((a, b) => a.card.order - b.card.order);

    return (
        <div className="border rounded-lg p-4 flex justify-between gap-4">
            <div className="flex gap-4">
                {cardFields.some(f => f.type === "image") && (
                    <div
                        className="p-3 rounded-full w-16 h-16 flex items-center justify-center"
                        style={{backgroundColor: `${type.color}22`}}
                    >
                        {(() => {
                            const imgField = cardFields.find(f => f.type === "image");
                            const url = imgField && object.attributes[imgField.key];
                            return url ? (
                                <img
                                    src={url}
                                    className="w-12 h-12 object-cover rounded-full"
                                />
                            ) : null;
                        })()}
                    </div>
                )}

                <div>
                    {cardFields
                        .filter(f => f.type !== "image")
                        .map(field => (
                            <div key={field.key}>
                                <div className="text-sm text-gray-500">
                                    {field.label}
                                </div>
                                <div className="font-medium">
                                    {object.attributes[field.key] ?? "-"}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {onDelete && (
                <button
                    onClick={() => onDelete(object.id)}
                    className="text-red-600 hover:text-red-800"
                >
                    <FaTrash/>
                </button>
            )}
        </div>
    );
};

export default ObjectCard;
