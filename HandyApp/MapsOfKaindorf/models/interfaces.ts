export interface IObject {
    id: string;
    typeId: string;
    attributes: Record<string, any>;
    assignedRoomId?: string;
}

export interface IRoom {
    id: number;
    room_number: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    teacher_ids?: number[];
}

export interface IRoomDetailed {
    id: number;
    room_number: string;
    name: string;
    cardId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    teachers: IObject[];
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