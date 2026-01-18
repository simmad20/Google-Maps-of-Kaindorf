import axios, {HttpStatusCode} from "axios";
import {IRoom, IRoomDetailed} from "../models/interfaces.ts";
import {API_URL} from "../config.ts";

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

    static async createRoom(room: Omit<IRoom, 'id' | 'assignedObjectIds'|'cardId'>, cardId: string): Promise<IRoom> {
        try {
            const response = await axios.post(BASE_URL + "/" + cardId, room);
            if (response.status !== HttpStatusCode.Created) {
                throw Error("Error response creating room: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error creating room: " + error.message);
            throw error;
        }
    }

    static async updateRoom(room: IRoom): Promise<IRoom> {
        try {
            const response = await axios.put(`${BASE_URL}/${room.id}`, room);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response updating room: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            if (axios.isAxiosError(error)) {
                if (error.response?.status === HttpStatusCode.NotFound) {
                    throw new Error('Room not found');
                }
                if (error.response?.status === HttpStatusCode.BadRequest) {
                    throw new Error('Invalid room data');
                }
            }
            console.error("Error updating room: " + error.message);
            throw error;
        }
    }

    static async deleteRoom(id: string): Promise<void> {
        try {
            const response = await axios.delete(`${BASE_URL}/${id}`);
            if (response.status !== HttpStatusCode.NoContent) {
                throw new Error(`Unexpected status code: ${response.status}`);
            }
        } catch (err) {
            const error = err as Error;
            if (axios.isAxiosError(error)) {
                if (error.response?.status === HttpStatusCode.NotFound) {
                    throw new Error('Room not found');
                }
                if (error.response?.status === HttpStatusCode.BadRequest) {
                    throw new Error('Invalid room ID');
                }
            }
            console.error("Error deleting room:", error);
            throw error;
        }
    }

    static async deleteAssignedObjectRoom(roomId: string, objectId: string, eventId: string): Promise<void> {
        try {
            const response = await axios.delete(`${BASE_URL}/assigned`, {
                params: {
                    roomId,
                    objectId,
                    eventId
                }
            });

            if (response.status !== HttpStatusCode.NoContent) {
                throw new Error(`Unexpected status code: ${response.status}`);
            }

        } catch (err) {
            const error = err as Error;

            if (axios.isAxiosError(error)) {
                if (error.response?.status === HttpStatusCode.NotFound) {
                    throw new Error('Room not found');
                }
                if (error.response?.status === HttpStatusCode.BadRequest) {
                    throw new Error('Invalid room ID');
                }
            }

            console.error("Error deleting room:", error);
            throw error;
        }
    }

}

export default RoomService;