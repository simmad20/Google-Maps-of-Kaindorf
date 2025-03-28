export interface IRoom {
    id: number
    room_number: string
    name: string
    x: number
    y: number
    width: number
    height: number
    teacher_id: number
    valid_from: string
}

export interface ITeacher {
    id: number
    firstname: string
    lastname: string
    abbreviation: string
    image_url: string
    title: string
    room_id: number
}