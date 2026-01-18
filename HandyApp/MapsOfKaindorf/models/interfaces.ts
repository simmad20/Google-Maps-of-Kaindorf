export interface IObject {
    id: string;
    typeId: string;
    attributes: Record<string, any>;
    assignedRoomId?: string;
}

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
    eventId?: string
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
    eventId?: string;
}

export interface ICard {
    id: string
    title: string
    imagePath: string
}

export interface IObjectField {
    key: string;
    label: string;
    type: "text" | "number" | "email" | "image";
    required: boolean;
    searchable: boolean;
    placeholder: string

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

    visibleInApp: boolean;
    visibleInAdmin: boolean;

    schema: IObjectField[];
}

export interface IObjectType extends IObjectTypeCreate {
    id: string
}

export interface IVisibilityConfig {
    visible: boolean;
    order: number;
}

export interface IEvent {
    id: string
    name: string
    startDateTime: string
    endDateTime?: string
    description?: string
    active?: boolean
    themeColor: string
    announcement?: string
}