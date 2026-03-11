import React, { useState, useEffect } from 'react';
import { Plus, Eye, UserPlus, ToggleLeft, ToggleRight, Search, MapPin, Star } from 'lucide-react';
import api from '../utils/api';
import HotelModal from '../components/HotelModal';
import HotelDetails from '../components/HotelDetails';

const Hotels = () => {
    const [hotels, setHotels] = useState([]);
    const [managers, setManagers] = useState([]);
    const [selectedHotel, setSelectedHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedManager, setSelectedManager] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [nameSearch, setNameSearch] = useState('');
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);

    const [sortBy, setSortBy] = useState('name');
    const [direction, setDirection] = useState('asc');

    // Start with just fetching hotels
    useEffect(() => {
        fetchHotels();
        fetchManagers();
    }, [statusFilter, selectedManager, nameSearch, page, sortBy, direction]);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                sortBy,
                direction
            };

            if (statusFilter) params.status = statusFilter;
            if (selectedManager) params.managerId = selectedManager;
            if (nameSearch) params.nameSearch = nameSearch;

            const response = await api.get('/admin/hotels', { params });

            setHotels(response.data.content);
            setTotalPages(response.data.totalPages);

        } catch (error) {
            console.error("Error fetching hotels:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await api.get('/admin/managers');
            setManagers(response.data);
        } catch (error) {
            console.error("Error fetching managers:", error);
        }
    };

    const handleStatusToggle = async (hotel) => {
        const newStatus = hotel.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
            try {
                await api.put(`/admin/hotels/${hotel.id}/status`, null, {
                    params: { status: newStatus } // Changed to 'status' matching controller param name
                });
                fetchHotels(); // Refresh
            } catch (error) {
                console.error("Error updating status:", error);
                alert("Failed to update status");
            }
        }
    };

    const handleAssignManager = async (hotelId, managerId) => {
        try {
            await api.put(`/admin/hotels/${hotelId}/manager`, null, {
                params: { managerId }
            });
            fetchHotels();
            alert("Manager assigned successfully");
        } catch (error) {
            console.error("Error assigning manager:", error);
            alert("Failed to assign manager");
        }
    };

    return (
        <div className="p-6 relative">
            {/* Filters */}
            <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center bg-slate-700 rounded-lg px-3 py-2 border border-slate-600 w-full md:w-48">
                    <Search size={18} className="text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search by Name..."
                        className="bg-transparent border-none focus:outline-none text-slate-200 text-sm w-full placeholder-slate-500"
                        value={nameSearch}
                        onChange={(e) => {
                            setPage(0);
                            setNameSearch(e.target.value);
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="ACTIVE">Active</option>
                        <option value="PENDING">Pending</option>
                        <option value="INACTIVE">Inactive</option>
                        <option value="REJECTED">Rejected</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm"
                    >
                        <option value="name">Sort by Name</option>
                        <option value="createdAt">Sort by Created Date</option>
                    </select>

                    <select
                        value={direction}
                        onChange={(e) => setDirection(e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm"
                    >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                    </select>

                    <select
                        value={selectedManager}
                        onChange={(e) => setSelectedManager(e.target.value)}
                        className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-blue-500"
                    >
                        <option value="">All Managers</option>
                        {managers.map(m => (
                            <option key={m.id} value={m.id}>{m.firstName} {m.lastName} ({m.email})</option>
                        ))}
                    </select>
                </div>

                <div className="flex-grow"></div>

                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg shadow-blue-500/20"
                >
                    <Plus size={20} />
                    <span>Add Hotel</span>
                </button>
            </div>

            {/* List */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Hotel Name</th>
                                <th className="p-4 font-semibold">Location</th>
                                <th className="p-4 font-semibold">Rating</th>
                                <th className="p-4 font-semibold">Manager</th>
                                <th className="p-4 font-semibold">Created</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">Loading hotels...</td>
                                </tr>
                            ) : hotels.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">No hotels found.</td>
                                </tr>
                            ) : (
                                hotels.map(hotel => (
                                    <tr key={hotel.id} className="hover:bg-slate-700/30 transition-colors group">
                                        <td className="p-4">
                                            <div className="font-medium text-slate-100">{hotel.name}</div>
                                            <div className="text-xs text-slate-500">{hotel.brand}</div>
                                        </td>
                                        <td className="p-4 text-slate-300">
                                            <div className="flex items-center gap-1 text-sm">
                                                <MapPin size={14} className="text-slate-500" />
                                                {hotel.location?.city}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <span className="text-slate-200 font-medium">{hotel.starRating}</span>
                                                <Star size={14} fill="currentColor" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <select
                                                    className="bg-slate-900 border border-slate-600 rounded text-xs text-slate-300 p-1 w-32 focus:outline-none focus:border-blue-500"
                                                    value={hotel.managerId || ""}
                                                    onChange={(e) => handleAssignManager(hotel.id, e.target.value)}
                                                >
                                                    <option value="">No Manager</option>

                                                    {managers.map(m => (
                                                        <option key={m.id} value={m.id}>
                                                            {m.firstName} {m.lastName}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="p-4 text-xs text-slate-400">
                                            {new Date(hotel.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            {hotel.status === 'ACTIVE' || hotel.status === 'INACTIVE' ? (
                                            <button
                                                onClick={() => handleStatusToggle(hotel)}
                                                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                                                    hotel.status === 'ACTIVE' 
                                                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                                                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                }`}
                                            >
                                                {hotel.status === 'ACTIVE' ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                                                {hotel.status}  
                                            </button>
                                            ) : (
                                                <span className="ml-2 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-400">
                                                    {hotel.status}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedHotel(hotel)}
                                                className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex justify-between items-center p-4">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(prev => prev - 1)}
                            className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <span className="text-slate-400 text-sm">
                            Page {page + 1} of {totalPages}
                        </span>

                        <button
                            disabled={page + 1 >= totalPages}
                            onClick={() => setPage(prev => prev + 1)}
                            className="px-3 py-1 bg-slate-700 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {showCreateModal && (
                <HotelModal
                    onClose={() => setShowCreateModal(false)}
                    onSave={fetchHotels}
                />
            )}

            {/* Details & Edit Panel */}
            <HotelDetails
                hotel={selectedHotel}
                onClose={() => setSelectedHotel(null)}
            />
        </div>
    );
};

export default Hotels;
