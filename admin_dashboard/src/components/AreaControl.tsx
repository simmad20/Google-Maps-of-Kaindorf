import {IObjectField} from "../models/interfaces.ts";
import {FiArrowUp, FiArrowDown} from "react-icons/fi";

interface IAreaControl {
    title: string;
    area: "card" | "dropdown" | "marker";
    attribute: IObjectField;
    attributeIndex: number;
    onToggle: (index: number, area: "card" | "dropdown" | "marker", visible: boolean) => void;
    onMove: (index: number, area: "card" | "dropdown" | "marker", direction: "up" | "down") => void;
    getMoveButtonState: (index: number, area: "card" | "dropdown" | "marker", direction: "up" | "down") => boolean;
}

const AreaControl = ({
                         title,
                         area,
                         attribute,
                         attributeIndex,
                         onToggle,
                         onMove,
                         getMoveButtonState
                     }: IAreaControl) => {
    return (
        <div className="border rounded-lg p-3 space-y-3">
            <label className="flex items-center gap-2 font-medium">
                <input
                    type="checkbox"
                    checked={attribute[area].visible}
                    onChange={e => onToggle(attributeIndex, area, e.target.checked)}
                    className="rounded"
                />
                {title}
            </label>

            {attribute[area].visible && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
                            {attribute[area].order}
                        </span>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onMove(attributeIndex, area, "up")}
                            disabled={!getMoveButtonState(attributeIndex, area, "up")}
                            className={`p-2 rounded border ${
                                getMoveButtonState(attributeIndex, area, "up")
                                    ? "hover:bg-gray-100 text-gray-700"
                                    : "text-gray-300 cursor-not-allowed"
                            }`}
                            title="Move up"
                        >
                            <FiArrowUp size={16}/>
                        </button>
                        <button
                            onClick={() => onMove(attributeIndex, area, "down")}
                            disabled={!getMoveButtonState(attributeIndex, area, "down")}
                            className={`p-2 rounded border ${
                                getMoveButtonState(attributeIndex, area, "down")
                                    ? "hover:bg-gray-100 text-gray-700"
                                    : "text-gray-300 cursor-not-allowed"
                            }`}
                            title="Move down"
                        >
                            <FiArrowDown size={16}/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AreaControl;