import axios, {HttpStatusCode} from "axios";
import {IObject} from "../models/interfaces.ts";
import {API_URL} from "../config.ts";

const BASE_URL: string = API_URL + '/objects/teacher';

class TeacherService {
    static async fetchAllTeachers(): Promise<IObject[]> {
        try {
            const response = await axios.get(BASE_URL);
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

    // Neue Suchmethode
    static async searchTeachers(searchTerm: string): Promise<IObject[]> {
        try {
            const response = await axios.get(`${API_URL}/objects/teacher/search?query=${encodeURIComponent(searchTerm)}`);
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

    static async addTeacherToRoom(objectId: string, roomId: string): Promise<any> {
        try {
            const response = await axios.post(
                `${BASE_URL}/${objectId}/assign-room/${roomId}`
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

    static async deleteTeacher(teacherId: number): Promise<void> {
        try {
            const response = await axios.delete(`${BASE_URL}/${teacherId}`);

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

export default TeacherService;