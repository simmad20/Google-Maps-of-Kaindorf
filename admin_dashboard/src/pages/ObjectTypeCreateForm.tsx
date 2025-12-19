import {useState} from 'react';
import {IObjectAttribute, IObjectTypeCreate} from "../models/interfaces.ts";
import {MdDelete} from "react-icons/md";
import {FaPlus} from "react-icons/fa6";

interface IObjectTypeCreateForm {
    onSubmit: (objectType: IObjectTypeCreate) => void
    onCancel: () => void
}

function ObjectTypeCreateForm({onSubmit, onCancel}: IObjectTypeCreateForm) {
    const [objectType, setObjectType] = useState<IObjectTypeCreate>({
        name: "",
        displayName: "",
        description: "",
        icon: "",
        color: "#2563eb",
        navigable: true,
        visibleInApp: true,
        visibleInAdmin: true,
        cardConfig: {
            showOnMap: true,
            markerType: "ICON_AND_TEXT",
            markerIcon: "",
            markerLabelFields: []
        },
        schema: []
    });

    const flags: (keyof IObjectAttribute)[] = [
        "displayInForm",
        "displayInDropdown",
        "displayOnMarker",
        "searchable"
    ];


    const addAttribute = () => {
        setObjectType(prev => ({
            ...prev,
            schema: [
                ...prev.schema,
                {
                    key: "",
                    label: "",
                    type: "text",
                    required: false,
                    displayInForm: true,
                    formOrder: prev.schema.length + 1,
                    displayInDropdown: false,
                    dropdownOrder: 0,
                    displayOnMarker: false,
                    markerOrder: 0,
                    searchable: false
                }
            ]
        }));
    };

    const updateAttribute = <
        K extends keyof IObjectAttribute
    >(
        index: number,
        field: K,
        value: IObjectAttribute[K]
    ) => {
        setObjectType(prev => {
            const updated = [...prev.schema];

            updated[index] = {
                ...updated[index],
                [field]: value
            };

            return {
                ...prev,
                schema: updated
            };
        });
    };

    const removeAttribute = (index: number) => {
        setObjectType(prev => ({
            ...prev,
            schema: prev.schema.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 space-y-8">
            <h2 className="text-2xl font-semibold">Create Object Type</h2>

            <div className="grid grid-cols-2 gap-4">
                <input placeholder="Internal name (Teacher)" className="input" value={objectType.name}
                       onChange={e => setObjectType({...objectType, name: e.target.value})}/>
                <input placeholder="Display name (Teachers)" className="input" value={objectType.displayName}
                       onChange={e => setObjectType({...objectType, displayName: e.target.value})}/>
                <input placeholder="Icon (lucide name)" className="input" value={objectType.icon}
                       onChange={e => setObjectType({...objectType, icon: e.target.value})}/>
                <input type="color" value={objectType.color}
                       onChange={e => setObjectType({...objectType, color: e.target.value})}/>
            </div>

            <div className="flex gap-6">
                <label><input type="checkbox" checked={objectType.navigable}
                              onChange={e => setObjectType({
                                  ...objectType,
                                  navigable: e.target.checked
                              })}/> Navigable</label>
                <label><input type="checkbox" checked={objectType.visibleInApp}
                              onChange={e => setObjectType({...objectType, visibleInApp: e.target.checked})}/> Visible
                    in App</label>
                <label><input type="checkbox" checked={objectType.visibleInAdmin}
                              onChange={e => setObjectType({...objectType, visibleInAdmin: e.target.checked})}/> Visible
                    in Admin</label>
            </div>

            <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-2">Attributes</h3>

                {objectType.schema.map((attr, i) => (
                    <div key={i} className="border rounded-xl p-4 mb-4 space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            <input placeholder="key" value={attr.key}
                                   onChange={e => updateAttribute(i, "key", e.target.value)} className="input"/>
                            <input placeholder="label" value={attr.label}
                                   onChange={e => updateAttribute(i, "label", e.target.value)} className="input"/>
                            <select value={attr.type}
                                    onChange={e => updateAttribute(i, "type", e.target.value)} className="input">
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="select">Select</option>
                                <option value="image">Image</option>
                            </select>
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm">
                            {flags.map(flag => (
                                <label key={flag} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={Boolean(attr[flag])}
                                        onChange={e =>
                                            updateAttribute(i, flag, e.target.checked)
                                        }
                                    />
                                    {flag}
                                </label>
                            ))}

                        </div>

                        <button onClick={() => removeAttribute(i)} className="text-red-500 flex gap-1 items-center">
                            <MdDelete size={16}/> Remove
                        </button>
                    </div>
                ))}

                <button onClick={addAttribute} className="flex items-center gap-2 text-indigo-600">
                    <FaPlus size={18}/> Add attribute
                </button>
            </div>

            <div className="flex justify-end gap-4">
                <button onClick={onCancel} className="px-6 py-2 rounded-lg border">Cancel</button>
                <button onClick={() => onSubmit(objectType)}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white">Create Object Type
                </button>
            </div>
        </div>
    );

}

export default ObjectTypeCreateForm;