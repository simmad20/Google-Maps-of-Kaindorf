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

export interface IVisibilityConfig {
    visible: boolean;
    order: number;
}

export interface IObjectAttribute {
    key: string;
    label: string;
    type: "text" | "number" | "select" | "image";
    required: boolean;
    searchable: boolean;

    dropdown: IVisibilityConfig;
    card: IVisibilityConfig;
    marker: IVisibilityConfig;
}

export interface IObjectTypeCreate {
    name: string;
    displayName: string;
    description: string;
    icon: string;
    color: string;

    navigable: boolean;
    visibleInApp: boolean;
    visibleInAdmin: boolean;

    cardConfig: {
        showOnMap: boolean;
        markerType: string;
        markerIcon: string;
        markerLabelFields: string[];
    };

    schema: IObjectAttribute[];
}