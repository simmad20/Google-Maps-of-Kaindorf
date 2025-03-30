import {useDrag} from "react-dnd";
import PropTypes from "prop-types";
import {ITeacher} from "../models/interfaces.ts";
import {FaTrash} from "react-icons/fa";
import {useContext} from "react";
import {TeacherContext, TeacherContextType} from "../context/TeacherContext.tsx";

Item.propTypes = {
    item: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired,
    showDelete: PropTypes.bool
}

interface IItem {
    item: ITeacher
    handleClick: (teacher: ITeacher) => void
    showDelete?: boolean
}

function Item({item, handleClick, showDelete = false}: IItem) {
    const {handleDelete} = useContext<TeacherContextType>(TeacherContext);
    const [{isDragging}, drag] = useDrag(() => ({
        type: "ITEM",
        item: {id: item.id, label: item.abbreviation, img_url: item.image_url},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [item.id]);

    const deleteItem = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await handleDelete(item.id);
        } catch (error) {
            console.error("Fehler beim Löschen:", error);
        }
    };

    return (
        <div
            onClick={() => handleClick(item)}
            ref={drag}
            className={`flex items-center gap-4 p-4 ${isDragging ? "opacity-50" : "hover:bg-gray-100"}`}
            style={{cursor: "move"}}
        >
            <img
                className="w-20 h-20 rounded-full object-cover"
                src={item.image_url}
                alt={`${item.abbreviation} profile`}
            />
            <div className="flex-1 flex flex-col">
                <div className="font-bold">{item.abbreviation}</div>
                <div className="text-gray-600">
                    {item.title && `${item.title} `}
                    {item.firstname} {item.lastname}
                </div>
            </div>

            {showDelete && (
                <button
                    onClick={deleteItem}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full"
                    aria-label="Lehrer löschen"
                >
                    <FaTrash size={16}/>
                </button>
            )}
        </div>
    );
}

export default Item;