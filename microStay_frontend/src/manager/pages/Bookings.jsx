import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import api from '../../admin/utils/api';

const ManagerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/manager/bookings');
            setBookings(response.data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            if (error.response && error.response.status === 404) {
                setBookings([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (!window.confirm(`Are you sure you want to \${action} this booking?`)) return;

        try {
            if (action === 'confirm') {
                await api.post(`/bookings/\${id}/confirm`);
            } else if (action === 'cancel') {
                await api.post(`/bookings/\${id}/cancel`);
            } else if (action === 'checkin') {
                // Assuming backend supports this, or we update status manually via PUT
                // await api.put(`/bookings/\${id}/status`, { status: 'CHECKED_IN' });
                alert("Check-in feature not yet connected to backend.");
                return;
            } else if (action === 'checkout') {
                // await api.put(`/bookings/\${id}/status`, { status: 'COMPLETED' });
                alert("Check-out feature not yet connected to backend.");
                return;
            }

            alert(`Booking \${action}ed successfully.`);
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error(`Error \${action}ing booking:`, error);
            alert(`Failed to \${action} booking.`);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Bookings Management</h1>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Ref ID</th>
                                <th className="p-4 font-semibold">Guest</th>
                                <th className="p-4 font-semibold">Room Info</th>
                                <th className="p-4 font-semibold">Dates</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading bookings...</td></tr>
                            ) : bookings.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No bookings found.</td></tr>
                            ) : (
                                bookings.map(booking => (
                                    <tr key={booking.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 text-slate-400 font-mono text-xs">{booking.id}</td>
                                        <td className="p-4 text-slate-200 font-medium text-xs">{booking.userId}</td>
                                        <td className="p-4 text-sm text-slate-300">
                                            <p>{booking.roomId}</p>
                                            <p className="text-xs text-slate-500">{booking.hotelId}</p>
                                        </td>
                                        <td className="p-4 text-sm text-slate-300">
                                            <div className="flex flex-col">
                                                <span>In: {new Date(booking.checkInDate).toLocaleDateString()}</span>
                                                <span>Out: {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold \${
                                                booking.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-400' :
                                                booking.status === 'CHECKED_IN' ? 'bg-purple-500/20 text-purple-400' :
                                                booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                                                'bg-green-500/20 text-green-400'
                                            }`}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status === 'PENDING' && (
                                                    <div className="text-yellow-500 text-xs italic pr-2">Pending Conf.</div>
                                                )}
                                                {booking.status === 'CONFIRMED' && (
                                                    <button onClick={() => handleAction(booking.id, 'checkin')} className="bg-emerald-600/20 text-emerald-400 px-3 py-1 rounded text-xs hover:bg-emerald-600/30">
                                                        Check In
                                                    </button>
                                                )}
                                                {booking.status === 'CHECKED_IN' && (
                                                    <button onClick={() => handleAction(booking.id, 'checkout')} className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded text-xs hover:bg-purple-600/30">
                                                        Check Out
                                                    </button>
                                                )}
                                                {booking.status !== 'CANCELLED' && booking.status !== 'COMPLETED' && (
                                                    <button onClick={() => handleAction(booking.id, 'cancel')} className="text-red-400 p-2 hover:bg-red-500/10 rounded" title="Cancel Booking">
                                                        <XCircle size={16} />
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

export default ManagerBookings;
