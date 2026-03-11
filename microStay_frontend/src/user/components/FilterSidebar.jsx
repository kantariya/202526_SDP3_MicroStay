import React from 'react';
import { Star, X } from 'lucide-react';

const FilterSidebar = ({ filters, setFilters }) => {

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFacilityToggle = (facility) => {
        setFilters(prev => ({
            ...prev,
            facilities: prev.facilities.includes(facility)
                ? prev.facilities.filter(f => f !== facility)
                : [...prev.facilities, facility]
        }));
    };

    const resetFilters = () => {
        setFilters({
            city: filters.city, // Keep city and dates
            checkIn: filters.checkIn,
            checkOut: filters.checkOut,
            minPrice: '',
            maxPrice: '',
            starRating: '',
            roomType: '',
            facilities: [],
            sortDirection: ''
        });
    };

    const facilityOptions = ['WiFi', 'Breakfast', 'Pool', 'Parking', 'Gym'];
    const roomTypes = ['STANDARD', 'DELUXE', 'SUITE'];

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                <button
                    onClick={resetFilters}
                    className="text-xs text-blue-600 font-semibold hover:underline flex items-center gap-1"
                >
                    <X size={14} /> Reset
                </button>
            </div>

            {/* PRICE RANGE */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Price Range</h4>
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        name="minPrice"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={handleChange}
                        className="text-[#1A1A1A] w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                        type="number"
                        name="maxPrice"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={handleChange}
                        className="text-[#1A1A1A] w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                </div>
            </div>

            {/* SORT BY PRICE */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Sort by Price</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="sortDirection"
                            value=""
                            checked={filters.sortDirection === ''}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 font-medium group-hover:text-blue-600 transition">
                            No Sorting
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="sortDirection"
                            value="asc"
                            checked={filters.sortDirection === 'asc'}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 font-medium group-hover:text-blue-600 transition">
                            Price: Low to High ↑
                        </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                            type="radio"
                            name="sortDirection"
                            value="desc"
                            checked={filters.sortDirection === 'desc'}
                            onChange={handleChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 font-medium group-hover:text-blue-600 transition">
                            Price: High to Low ↓
                        </span>
                    </label>
                </div>
            </div>

            {/* STAR RATING */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Star Rating</h4>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(star => (
                        <label key={star} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="starRating"
                                value={star}
                                checked={Number(filters.starRating) === star}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex items-center gap-1.5 group-hover:text-blue-600 transition">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            className={i < star ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-semibold text-slate-600">{star}+ Stars</span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>

            {/* ROOM TYPE */}
            <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-bold text-slate-700 mb-3">Room Type</h4>
                <div className="space-y-2">
                    {roomTypes.map(type => (
                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="radio"
                                name="roomType"
                                value={type}
                                checked={filters.roomType === type}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600 font-medium group-hover:text-blue-600 transition capitalize">
                                {type.toLowerCase()}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* FACILITIES */}
            <div>
                <h4 className="text-sm font-bold text-slate-700 mb-3">Facilities</h4>
                <div className="space-y-2.5">
                    {facilityOptions.map(facility => (
                        <label key={facility} className="flex items-center gap-3 cursor-pointer group">
                            <input 
                                type="checkbox"
                                checked={filters.facilities.includes(facility)}
                                onChange={() => handleFacilityToggle(facility)}
                                className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600 font-medium group-hover:text-blue-600 transition">
                                {facility}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.minPrice || filters.maxPrice || filters.starRating || filters.roomType || filters.sortDirection || filters.facilities.length > 0) && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Active Filters</h4>
                    <div className="flex flex-wrap gap-2">
                        {filters.minPrice && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                                Min: ₹{filters.minPrice}
                            </span>
                        )}
                        {filters.maxPrice && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                                Max: ₹{filters.maxPrice}
                            </span>
                        )}
                        {filters.sortDirection && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg font-medium">
                                {filters.sortDirection === 'asc' ? '↑ Low to High' : '↓ High to Low'}
                            </span>
                        )}
                        {filters.starRating && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                                {filters.starRating}+ Stars
                            </span>
                        )}
                        {filters.roomType && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium capitalize">
                                {filters.roomType.toLowerCase()}
                            </span>
                        )}
                        {filters.facilities.map(facility => (
                            <span key={facility} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium">
                                {facility}
                            </span>
                        ))}
                    </div>
                </div>
            )}

        </div>
    );
};

export default FilterSidebar;
