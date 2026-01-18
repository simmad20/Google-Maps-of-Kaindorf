import axios, {HttpStatusCode} from "axios";
import {IRoom, IRoomDetailed} from "@/models/interfaces";
import {API_URL} from "@/config";

const BASE_URL: string = API_URL + '/rooms';

class RoomService {
    static async fetchAllRooms(eventId: string): Promise<IRoom[]> {
        try {
            const response = await axios.get(BASE_URL, {params: {eventId}});
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

    static async fetchAllRoomsFromCard(cardId: string, eventId: string): Promise<IRoom[]> {
        try {
            const response = await axios.get(BASE_URL + "/card/" + cardId, {params: {eventId}});
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all rooms: " + response.status);
            }
            console.log(response.data);
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all rooms: " + error.message);
            throw error;
        }
    }

    static async fetchDetailedRoom(id: string, eventId: string): Promise<IRoomDetailed> {
        try {
            const response = await axios.get(`${BASE_URL}/${id}`, {params: {eventId}});
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching detailed room: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching detailed room: " + error.message);
            throw error;
        }
    }

}

export default RoomService;