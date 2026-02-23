import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/axios';

const TOKEN_KEY = 'app_token';
const USER_KEY = 'app_user';

export interface IAppAuthResponse {
    token: string;
    userId: string;
    roles: string[];
    tenantId: string;
}

class AuthService {

    async saveAuth(data: IAppAuthResponse) {
        await AsyncStorage.setItem(TOKEN_KEY, data.token);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify({
            userId: data.userId,
            roles: data.roles,
            tenantId: data.tenantId,
        }));
    }

    async getToken(): Promise<string | null> {
        return await AsyncStorage.getItem(TOKEN_KEY);
    }

    async getUser() {
        const user = await AsyncStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    async isLoggedIn(): Promise<boolean> {
        const token = await this.getToken();
        return token !== null;
    }

    async logout() {
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_KEY);
    }

    async joinTenant(joinCode: string): Promise<IAppAuthResponse> {
        const res = await api.post<IAppAuthResponse>('/app/join', { joinCode });
        await this.saveAuth(res.data);
        return res.data;
    }
}

export default new AuthService();