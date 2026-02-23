import {ChangeEvent, useContext, useEffect, useState} from 'react';
import {IObjectField, IObjectType} from "../models/interfaces.ts";
import {MdDelete} from "react-icons/md";
import {FaPlus} from "react-icons/fa6";
import AreaControl from "../components/AreaControl.tsx";
import {useNavigate} from "react-router-dom";
import ObjectTypeService from "../services/ObjectTypeService.tsx";
import {ObjectContext, ObjectContextType} from "../context/ObjectContext.tsx";

interface IObjectTypeCreateForm {
    type?: IObjectType
    goBackFromEdit?: () => void
}

function ObjectTypeCreateEditForm({type, goBackFromEdit}: IObjectTypeCreateForm) {
    const [objectType, setObjectType] = useState<IObjectType>({
        id: "",
        name: "",
        displayName: "",
        description: "",
        icon: "",
        color: "#2563eb",
        visibleInApp: true,
        visibleInAdmin: true,
        schema: []
    });
    const {reloadTypes} = useContext<ObjectContextType>(ObjectContext);
    const formType = typeof type !== "undefined" ? "Edit" : "Create";
    const navigate = useNavigate();

    useEffect(() => {
        if (typeof type !== "undefined") {
            setObjectType(type);
        }
    }, []);

    const addAttribute = () => {
        setObjectType(prev => {
            const newAttr: IObjectField = {
                key: "",
                label: "",
                placeholder: "",
                type: "text",
                required: false,
                searchable: false,
                sortable: false,
                dropdown: {visible: false, order: 0},
                card: {visible: true, order: 0},
                marker: {visible: false, order: 0}
            };

            const tempSchema = [...prev.schema, newAttr];

            ["card", "dropdown", "marker"].forEach(area => {
                const areaTyped = area as "card" | "dropdown" | "marker";
                const visibleCount = tempSchema.filter(a => a[areaTyped].visible).length;

                if (newAttr[areaTyped].visible) {
                    newAttr[areaTyped].order = visibleCount;
                }
            });

            let finalSchema = [...prev.schema, newAttr];
            ["card", "dropdown", "marker"].forEach(area => {
                finalSchema = normalizeOrders(finalSchema, area as "card" | "dropdown" | "marker");
            });

            return {
                ...prev,
                schema: finalSchema
            };
        });
    };

    const updateAttribute = <K extends keyof IObjectField>(
        index: number,
        field: K,
        value: IObjectField[K]
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
        setObjectType(prev => {
            let normalizedSchema = prev.schema.filter((_, i) => i !== index);
            ["card", "dropdown", "marker"].forEach(area => {
                normalizedSchema = normalizeOrders(normalizedSchema, area as "card" | "dropdown" | "marker");
            });

            return {
                ...prev,
                schema: normalizedSchema
            };
        });
    };

    const normalizeOrders = (schema: IObjectField[], area: "card" | "dropdown" | "marker"): IObjectField[] => {
        const visibleAttrs = schema
            .filter(a => a[area].visible)
            .sort((a, b) => a[area].order - b[area].order);

        return schema.map(attr => {
            if (!attr[area].visible) return attr;

            const newIndex = visibleAttrs.findIndex(v => v === attr);
            return {
                ...attr,
                [area]: {
                    ...attr[area],
                    order: newIndex + 1
                }
            };
        });
    };

    const moveAttribute = (
        index: number,
        area: "card" | "dropdown" | "marker",
        direction: "up" | "down"
    ) => {
        setObjectType(prev => {
            const visibleIndices = prev.schema
                .map((attr, idx) => ({attr, idx}))
                .filter(x => x.attr[area].visible)
                .sort((a, b) => a.attr[area].order - b.attr[area].order)
                .map(x => x.idx);

            const currentPos = visibleIndices.indexOf(index);
            if (currentPos === -1) return prev;

            const targetPos = direction === "up" ? currentPos + 1 : currentPos - 1;

            if (targetPos < 0 || targetPos >= visibleIndices.length) return prev;

            const newSchema = [...prev.schema];

            const currentIdx = visibleIndices[currentPos];
            const targetIdx = visibleIndices[targetPos];

            const tempOrder = newSchema[currentIdx][area].order;

            newSchema[currentIdx] = {
                ...newSchema[currentIdx],
                [area]: {...newSchema[currentIdx][area], order: newSchema[targetIdx][area].order}
            };
            newSchema[targetIdx] = {
                ...newSchema[targetIdx],
                [area]: {...newSchema[targetIdx][area], order: tempOrder}
            };

            const finalSchema = normalizeOrders(newSchema, area);

            return {
                ...prev,
                schema: finalSchema
            };
        });
    };

    const toggleVisibility = (
        index: number,
        area: "card" | "dropdown" | "marker",
        visible: boolean
    ) => {
        setObjectType(prev => {
            const updated = [...prev.schema];

            if (visible) {
                const visibleCount = updated.filter(a => a[area].visible).length;
                updated[index][area] = {
                    visible: true,
                    order: visibleCount + 1
                };
            } else {
                updated[index][area] = {
                    visible: false,
                    order: 0
                };
            }

            const normalizedSchema = normalizeOrders(updated, area);

            return {...prev, schema: normalizedSchema};
        });
    };

    const getMoveButtonState = (
        index: number,
        area: "card" | "dropdown" | "marker",
        direction: "up" | "down"
    ) => {
        const attr = objectType.schema[index];
        if (!attr[area].visible) return false;

        const visibleAttrs = objectType.schema
            .filter(a => a[area].visible)
            .sort((a, b) => a[area].order - b[area].order);

        const currentPos = visibleAttrs.findIndex(a => a === attr);

        if (direction === "up") {
            return currentPos < visibleAttrs.length - 1;
        } else {
            return currentPos > 0;
        }
    };

    const updateObjectType = (event: ChangeEvent<HTMLInputElement>) => {
        setObjectType(prevState => {
            return {...prevState, [event.target.name]: event.target.value}
        });

        console.log(objectType);
    }

    const submit = async () => {
        try {
            if (formType === "Create") {
                await ObjectTypeService.createObjectType(objectType);
                navigate(-1);
            } else {
                await ObjectTypeService.updateObjectType(objectType);
                goBackFromEdit?.();
            }
            reloadTypes();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <form className="max-w-4xl mx-auto bg-white rounded-2xl shadow p-8 space-y-8"
              onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-2xl font-semibold">{formType} Object Type</h2>

            <div className="grid grid-cols-2 gap-4">
                <input placeholder="Internal name (Teacher)" className="input" value={objectType.name} name="name"
                       required onChange={updateObjectType}/>
                <input placeholder="Display name (Teachers)" className="input" value={objectType.displayName}
                       name="displayName"
                       required onChange={updateObjectType}/>
                <input placeholder="Icon (lucide name)" className="input" value={objectType.icon} name="icon"
                       onChange={updateObjectType}/>
                <input type="color" value={objectType.color} name="color"
                       onChange={updateObjectType}/>
                <input placeholder="Description" type="text" value={objectType.description} name="description"
                       onChange={updateObjectType}/>
            </div>

            <div className="flex gap-6">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={objectType.visibleInApp}
                           onChange={e => setObjectType({...objectType, visibleInApp: e.target.checked})}/>
                    Visible in App
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={objectType.visibleInAdmin}
                           onChange={e => setObjectType({...objectType, visibleInAdmin: e.target.checked})}/>
                    Visible in Admin
                </label>
            </div>

            <div className="border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Attributes</h3>
                    <span className="text-sm text-gray-500">
                        {objectType.schema.length} {objectType.schema.length === 0 || objectType.schema.length > 1 ? 'attributes' : 'attribute'}
                    </span>
                </div>

                {/* Info Box */}
                <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 space-y-2">
                    <p className="font-semibold text-gray-900">Display Area Reference</p>
                    <ul className="space-y-1.5 text-gray-600">
                        <li><span className="font-medium text-gray-800">Card Display</span> — Defines which fields appear on object cards within the admin dashboard.</li>
                        <li><span className="font-medium text-gray-800">Dropdown Display</span> — Defines which fields are shown in the mobile app when users browse and select objects from a list.</li>
                        <li><span className="font-medium text-gray-800">Map Marker</span> — Defines which fields are displayed as a marker on the admin map.</li>
                        <li><span className="font-medium text-gray-800">Image</span> — Image fields are automatically used by the mobile app to display a visual representation of the object on the map.</li>
                    </ul>
                </div>

                {objectType.schema.length === 0 ? (
                    <div className="text-center py-8 border rounded-xl">
                        <p className="text-gray-500 mb-4">No attributes added yet</p>
                        <button
                            onClick={addAttribute}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <FaPlus className="inline mr-2"/>
                            Add first attribute
                        </button>
                    </div>
                ) : (
                    <>
                        {objectType.schema.map((attr: IObjectField, i: number) => (
                            <div key={i}
                                 className="border rounded-xl p-4 mb-4 space-y-4 hover:border-indigo-200 transition-colors">

                                <div className="grid grid-cols-3 gap-3">
                                    <input
                                        placeholder="key"
                                        value={attr.key}
                                        onChange={e => updateAttribute(i, "key", e.target.value)}
                                        className="input"
                                    />
                                    <input
                                        placeholder="label"
                                        value={attr.label}
                                        onChange={e => updateAttribute(i, "label", e.target.value)}
                                        className="input"
                                    />
                                    <select
                                        value={attr.type}
                                        onChange={e => updateAttribute(i, "type", e.target.value as IObjectField["type"])}
                                        className="input"
                                    >
                                        <option value="text">Text</option>
                                        <option value="number">Number</option>
                                        <option value="email">Email</option>
                                        <option value="image">Image</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    {/* Card Display */}
                                    <AreaControl
                                        title="Card Display"
                                        area="card"
                                        attribute={attr}
                                        attributeIndex={i}
                                        onToggle={toggleVisibility}
                                        onMove={moveAttribute}
                                        getMoveButtonState={getMoveButtonState}
                                    />

                                    {/* Dropdown Display */}
                                    <AreaControl
                                        title="Dropdown Display"
                                        area="dropdown"
                                        attribute={attr}
                                        attributeIndex={i}
                                        onToggle={toggleVisibility}
                                        onMove={moveAttribute}
                                        getMoveButtonState={getMoveButtonState}
                                    />

                                    {/* Map Marker */}
                                    <AreaControl
                                        title="Map Marker"
                                        area="marker"
                                        attribute={attr}
                                        attributeIndex={i}
                                        onToggle={toggleVisibility}
                                        onMove={moveAttribute}
                                        getMoveButtonState={getMoveButtonState}
                                    />
                                </div>

                                <div className="flex justify-between items-start">
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={attr.searchable}
                                            onChange={e => updateAttribute(i, "searchable", e.target.checked)}
                                            className="rounded"
                                        />
                                        Searchable (include in search results)
                                    </label>
                                    <button
                                        onClick={() => removeAttribute(i)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                        title="Remove attribute"
                                    >
                                        <MdDelete size={18}/>
                                    </button>
                                    <label className="flex items-center gap-2 text-sm">
                                        <input
                                            type="checkbox"
                                            checked={attr.sortable}
                                            onChange={e => updateAttribute(i, "sortable", e.target.checked)}
                                            className="rounded"
                                        />
                                        Sortable (will be sorted in order)
                                    </label>
                                    <button
                                        onClick={() => removeAttribute(i)}
                                        className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition-colors"
                                        title="Remove attribute"
                                    >
                                        <MdDelete size={18}/>
                                    </button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={addAttribute}
                            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <FaPlus size={18}/> Add another attribute
                        </button>
                    </>
                )}
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
                <button onClick={() => formType === "Edit" ? goBackFromEdit?.() : navigate(-1)}
                        className="px-6 py-2 rounded-lg border hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
                <button onClick={submit}
                        className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors">
                    {formType} Object Type
                </button>
            </div>
        </form>
    );
}

export default ObjectTypeCreateEditForm;