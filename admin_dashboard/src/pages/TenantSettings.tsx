import React, {useEffect, useState} from "react";
import QRCode from "react-qr-code";
import authService from "../services/AuthService";
import {useAuth} from "../context/AuthContext";
import {ITenant, IUser} from "../models/interfaces";

export default function TenantSettings() {
    const {user} = useAuth();

    const [tenant, setTenant] = useState<ITenant | null>(null);
    const [tenantName, setTenantName] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [repeatNewPassword, setRepeatNewPassword] = useState("");

    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteFirstName, setInviteFirstName] = useState("");
    const [inviteLastName, setInviteLastName] = useState("");
    const [inviteUsername, setInviteUsername] = useState("");

    const [inviteRole, setInviteRole] = useState<"ADMIN" | "ADMIN_VIEWER">("ADMIN");
    const [users, setUsers] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    if (!user) return null;
    const isSuperAdmin = user.roles.includes("SUPER_ADMIN");

    useEffect(() => {
        loadTenant();
        loadUsers();
    }, []);

    const loadTenant = async () => {
        try {
            const data = await authService.getTenant();
            setTenant(data);
            setTenantName(data.name ?? "");
        } catch {
            console.error("Could not load tenant");
        }
    };

    const loadUsers = async () => {
        try {
            const data = await authService.listUsers();
            setUsers(data);
        } catch (err) {
            console.error("Error loading users:", err);
        }
    };

    const handleUpdateTenant = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tenantName.trim()) return;
        setError(""); setSuccess(""); setLoading(true);
        try {
            await authService.updateTenant(tenantName, tenantName);
            setSuccess("Tenant name updated.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(""); setSuccess(""); setLoading(true);
        try {
            const result = await authService.inviteUser({
                email: inviteEmail,
                name: inviteUsername,
                firstName: inviteFirstName,
                lastName: inviteLastName,
                role: inviteRole,
            });
            setSuccess(result.message ?? "User invited successfully.");
            setInviteEmail(""); setInviteUsername("");
            setInviteFirstName(""); setInviteLastName("");
            await loadUsers();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResetJoinCode = async () => {
        if (!window.confirm("Generate a new join code? The old QR code will stop working immediately.")) return;
        setError(""); setSuccess(""); setLoading(true);
        try {
            const updatedTenant = await authService.resetJoinCode();
            setTenant(updatedTenant);
            setSuccess("Join code regenerated.");
        } catch (err: any) {
            setError(err.message || "Failed to reset join code.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== repeatNewPassword) {
            setError("New passwords do not match.");
            return;
        }
        setError(""); setSuccess(""); setLoading(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            setSuccess("Password changed successfully.");
            setCurrentPassword(""); setNewPassword(""); setRepeatNewPassword("");
        } catch (err: any) {
            setError(err.message || "Failed to change password.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangeRole = async (userId: string, newRole: "ADMIN" | "ADMIN_VIEWER") => {
        setError(""); setSuccess("");
        try {
            await authService.changeUserRole(userId, newRole);
            setSuccess("Role updated successfully.");
            await loadUsers();
        } catch (err: any) {
            setError(err.message || "Failed to change role.");
        }
    };

    const handleDeleteUser = async (userId: string, name: string) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        setError(""); setSuccess("");
        try {
            await authService.deleteUser(userId);
            setSuccess("User deleted successfully.");
            await loadUsers();
        } catch (err: any) {
            setError(err.message || "Failed to delete user.");
        }
    };

    const handleExportQrPdf = () => {
        const joinCode = tenant?.joinCode;
        if (!joinCode) return;
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;
        const qrSvg = document.querySelector('#qr-code-container svg');
        const svgContent = qrSvg ? qrSvg.outerHTML : '';
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>QR Code - ${tenant?.name || 'Tenant'}</title>
                <style>
                    body { font-family: Arial, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 40px; box-sizing: border-box; }
                    h1 { font-size: 24px; margin-bottom: 8px; color: #1f2937; }
                    p { color: #6b7280; font-size: 14px; margin-bottom: 32px; }
                    .qr { padding: 24px; border: 1px solid #e5e7eb; border-radius: 12px; }
                    .code { margin-top: 24px; font-family: monospace; font-size: 12px; color: #9ca3af; word-break: break-all; text-align: center; max-width: 300px; }
                    @media print { button { display: none; } }
                </style>
            </head>
            <body>
                <h1>${tenant?.name || 'Maps of Kaindorf'}</h1>
                <p>Scan this QR-Code to join in the App</p>
                <div class="qr">${svgContent}</div>
                <div class="code">${joinCode}</div>
                <script>window.onload = () => window.print();<\/script>
            </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
            <h1 className="text-xl font-semibold text-gray-900">Tenant Settings</h1>

            {/* QR Code – alle sehen es, aber nur SuperAdmin kann regeneraten */}
            {tenant !== null && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-900">Mobile App QR Code</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleExportQrPdf}
                                disabled={!tenant?.joinCode}
                                className="px-3 py-1.5 text-xs border border-purple-200 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Export PDF
                            </button>
                            {isSuperAdmin && (
                                <button
                                    onClick={handleResetJoinCode}
                                    disabled={loading}
                                    className="px-3 py-1.5 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                >
                                    Regenerate code
                                </button>
                            )}
                        </div>
                    </div>
                    <div id="qr-code-container" className="flex justify-center p-6 bg-gray-50 rounded-lg border border-gray-100">
                        {tenant.joinCode ? (
                            <QRCode value={tenant.joinCode} size={180}/>
                        ) : (
                            <p className="text-sm text-gray-400">No join code available.</p>
                        )}
                    </div>
                    {tenant.joinCode && (
                        <p className="mt-3 text-xs text-gray-400 text-center font-mono break-all">
                            {tenant.joinCode}
                        </p>
                    )}
                </div>
            )}

            {/* Tenant Name – nur SuperAdmin */}
            {isSuperAdmin && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Tenant Name</h2>
                    <form onSubmit={handleUpdateTenant} className="space-y-3">
                        <input
                            type="text"
                            value={tenantName}
                            onChange={(e) => setTenantName(e.target.value)}
                            placeholder="Tenant name"
                            required
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300"
                        >
                            Save
                        </button>
                    </form>
                </div>
            )}

            {/* Change Password – alle */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h2>
                <form onSubmit={handleChangePassword} className="space-y-3">
                    <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                           placeholder="Current password" required
                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
                           placeholder="New password" required
                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
                    <input type="password" value={repeatNewPassword} onChange={e => setRepeatNewPassword(e.target.value)}
                           placeholder="Repeat new password" required
                           className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
                    <button type="submit" disabled={loading}
                            className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300">
                        Change Password
                    </button>
                </form>
            </div>

            {/* Invite Admin – nur SuperAdmin */}
            {isSuperAdmin && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Invite Admin</h2>
                    <form onSubmit={handleInvite} className="space-y-3">
                        <input value={inviteFirstName} onChange={e => setInviteFirstName(e.target.value)}
                               placeholder="First Name" required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"/>
                        <input value={inviteLastName} onChange={e => setInviteLastName(e.target.value)}
                               placeholder="Last Name" required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"/>
                        <input value={inviteUsername} onChange={e => setInviteUsername(e.target.value)}
                               placeholder="Username" required className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg"/>
                        <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)}
                               placeholder="Email address" required
                               className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"/>
                        <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value as "ADMIN" | "ADMIN_VIEWER")}
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white">
                            <option value="ADMIN">Admin</option>
                            <option value="ADMIN_VIEWER">Viewer</option>
                        </select>
                        <button type="submit" disabled={loading}
                                className="px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors disabled:bg-gray-300">
                            Send invitation
                        </button>
                    </form>
                </div>
            )}

            {/* User list – alle sehen es, Aktionen nur SuperAdmin */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    All Users
                    <span className="ml-2 text-xs font-normal text-gray-400">({users.length})</span>
                </h2>
                {users.length === 0 ? (
                    <p className="text-sm text-gray-400">No users found.</p>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {users.map((u, index: number) => {
                            const isAppUser = u.roles.includes("APP_USER");
                            const isUserSuperAdmin = u.roles.includes("SUPER_ADMIN");
                            const fullName = !isAppUser && (u.firstName || u.lastName)
                                ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim()
                                : null;

                            return (
                                <li key={index} className="py-4 flex items-start justify-between gap-4">
                                    <div className="min-w-0 flex-1">
                                        {fullName && <p className="text-sm font-medium text-gray-900">{fullName}</p>}
                                        <p className={`text-sm ${fullName ? "text-gray-500" : "font-medium text-gray-900"}`}>
                                            {u.username}
                                        </p>
                                        {!isAppUser && <p className="text-xs text-gray-400">{u.email}</p>}
                                        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-gray-400">
                                            <span>Created: {u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-GB") : "—"}</span>
                                            {!isAppUser && (
                                                <span>Last login: {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString("en-GB") : "Never"}</span>
                                            )}
                                            {!u.enabled && <span className="text-amber-500 font-medium">Pending verification</span>}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex flex-wrap gap-1.5 justify-end">
                                            {u.roles.map((r, i) => (
                                                <span key={i} className="px-2 py-0.5 text-xs bg-purple-50 text-purple-700 border border-purple-100 rounded-full font-medium whitespace-nowrap">
                                                    {r}
                                                </span>
                                            ))}
                                        </div>
                                        {isSuperAdmin && !isUserSuperAdmin && !isAppUser && (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={u.roles[0]}
                                                    onChange={e => handleChangeRole(u.id, e.target.value as "ADMIN" | "ADMIN_VIEWER")}
                                                    className="px-2 py-1 text-xs border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                                                >
                                                    <option value="ADMIN">Admin</option>
                                                    <option value="ADMIN_VIEWER">Viewer</option>
                                                </select>
                                                <button
                                                    onClick={() => handleDeleteUser(u.id, fullName ?? u.username)}
                                                    className="px-2 py-1 text-xs border border-red-200 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {error && <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
            {success && <div className="px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{success}</div>}
        </div>
    );
}