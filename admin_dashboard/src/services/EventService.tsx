import axios, {HttpStatusCode} from "axios";
import {IEvent} from "../models/interfaces.ts";
import {API_URL} from "../config.ts";

const BASE_URL: string = API_URL + '/events';

class EventService {
    static async fetchAllEvents(): Promise<IEvent[]> {
        try {
            const response = await axios.get(BASE_URL);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all events: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all events: " + error.message);
            throw error;
        }
    }

    static async createEvent(eventCreate: Omit<IEvent, 'id'>): Promise<IEvent> {
        try {
            const response = await axios.post(BASE_URL, eventCreate);

            if (response.status !== HttpStatusCode.Created) {
                throw Error("Error response posting event: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error posting event: " + error.message);
            throw error;
        }
    }

    static async updateEvent(event: IEvent): Promise<IEvent> {
        try {
            const response = await axios.put(BASE_URL, event);

            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response updating event: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error updating event: " + error.message);
            throw error;
        }
    }

    static async activateEvent(eventId: string): Promise<IEvent> {
        try {
            const response = await axios.put(`${BASE_URL}/${eventId}/activate`);

            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response activating event: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error activating event: " + error.message);
            throw error;
        }
    }

}


export default EventService;