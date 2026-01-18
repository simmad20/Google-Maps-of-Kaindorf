import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080',
});

let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
    authToken = token;
};

axiosInstance.interceptors.request.use(config => {
    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

export default axiosInstance;
