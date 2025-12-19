import {useState} from "react";
import {IObjectType} from "../models/interfaces.ts";
import ObjectTypesPage from "./ObjectTypesPage.tsx";
import DynamicObjectForm from "../components/DynamicObjectForm.tsx";

function ObjectAdminPage() {
    const [selectedType, setSelectedType] = useState<IObjectType | null>(null);

    return (
        <div className="p-8">
            {!selectedType ? (
                <ObjectTypesPage onSelect={setSelectedType}/>
            ) : (
                <DynamicObjectForm type={selectedType} goBack={() => setSelectedType(null)}/>
            )}
        </div>
    );
}

export default ObjectAdminPage;