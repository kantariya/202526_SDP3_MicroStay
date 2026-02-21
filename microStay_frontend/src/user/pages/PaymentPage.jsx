import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Lock, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hotel, room, checkIn, checkOut, guests, days, totalPrice, guestDetails } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [method, setMethod] = useState('card');

    useEffect(() => {
        if (!hotel) navigate('/');
    }, [hotel, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // 1. Create Booking
            const bookingData = {
                hotelId: hotel.id,
                roomId: room.id,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                totalPrice: totalPrice,
                status: 'PENDING', // Initially pending
                guestName: `\${guestDetails.firstName} \${guestDetails.lastName}`,
                guestEmail: guestDetails.email,
                guestPhone: guestDetails.phone
            };

            const bookingRes = await api.post('/bookings/initiate', bookingData);
            const booking = bookingRes.data;

            // 2. Process Payment (Mock)
            const paymentData = {
                bookingId: booking.id,
                amount: totalPrice,
                paymentMethod: method.toUpperCase(),
                transactionId: `TXN_\${Date.now()}`
            };

            await api.post('/payments', paymentData);

            // 3. Confirm Booking
            await api.post(`/bookings/\${booking.bookingReference}/confirm`);

            // 3. Success
            navigate('/booking/success', { state: { booking } });

        } catch (err) {
            console.error("Payment failed", err);
            setError('Payment failed. Please try again or contact support.');
        } finally {
            setLoading(false);
        }
    };

    if (!hotel) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-xl mx-auto px-6">

                <h1 className="text-3xl font-black text-slate-900 mb-2">Payment</h1>
                <p className="text-slate-500 mb-8 flex items-center gap-2">
                    <Lock size={14} /> Secure Payment Gateway
                </p>

                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-900/5">

                    <div className="mb-8 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-bold text-blue-500 uppercase mb-1">Total to pay</p>
                            <p className="text-3xl font-black text-blue-700">₹{totalPrice}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-bold text-blue-900">{hotel.name}</p>
                            <p className="text-xs text-blue-400">{room.roomType} x {days} nights</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                            {error}
                        </div>
                    )}

                    <h3 className="text-lg font-bold text-slate-900 mb-4">Select Payment Method</h3>
                    <div className="space-y-3 mb-8">
                        <div
                            onClick={() => setMethod('card')}
                            className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition \${method === 'card' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center \${method === 'card' ? 'border-blue-600' : 'border-gray-300'}`}>
                                {method === 'card' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                            </div>
                            <CreditCard size={24} className="text-slate-700" />
                            <span className="font-bold text-slate-700">Credit / Debit Card</span>
                        </div>

                        <div
                            onClick={() => setMethod('upi')}
                            className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition \${method === 'upi' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-blue-200'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center \${method === 'upi' ? 'border-blue-600' : 'border-gray-300'}`}>
                                {method === 'upi' && <div className="w-2.5 h-2.5 bg-blue-600 rounded-full" />}
                            </div>
                            <span className="font-bold text-slate-700">UPI / QR Code</span>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={20} className="animate-spin" /> Processing...
                            </>
                        ) : (
                            <>
                                Pay ₹{totalPrice}
                            </>
                        )}
                    </button>

                </div>
            </div>
        </div>
    );
};

export default PaymentPage;
