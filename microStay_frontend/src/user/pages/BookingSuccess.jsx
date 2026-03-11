import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';

const BookingSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { booking } = location.state || {};

    console.log("BookingSuccess received booking:", booking);

    if (!booking) {
        return <div className="p-10 text-center"><button onClick={() => navigate('/')}>Go Home</button></div>;
    }

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-lg w-full text-center">

                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle size={48} className="text-green-600" />
                </div>

                <h1 className="text-3xl font-black text-slate-900 mb-4">Booking Confirmed!</h1>
                <p className="text-slate-500 mb-8">
                    Thank you for booking with MicroStay. Your reservation ID is <span className="font-mono font-bold text-slate-900">#{booking.bookingId}</span>
                </p>

                <div className="bg-gray-50 p-6 rounded-3xl mb-8 text-left border border-gray-100">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-500">Amount Paid</span>
                        <span className="font-bold text-slate-900">₹{booking.totalAmount}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm text-slate-500">Status</span>
                        <span className="font-bold text-green-600 uppercase text-xs bg-green-100 px-2 py-1 rounded">Confirmed</span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={() => navigate('/my-bookings')}
                        className="flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 font-bold py-3 rounded-xl transition text-slate-700"
                    >
                        <FileText size={18} /> View Booking
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-200"
                    >
                        <Home size={18} /> Go Home
                    </button>
                </div>

            </div>
        </div>
    );
};

export default BookingSuccess;
