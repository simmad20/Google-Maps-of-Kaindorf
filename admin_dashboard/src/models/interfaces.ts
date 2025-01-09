import {CSSProperties} from "react";

export interface IStyle {
    top: string
    left: string
    width: string
    height: string
}

export interface IRoom {
    id: number
    room_number: string
    name: string
    style?: CSSProperties
}