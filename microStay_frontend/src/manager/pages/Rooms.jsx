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
        price: '',
        capacity: '',
        totalRooms: '',
        amenities: [],
        availability: true
    });
    const [editingRoomId, setEditingRoomId] = useState(null);

    useEffect(() => {
        fetchRooms();
    }, [id]);

    const fetchRooms = async () => {
        try {
            // Using public endpoint for reading as strictly no GET /manager/hotels/{id}/rooms listed
            const res = await api.get(`/hotels/\${id}/rooms`);
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
            setEditingRoomId(room.id);
            setFormData({
                roomType: room.roomType || room.type || '',
                price: room.price || '',
                capacity: room.capacity || '',
                totalRooms: room.totalRooms || room.total || '',
                amenities: room.amenities || [],
                availability: room.availability !== undefined ? room.availability : true
            });
        } else {
            setEditingRoomId(null);
            setFormData({
                roomType: '',
                price: '',
                capacity: '',
                totalRooms: '',
                amenities: [],
                availability: true
            });
        }
        setShowModal(true);
    };

    const handleSaveRoom = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                capacity: parseInt(formData.capacity),
                totalRooms: parseInt(formData.totalRooms),
            };

            if (editingRoomId) {
                // PUT /manager/hotels/{hotelId}/rooms/{roomId}
                await api.put(`/manager/hotels/\${id}/rooms/\${editingRoomId}`, payload);
            } else {
                // POST /manager/hotels/{hotelId}/rooms
                await api.post(`/manager/hotels/\${id}/rooms`, payload);
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
                await api.delete(`/manager/hotels/\${id}/rooms/\${roomId}`);
                setRooms(rooms.filter(r => r.id !== roomId));
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
                        <div key={room.id} className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-lg p-6 relative group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
                                    <BedDouble size={24} />
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${(room.availability !== false) ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                                    }`}>
                                    {(room.availability !== false) ? 'ACTIVE' : 'INACTIVE'}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-100 mb-1">{room.roomType || room.type}</h3>
                            <p className="text-slate-400 text-sm mb-4">Capacity: {room.capacity} Guests</p>

                            <div className="flex items-end gap-1 mb-6">
                                <span className="text-2xl font-bold text-emerald-400">₹{room.price}</span>
                                <span className="text-slate-500 text-sm mb-1">/ night</span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-slate-400 border-t border-slate-700 pt-4">
                                <span>Total Units: <span className="text-slate-200 font-bold">{room.totalRooms || room.total}</span></span>

                                <div className="flex gap-2">
                                    <button onClick={() => handleOpenModal(room)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(room.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded transition-colors">
                                        <Trash2 size={16} />
                                    </button>
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

                        <form onSubmit={handleSaveRoom} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Room Type</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Deluxe Suite"
                                    value={formData.roomType}
                                    onChange={e => setFormData({ ...formData, roomType: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Price per Night</label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-slate-400 mb-1">Capacity (Guests)</label>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        placeholder="2"
                                        value={formData.capacity}
                                        onChange={e => setFormData({ ...formData, capacity: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-slate-400 mb-1">Total Rooms Available</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    placeholder="Number of rooms of this type"
                                    value={formData.totalRooms}
                                    onChange={e => setFormData({ ...formData, totalRooms: e.target.value })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                                />
                            </div>

                            <div className="flex items-center gap-3 py-2">
                                <input
                                    type="checkbox"
                                    id="active"
                                    checked={formData.availability}
                                    onChange={e => setFormData({ ...formData, availability: e.target.checked })}
                                    className="w-5 h-5 rounded border-slate-600 bg-slate-900 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label htmlFor="active" className="text-slate-300 font-medium">Available for booking</label>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg font-medium transition-colors">Cancel</button>
                                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-2 transition-colors">
                                    <Save size={18} /> Save Room
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
