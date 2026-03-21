import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import api from '../utils/api';
import ConfirmDialog from '../../user/components/ConfirmDialog';

const AdminBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Confirm Dialog State
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [bookingToCancel, setBookingToCancel] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/bookings');
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

    // Check if booking can be cancelled (must be confirmed and check-in date is in the future)
    const canCancelBooking = (booking) => {
        if (booking.status !== 'CONFIRMED') return false;
        const today = new Date();
        const checkInDate = new Date(booking.checkInDate);
        return checkInDate > today;
    };

    const initiateCancel = (booking) => {
        if (!canCancelBooking(booking)) {
            alert("This booking cannot be cancelled. Either it's not confirmed or the cancellation period has passed.");
            return;
        }
        setBookingToCancel(booking);
        setIsConfirmOpen(true);
    };

    const handleConfirmCancel = async () => {
        if (!bookingToCancel) return;
        
        try {
            await api.post(`/bookings/${bookingToCancel.bookingReference}/cancel`);
            alert(`Booking ${bookingToCancel.bookingReference} cancelled successfully.`);
            fetchBookings(); // Refresh list
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert(error.response?.data?.message || "Failed to cancel booking.");
        } finally {
            setIsConfirmOpen(false);
            setBookingToCancel(null);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">All Bookings</h1>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Ref ID</th>
                                <th className="p-4 font-semibold">Guest (User ID)</th>
                                <th className="p-4 font-semibold">Room / Hotel</th>
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
                                bookings.map((booking) => (
                                    <tr key={booking.bookingId} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 text-slate-400 font-mono text-xs">{booking.bookingId}</td>
                                        <td className="p-4 text-slate-200 font-medium text-xs">
                                            {booking.guestDetails?.name || booking.userId}
                                        </td>
                                        <td className="p-4 text-sm text-slate-300">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-slate-100">{booking.hotelName}</span>
                                                <span className="text-xs text-slate-500">
                                                    {booking.rooms?.length || 0} Rooms: {booking.rooms?.map(r => r.roomType).join(', ')}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-slate-300">
                                            <div className="flex flex-col">
                                                <span>In: {new Date(booking.checkInDate).toLocaleDateString()}</span>
                                                <span>Out: {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col items-start gap-1">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-blue-500/20 text-blue-400' :
                                                        booking.status === 'CHECKED_IN' ? 'bg-purple-500/20 text-purple-400' :
                                                            booking.status === 'CANCELLED' ? 'bg-red-500/20 text-red-400' :
                                                                booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                                    'bg-green-500/20 text-green-400'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                                <span className="text-[10px] text-slate-400 font-mono">{booking.bookingReference}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {booking.status === 'CONFIRMED' && (
                                                    <>
                                                        {canCancelBooking(booking) ? (
                                                            <button
                                                                onClick={() => initiateCancel(booking)}
                                                                className="text-red-400 p-2 hover:bg-red-500/10 rounded transition"
                                                                title="Cancel Booking"
                                                            >
                                                                <XCircle size={16} />
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-slate-500 italic" title="Cancellation period has passed">
                                                                Cannot cancel
                                                            </span>
                                                        )}
                                                    </>
                                                )}
                                                {booking.status === 'CANCELLED' && (
                                                    <span className="text-xs text-slate-500 italic">
                                                        Cancelled
                                                    </span>
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

            <ConfirmDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Booking"
                message={`Are you sure you want to cancel booking ${bookingToCancel?.bookingReference}? This action cannot be undone and the guest will be notified.`}
            />
        </div>
    );
};

export default AdminBookings;
