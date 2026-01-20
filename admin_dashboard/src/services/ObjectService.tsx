import axios, {HttpStatusCode} from "axios";
import {IObject} from "../models/interfaces.ts";
import {API_URL} from "../config.ts";

const BASE_URL: string = API_URL + '/objects';

class ObjectService {
    static async fetchAllObjects(): Promise<IObject[]> {
        try {
            const response = await axios.get(BASE_URL);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all objects" + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all objects" + error.message);
            throw error;
        }
    }

    static async fetchAllObjectsByType(typeId: string): Promise<IObject[]> {
        try {
            const response = await axios.get(BASE_URL + "/" + typeId);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all objects by type: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all objects by type: " + error.message);
            throw error;
        }
    }

    static async createOrEditObject(object: IObject, isCreating: boolean) {
        try {
            const url = isCreating
                ? BASE_URL + `/${object.typeId}`
                : BASE_URL + `/${object.id}`;

            let response;
            if (isCreating) {
                response = await axios.post(url, object.attributes);

                if (response.status !== HttpStatusCode.Created) {
                    throw Error("Error response creating object: " + response.status);
                }
            } else {
                response = await axios.put(url, object.attributes)

                if (response.status !== HttpStatusCode.Ok) {
                    throw Error("Error response editing object: " + response.status);
                }
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error creating or editing object: " + error.message);
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

    static async addObjectToRoom(objectId: string, roomId: string, eventId: string): Promise<any> {
        try {
            const response = await axios.post(
                `${BASE_URL}/${objectId}/assign-room/${roomId}`,
                {},
                {params: {eventId}}
            );
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 400) {
                throw new Error('Ungültige Eingabedaten');
            }
            if (error.response?.status === 404) {
                throw new Error('Lehrer oder Raum nicht gefunden');
            }
            throw new Error('Fehler beim Zuordnen: ' + error.message);
        }
    }

    static async deleteObject(objectId: string): Promise<void> {
        try {
            const response = await axios.delete(`${BASE_URL}/${objectId}`);

            if (response.status !== HttpStatusCode.NoContent) {
                throw new Error(`Unerwarteter Statuscode: ${response.status}`);
            }
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    switch (error.response.status) {
                        case HttpStatusCode.NotFound:
                            throw new Error('Lehrer nicht gefunden');
                        case HttpStatusCode.BadRequest:
                            throw new Error('Ungültige Lehrer-ID');
                        case HttpStatusCode.Conflict:
                            throw new Error('Lehrer hat noch Raumzuordnungen');
                    }
                }
            }
            console.error("Fehler beim Löschen:", error);
            throw new Error('Fehler beim Löschen des Lehrers: ' + error.message);
        }
    }
}

export default ObjectService;