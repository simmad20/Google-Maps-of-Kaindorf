export interface ITeacher {
    id: number
    firstname: string
    lastname: string
    abbreviation: string
    image_url: string
    title: string
}

export interface IFeedback {
    id: number
    feedback: Feedback
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

export type Feedback = 'GOOD' | 'MID' | 'BAD';
