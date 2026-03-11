import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Plus, Trash2, Edit2, ArrowLeft, BedDouble, Save, X } from 'lucide-react';
import api from '../../admin/utils/api';

const Rooms = () => {
    const { id } = useParams(); // Hotel ID
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        roomType: '',
        description: '',

        maxAdults: '',
        maxChildren: '',

        pricing: {
            basePrice: '',
            currency: 'INR',
            weekendMultiplier: 1
        },

        inventory: {
            totalRooms: ''
        },

        amenities: [],
        images: [],

        active: true
    });
    const [editingRoomId, setEditingRoomId] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, [id]);

    const fetchRooms = async () => {
        try {
            // Using public endpoint for reading as strictly no GET /manager/hotels/{id}/rooms listed
            const res = await api.get(`/hotels/${id}/rooms`);
            console.log("Fetched rooms:", res.data);
            setRooms(res.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            if (error.response && error.response.status === 404) {
                setRooms([]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (room = null) => {
        if (room) {
            setEditingRoomId(room.roomId);
            setFormData({
                roomType: room.roomType || '',
                description: room.description || '',
                maxAdults: room.maxAdults || '',
                maxChildren: room.maxChildren || '',
                pricing: {
                    basePrice: room.pricing?.basePrice || '',
                    currency: room.pricing?.currency || 'INR',
                    weekendMultiplier: room.pricing?.weekendMultiplier || 1
                },
                inventory: {
                    totalRooms: room.inventory?.totalRooms || ''
                },
                amenities: room.amenities || [],
                images: room.images || [],
                active: room.active !== undefined ? room.active : true
            });
        } else {
            setEditingRoomId(null);
            setFormData({
                roomType: '',
                description: '',
                maxAdults: '',
                maxChildren: '',
                pricing: {
                    basePrice: '',
                    currency: 'INR',
                    weekendMultiplier: 1
                },
                inventory: {
                    totalRooms: ''
                },
                amenities: [],
                images: [],
                active: true
            });
        }
        setShowModal(true);
    };

    const handleSaveRoom = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                roomType: formData.roomType,
                description: formData.description,

                maxAdults: parseInt(formData.maxAdults),
                maxChildren: parseInt(formData.maxChildren),

                pricing: {
                    basePrice: parseFloat(formData.pricing.basePrice),
                    currency: formData.pricing.currency,
                    weekendMultiplier: parseFloat(formData.pricing.weekendMultiplier)
                },

                inventory: {
                    totalRooms: parseInt(formData.inventory.totalRooms)
                },

                amenities: formData.amenities,
                images: formData.images,

                active: formData.active
            };

            if (editingRoomId) {
                // PUT /manager/hotels/{hotelId}/rooms/{roomId}
                await api.put(`/manager/hotels/${id}/rooms/${editingRoomId}`, payload);
            } else {
                // POST /manager/hotels/{hotelId}/rooms
                await api.post(`/manager/hotels/${id}/rooms`, payload);
            }
            setShowModal(false);
            fetchRooms(); // Refresh
        } catch (error) {
            console.error("Error saving room:", error);
            alert("Failed to save room.");
        }
    };

    const handleDelete = async (roomId) => {
        if (window.confirm("Delete this room type? This action cannot be undone.")) {
            try {
                // DELETE /manager/hotels/{hotelId}/rooms/{roomId}
                await api.delete(`/manager/hotels/${id}/rooms/${roomId}`);
                setRooms(rooms.filter(r => r.roomId !== roomId));
            } catch (error) {
                console.error("Error deleting room:", error);
                alert("Failed to delete room.");
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/manager/hotels" className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">Room Management</h1>
                    <p className="text-slate-400 text-sm">Manage room types and pricing</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/20"
                >
                    <Plus size={20} /> Add Room Type
                </button>
            </div>

            {loading ? (
                <div className="text-center text-slate-400 py-10">Loading rooms...</div>
            ) : rooms.length === 0 ? (
                <div className="text-center text-slate-500 py-10 bg-slate-800 rounded-xl border border-slate-700">
                    No rooms found. Add a room type to get started.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map(room => (
                        <div key={room.roomId} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg hover:shadow-emerald-500/10 transition-shadow duration-300">
                            {/* Room Header with Image */}
                            {room.images && room.images.length > 0 ? (
                                <div className="h-48 bg-slate-700 overflow-hidden">
                                    <img src={room.images[1]} alt={room.roomType} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                                    <BedDouble size={64} className="text-indigo-400/40" />
                                </div>
                            )}

                            <div className="p-6">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-xl font-bold text-slate-100">{room.roomType}</h3>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${room.active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                        {room.active ? 'ACTIVE' : 'INACTIVE'}
                                    </span>
                                </div>

                                {room.description && (
                                    <p className="text-slate-400 text-sm mb-4 line-clamp-2">{room.description}</p>
                                )}

                                {/* Capacity Info */}
                                <div className="flex gap-4 mb-4 text-sm">
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-slate-500">👤 Adults:</span>
                                        <span className="text-slate-200 font-semibold">{room.maxAdults || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-slate-500">👶 Children:</span>
                                        <span className="text-slate-200 font-semibold">{room.maxChildren || 0}</span>
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="mb-4">
                                    <div className="flex items-end gap-1 mb-1">
                                        <span className="text-3xl font-bold text-emerald-400">
                                            {room.pricing?.currency === 'USD' ? '$' : '₹'}{room.pricing?.basePrice || 0}
                                        </span>
                                        <span className="text-slate-500 text-sm mb-1.5">/ night</span>
                                    </div>
                                    {room.pricing?.weekendMultiplier && room.pricing.weekendMultiplier !== 1 && (
                                        <p className="text-xs text-amber-400">
                                            Weekend: {room.pricing.weekendMultiplier}x multiplier
                                        </p>
                                    )}
                                </div>

                                {/* Amenities */}
                                {room.amenities && room.amenities.length > 0 && (
                                    <div className="mb-4">
                                        <div className="flex flex-wrap gap-1.5">
                                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                                                <span key={idx} className="px-2 py-0.5 bg-slate-700/50 text-slate-300 text-xs rounded">
                                                    {amenity}
                                                </span>
                                            ))}
                                            {room.amenities.length > 3 && (
                                                <span className="px-2 py-0.5 bg-slate-700/50 text-slate-400 text-xs rounded">
                                                    +{room.amenities.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="flex items-center justify-between text-sm border-t border-slate-700 pt-4">
                                    <div className="text-slate-400">
                                        Total Rooms: <span className="text-slate-200 font-bold">{room.inventory?.totalRooms || 0}</span>
                                    </div>

                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleOpenModal(room)} 
                                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            title="Edit Room"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(room.roomId)} 
                                            className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            title="Delete Room"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-slate-800 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex justify-between items-center p-6 border-b border-slate-700">
                            <h2 className="text-xl font-bold text-white">{editingRoomId ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveRoom} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Room Type */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Room Type <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g., STANDARD, DELUXE, SUITE"
                                    value={formData.roomType}
                                    onChange={e => setFormData({ ...formData, roomType: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Description <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="Describe the room features and amenities..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none"
                                />
                            </div>

                            {/* Capacity Section */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Max Adults <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="e.g., 2"
                                        value={formData.maxAdults}
                                        onChange={e => setFormData({ ...formData, maxAdults: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Max Children <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="e.g., 1"
                                        value={formData.maxChildren}
                                        onChange={e => setFormData({ ...formData, maxChildren: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="border border-slate-700 rounded-lg p-4 bg-slate-900/50">
                                <h3 className="text-sm font-semibold text-slate-200 mb-3">Pricing Details</h3>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-3 gap-3">
                                        <div className="col-span-2">
                                            <label className="block text-xs text-slate-400 mb-1">
                                                Base Price <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                placeholder="2000"
                                                value={formData.pricing.basePrice}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        pricing: { ...formData.pricing, basePrice: e.target.value }
                                                    })
                                                }
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Currency</label>
                                            <select
                                                value={formData.pricing.currency}
                                                onChange={e =>
                                                    setFormData({
                                                        ...formData,
                                                        pricing: { ...formData.pricing, currency: e.target.value }
                                                    })
                                                }
                                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:border-emerald-500 transition-all"
                                            >
                                                <option value="INR">INR</option>
                                                <option value="USD">USD</option>
                                                <option value="EUR">EUR</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">
                                            Weekend Multiplier
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            step="0.1"
                                            placeholder="1.5"
                                            value={formData.pricing.weekendMultiplier}
                                            onChange={e =>
                                                setFormData({
                                                    ...formData,
                                                    pricing: { ...formData.pricing, weekendMultiplier: e.target.value }
                                                })
                                            }
                                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 transition-all"
                                        />
                                        <p className="text-xs text-slate-500 mt-1">e.g., 1.5 means 50% higher on weekends</p>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Total Rooms Available <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="e.g., 10"
                                    value={formData.inventory.totalRooms}
                                    onChange={e =>
                                        setFormData({
                                            ...formData,
                                            inventory: { ...formData.inventory, totalRooms: e.target.value }
                                        })
                                    }
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            {/* Amenities */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Amenities <span className="text-slate-500 text-xs">(comma-separated)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., WiFi, TV, Air Conditioning, Mini Bar"
                                    value={formData.amenities.join(', ')}
                                    onChange={e => setFormData({ 
                                        ...formData, 
                                        amenities: e.target.value.split(',').map(a => a.trim()).filter(a => a)
                                    })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Image URLs <span className="text-slate-500 text-xs">(comma-separated)</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                                    value={formData.images.join(', ')}
                                    onChange={e => setFormData({ 
                                        ...formData, 
                                        images: e.target.value.split(',').map(i => i.trim()).filter(i => i)
                                    })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>

                            {/* Active Status */}
                            <div className="flex items-center gap-3 py-2 px-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.active}
                                    onChange={e => setFormData({ ...formData, active: e.target.checked })}
                                    className="w-4 h-4 text-emerald-600 bg-slate-900 border-slate-600 rounded focus:ring-emerald-500 focus:ring-2"
                                />
                                <label htmlFor="active" className="text-slate-300 font-medium cursor-pointer">
                                    Active - Available for booking
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                                <button 
                                    type="button" 
                                    onClick={() => setShowModal(false)} 
                                    className="px-5 py-2.5 text-slate-300 hover:bg-slate-700 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors shadow-lg shadow-emerald-500/20"
                                >
                                    <Save size={18} /> {editingRoomId ? 'Update Room' : 'Save Room'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div >
    );
};

export default Rooms;
