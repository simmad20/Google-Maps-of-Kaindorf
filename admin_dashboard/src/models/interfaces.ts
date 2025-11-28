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
    type: string;
    attributes: Record<string, any>;
    assignedRoomId?: string;
}

export interface ITeacher extends IObject {
    type: "teacher";
}

export interface ITeacher extends IObject {
    type: "teacher";
    attributes: {
        firstname: string;
        lastname: string;
        abbreviation: string;
        image_url: string;
        title: string;
        legacy_teacher_id?: number;
    };
}

export interface ICard {
    id: string
    title: string
    imagePath: string
}