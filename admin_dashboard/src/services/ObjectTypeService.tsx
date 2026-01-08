import {API_URL} from "../config.ts";
import {IObjectType, IObjectTypeCreate} from "../models/interfaces.ts";
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

    static async createObjectType(objectTypeCreate: IObjectTypeCreate): Promise<IObjectType> {
        try {
            const response = await axios.post(BASE_URL, objectTypeCreate);

            if (response.status !== HttpStatusCode.Created) {
                throw Error("Error response posting type: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error posting type: " + error.message);
            throw error;
        }
    }

    static async updateObjectType(objectType: IObjectType): Promise<IObjectType> {
        try {
            const response = await axios.put(BASE_URL, objectType);

            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Erro response updating type: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error updating type: " + error.message);
            throw error;
        }
    }
}

export default ObjectTypeService;