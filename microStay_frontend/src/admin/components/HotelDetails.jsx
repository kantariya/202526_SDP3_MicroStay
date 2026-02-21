import React from 'react';
import { X, MapPin, Phone, Mail, Star, User } from 'lucide-react';

const HotelDetails = ({ hotel, onClose }) => {
    if (!hotel) return null;

    return (
        <div className="fixed inset-y-0 right-0 w-96 bg-slate-800 border-l border-slate-700 shadow-2xl p-6 overflow-y-auto transform transition-transform duration-300 ease-in-out z-40">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white leading-tight">{hotel.name}</h2>
                    <p className="text-slate-400 text-sm mt-1">{hotel.brand}</p>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
                    <X size={24} />
                </button>
            </div>

            <div className="space-y-6">
                {/* Status Badge */}
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${hotel.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {hotel.status}
                    </span>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                    <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} size={16} fill={i < hotel.starRating ? "currentColor" : "none"} className={i < hotel.starRating ? "" : "text-slate-600"} />
                        ))}
                    </div>
                    <span className="text-slate-400 text-sm">({hotel.starRating} Stars)</span>
                </div>

                {/* Description */}
                {hotel.description && (
                    <div className="bg-slate-700/50 p-4 rounded-lg">
                        <p className="text-slate-300 text-sm leading-relaxed">{hotel.description}</p>
                    </div>
                )}

                {/* Location */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <MapPin size={16} /> Location
                    </h3>
                    <p className="text-slate-200">
                        {hotel.location?.address}<br />
                        {hotel.location?.city}, {hotel.location?.state}<br />
                        {hotel.location?.country}
                    </p>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Contact Info</h3>
                    <div className="space-y-2">
                        {hotel.contact?.phone && (
                            <div className="flex items-center gap-3 text-slate-200 text-sm">
                                <Phone size={16} className="text-blue-400" /> {hotel.contact.phone}
                            </div>
                        )}
                        {hotel.contact?.email && (
                            <div className="flex items-center gap-3 text-slate-200 text-sm">
                                <Mail size={16} className="text-blue-400" /> {hotel.contact.email}
                            </div>
                        )}
                    </div>
                </div>

                {/* Manager */}
                <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <User size={16} /> Manager
                    </h3>
                    <p className="text-slate-200">{hotel.managerId ? `ID: ${hotel.managerId}` : 'No Manager Assigned'}</p>
                </div>

                {/* Facilities */}
                {hotel.facilities && hotel.facilities.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Facilities</h3>
                        <div className="flex flex-wrap gap-2">
                            {hotel.facilities.map((f, i) => (
                                <span key={i} className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-xs">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Timings */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <span className="block text-xs text-slate-500">Check-in</span>
                        <span className="text-slate-200 font-medium">{hotel.checkInTime}</span>
                    </div>
                    <div>
                        <span className="block text-xs text-slate-500">Check-out</span>
                        <span className="text-slate-200 font-medium">{hotel.checkOutTime}</span>
                    </div>
                </div>

                {/* ID */}
                <div className="pt-4 border-t border-slate-700">
                    <span className="block text-xs text-slate-600">ID: {hotel.id}</span>
                    <span className="block text-xs text-slate-600">Created: {new Date(hotel.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
};

export default HotelDetails;
