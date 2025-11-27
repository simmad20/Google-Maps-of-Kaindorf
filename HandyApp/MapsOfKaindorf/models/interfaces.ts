export interface ITeacher {
    id: string
    title: string
    firstname: string
    lastname: string
    abbreviation: string
    image_url: string
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
    x: number;
    y: number;
    width: number;
    height: number;
    teachers: ITeacher[];
}