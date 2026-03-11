import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../admin/utils/api';

const EditHotel = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        starRating: 3,

        checkInTime: '',
        checkOutTime: '',

        facilities: [],
        images: [],

        location: {
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            geo: {
                type: "Point",
                coordinates: [0, 0]
            }
        },

        contact: {
            phone: '',
            email: ''
        },

        policies: {
            cancellation: '',
            petsAllowed: false,
            smokingAllowed: false
        }
    });

    const [facilityInput, setFacilityInput] = useState('');

    const isNew = id === 'new';

    useEffect(() => {
        if (isNew) {
            alert("Managers cannot create new hotels.");
            navigate('/manager/hotels');
            return;
        }

        const fetchHotel = async () => {
            try {
                // Strictly use allowed API: GET /manager/hotels/{hotelId}
                const res = await api.get(`/manager/hotels/${id}`);
                const hotel = res.data;

                if (!hotel) {
                    throw new Error("Hotel not found in your list");
                }

                setFormData({
                    name: hotel.name || '',
                    brand: hotel.brand || '',
                    description: hotel.description || '',
                    starRating: hotel.starRating || 3,

                    checkInTime: hotel.checkInTime || '',
                    checkOutTime: hotel.checkOutTime || '',

                    facilities: hotel.facilities || [],
                    images: hotel.images || [],

                    location: hotel.location || {
                        address: '',
                        city: '',
                        state: '',
                        country: '',
                        pincode: '',
                        geo: { type: "Point", coordinates: [0, 0] }
                    },

                    contact: hotel.contact || { phone: '', email: '' },

                    policies: hotel.policies || {
                        cancellation: '',
                        petsAllowed: false,
                        smokingAllowed: false
                    }
                });
            } catch (error) {
                console.error("Error fetching hotel:", error);
                alert("Failed to load hotel details.");
                navigate('/manager/hotels');
            } finally {
                setLoading(false);
            }
        };
        fetchHotel();
    }, [id, isNew, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // Strictly use allowed API: PUT /manager/hotels/{hotelId}
            await api.put(`/manager/hotels/${id}`, formData);
            alert("Hotel updated successfully!");
            navigate('/manager/hotels');
        } catch (error) {
            console.error("Error saving hotel:", error);
            alert(`Failed to update hotel. ` + (error.response?.data?.message || ""));
        } finally {
            setSaving(false);
        }
    };

    const handleAddFacility = (e) => {
        if (e.key === 'Enter' && facilityInput.trim()) {
            e.preventDefault();
            if (!formData.facilities.includes(facilityInput.trim())) {
                setFormData(prev => ({ ...prev, facilities: [...prev.facilities, facilityInput.trim()] }));
            }
            setFacilityInput('');
        }
    };

    const removeFacility = (fac) => {
        setFormData(prev => ({ ...prev, facilities: prev.facilities.filter(f => f !== fac) }));
    };

    if (loading) return <div className="p-8 text-center text-slate-400">Loading hotel details...</div>;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <button onClick={() => navigate('/manager/hotels')} className="mb-6 flex items-center text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={18} className="mr-2" /> Back to Hotels
            </button>

            <h1 className="text-2xl font-bold text-slate-100 mb-6">{isNew ? 'Add New Hotel' : 'Edit Hotel'}</h1>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Name & Location */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">Hotel Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Hotel Name</label>
                            <input
                                type="text"
                                required
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">City</label>
                            <input
                                type="text"
                                required
                                value={formData.location.city || ''}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        location: { ...formData.location, city: e.target.value }
                                    })
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Address</label>
                        <input
                            type="text"
                            required
                            value={formData.location.address}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    location: { ...formData.location, address: e.target.value }
                                })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">Basic Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 h-32 focus:outline-none focus:border-emerald-500"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Star Rating</label>
                        <input
                            type="number"
                            min="1"
                            max="5"
                            value={formData.starRating}
                            onChange={(e) =>
                                setFormData({ ...formData, starRating: Number(e.target.value) })
                            }
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">Contact Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Phone</label>
                            <input
                                type="text"
                                value={formData.contact.phone}
                                onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, phone: e.target.value } })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.contact.email}
                                onChange={(e) => setFormData({ ...formData, contact: { ...formData.contact, email: e.target.value } })}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Facilities */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">Facilities</h2>
                    <div className="mb-4 flex flex-wrap gap-2">
                        {formData.facilities.map(fac => (
                            <span key={fac} className="px-3 py-1 bg-emerald-600/20 text-emerald-400 rounded-full text-sm flex items-center gap-2">
                                {fac}
                                <button type="button" onClick={() => removeFacility(fac)} className="hover:text-emerald-200">×</button>
                            </span>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Type facility and press Enter..."
                        value={facilityInput}
                        onChange={(e) => setFacilityInput(e.target.value)}
                        onKeyDown={handleAddFacility}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                    />
                </div>

                {/* Policies */}
                <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-200 mb-4">Policies & Time</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Check-in Time</label>
                            <input
                                type="time"
                                value={formData.checkInTime}
                                onChange={(e) =>
                                    setFormData({ ...formData, checkInTime: e.target.value })
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-1">Check-out Time</label>
                            <input
                                type="time"
                                value={formData.checkOutTime}
                                onChange={(e) =>
                                    setFormData({ ...formData, checkOutTime: e.target.value })
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <label className="block text-sm text-slate-400 mb-1">Cancellation Policy</label>
                            <textarea
                                value={formData.policies.cancellation}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        policies: { ...formData.policies, cancellation: e.target.value }
                                    })
                                }
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-slate-200 h-20"
                            />
                        </div>
                    </div>
                    <div className="flex gap-6 mt-4">
                        <label className="flex items-center gap-2 text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.policies.petsAllowed}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        policies: {
                                            ...formData.policies,
                                            petsAllowed: e.target.checked
                                        }
                                    })
                                }
                            />
                            Pets Allowed
                        </label>

                        <label className="flex items-center gap-2 text-slate-300">
                            <input
                                type="checkbox"
                                checked={formData.policies.smokingAllowed}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        policies: {
                                            ...formData.policies,
                                            smokingAllowed: e.target.checked
                                        }
                                    })
                                }
                            />
                            Smoking Allowed
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>

            </form>
        </div>
    );
};

export default EditHotel;
