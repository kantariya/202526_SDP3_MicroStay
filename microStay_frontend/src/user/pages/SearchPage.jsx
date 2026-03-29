import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import HotelCard from '../components/HotelCard';
import FilterSidebar from '../components/FilterSidebar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { SlidersHorizontal } from 'lucide-react';

const SearchPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);

    const [hotels, setHotels] = useState([]);
    const [favorites, setFavorites] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);

    // Filter State
    const [filters, setFilters] = useState({
        city: queryParams.get('city') || '',
        checkIn: queryParams.get('checkIn') || '',
        checkOut: queryParams.get('checkOut') || '',
        minPrice: '',
        maxPrice: '',
        starRating: '',
        roomType: '',
        facilities: [],
        sortDirection: '' // Default: no sorting
    });

    useEffect(() => {
        // Update filters when URL changes
        setFilters(prev => ({
            ...prev,
            city: queryParams.get('city') || '',
            checkIn: queryParams.get('checkIn') || '',
            checkOut: queryParams.get('checkOut') || ''
        }));
    }, [location.search]);

    useEffect(() => {
        fetchHotels();
    }, [filters, currentPage]);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const favRes = await api.get('/users/favourites');
            setFavorites(new Set(favRes.data.map(f => f.hotelId)));
        } catch (err) {
            console.error("Favorites fetch error", err);
        }
    };

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            // Add search parameters
            if (filters.city) params.append('city', filters.city);
            if (filters.checkIn) params.append('checkIn', filters.checkIn);
            if (filters.checkOut) params.append('checkOut', filters.checkOut);
            if (filters.minPrice) params.append('minPrice', filters.minPrice);
            if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
            if (filters.starRating) params.append('starRating', filters.starRating);
            if (filters.roomType) params.append('roomType', filters.roomType);

            // Add facilities as multiple parameters
            if (filters.facilities && filters.facilities.length > 0) {
                filters.facilities.forEach(facility => {
                    params.append('facilities', facility);
                });
            }

            // Pagination
            params.append('page', currentPage);
            params.append('size', 10);

            // Sort Direction - only add if user has selected a sort option
            if (filters.sortDirection) {
                params.append('sortDirection', filters.sortDirection);
            }

            console.log("Fetching hotels with params:", params.toString());

            const response = await api.get(`/hotels/search?${params.toString()}`);

            console.log("Search response:", response.data);

            // Handle paginated response
            if (response.data.content) {
                setHotels(response.data.content);
                setTotalPages(response.data.totalPages);
            } else {
                setHotels(response.data);
            }
        } catch (err) {
            console.error("Search fetch error", err);
            setHotels([]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (hotelId) => {
        navigate(`/hotel/${hotelId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">

                {/* HEADER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900">
                            {filters.city ? `Stays in ${filters.city}` : 'All Stays'}
                        </h1>
                        <p className="text-slate-500 font-medium text-sm md:text-base mt-1">
                            {hotels.length} places found
                            {filters.checkIn && filters.checkOut && (
                                <span className="hidden sm:inline"> • {filters.checkIn} to {filters.checkOut}</span>
                            )}
                        </p>
                    </div>

                    {/* Filter Toggle Button - Always visible */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm xl:hidden"
                    >
                        <SlidersHorizontal size={16} />
                        {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                </div>

                <div className="flex flex-col xl:flex-row gap-6 items-start">

                    {/* SIDEBAR (Filters) - Left side on large screens */}
                    <aside className={`${showMobileFilters ? 'block' : 'hidden'} xl:block w-full xl:w-80 xl:flex-shrink-0`}>
                        <div className="xl:sticky xl:top-24">
                            <FilterSidebar filters={filters} setFilters={setFilters} />
                        </div>
                    </aside>

                    {/* RESULTS - Takes remaining space */}
                    <main className="flex-1 w-full min-w-0 space-y-5">
                        {loading ? (
                            <LoadingSkeleton type="card" count={3} />
                        ) : hotels.length > 0 ? (
                            <>
                                {hotels.map(hotel => (
                                    <HotelCard
                                        key={hotel.id}
                                        hotel={hotel}
                                        favorites={favorites}
                                        setFavorites={setFavorites}
                                        onViewDetails={() => handleViewDetails(hotel.id)}
                                    />
                                ))}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex flex-wrap justify-center items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                            disabled={currentPage === 0}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                        >
                                            Previous
                                        </button>
                                        <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold min-w-[100px] text-center">
                                            {currentPage + 1} / {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                            disabled={currentPage === totalPages - 1}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg font-semibold text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-3xl p-8 md:p-12 text-center border border-gray-100">
                                <div className="text-6xl mb-4">🏚️</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">No Hotels found</h3>
                                <p className="text-slate-500 mb-6">Try adjusting your filters or search for a different city.</p>
                                <button
                                    onClick={() => setFilters({
                                        city: '',
                                        checkIn: '',
                                        checkOut: '',
                                        minPrice: '',
                                        maxPrice: '',
                                        starRating: '',
                                        roomType: '',
                                        facilities: [],
                                        sortDirection: ''
                                    })}
                                    className="mt-6 text-blue-600 font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}
                    </main>

                </div>
            </div>
        </div>
    );
};

export default SearchPage;
