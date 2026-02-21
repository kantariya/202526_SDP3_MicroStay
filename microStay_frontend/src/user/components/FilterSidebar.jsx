import React from 'react';
import { Star } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters }) => {

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                <button
                    onClick={() => setFilters({ minPrice: '', maxPrice: '', rating: '', amenities: [] })}
                    className="text-xs text-blue-600 font-semibold hover:underline"
                >
                    Reset
                </button>
            </div>

            {/* PRICE RANGE */}
            <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Price Range</h4>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* STAR RATING */}
            <div className="mb-8">
                <h4 className="text-sm font-bold text-slate-700 mb-4">Star Rating</h4>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                        <label key={star} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="rating"
                                value={star}
                                checked={Number(filters.rating) === star}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-1 group-hover:text-blue-600 transition">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < star ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-semibold text-slate-600 ml-1">{star} Stars</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* AMENITIES (Mock for now) */}
            <div>
                <h4 className="text-sm font-bold text-slate-700 mb-4">Amenities</h4>
                <div className="space-y-3">
                    {['WiFi', 'Breakfast', 'Pool', 'Parking', 'Gym'].map(amenity => (
                        <label key={amenity} className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                            <span className="text-sm text-slate-600 font-medium">{amenity}</span>
                        </label>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default FilterSidebar;
