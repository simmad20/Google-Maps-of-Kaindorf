import {useDrag} from "react-dnd";
import PropTypes from "prop-types";
import {ITeacher} from "../models/interfaces.ts";

Item.propTypes = {
    item: PropTypes.object.isRequired,
    handleClick: PropTypes.func.isRequired
}

interface IItem {
    item: ITeacher
    handleClick: (teacher: ITeacher) => void
}

function Item({item, handleClick}: IItem) {
    const [{isDragging}, drag] = useDrag(() => ({
        type: "ITEM",
        item: {id: item.id, label: item.abbreviation, img_url: item.image_url},
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [item.id]);

    return (
        <div onClick={() => handleClick(item)}
             ref={drag}
             className={`flex items-center gap-4 p-4 ${isDragging && "opacity-50"}`}
             style={{cursor: "move"}}>
            <img
                className="w-20 rounded-full"
                src={item.image_url}
                alt={"image of the item " + item.abbreviation}
            />
            <div className="flex flex-col">
                <div>{item.abbreviation}</div>
                <div>
                    {item.title !== null && item.title + " "}
                    {item.firstname + " " + item.lastname}
                </div>
            </div>
        </div>
    );
}

export default Item;
