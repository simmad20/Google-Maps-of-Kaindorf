export interface IObject {
    id: string;
    type: string;
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