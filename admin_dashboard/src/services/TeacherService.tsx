import {Component} from "react";
import axios, {HttpStatusCode} from "axios";
import {ITeacher} from "../models/interfaces.ts";

const BASE_URL: string = 'http://localhost:3000/teachers';

class TeacherService extends Component {
    static async fetchAllTeachers(): Promise<ITeacher[]> {
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

    static async addTeacherToRoom(teacher_id: number, room_id: number): Promise<ITeacher[]> {
        try {
            const response = await axios.post(BASE_URL + "/" + "assignTeacherToRoom");
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all teachers: " + response.status);
            }

            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error adding teacher to room: " + error.message);
            throw error;
        }
    }
}

export default TeacherService;