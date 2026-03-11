import React from 'react';
import { MapPin, Bed, Calendar, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BookingCard = ({ booking, hotel, onCancel }) => {
    const navigate = useNavigate();
    const today = new Date();
    const isUpcoming = new Date(booking.checkInDate) > today && booking.status === 'CONFIRMED';


    // Status Config
    const getStatusConfig = (status) => {
        switch (status) {
            case 'CONFIRMED': return { color: 'text-emerald-700 bg-emerald-100', icon: CheckCircle2 };
            case 'CANCELLED': return { color: 'text-red-700 bg-red-100', icon: XCircle };
            default: return { color: 'text-blue-700 bg-blue-100', icon: Clock };
        }
    };

    const { color, icon: Icon } = getStatusConfig(booking.status);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric"
        });
    };

    return (
        <div className="bg-white border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition group">
            <div className="flex flex-col md:flex-row justify-between gap-6">

                {/* IMAGE & INFO */}
                <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                        <img
                            src={hotel?.images?.[0] || booking?.image || 'https://via.placeholder.com/150'}
                            className="w-full h-full object-cover"
                            alt={hotel?.name || 'Hotel'}
                        />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">
                            {hotel?.name || booking.hotelName}
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mb-2 flex items-center gap-1">
                            <MapPin size={14} /> {hotel ? `${booking.city || hotel.location?.city}, ${booking.country || hotel.location?.country}` : 'Location'}
                        </p>
                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${color}`}>
                            <Icon size={12} /> {booking.status}
                        </div>
                    </div>
                </div>

                {/* DATES & PRICE */}
                <div className="flex flex-col md:flex-row gap-8 md:items-center">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">Check-in</p>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" /> {formatDate(booking.checkInDate)}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase">Check-out</p>
                        <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <Calendar size={14} className="text-blue-500" /> {formatDate(booking.checkOutDate)}
                        </p>
                    </div>
                    <div className="space-y-1 text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                        <p className="text-xl font-black text-slate-900">₹{booking.totalAmount}</p>
                    </div>
                </div>

            </div>

            {/* ACTIONS */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <button
                    onClick={() => navigate(`/booking/${booking.bookingReference || booking.bookingId}`)}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                >
                    View Details <ArrowRight size={16} />
                </button>

                {isUpcoming && onCancel && (
                    <button
                        onClick={() => onCancel(booking.bookingReference)}
                        className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition"
                    >
                        Cancel Booking
                    </button>
                )}
            </div>
        </div>
    );
};

export default BookingCard;
