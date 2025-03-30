import Item from "./Item.tsx";
import PropTypes from "prop-types";
import {ITeacher} from "../models/interfaces.ts";

List.propTypes = {
    items: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired,
    showDelete: PropTypes.bool.isRequired
}

interface IItemList {
    items: ITeacher[]
    handleClick: (teacher: ITeacher) => void
    showDelete: boolean
}

function List({items, handleClick,showDelete}: IItemList) {
    return (
        <div
            className="h-96 w-80 lg:w-64 lg:mt-16 lg:ms-3 overflow-y-scroll relative max-w-sm bg-white rounded-xl flex flex-col divide-y dark:divide-slate-200/5 border border-purple-700">
            {items.map((item: ITeacher) => <Item key={item.id} item={item} handleClick={handleClick} showDelete={showDelete}/>)}
        </div>
    );
}

export default List;