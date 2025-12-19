import Item from "./Item.tsx";
import PropTypes from "prop-types";
import {IObject} from "../models/interfaces.ts";

List.propTypes = {
    items: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired
};

interface IItemList {
    items: IObject[];
    handleClick: (object: IObject) => void;
    showDelete: boolean;
}

function List({items, handleClick, showDelete}: IItemList) {
    return (
        <div className="w-full max-w-5xl">
            <div
                className="
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    md:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                    w-full
                "
            >
                {items.map((item: IObject) => (
                    <Item
                        key={item.id}
                        item={item}
                        handleClick={handleClick}
                        showDelete={showDelete}
                    />
                ))}
            </div>
        </div>
    );
}

export default List;