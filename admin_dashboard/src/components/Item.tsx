import { ITeacher } from "../models/interfaces.ts";
import { useDrag } from "react-dnd";

interface IItem {
    item: ITeacher;
}

function Item({ item }: IItem) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "ITEM", // Type identifier for the draggable item
        item: { id: item.id , label: item.abbreviation, img_url: item.image_url}, // Pass the item id to uniquely identify it
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }), [item.id]);

    return (
        <div
            ref={drag} // Attach the drag reference
            className={`flex items-center gap-4 p-4 ${isDragging ? "opacity-50" : ""}`}
            style={{ cursor: "move" }} // Style to indicate draggable
        >
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
