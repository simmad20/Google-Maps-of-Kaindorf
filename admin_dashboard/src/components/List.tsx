import Item from "./Item.tsx";
import {ITeacher} from "../models/interfaces.ts";

/* import PropTypes from "prop-types";
TeacherList.propTypes = {
    teachers: PropTypes.array.isRequired
}*/

interface IItemList {
    items: ITeacher[]
}

function List({items}: ITeacherList) {
    return (
        <div
            className="h-96 w-80 mt-3 mx-auto lg:w-64 lg:mt-16 lg:ms-3 overflow-y-scroll relative max-w-sm bg-white rounded-xl flex flex-col divide-y dark:divide-slate-200/5 border border-purple-700">
            {items.map((item: ITeacher) => <Item key={item.id} item={item}/>)}
        </div>
    );
}

export default List;