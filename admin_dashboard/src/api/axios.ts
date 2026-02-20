import axios from "axios";
import { API_URL } from "../config";
import AuthService from "../services/AuthService";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
    const token = AuthService.getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    res => res,
    async error => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;
            const refreshToken = AuthService.getRefreshToken();
            if (refreshToken) {
                try {
                    const res = await api.post("/auth/refresh", { refreshToken });
                    AuthService.saveAuth(res.data);
                    original.headers.Authorization = `Bearer ${res.data.token}`;
                    return api(original);
                } catch {
                    AuthService.clearAuth();
                    window.location.href = "/auth";
                }
            } else {
                AuthService.clearAuth();
                window.location.href = "/auth";
            }
        }

        const message = error.response?.data?.message || error.response?.data || error.message;
        return Promise.reject(new Error(message));
    }
);

export default api;