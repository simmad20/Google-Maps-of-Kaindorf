import React, {useState} from "react";
import {useNavigate, useLocation} from "react-router-dom";
import authService from "../services/AuthService";
import {RegisterTenantRequest} from "../models/interfaces";
import {useAuth} from "../context/AuthContext.tsx";

interface ILogin {
    registering?: boolean
}

export default function Login({registering}: ILogin) {
    const navigate = useNavigate();
    const location = useLocation();
    const {login} = useAuth();

    // Remember the route the user wanted to visit
    const from = (location.state as any)?.from?.pathname || "/";

    const [isRegister, setIsRegister] = useState(registering ?? false);
    const [loginData, setLoginData] = useState({username: "", password: ""});
    const [registerData, setRegisterData] = useState<RegisterTenantRequest>({
        tenantName: "",
        email: "",
        name: "",
        firstName: "",
        lastName: "",
        password: "",
        repeatPassword: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegisterData({...registerData, [e.target.name]: e.target.value});
    };

    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginData({...loginData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isRegister) {
                if (registerData.password !== registerData.repeatPassword) {
                    setError("Passwords do not match.");
                    return;
                }
                const message: string = await authService.registerSuperAdmin(registerData);
                alert(message);
            } else {
                await login(loginData.username, loginData.password);
                navigate(from, {replace: true});
            }
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <h1 className="text-2xl font-bold text-center mb-6">
                    {isRegister ? "Register Tenant" : "Admin Login"}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {isRegister && (
                        <>
                            <input
                                name="tenantName"
                                placeholder="Tenant Name"
                                value={registerData.tenantName}
                                onChange={handleRegisterChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                            <input
                                name="name"
                                placeholder="Username"
                                value={registerData.name}
                                onChange={handleRegisterChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                            <input
                                name="firstName"
                                placeholder="First Name"
                                value={registerData.firstName}
                                onChange={handleRegisterChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                            <input
                                name="lastName"
                                placeholder="Last Name"
                                value={registerData.lastName}
                                onChange={handleRegisterChange}
                                required
                                className="w-full px-4 py-3 border rounded-lg"
                            />
                        </>
                    )}

                    {isRegister ? (
                        <input
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={registerData.email}
                            onChange={handleRegisterChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg"
                        />
                    ) : (
                        <input
                            name="username"
                            placeholder="Username"
                            value={loginData.username}
                            onChange={handleLoginChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg"
                        />
                    )}

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={isRegister ? registerData.password : loginData.password}
                        onChange={isRegister ? handleRegisterChange : handleLoginChange}
                        required
                        className="w-full px-4 py-3 border rounded-lg"
                    />

                    {isRegister && (
                        <input
                            name="repeatPassword"
                            type="password"
                            placeholder="Repeat Password"
                            value={registerData.repeatPassword}
                            onChange={handleRegisterChange}
                            required
                            className="w-full px-4 py-3 border rounded-lg"
                        />
                    )}

                    {error && (
                        <div className="p-3 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-purple-600 text-white rounded-lg disabled:bg-gray-300"
                    >
                        {loading ? "Loading..." : isRegister ? "Register" : "Login"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsRegister(!isRegister)}
                        className="text-purple-600 text-sm"
                    >
                        {isRegister ? "Back to Login" : "No account yet? Register"}
                    </button>
                </div>
            </div>
        </div>
    );
}