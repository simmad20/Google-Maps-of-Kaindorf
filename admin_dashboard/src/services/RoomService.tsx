import {Component} from "react";
import axios, {HttpStatusCode} from "axios";
import {IRoom} from "../models/interfaces.ts";

const BASE_URL: string = 'http://localhost:3000/rooms';

class RoomService extends Component {
    static async fetchAllRooms(): Promise<IRoom[]> {
        try {
            const response = await axios.get(BASE_URL);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all rooms: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all rooms: " + error.message);
            throw error;
        }
    }
}

export default RoomService;