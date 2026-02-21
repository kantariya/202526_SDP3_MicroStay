import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Phone, Calendar } from 'lucide-react';

const BookingCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hotel, room, checkIn, checkOut, guests, days } = location.state || {};

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialRequests: ''
    });

    if (!hotel || !room) {
        return <div className="p-10 text-center">Invalid booking session. <button onClick={() => navigate('/')} className="text-blue-600 underline">Go Home</button></div>;
    }

    const totalPrice = room.price * days;

    const handleSubmit = (e) => {
        e.preventDefault();
        // Navigate to Payment Page with all data
        navigate('/booking/payment', {
            state: {
                hotel,
                room,
                checkIn,
                checkOut,
                guests,
                days,
                totalPrice,
                guestDetails: formData
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-4xl mx-auto px-6">

                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-900">
                    <ArrowLeft size={18} /> Back
                </button>

                <h1 className="text-3xl font-black text-slate-900 mb-8">Confirm your booking</h1>

                <div className="flex flex-col md:flex-row gap-8">

                    {/* FORM */}
                    <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-slate-900 mb-6">Guest Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                                        <User size={16} className="text-gray-400" />
                                        <input
                                            required
                                            type="text"
                                            className="bg-transparent w-full outline-none text-sm font-semibold"
                                            value={formData.firstName}
                                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                                        <input
                                            required
                                            type="text"
                                            className="bg-transparent w-full outline-none text-sm font-semibold"
                                            value={formData.lastName}
                                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                                    <Mail size={16} className="text-gray-400" />
                                    <input
                                        required
                                        type="email"
                                        className="bg-transparent w-full outline-none text-sm font-semibold"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                                <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
                                    <Phone size={16} className="text-gray-400" />
                                    <input
                                        required
                                        type="tel"
                                        className="bg-transparent w-full outline-none text-sm font-semibold"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Special Requests (Optional)</label>
                                <textarea
                                    rows="3"
                                    className="w-full bg-gray-50 px-3 py-2 rounded-xl border border-gray-200 outline-none text-sm font-semibold"
                                    value={formData.specialRequests}
                                    onChange={e => setFormData({ ...formData, specialRequests: e.target.value })}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition mt-4">
                                Continue to Payment
                            </button>
                        </form>
                    </div>

                    {/* SUMMARY */}
                    <div className="md:w-80">
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-24">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Booking Summary</h3>
                            <div className="flex items-start gap-3 mb-4 pb-4 border-b border-gray-100">
                                <img src={hotel.image || hotel.images?.[0] || 'https://via.placeholder.com/100'} className="w-16 h-16 rounded-lg object-cover" alt="Hotel" />
                                <div>
                                    <h4 className="font-bold text-sm text-slate-900 line-clamp-2">{hotel.name}</h4>
                                    <p className="text-xs text-slate-500">{hotel.city}</p>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Check-in</span>
                                    <span className="font-bold text-slate-900">{checkIn}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Check-out</span>
                                    <span className="font-bold text-slate-900">{checkOut}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Guests</span>
                                    <span className="font-bold text-slate-900">{guests}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Room</span>
                                    <span className="font-bold text-slate-900">{room.roomType}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-slate-500">Total Price</span>
                                    <span className="text-2xl font-black text-blue-600">₹{totalPrice}</span>
                                </div>
                                <p className="text-xs text-slate-400 text-right">Includes taxes & fees</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BookingCheckout;
