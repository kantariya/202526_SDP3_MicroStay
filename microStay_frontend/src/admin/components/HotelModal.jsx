import React, { useState, useEffect } from 'react';
import { X, Save, ArrowRight, ArrowLeft, Plus, Trash2, Check } from 'lucide-react';
import api from '../utils/api';
import { CountrySelect, StateSelect, CitySelect } from 'react-country-state-city';
import "react-country-state-city/dist/react-country-state-city.css";

const HotelModal = ({ onClose, onSave }) => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [managers, setManagers] = useState([]);

    // Location dropdown state
    const [countryId, setCountryId] = useState(0);
    const [stateId, setStateId] = useState(0);
    const [cityId, setCityId] = useState(0);

    // Initial State Matching Hotel Entity
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        description: '',
        starRating: 3,
        managerId: '',
        location: {
            address: '',
            city: '',
            state: '',
            country: '',
            pincode: '',
            geo: { type: 'Point', coordinates: [0, 0] } // [long, lat]
        },
        contact: {
            phone: '',
            email: ''
        },
        checkInTime: '14:00',
        checkOutTime: '11:00',
        policies: {
            cancellation: '',
            petsAllowed: false,
            smokingAllowed: false
        },
        facilities: [],
        images: [],
        rooms: [] // List of Room objects
    });

    // Inputs for arrays
    const [facilityInput, setFacilityInput] = useState('');
    const [imageInput, setImageInput] = useState('');

    useEffect(() => {
        fetchManagers();
    }, []);

    const fetchManagers = async () => {
        try {
            const response = await api.get('/admin/managers');
            setManagers(response.data);
        } catch (error) {
            console.error("Failed to fetch managers", error);
        }
    };

    // --- Handlers ---

    const updateField = (path, value) => {
        setFormData(prev => {
            const newData = { ...prev };
            const keys = path.split('.');
            let current = newData;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newData;
        });
    };

    const handleAddFacility = () => {
        if (facilityInput.trim()) {
            setFormData(prev => ({
                ...prev,
                facilities: [...prev.facilities, facilityInput.trim()]
            }));
            setFacilityInput('');
        }
    };

    const handleAddImage = () => {
        if (imageInput.trim()) {
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, imageInput.trim()]
            }));
            setImageInput('');
        }
    };

    // --- Room Handlers ---
    // const [newRoom, setNewRoom] = useState({
    //     roomType: 'STANDARD',
    //     description: '',
    //     maxAdults: 2,
    //     maxChildren: 0,
    //     pricing: { basePrice: 100, currency: 'USD', weekendMultiplier: 1.0 },
    //     inventory: { totalRooms: 10 },
    //     amenities: [],
    //     images: [],
    //     active: true
    // });
    // const [roomAmenityInput, setRoomAmenityInput] = useState('');

    // const addRoom = () => {
    //     setFormData(prev => ({
    //         ...prev,
    //         rooms: [...prev.rooms, { ...newRoom, roomId: `ROOM-${Date.now()}` }]
    //     }));
    //     // Reset new room form
    //     setNewRoom({
    //         roomType: 'STANDARD',
    //         description: '',
    //         maxAdults: 2,
    //         maxChildren: 0,
    //         pricing: { basePrice: 100, currency: 'USD', weekendMultiplier: 1.0 },
    //         inventory: { totalRooms: 10 },
    //         amenities: [],
    //         images: [],
    //         active: true
    //     });
    // };

    // const removeRoom = (index) => {
    //     setFormData(prev => ({
    //         ...prev,
    //         rooms: prev.rooms.filter((_, i) => i !== index)
    //     }));
    // };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Ensure coordinates are numbers
            const payload = {
                ...formData,
                location: {
                    ...formData.location,
                    geo: {
                        ...formData.location.geo,
                        coordinates: formData.location.geo.coordinates.map(Number)
                    }
                }
            };

            await api.post('/admin/hotels', payload);
            onSave();
            onClose();
        } catch (error) {
            console.error("Failed to create hotel", error);
            alert("Failed to create hotel: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // --- Render Steps ---

    const renderStep1 = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-400">Hotel Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-slate-400">Brand</label>
                    <input type="text" value={formData.brand} onChange={(e) => updateField('brand', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400">Description</label>
                    <textarea rows="3" value={formData.description} onChange={(e) => updateField('description', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-slate-400">Star Rating</label>
                    <select value={formData.starRating} onChange={(e) => updateField('starRating', parseInt(e.target.value))} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white">
                        {[1, 2, 3, 4, 5].map(r => <option key={r} value={r}>{r} Stars</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-slate-400">Manager</label>
                    <select value={formData.managerId} onChange={(e) => updateField('managerId', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white">
                        <option value="">Select Manager</option>
                        {managers.map(m => <option key={m.id} value={m.id}>{m.name || m.email}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Location & Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400 mb-2">Address *</label>
                    <input type="text" value={formData.location.address} onChange={(e) => updateField('location.address', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                
                {/* Country Dropdown */}
                <div className='text-[#1A1A1A]'>
                    <label className="block text-sm text-slate-400 mb-2">Country *</label>
                    <CountrySelect
                        onChange={(e) => {
                            setCountryId(e.id);
                            updateField('location.country', e.name);
                            updateField('location.state', '');
                            updateField('location.city', '');
                            setStateId(0);
                            setCityId(0);
                        }}
                        placeHolder="Select Country"
                        containerClassName="w-full"
                        inputClassName="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    />
                </div>

                {/* State Dropdown */}
                <div className='text-[#1A1A1A]'>
                    <label className="block text-sm text-slate-400 mb-2">State</label>
                    <StateSelect
                        countryid={countryId}
                        onChange={(e) => {
                            setStateId(e.id);
                            updateField('location.state', e.name);
                            updateField('location.city', '');
                            setCityId(0);
                        }}
                        placeHolder="Select State"
                        containerClassName="w-full"
                        inputClassName="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    />
                </div>

                {/* City Dropdown */}
                <div className='text-[#1A1A1A]'>
                    <label className="block text-sm text-slate-400 mb-2">City *</label>
                    <CitySelect
                        countryid={countryId}
                        stateid={stateId}
                        onChange={(e) => {
                            setCityId(e.id);
                            updateField('location.city', e.name);
                        }}
                        placeHolder="Select City"
                        containerClassName="w-full"
                        inputClassName="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white"
                    />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-2">Pincode</label>
                    <input type="text" value={formData.location.pincode} onChange={(e) => updateField('location.pincode', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Lat (Optional)</label>
                    <input type="number" step="any" value={formData.location.geo.coordinates[1]} onChange={(e) => updateField('location.geo.coordinates', [formData.location.geo.coordinates[0], parseFloat(e.target.value)])} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Long (Optional)</label>
                    <input type="number" step="any" value={formData.location.geo.coordinates[0]} onChange={(e) => updateField('location.geo.coordinates', [parseFloat(e.target.value), formData.location.geo.coordinates[1]])} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>

                <div>
                    <label className="block text-sm text-slate-400 mb-2">Email Contact</label>
                    <input type="email" value={formData.contact.email} onChange={(e) => updateField('contact.email', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Phone Contact</label>
                    <input type="tel" value={formData.contact.phone} onChange={(e) => updateField('contact.phone', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Policies & Times</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm text-slate-400">Check-in Time</label>
                    <input type="time" value={formData.checkInTime} onChange={(e) => updateField('checkInTime', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div>
                    <label className="block text-sm text-slate-400">Check-out Time</label>
                    <input type="time" value={formData.checkOutTime} onChange={(e) => updateField('checkOutTime', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" />
                </div>
                <div className="md:col-span-2">
                    <label className="block text-sm text-slate-400">Cancellation Policy</label>
                    <textarea rows="2" value={formData.policies.cancellation} onChange={(e) => updateField('policies.cancellation', e.target.value)} className="w-full bg-slate-700 border border-slate-600 rounded p-2 text-white" placeholder="e.g. Free cancellation until 24 hours before check-in" />
                </div>
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={formData.policies.petsAllowed} onChange={(e) => updateField('policies.petsAllowed', e.target.checked)} className="w-4 h-4" />
                        Pets Allowed
                    </label>
                    <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input type="checkbox" checked={formData.policies.smokingAllowed} onChange={(e) => updateField('policies.smokingAllowed', e.target.checked)} className="w-4 h-4" />
                        Smoking Allowed
                    </label>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Facilities & Images</h3>

            {/* Facilities */}
            <div>
                <label className="block text-sm text-slate-400 mb-1">Hotel Facilities</label>
                <div className="flex gap-2 mb-2">
                    <input type="text" value={facilityInput} onChange={(e) => setFacilityInput(e.target.value)} className="flex-1 bg-slate-700 rounded p-2 text-white" placeholder="Add facility (Wifi, Pool...)" />
                    <button type="button" onClick={handleAddFacility} className="bg-blue-600 text-white p-2 rounded"><Plus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.facilities.map((f, i) => (
                        <span key={i} className="bg-slate-700 px-2 py-1 rounded text-sm flex items-center gap-2 text-slate-200">{f} <X size={12} className="cursor-pointer" onClick={() => updateField('facilities', formData.facilities.filter((_, idx) => idx !== i))} /></span>
                    ))}
                </div>
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm text-slate-400 mb-1">Image URLs</label>
                <div className="flex gap-2 mb-2">
                    <input type="text" value={imageInput} onChange={(e) => setImageInput(e.target.value)} className="flex-1 bg-slate-700 rounded p-2 text-white" placeholder="https://example.com/image.jpg" />
                    <button type="button" onClick={handleAddImage} className="bg-blue-600 text-white p-2 rounded"><Plus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.images.map((img, i) => (
                        <div key={i} className="relative group">
                            <img src={img} alt="preview" className="w-20 h-20 object-cover rounded bg-slate-900" />
                            <button type="button" onClick={() => updateField('images', formData.images.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={10} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // const renderStep5 = () => (
    //     <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
    //         <h3 className="text-lg font-semibold text-slate-200 border-b border-slate-700 pb-2">Rooms Configuration</h3>

    //         {/* Add Room Form */}
    //         <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
    //             <h4 className="text-sm font-bold text-slate-300 mb-3">Add New Room Type</h4>
    //             <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
    //                 <input type="text" placeholder="Room Type (STANDARD)" value={newRoom.roomType} onChange={(e) => setNewRoom({ ...newRoom, roomType: e.target.value })} className="bg-slate-800 p-2 rounded text-white text-sm" />
    //                 <input type="number" placeholder="Base Price" value={newRoom.pricing.basePrice} onChange={(e) => setNewRoom({ ...newRoom, pricing: { ...newRoom.pricing, basePrice: parseFloat(e.target.value) } })} className="bg-slate-800 p-2 rounded text-white text-sm" />
    //                 <input type="number" placeholder="Total Rooms" value={newRoom.inventory.totalRooms} onChange={(e) => setNewRoom({ ...newRoom, inventory: { ...newRoom.inventory, totalRooms: parseInt(e.target.value) } })} className="bg-slate-800 p-2 rounded text-white text-sm" />
    //                 <input type="number" placeholder="Max Adults" value={newRoom.maxAdults} onChange={(e) => setNewRoom({ ...newRoom, maxAdults: parseInt(e.target.value) })} className="bg-slate-800 p-2 rounded text-white text-sm" />
    //                 <input type="number" placeholder="Max Children" value={newRoom.maxChildren} onChange={(e) => setNewRoom({ ...newRoom, maxChildren: parseInt(e.target.value) })} className="bg-slate-800 p-2 rounded text-white text-sm" />
    //             </div>
    //             <div className="flex justify-end">
    //                 <button type="button" onClick={addRoom} className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"><Plus size={14} /> Add Room</button>
    //             </div>
    //         </div>

    //         {/* Room List */}
    //         <div className="space-y-2 max-h-60 overflow-y-auto">
    //             {formData.rooms.map((room, i) => (
    //                 <div key={i} className="bg-slate-800 p-3 rounded border border-slate-700 flex justify-between items-center">
    //                     <div>
    //                         <p className="font-bold text-slate-200">{room.roomType} <span className="text-xs text-slate-500 font-normal">({room.maxAdults} Adults + {room.maxChildren} Child)</span></p>
    //                         <p className="text-xs text-slate-400">${room.pricing.basePrice} / night • {room.inventory.totalRooms} Units</p>
    //                     </div>
    //                     <button type="button" onClick={() => removeRoom(i)} className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
    //                 </div>
    //             ))}
    //             {formData.rooms.length === 0 && <p className="text-slate-500 text-sm italic text-center">No rooms added yet.</p>}
    //         </div>
    //     </div>
    // );

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800 shrink-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-100">Create New Hotel</h2>
                        <p className="text-xs text-slate-400 mt-1">Step {step} of 4</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors"><X size={24} /></button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">
                    {step === 1 && renderStep1()}
                    {step === 2 && renderStep2()}
                    {step === 3 && renderStep3()}
                    {step === 4 && renderStep4()}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700 bg-slate-800 flex justify-between shrink-0">
                    <button
                        onClick={() => setStep(s => Math.max(1, s - 1))}
                        disabled={step === 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${step === 1 ? 'text-slate-600 cursor-not-allowed' : 'text-slate-300 hover:bg-slate-700'}`}
                    >
                        <ArrowLeft size={18} /> Back
                    </button>

                    {step < 4 ? (
                        <button
                            onClick={() => setStep(s => Math.min(4, s + 1))}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            Next <ArrowRight size={18} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            {loading ? 'Submitting...' : <><Check size={18} /> Create Hotel</>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HotelModal;
