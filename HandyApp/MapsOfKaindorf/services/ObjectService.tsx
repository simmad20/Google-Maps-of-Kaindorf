import axios, {HttpStatusCode} from "axios";
import {IObject} from "@/models/interfaces";
import {API_URL} from "@/config";

const BASE_URL: string = API_URL + '/objects';

class ObjectService {
    static async fetchAllObjectsByType(typeId: string): Promise<IObject[]> {
        try {
            const response = await axios.get(BASE_URL + "/" + typeId);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all teachers: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all teachers: " + error.message);
            throw error;
        }
    }

    static async searchObjects(typeId: string, searchTerm: string): Promise<IObject[]> {
        try {
            const response = await axios.get(`${API_URL}/objects/${typeId}/search?query=${encodeURIComponent(searchTerm)}`);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response searching teachers: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error searching teachers: " + error.message);
            throw error;
        }
    }
}

export default ObjectService;