import {IObjectType} from "../models/interfaces.ts";
import React, {useContext, useState} from "react";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import {useNavigate} from "react-router-dom";
import {resolveIcon} from "../utils/iconResolver.ts";
import {LucideIcon} from "lucide-react";
import ObjectTypeCreateEditForm from "./ObjectTypeCreateEditForm.tsx";
import {useAuth} from "../context/AuthContext.tsx";

function ObjectTypesPage() {
    const [selectedType, setSelectedType] = useState<IObjectType | undefined>(undefined);
    const {types} = useContext<ObjectContextType>(ObjectContext);
    const {isViewer} = useAuth();
    const navigate = useNavigate();

    return (
        <div>
            {typeof selectedType !== "undefined" ? (
                <ObjectTypeCreateEditForm type={selectedType} goBackFromEdit={() => setSelectedType(undefined)}/>
            ) : (
                <React.Fragment>
                    {!isViewer && (
                        <button
                            className="modifyButton block mx-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-2.5 mb-2"
                            onClick={() => navigate("/createType")}
                        >
                            Create
                        </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {types.map((type: IObjectType) => {
                            const Icon: LucideIcon = resolveIcon(type.icon);
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => !isViewer && setSelectedType(type)}
                                    className={`p-6 rounded-xl border bg-white shadow transition text-left ${
                                        !isViewer ? 'hover:shadow-md cursor-pointer' : 'cursor-default'
                                    }`}
                                >
                                    <div className="mb-3" style={{color: type.color}}>
                                        <Icon size={36}/>
                                    </div>
                                    <h3 className="text-lg font-semibold">{type.name}</h3>
                                    <p className="text-sm text-gray-500">{type.description}</p>
                                </button>
                            );
                        })}
                    </div>
                </React.Fragment>
            )}
        </div>
    );
}

export default ObjectTypesPage;