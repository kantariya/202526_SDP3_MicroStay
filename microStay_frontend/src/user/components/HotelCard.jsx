import React, { useMemo } from 'react';
import { MapPin, Wifi, Coffee, Heart, Star, IndianRupee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const HotelCard = ({ hotel, favorites, setFavorites }) => {
    const navigate = useNavigate();
    const isFav = favorites && favorites.has(hotel.id);

    const toggleFavorite = async (e) => {
        e.stopPropagation();
        if (!setFavorites) return;

        try {
            if (isFav) {
                await api.delete(`/users/favourites/${hotel.id}`);
                setFavorites(prev => {
                    const copy = new Set(prev);
                    copy.delete(hotel.id);
                    return copy;
                });
            } else {
                await api.post(`/users/favourites/${hotel.id}`);
                setFavorites(prev => new Set(prev).add(hotel.id));
            }
        } catch (err) {
            console.error("Favorite error", err);
        }
    };

    const lowestPrice = useMemo(() => {
        if (!hotel.rooms || hotel.rooms.length === 0) return 0;
        const prices = hotel.rooms
            .map(r => r.pricing?.basePrice)
            .filter(price => price !== undefined && price !== null);
        return prices.length > 0 ? Math.min(...prices) : 0;
    }, [hotel.rooms]);

    return (
        <div
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition cursor-pointer h-full flex flex-col"
        >

            {/* IMAGE */}
            <div className="h-48 overflow-hidden relative">
                <img
                    src={(typeof hotel.image === 'string' && hotel.image) ? hotel.image : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={String(hotel.name || "Hotel")}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <button
                    onClick={toggleFavorite}
                    className="absolute top-3 right-3 bg-white/95 backdrop-blur p-2 rounded-full shadow-md border border-gray-200 hover:scale-110 transition z-10"
                >
                    <Heart size={20} className={isFav ? "text-red-500 fill-red-500" : "text-gray-400"} />
                </button>
            </div>

            {/* CONTENT */}
            <div className="p-4 flex flex-col flex-grow bg-slate-50/30">

                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-1 mb-2 flex items-center gap-2 flex-wrap">
                            <span>{hotel.name || "Unknown"}</span>
                            <span className="flex text-sm">
                                {Array.from({ length: hotel.starRating || 0 }).map((_, i) => (
                                    <span key={i}>⭐</span>
                                ))}
                            </span>
                        </h2>

                        {/* Location Badge */}
                        <div className="flex items-center w-fit mb-2 px-2 py-1 bg-white border border-slate-100 rounded-lg shadow-sm">
                            <span className="text-sm mr-1.5 opacity-80">🏨</span>
                            <span className="text-xs font-semibold text-slate-600 truncate">
                                {hotel.location?.address ? `${hotel.location.address}, ` : ''}
                                {hotel.city || hotel.location?.city || "Unknown City"}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100 self-start shadow-sm">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs font-bold whitespace-nowrap">
                            {hotel.ratingSummary?.average > 0
                                ? `${hotel.ratingSummary.average.toFixed(1)} (${hotel.ratingSummary.totalReviews} Reviews)`
                                : 'No Ratings Yet'}
                        </span>
                    </div>
                </div>

                {/* Amenities & Price Row */}
                <div className="mt-auto flex items-center justify-between pt-2 border-t border-slate-200/50">
                    {/* AMENITIES - Left Side */}
                    <div className="flex gap-1">
                        {hotel.facilities?.slice(0, 2).map((fac, i) => (
                            <span
                                key={i}
                                className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded border border-slate-200 shadow-sm"
                            >
                                {typeof fac === "string" ? fac : fac?.name || ""}
                            </span>
                        ))}
                    </div>

                    {/* Price - Right Side */}
                    <div className="flex items-baseline gap-1 text-slate-900">
                        <span className="text-xs font-bold opacity-70">💰</span>
                        <div className="flex items-center font-black">
                            <IndianRupee size={15} className="mr-0.5" />
                            <span className="text-xl tracking-tighter">
                                {lowestPrice.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">/night</span>
                    </div>
                </div>

                {/* BUTTON */}
                <button className="mt-4 w-full bg-slate-900 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-blue-800 transition shadow-sm ring-1 ring-slate-900/10">
                    View Details
                </button>

            </div>
        </div>
    );
};

export default HotelCard;
