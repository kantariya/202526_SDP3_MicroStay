import React, { useState, useEffect } from 'react';
import { Search, Ban, RefreshCw, User, Mail, Shield } from 'lucide-react';
import api from '../utils/api';

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

    const handleDisableUser = async (id) => {
        if (window.confirm("Are you sure you want to disable this user account?")) {
            try {
                await api.put(`/admin/users/${id}/disable`);
                // Backend doesn't return list, so we manually update or refetch
                setUsers(users.map(u => u.id === id ? { ...u, enabled: false } : u));
                alert("User disabled successfully.");
            } catch (error) {
                console.error("Error disabling user:", error);
                alert("Failed to disable user.");
            }
        }
    };

    const handleResetPassword = async (id) => {
        if (window.confirm("Reset password for this user? A temporary password will be emailed.")) {
            try {
                await api.post(`/admin/users/${id}/reset-password`);
                alert("Password reset email sent.");
            } catch (error) {
                console.error("Error resetting password:", error);
                alert("Failed to reset password.");
            }
        }
    };

    const filteredUsers = users.filter(user =>
    (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
                    <p className="text-slate-400 text-sm">Manage registered customers</p>
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
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading users...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No users found.</td></tr>
                            ) : (
                                filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{user.name || user.firstName} {user.lastName}</p>
                                                    <p className="text-xs text-slate-500">ID: {user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                <Mail size={14} className="text-slate-500" /> {user.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit">
                                                <Shield size={10} /> {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${user.enabled !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {user.enabled !== false ? 'ACTIVE' : 'DISABLED'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleResetPassword(user.id)}
                                                    className="p-1 hover:bg-yellow-500/10 text-yellow-500 rounded transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDisableUser(user.id)}
                                                    className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                                                    title="Disable User"
                                                >
                                                    <Ban size={16} />
                                                </button>
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
