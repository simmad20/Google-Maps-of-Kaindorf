import {useContext, useEffect, useState} from 'react';
import {IObject, IObjectField, IObjectType} from "../models/interfaces.ts";
import PropTypes from "prop-types";
import {IoArrowBack} from "react-icons/io5";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";
import ObjectService from "../services/ObjectService.tsx";

DynamicObjectForm.propTypes = {
    item: PropTypes.object,
    type: PropTypes.object,
    goBack: PropTypes.func
}

interface IDynamicObjectForm {
    item?: IObject;
    type: IObjectType;
    goBack: () => void;
}

function DynamicObjectForm({item, type, goBack}: IDynamicObjectForm) {
    const [values, setValues] = useState<Record<string, any>>({});
    const isCreating: boolean = typeof item === 'undefined';
    const {reload} = useContext<ObjectContextType>(ObjectContext);

    const handleChange = (key: string, value: any) => {
        setValues(prev => ({...prev, [key]: value}));
    };

    useEffect(() => {
        if (!isCreating && typeof item !== 'undefined') {
            setValues(item.attributes);
        }
    }, []);

    const createOrEdit = () => {
        const object: IObject = {
            id: item?.id || '',
            typeId: item?.typeId || type.id,
            attributes: values,
            assignedRoomId: item?.assignedRoomId || ''
        };
        ObjectService.createOrEditObject(object, isCreating)
            .then(() => reload())
            .catch((error) => console.error(error));
        goBack();
    };

    return (
        <div className="max-w-lg mx-auto p-6">
            <div className="flex items-center gap-3 mb-6">
                <button
                    onClick={goBack}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <IoArrowBack size={18} />
                </button>
                <h2 className="text-xl font-semibold text-gray-900">
                    {isCreating ? 'Create' : 'Edit'} {type.name}
                </h2>
            </div>

            <form
                onSubmit={e => { e.preventDefault(); createOrEdit(); }}
                className="bg-white rounded-xl border border-gray-200 p-6 space-y-4"
            >
                {type.schema.map((field: IObjectField) => (
                    <div key={field.key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            {field.label}
                            {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        <input
                            type={field.type === 'image' ? 'text' : field.type}
                            value={values[field.key] ?? ''}
                            placeholder={field.placeholder}
                            onChange={e => handleChange(field.key, e.target.value)}
                            required={field?.required}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>
                ))}

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={goBack}
                        className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
                    >
                        {isCreating ? 'Create' : 'Save changes'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default DynamicObjectForm;