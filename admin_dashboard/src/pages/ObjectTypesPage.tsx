import {IObjectType} from "../models/interfaces.ts";
import {useContext} from "react";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import {useNavigate} from "react-router-dom";

interface IObjectTypesPage {
    onSelect: (type: IObjectType) => void
}

function ObjectTypesPage({onSelect}: IObjectTypesPage) {
    const {types} = useContext<ObjectContextType>(ObjectContext);
    const navigate = useNavigate();

    return (
        <div>
            <button
                className="modifyButton  block mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5 mb-2"
                onClick={() => navigate("/createType")}
            >
                Create
            </button>
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
        </div>
    );
}

export default ObjectTypesPage;