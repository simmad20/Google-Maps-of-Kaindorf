import Item from "./Item.tsx";
import PropTypes from "prop-types";

List.propTypes = {
    items: PropTypes.array.isRequired,
    handleClick: PropTypes.func.isRequired
}

interface IItemList {
    items: ITeacher[]
    handleClick: (teacher: ITeacher) => void
}

function List({items, handleClick}: IItemList) {
    return (
        <div
            className="h-96 w-80 mx-auto lg:w-64 lg:mt-16 lg:ms-3 overflow-y-scroll relative max-w-sm bg-white rounded-xl flex flex-col divide-y dark:divide-slate-200/5 border border-purple-700">
            {items.map((item: ITeacher) => <Item key={item.id} item={item} handleClick={handleClick}/>)}
        </div>
    );
}

export default List;