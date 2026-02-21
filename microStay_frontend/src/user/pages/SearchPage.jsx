import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';
import HotelCard from '../components/HotelCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { SlidersHorizontal } from 'lucide-react';

const SearchPage = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);

    // Filter State
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        rating: '', // minimum rating
        amenities: []
    });

    // Initial Search Params
    const cityQuery = queryParams.get('city') || '';

    useEffect(() => {
        fetchData();
    }, [location.search]);

    useEffect(() => {
        applyFilters();
    }, [hotels, filters, cityQuery]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [hotelRes, favRes] = await Promise.all([
                api.get('/hotels'),
                api.get('/users/favourites')
            ]);

            setHotels(hotelRes.data);
            setFavorites(new Set(favRes.data.map(f => f.hotelId)));
        } catch (err) {
            console.error("Search fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let result = hotels;

        // 1. City Filter (from URL)
        if (cityQuery) {
            result = result.filter(h =>
                h.city.toLowerCase().includes(cityQuery.toLowerCase()) ||
                h.name.toLowerCase().includes(cityQuery.toLowerCase())
            );
        }

        // 2. Price Filter
        if (filters.minPrice) {
            result = result.filter(h => h.startingPrice >= Number(filters.minPrice));
        }
        if (filters.maxPrice) {
            result = result.filter(h => h.startingPrice <= Number(filters.maxPrice));
        }

        // 3. Rating Filter
        if (filters.rating) {
            result = result.filter(h => h.starRating >= Number(filters.rating));
        }

        setFilteredHotels(result);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">
                            {cityQuery ? `Stays in \${cityQuery}` : 'All Stays'}
                        </h1>
                        <p className="text-slate-500 font-medium">
                            {filteredHotels.length} places found
                        </p>
                    </div>

                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="md:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700"
                    >
                        <SlidersHorizontal size={16} /> Filters
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">

                    {/* SIDEBAR (Filters) */}
                    <div className={`lg:w-1/4 \${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24">
                            <FilterSidebar filters={filters} setFilters={setFilters} />
                        </div>
                    </div>

                    {/* RESULTS */}
                    <div className="lg:w-3/4 space-y-6">
                        {loading ? (
                            <LoadingSkeleton type="card" count={3} />
                        ) : filteredHotels.length > 0 ? (
                            filteredHotels.map(hotel => (
                                <HotelCard
                                    key={hotel.id}
                                    hotel={hotel}
                                    favorites={favorites}
                                    setFavorites={setFavorites}
                                />
                            ))
                        ) : (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                                <div className="text-6xl mb-4">🏚️</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No properties found</h3>
                                <p className="text-slate-500">Try adjusting your filters or search for a different city.</p>
                                <button
                                    onClick={() => setFilters({ minPrice: '', maxPrice: '', rating: '', amenities: [] })}
                                    className="mt-6 text-blue-600 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SearchPage;
