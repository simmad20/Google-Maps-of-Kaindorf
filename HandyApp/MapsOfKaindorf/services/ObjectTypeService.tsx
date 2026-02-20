import {API_URL} from "@/config";
import {IObjectType} from "@/models/interfaces";
import {HttpStatusCode} from "axios";
import api from "@/api/axios";

const BASE_URL: string = API_URL + "/types";

class ObjectTypeService {
    static async fetchAllObjectTypes(eventId: string): Promise<IObjectType[]> {
        try {
            const response = await api.get(BASE_URL + "/" + eventId);

            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all types: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all types: " + error.message);
            throw error;
        }
    }
}

export default ObjectTypeService;