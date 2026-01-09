import {useContext} from "react";
import {IObject, IObjectType, IObjectField} from "../models/interfaces";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";

interface IItem {
    item: IObject;
    objectType: IObjectType;
    handleClick: (object: IObject) => void;
    showDelete?: boolean;
}

function Item({item, objectType, handleClick, showDelete = false}: IItem) {
    const {handleDelete} = useContext<ObjectContextType>(ObjectContext);

    const cardFields: IObjectField[] = objectType.schema
        .filter(f => f.card?.visible)
        .sort((a, b) => a.card.order - b.card.order);

    const imageField = cardFields.find(f => f.type === "image");
    const imageUrl = imageField
        ? item.attributes[imageField.key]
        : undefined;

    const [{isDragging}, drag] = useDrag(() => ({
        type: "ITEM",
        item: {
            id: item.id,
            label: cardFields
                .map(f => item.attributes[f.key])
                .filter(Boolean)
                .join(" "),
            img_url: imageUrl
        },
        collect: monitor => ({
            isDragging: monitor.isDragging()
        })
    }), [item.id, objectType.id]);

    const deleteItem = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await handleDelete(item.id);
    };

    return (
        <div
            ref={drag}
            onClick={() => handleClick(item)}
            className={`flex items-center gap-4 p-4 rounded-lg cursor-move
                ${isDragging ? "opacity-50" : "hover:bg-gray-100"}`}
        >
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={objectType.displayName + " image"}
                    className="w-20 h-20 rounded-full object-cover"
                />
            )}

            <div className="flex-1 flex flex-col gap-1">
                {cardFields.map(field => field.type !== "image" && (
                    <div
                        key={field.key}
                        className="text-sm"
                        style={{color: objectType.color}}
                    >
                        {item.attributes[field.key]}
                    </div>
                ))}
            </div>

            {showDelete && (
                <button
                    onClick={deleteItem}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                >
                    <FaTrash size={16}/>
                </button>
            )}
        </div>
    );
}

export default Item;