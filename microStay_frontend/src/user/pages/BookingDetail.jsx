import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, User, FileText, CreditCard } from 'lucide-react';
import api from '../../utils/api';

const BookingDetail = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
            api.get(`/bookings/${bookingId}`).then(r => setBooking(r.data)).catch(e => console.error(e))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [bookingId]);

    if (loading) return <div className="p-10 text-center">Loading...</div>;
    if (!booking) return <div className="p-10 text-center">Booking not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto px-6">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-900">
                    <ArrowLeft size={18} /> Back
                </button>

                <div className="flex justify-between items-start mb-6">
                    <h1 className="text-3xl font-black text-slate-900">Booking #{booking.bookingId}</h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
              booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
              booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
              'bg-blue-100 text-blue-700'
           }`}>
                        {booking.status}
                    </span>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* HEADER INFO */}
                    <div className="p-8 border-b border-gray-100">
                        <h2 className="text-[#1A1A1A] text-xl font-bold mb-1">Booking Details</h2>
                        <p className="text-slate-500 text-sm">Booked on {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* CONTENT */}
                    <div className="p-8 space-y-8">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                    <Calendar size={14} /> Dates
                                </h3>
                                <div className="flex gap-8">
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Check-in</p>
                                        <p className="font-bold text-slate-900">{booking.checkInDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Check-out</p>
                                        <p className="font-bold text-slate-900">{booking.checkOutDate}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase mb-4 flex items-center gap-2">
                                    <CreditCard size={14} /> Payment
                                </h3>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Total Paid</p>
                                    <p className="font-bold text-slate-900 text-xl">₹{booking.totalAmount}</p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
};

export default BookingDetail;
