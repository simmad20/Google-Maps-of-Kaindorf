import api from "../api/axios";
import {IAuthResponse, ITenant, IUser, RegisterTenantRequest} from "../models/interfaces.ts";

const TOKEN_KEY = "admin_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const USER_KEY = "admin_user";

class AuthService {

    saveAuth(data: IAuthResponse) {
        localStorage.setItem(TOKEN_KEY, data.token);
        if (data.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, data.refreshToken);
        localStorage.setItem(USER_KEY, JSON.stringify({
            id: data.id, username: data.username, roles: data.roles
        }));
    }

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    getRefreshToken() {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    }

    getUser() {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    clearAuth() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }

    async logout() {
        try {
            await api.post("/auth/logout");
        } catch {
        } finally {
            this.clearAuth();
        }
    }

    async verifyEmail(token: string) {
        await api.post(`/auth/verify-email?token=${token}`);
    }

    async changePassword(currentPassword: string, newPassword: string) {
        await api.post("/auth/change-password", {currentPassword, newPassword});
    }

    async login(username: string, password: string) {
        const res = await api.post<IAuthResponse>("/auth/login", {username, password});
        this.saveAuth(res.data);
        return res.data;
    }

    async registerSuperAdmin(data: RegisterTenantRequest): Promise<string> {
        const res = await api.post<string>("/auth/register-superadmin", data);
        return res.data;
    }

    async updateTenant(name: string, displayName: string) {
        const res = await api.put("/admin/tenant", {name, displayName});
        return res.data;
    }

    async inviteUser(data: {
        email: string,
        name: string,
        firstName: string,
        lastName: string,
        role: "ADMIN" | "ADMIN_VIEWER"
    }) {
        const res = await api.post("/admin/tenant/invite", data);
        return res.data;
    }

    async listUsers() {
        const res = await api.get<IUser[]>("/admin/tenant/users");
        return res.data;
    }

    async getTenant() {
        const res = await api.get<ITenant>("/admin/tenant");
        return res.data;
    }

    async resetJoinCode() {
        const res = await api.post<ITenant>("/admin/tenant/joincode/reset");
        return res.data;
    }

    async changeUserRole(userId: string, role: "ADMIN" | "ADMIN_VIEWER") {
        const res = await api.put(`/admin/tenant/users/${userId}/role`, {role});
        return res.data;
    }

    async deleteUser(userId: string) {
        await api.delete(`/admin/tenant/users/${userId}`);
    }
}

export default new AuthService();