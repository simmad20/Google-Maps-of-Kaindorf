import axios, {AxiosResponse} from "axios";
import {IAuthResponse, ISignIn} from "../models/interfaces.ts";

const API_BASE_URL = 'http://localhost:8080/auth';

class AuthService {
    static async register(formFields: ISignIn): Promise<String> {
        try {
            const response: AxiosResponse<String> = await axios.post(API_BASE_URL + '/register', formFields,
                {
                    withCredentials: true
                });

            return response.data;
        } catch (error) {
            console.error('Error fetching register: ', error);
            throw error;
        }
    }

    static async login(formFields: ISignIn): Promise<IAuthResponse> {
        try {
            const response: AxiosResponse<IAuthResponse> = await axios.post(API_BASE_URL + '/login',
                {
                    username: formFields.username,
                    password: formFields.password
                },
                {
                    withCredentials: true
                });

            return response.data;
        } catch (error) {
            console.error('Error fetching login: ', error);
            throw error;
        }
    }

    static async refresh(): Promise<IAuthResponse> {
        try {
            const response: AxiosResponse<IAuthResponse> = await axios.post(API_BASE_URL + '/refresh',
                {},
                {withCredentials: true}
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching refresh: ', error);
            throw error;
        }
    }

    static async logout(): Promise<void> {
        try {
            await axios.post(API_BASE_URL + '/logout', {}, {
                withCredentials: true
            });
        } catch (error) {
            console.error('Error fetching logout: ', error);
            throw error;
        }
    }
}

export default AuthService;