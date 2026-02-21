import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Building2, Calendar, MapPin } from 'lucide-react';
import api from '../utils/api';

const HotelApprovals = () => {
    const [pendingHotels, setPendingHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingHotels();
    }, []);

    const fetchPendingHotels = async () => {
        try {
            // Correct path — use admin hotels endpoint filtered by PENDING status
            const response = await api.get('/admin/hotels', { params: { status: 'PENDING' } });
            setPendingHotels(response.data);
        } catch (error) {
            console.error("Error fetching pending hotels:", error);
            // Mock data for demo
            setPendingHotels([
                { id: '101', name: 'Mountain View Inn', city: 'Denver', managerId: 'user_123', createdAt: '2024-03-01T10:00:00Z', status: 'PENDING' },
                { id: '102', name: 'Lakeside Cabins', city: 'Austin', managerId: 'user_456', createdAt: '2024-03-02T14:30:00Z', status: 'PENDING' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        try {
            // Use admin hotel status endpoint: PUT /admin/hotels/{id}/status?status=ACTIVE
            await api.put(`/admin/hotels/${id}/status`, null, { params: { status: 'ACTIVE' } });
            setPendingHotels(prev => prev.filter(h => h.id !== id));
        } catch (error) {
            console.error("Failed to approve:", error);
            alert("Action failed.");
        }
    };

    const handleReject = async (id) => {
        if (!window.confirm("Are you sure you want to reject this hotel?")) return;
        try {
            // Use admin hotel status endpoint: PUT /admin/hotels/{id}/status?status=REJECTED
            await api.put(`/admin/hotels/${id}/status`, null, { params: { status: 'REJECTED' } });
            setPendingHotels(prev => prev.filter(h => h.id !== id));
        } catch (error) {
            console.error("Failed to reject:", error);
            alert("Action failed.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <CheckCircle className="text-emerald-500" /> Hotel Approvals
            </h1>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Hotel Info</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Submitted Date</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">Loading pending approvals...</td></tr>
                            ) : pendingHotels.length === 0 ? (
                                <tr><td colSpan="4" className="p-8 text-center text-slate-400">No pending hotels necessary for approval.</td></tr>
                            ) : (
                                pendingHotels.map(hotel => (
                                    <tr key={hotel.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-yellow-600/20 flex items-center justify-center text-yellow-400">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{hotel.name}</p>
                                                    <p className="text-xs text-slate-500">Manager: {hotel.managerId}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            <div className="flex items-center gap-2 text-sm">
                                                <MapPin size={14} className="text-slate-500" /> {hotel.city}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar size={14} className="text-slate-500" />
                                                {new Date(hotel.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    onClick={() => handleApprove(hotel.id)}
                                                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                                                >
                                                    <CheckCircle size={16} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(hotel.id)}
                                                    className="p-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-red-400 rounded-lg transition-colors"
                                                >
                                                    <XCircle size={18} />
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

export default HotelApprovals;
