import axios, {HttpStatusCode} from "axios";
import {API_URL} from "@/config";
import {ICard} from "@/models/interfaces";

const BASE_URL: string = API_URL + '/cards';

class CardService {
    static async fetchAllCards(): Promise<ICard[]> {
        try {
            const response = await axios.get(BASE_URL);
            if (response.status !== HttpStatusCode.Ok) {
                throw Error("Error response fetching all cards: " + response.status);
            }
            return response.data;
        } catch (err) {
            const error: Error = err as Error;
            console.error("Error fetching all cards: " + error.message);
            throw error;
        }
    }
}


export default CardService;