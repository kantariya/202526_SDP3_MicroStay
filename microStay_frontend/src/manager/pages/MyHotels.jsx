import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, BedDouble, CalendarDays, Edit, Plus } from 'lucide-react';
import api from '../../admin/utils/api'; // Reuse API util

const MyHotels = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyHotels();
    }, []);

    const fetchMyHotels = async () => {
        try {
            const response = await api.get('/manager/hotels');
            setHotels(response.data);
        } catch (error) {
            console.error("Error fetching hotels:", error);
            if (error.response && error.response.status === 404) {
                setHotels([]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-100">My Hotels</h1>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Hotel Name</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Rooms</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">Loading hotels...</td></tr>
                            ) : hotels.length === 0 ? (
                                <tr><td colSpan="5" className="p-8 text-center text-slate-400">No hotels found assigned to you.</td></tr>
                            ) : (
                                hotels.map(hotel => (
                                    <tr key={hotel.id} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-blue-600/20 flex items-center justify-center text-blue-400">
                                                    <Building2 size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{hotel.name}</p>
                                                    <p className="text-xs text-slate-500">ID: {hotel.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-slate-300 text-sm">
                                                <MapPin size={14} className="text-slate-500" /> {hotel.city}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold \${
                                                hotel.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 
                                                hotel.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                                hotel.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                                'bg-slate-500/20 text-slate-400'
                                            }`}>
                                                {hotel.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">
                                            {hotel.roomsCount || 0} Units
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    to={`/manager/hotels/\${hotel.id}/edit`}
                                                    className="p-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded text-xs flex items-center gap-1 transition-colors"
                                                >
                                                    <Edit size={14} /> Edit
                                                </Link>
                                                <Link
                                                    to={`/manager/hotels/\${hotel.id}/rooms`}
                                                    className="p-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 rounded text-xs flex items-center gap-1 transition-colors"
                                                >
                                                    <BedDouble size={14} /> Rooms
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MyHotels;
