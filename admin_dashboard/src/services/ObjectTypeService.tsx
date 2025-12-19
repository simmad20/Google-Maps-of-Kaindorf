import {API_URL} from "../config.ts";
import {IObjectType} from "../models/interfaces.ts";
import axios, {HttpStatusCode} from "axios";

const BASE_URL: string = API_URL + "/types";

class ObjectTypeService {
    static async fetchAllObjectTypes(): Promise<IObjectType[]> {
        try {
            const response = await axios.get(BASE_URL);

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