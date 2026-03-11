import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CreditCard, Calendar, Trash2 } from 'lucide-react';

const BookingCheckout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { hotel, room, checkIn, checkOut, adults, children, numberOfRooms, days } = location.state || {};
    
    const totalGuests = (adults || 0) + (children || 0);

    // Initialize guest details array
    const [guestDetails, setGuestDetails] = useState(
        Array.from({ length: totalGuests }, (_, i) => ({
            fullName: '',
            age: i < adults ? 25 : 10, // Default age: 25 for adults, 10 for children
            aadharNumber: ''
        }))
    );

    if (!hotel || !room) {
        return <div className="p-10 text-center">Invalid booking session. <button onClick={() => navigate('/')} className="text-blue-600 underline">Go Home</button></div>;
    }

    // Calculate total price with weekend multiplier
    const calculateTotalPrice = () => {
        let total = 0;
        const checkInDate = new Date(checkIn);
        
        for (let i = 0; i < days; i++) {
            const currentDate = new Date(checkInDate);
            currentDate.setDate(checkInDate.getDate() + i);
            const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday
            
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
            const priceForDay = isWeekend 
                ? room.pricing.basePrice * room.pricing.weekendMultiplier 
                : room.pricing.basePrice;
            
            total += priceForDay;
        }
        
        return total * numberOfRooms;
    };

    const totalPrice = calculateTotalPrice();

    const updateGuest = (index, field, value) => {
        const updated = [...guestDetails];
        updated[index][field] = value;
        setGuestDetails(updated);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all guest details are filled
        const isValid = guestDetails.every(guest => 
            guest.fullName.trim() !== '' && 
            guest.age > 0 && 
            guest.aadharNumber.trim() !== ''
        );

        if (!isValid) {
            alert('Please fill all guest details');
            return;
        }

        // Navigate to Payment Page with all data
        navigate('/booking/payment', {
            state: {
                hotel,
                room,
                checkIn,
                checkOut,
                adults,
                children,
                numberOfRooms,
                days,
                totalPrice,
                guestDetails
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
                        <h2 className="text-xl font-bold text-slate-900 mb-2">Guest Details</h2>
                        <p className="text-sm text-slate-500 mb-6">
                            Please provide details for all {totalGuests} guest{totalGuests > 1 ? 's' : ''} ({adults} adult{adults > 1 ? 's' : ''}, {children} {children === 1 ? 'child' : 'children'})
                        </p>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {guestDetails.map((guest, index) => (
                                <div key={index} className="p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                    <h3 className="text-sm font-bold text-slate-700 mb-3">
                                        Guest {index + 1} {index < adults ? '(Adult)' : '(Child)'}
                                    </h3>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                                                <User size={16} className="text-gray-400" />
                                                <input
                                                    required
                                                    type="text"
                                                    className="text-[#1A1A1A] bg-transparent w-full outline-none text-sm font-semibold"
                                                    value={guest.fullName}
                                                    placeholder='e.g. John Doe'
                                                    onChange={e => updateGuest(index, 'fullName', e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                                    Age <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                                                    <Calendar size={16} className="text-gray-400" />
                                                    <input
                                                        required
                                                        type="number"
                                                        min="1"
                                                        max="120"
                                                        className="text-[#1A1A1A] bg-transparent w-full outline-none text-sm font-semibold"
                                                        value={guest.age}
                                                        placeholder='e.g. 25'
                                                        onChange={e => updateGuest(index, 'age', Number(e.target.value))}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
                                                    Aadhar Number <span className="text-red-500">*</span>
                                                </label>
                                                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200">
                                                    <CreditCard size={16} className="text-gray-400" />
                                                    <input
                                                        required
                                                        type="text"
                                                        pattern="[0-9]{12}"
                                                        maxLength="12"
                                                        className="text-[#1A1A1A] bg-transparent w-full outline-none text-sm font-semibold"
                                                        value={guest.aadharNumber}
                                                        placeholder='12 digits'
                                                        onChange={e => updateGuest(index, 'aadharNumber', e.target.value.replace(/\D/g, ''))}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition mt-6">
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
                                    <p className="text-xs text-slate-500">{hotel.location.city}</p>
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
                                    <span className="text-slate-500">Adults</span>
                                    <span className="font-bold text-slate-900">{adults}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Children</span>
                                    <span className="font-bold text-slate-900">{children}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Room</span>
                                    <span className="font-bold text-slate-900">{room.roomType}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Number of Rooms</span>
                                    <span className="font-bold text-slate-900">{numberOfRooms}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Nights</span>
                                    <span className="font-bold text-slate-900">{days}</span>
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
