import {HttpStatusCode} from "axios";
import {ICard} from "../models/interfaces.ts";
import {API_URL} from "../config.ts";
import api from "../api/axios.ts";

const BASE_URL: string = API_URL + '/cards';

class CardService {
    static async fetchAllCards(): Promise<ICard[]> {
        const response = await api.get(BASE_URL);
        if (response.status !== HttpStatusCode.Ok) {
            throw new Error("Error fetching cards: " + response.status);
        }
        return response.data;
    }

    static async createCard(title: string, image: File): Promise<ICard> {
        const form = new FormData();
        form.append('title', title.trim());
        form.append('image', image);

        const response = await api.post(BASE_URL, form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }

    static async deleteCard(cardId: string): Promise<void> {
        await api.delete(`${BASE_URL}/${cardId}`);
    }

}


export default CardService;