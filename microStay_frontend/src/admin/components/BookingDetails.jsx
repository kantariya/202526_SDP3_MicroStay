import React from 'react';
import { X, Calendar, CreditCard, Hotel, User, Clock } from 'lucide-react';

const BookingDetails = ({ booking, onClose, onCancel }) => {
    if (!booking) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-800 border-l border-slate-700 shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out z-40">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white leading-tight">Booking Details</h2>
                    <p className="text-slate-400 text-sm mt-1">ID: {booking.id}</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Status Badge */}
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                         booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400' :
                         booking.status === 'CANCELLED' || booking.status === 'CANCELLED_ADMIN' ? 'bg-red-500/20 text-red-400' :
                         'bg-yellow-500/20 text-yellow-400'
                     }`}>
                        {booking.status}
                    </span>
                </div>

                {/* Dates */}
                <div className="bg-slate-700/30 p-4 rounded-lg">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Calendar size={16} /> Stay Dates
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="block text-xs text-slate-500">Check-In</span>
                            <span className="text-slate-200 font-medium">{new Date(booking.checkInDate).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="block text-xs text-slate-500">Check-Out</span>
                            <span className="text-slate-200 font-medium">{new Date(booking.checkOutDate).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>

                {/* Hotel Info */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <Hotel size={16} /> Hotel Information
                    </h3>
                    <p className="text-slate-200">Hotel ID: {booking.hotelId}</p>
                    {/* If we had hotel name in booking object we would show it, otherwise ID is what we have */}
                </div>

                {/* Guest Info */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User size={16} /> Guest Information
                    </h3>
                    <p className="text-slate-200">User ID: {booking.userId}</p>
                </div>

                {/* Payment */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <CreditCard size={16} /> Payment
                    </h3>
                    <p className="text-2xl font-bold text-slate-100">₹${booking.amount}</p>
                    <p className="text-slate-400 text-sm">Status: {booking.paymentStatus || 'PENDING'}</p>
                </div>

                {/* Meta */}
                <div className="pt-4 border-t border-slate-700 text-xs text-slate-500 flex items-center gap-2">
                    <Clock size={12} />
                    Created: {new Date(booking.createdAt).toLocaleString()}
                </div>

                {/* Actions */}
                {booking.status !== 'CANCELLED' && booking.status !== 'CANCELLED_ADMIN' && (
                    <div className="pt-6">
                        <button
                            onClick={() => onCancel(booking.id)}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-red-500/20"
                        >
                            Cancel Booking
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookingDetails;
