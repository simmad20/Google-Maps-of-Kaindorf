import {useContext, useEffect, useState} from 'react';
import {IObject, IObjectField, IObjectType} from "../models/interfaces.ts";
import PropTypes from "prop-types";
import {RiArrowGoBackLine} from "react-icons/ri";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import ObjectService from "../services/ObjectService.tsx";

DynamicObjectForm.propTypes = {
    item: PropTypes.object,
    type: PropTypes.object,
    goBack: PropTypes.func
}

interface IDynamicObjectForm {
    item?: IObject
    type: IObjectType
    goBack: () => void
}

function DynamicObjectForm({item, type, goBack}: IDynamicObjectForm) {
    const [values, setValues] = useState<Record<string, any>>({});
    const isCreating: boolean = typeof item === "undefined";
    const {reload} = useContext<ObjectContextType>(ObjectContext);
    console.log(isCreating);

    console.log(item);
    const handleChange = (key: string, value: any) => {
        setValues(prevState => ({...prevState, [key]: value}));
    }

    useEffect(() => {
        if (!isCreating && typeof item !== "undefined") {
            setValues(item.attributes);
        }
    }, []);

    const createOrEdit = () => {
        const object: IObject = {
            id: item?.id || '',
            typeId: item?.typeId || type.id,
            attributes: values,
            assignedRoomId: item?.assignedRoomId || ''
        }
        ObjectService.createOrEditObject(object, isCreating)
            .then((object: IObject) => {
                reload();
                console.log(object);
            })
            .catch((error) => {
                console.error(error);
            })
        goBack();
    }

    return (
        <form
            onSubmit={e => {
                e.preventDefault();
                createOrEdit();
            }}
            className="space-y-4 bg-white p-6 rounded-xl shadow"
        >
            <h2 className="text-xl font-semibold">{isCreating ? 'Create ' : 'Edit '}{type.name}</h2>


            {type.schema.map((field: IObjectField) => (
                <div key={field.key}>
                    <label className="block text-sm font-medium mb-1">{field.label}</label>
                    <input
                        type={field.type === "image" ? "text" : field.type}
                        value={values[field.key] ?? ''}
                        placeholder={field.placeholder}
                        onChange={e => handleChange(field.key, e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                        required={field?.required}
                    />
                </div>
            ))}
            <div className="flex gap-4 items-center justify-center">
                <button onClick={() => goBack()}
                        className="w-16 h-12 flex items-center justify-center shadow-sm rounded-full bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 text-white text-base font-semibold leading-7">
                    <RiArrowGoBackLine/>
                </button>
                <button onClick={() => {
                }}
                        className="w-52 h-12 shadow-sm rounded-full bg-indigo-600 hover:bg-indigo-800 transition-all duration-700 text-white text-base font-semibold leading-7">{isCreating ? 'Create' : 'Edit teacher'}
                </button>
            </div>

        </form>
    );
}

export default DynamicObjectForm;