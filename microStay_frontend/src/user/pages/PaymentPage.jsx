import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, Lock, Loader2 } from 'lucide-react';
import api from '../../utils/api';

const PaymentPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hotel, room, checkIn, checkOut, adults, children, numberOfRooms, days, totalPrice, guestDetails } = location.state || {};

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('MOCK');
    const [mockResult, setMockResult] = useState('SUCCESS');

    useEffect(() => {
        if (!hotel) navigate('/');
    }, [hotel, navigate]);

    const handlePayment = async () => {
        setLoading(true);
        setError('');

        try {
            // 1. Initiate Booking
            const initiateBookingRequest = {
                hotelId: hotel.id,
                hotelName: hotel.name,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                rooms: [{
                    roomId: room.roomId,
                    roomType: room.roomType,
                    pricePerNight: room.pricing.basePrice,
                    numberOfRooms: numberOfRooms,
                    adults: adults,
                    children: children
                }],
                guestDetails: guestDetails // Array of {fullName, age, aadharNumber}
            };

            console.log('Initiating booking with:', initiateBookingRequest);
            const bookingRes = await api.post('/bookings/initiate', initiateBookingRequest);
            const booking = bookingRes.data;

            console.log('Booking initiated:', booking);

            // 2. Process Payment
            const paymentRequest = {
                bookingId: booking.bookingId,
                amount: totalPrice,
                currency: 'INR',
                paymentGateway: 'MOCK',
                mockResult: mockResult // SUCCESS or FAILED
            };

            console.log('Processing payment with:', paymentRequest);
            const paymentRes = await api.post('/payments', paymentRequest);

            console.log('Payment response:', paymentRes.data);

            // 3. Navigate to Success Page
            navigate('/booking/success', { state: { booking, payment: paymentRes.data } });

        } catch (err) {
            console.error("Payment failed", err);
            const errorMessage = err.response?.data?.message || 'Payment failed. Please try again or contact support.';
            setError(errorMessage);
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
                            <p className="text-xs text-blue-600">{room.roomType} x {numberOfRooms} room(s)</p>
                            <p className="text-xs text-blue-400">{days} night{days > 1 ? 's' : ''}</p>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100">
                            {error}
                        </div>
                    )}

                    <h3 className="text-lg font-bold text-slate-900 mb-4">Payment Simulation {/*(Test Mode)*/}</h3>
                    <div className="space-y-3 mb-8">
                        <div
                            onClick={() => setMockResult('SUCCESS')}
                            className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition ${mockResult === 'SUCCESS' ? 'border-green-600 bg-green-50/50' : 'border-gray-100 hover:border-green-200'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mockResult === 'SUCCESS' ? 'border-green-600' : 'border-gray-300'}`}>
                                {mockResult === 'SUCCESS' && <div className="w-2.5 h-2.5 bg-green-600 rounded-full" />}
                            </div>
                            <CheckCircle size={24} className="text-green-600" />
                            <span className="font-bold text-slate-700">✓ Pay Securely</span>
                        </div>

                        {/* <div
                            onClick={() => setMockResult('FAILED')}
                            className={`p-4 rounded-xl border-2 flex items-center gap-4 cursor-pointer transition ${mockResult === 'FAILED' ? 'border-red-600 bg-red-50/50' : 'border-gray-100 hover:border-red-200'}`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${mockResult === 'FAILED' ? 'border-red-600' : 'border-gray-300'}`}>
                                {mockResult === 'FAILED' && <div className="w-2.5 h-2.5 bg-red-600 rounded-full" />}
                            </div>
                            <CreditCard size={24} className="text-red-600" />
                            <span className="font-bold text-slate-700">✗ Simulate Failed Payment</span>
                        </div> */}
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
