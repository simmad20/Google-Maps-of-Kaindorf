import {IObjectType} from "../models/interfaces.ts";
import {useContext} from "react";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";

interface IObjectTypesPage {
    onSelect: (type: IObjectType) => void
}

function ObjectTypesPage({onSelect}: IObjectTypesPage) {
    const {types} = useContext<ObjectContextType>(ObjectContext);
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {types.map((type: IObjectType) => (
                <button
                    key={type.id}
                    onClick={() => onSelect(type)}
                    className="p-6 rounded-xl border bg-white shadow hover:shadow-md transition text-left"
                >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <h3 className="text-lg font-semibold">{type.name}</h3>
                    <p className="text-sm text-gray-500">{type.description}</p>
                </button>
            ))}
        </div>
    );
}

export default ObjectTypesPage;