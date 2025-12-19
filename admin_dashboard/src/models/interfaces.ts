export interface IRoom {
    id: string;
    roomNumber: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    assignedObjectIds: string[];
    cardId: string;
}

export interface IRoomDetailed {
    id: number;
    roomNumber: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    assignedObjects: IObject[];
    cardId: string;
}

export interface IObject {
    id: string;
    typeId: string;
    attributes: Record<string, any>;
    assignedRoomId?: string;
}

export interface IObjectField {
    key: string
    label: string
    type: "text" | "number" | "email" | "boolean"
    placeholder: string
    required?: boolean
}

export interface IObjectType {
    id: string
    name: string
    description: string
    icon: string
    schema: IObjectField[]
}

export interface ICard {
    id: string
    title: string
    imagePath: string
}