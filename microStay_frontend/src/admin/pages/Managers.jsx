import React, { useState, useEffect } from 'react';
import { Search, Ban, RefreshCw, User, Mail, Shield, UserPlus, KeyRound , Check } from 'lucide-react';
import api from '../utils/api';
import CreateManagerModal from '../components/CreateManagerModal';

const Managers = () => {
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/managers');
            setManagers(response.data);
        } catch (error) {
            console.error("Error fetching managers:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDisableManager = async (id) => {
        if (window.confirm("Are you sure you want to disable this manager account?")) {
            try {
                await api.put(`/admin/managers/${id}/disable`);
                setManagers(managers.map(m => m.id === id ? { ...m, enabled: false } : m));
                alert("Manager disabled successfully.");
            } catch (error) {
                console.error("Error disabling manager:", error);
                alert("Failed to disable manager.");
            }
        }
    };

    const handleEnableManager = async (id) => {
        if (window.confirm("Are you sure you want to enable this manager account?")) {
            try {
                await api.put(`/admin/managers/${id}/enable`);
                setManagers(managers.map(m =>
                    m.id === id ? { ...m, enabled: true } : m
                ));
                alert("Manager enabled successfully.");
            } catch (error) {
                console.error("Error enabling manager:", error);
                alert("Failed to enable manager.");
            }
        }
    };

    const handleResetPassword = async (id) => {
        if (window.confirm("Send a password reset link to this manager?")) {
            try {
                await api.post(`/admin/managers/${id}/reset-password`);
                alert("Password reset process initiated.");
            } catch (error) {
                console.error("Error resetting password:", error);
                alert("Failed to initiate password reset.");
            }
        }
    };

    const filteredManagers = managers.filter(manager =>
    (manager.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        manager.email?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Hotel Managers</h1>
                    <p className="text-slate-400 text-sm">Manage users with MANAGER role</p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 w-64">
                        <Search size={18} className="text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search managers..."
                            className="bg-transparent border-none focus:outline-none text-slate-200 text-sm w-full placeholder-slate-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                        <UserPlus size={18} /> Add Manager
                    </button>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Manager</th>
                                <th className="p-4 font-semibold">Contact</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading managers...</td></tr>
                            ) : filteredManagers.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No managers found.</td></tr>
                            ) : (
                                filteredManagers.map(manager => (
                                    <tr key={manager.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center text-purple-400">
                                                    <User size={16} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{manager.firstName} {manager.lastName}</p>
                                                    <p className="text-xs text-slate-500">ID: {manager.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                <Mail size={14} className="text-slate-500" /> {manager.email}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${manager.enabled !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {manager.enabled !== false ? 'ACTIVE' : 'DISABLED'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleResetPassword(manager.id)}
                                                    className="p-1 hover:bg-blue-500/10 text-blue-400 rounded transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <KeyRound size={16} />
                                                </button>
                                                {manager.enabled !== false ? (
                                                    <button
                                                        onClick={() => handleDisableManager(manager.id)}
                                                        className="p-1 hover:bg-red-500/10 text-red-500 rounded transition-colors"
                                                        title="Disable Manager"
                                                    >
                                                        <Ban size={16} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEnableManager(manager.id)}
                                                        className="p-1 hover:bg-green-500/10 text-green-500 rounded transition-colors"
                                                        title="Enable Manager"
                                                    >
                                                        <Check size={16} />
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

            {showCreateModal && (
                <CreateManagerModal
                    onClose={() => setShowCreateModal(false)}
                    onSave={() => {
                        fetchManagers();
                        setShowCreateModal(false);
                    }}
                />
            )}
        </div>
    );
};

export default Managers;
