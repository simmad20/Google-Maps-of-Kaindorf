import axios, {HttpStatusCode} from "axios";

import { API_URL } from "../config";
import {IEvent} from "@/models/interfaces";

const BASE_URL: string = API_URL + '/events';

class EventService {
    static async fetchActiveEvent(): Promise<IEvent> {
        try {
            const response = await axios.get(BASE_URL + "/active");
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching active event: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching active event: " + error.message);
            throw error;
        }
    }

}


export default EventService;