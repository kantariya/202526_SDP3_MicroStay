import React, { useState, useEffect } from 'react';
import { Search, Ban, RefreshCw, User, Mail, Shield, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const roles = ["USER", "HOTEL_MANAGER"];

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    /* ------------------ ENABLE / DISABLE ------------------ */

    const handleDisableUser = async (id) => {
        if (!window.confirm("Disable this user?")) return;

        try {
            await api.put(`/admin/users/${id}/disable`);
            setUsers(prev =>
                prev.map(u => u.id === id ? { ...u, enabled: false } : u)
            );
        } catch (error) {
            alert("Failed to disable user.");
        }
    };

    const handleEnableUser = async (id) => {
        try {
            await api.put(`/admin/users/${id}/enable`);
            setUsers(prev =>
                prev.map(u => u.id === id ? { ...u, enabled: true } : u)
            );
        } catch (error) {
            alert("Failed to enable user.");
        }
    };

    /* ------------------ RESET PASSWORD ------------------ */

    const handleResetPassword = async (id) => {
        if (!window.confirm("Reset password? Temporary password will be emailed.")) return;

        try {
            await api.post(`/admin/users/${id}/reset-password`);
            alert("Password reset email sent.");
        } catch (error) {
            alert("Failed to reset password.");
        }
    };

    /* ------------------ CHANGE ROLE ------------------ */

    const handleRoleChange = async (id, newRole) => {
        if (!window.confirm(`Change role to ${newRole}?`)) return;
        try {
            await api.put(`/admin/users/${id}/role`, null, {
                params: { role: newRole }
            });

            fetchUsers(); // reload to reflect changes

        } catch (error) {
            alert("Failed to update role.");
        }
    };

    /* ------------------ SEARCH ------------------ */

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
                    <p className="text-slate-400 text-sm">Manage registered users</p>
                </div>

                <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 w-64">
                    <Search size={18} className="text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-transparent border-none focus:outline-none text-slate-200 text-sm w-full placeholder-slate-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">User</th>
                                <th className="p-4 font-semibold">Contact</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        Loading users...
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-slate-400">
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">

                                        {/* USER INFO */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">
                                                        {user.firstName} {user.lastName}
                                                    </p>
                                                    <p className="text-xs text-slate-500">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* CONTACT */}
                                        <td className="p-4 text-sm text-slate-300">
                                            <div className="flex items-center gap-2">
                                                <Mail size={14} className="text-slate-500" />
                                                {user.email}
                                            </div>
                                        </td>

                                        {/* ROLE DROPDOWN */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Shield size={14} className="text-slate-400" />
                                                <select
                                                    value={user.role}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="bg-slate-700 text-slate-200 text-xs px-2 py-1 rounded focus:outline-none"
                                                >
                                                    {roles.map(role => (
                                                        <option key={role} value={role}>
                                                            {role}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>

                                        {/* STATUS */}
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold 
                                                ${user.enabled !== false
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-red-500/20 text-red-400'}`}>
                                                {user.enabled !== false ? 'ACTIVE' : 'DISABLED'}
                                            </span>
                                        </td>

                                        {/* ACTIONS */}
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-3">

                                                {/* RESET PASSWORD */}
                                                <button
                                                    onClick={() => handleResetPassword(user.id)}
                                                    className="p-1 hover:bg-yellow-500/10 text-yellow-500 rounded"
                                                    title="Reset Password"
                                                >
                                                    <RefreshCw size={16} />
                                                </button>

                                                {/* ENABLE / DISABLE */}
                                                {user.enabled !== false ? (
                                                    <button
                                                        onClick={() => handleDisableUser(user.id)}
                                                        className="p-1 hover:bg-red-500/10 text-red-500 rounded"
                                                        title="Disable User"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEnableUser(user.id)}
                                                        className="p-1 hover:bg-green-500/10 text-green-400 rounded"
                                                        title="Enable User"
                                                    >
                                                        <CheckCircle size={16} />
                                                    </button>
                                                )}

                                            </div>
                                        </td>

                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Users;