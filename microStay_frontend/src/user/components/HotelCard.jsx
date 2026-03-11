import React from 'react';
import { MapPin, Wifi, Coffee, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import RatingBadge from './RatingBadge';
import PriceBox from './PriceBox';

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

    return (
        <div
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-xl transition cursor-pointer h-full flex flex-col"
        >

            {/* IMAGE */}
            <div className="h-48 overflow-hidden relative">
                <img
                    src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={hotel.name}
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
            <div className="p-5 flex flex-col flex-grow">

                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition line-clamp-1">
                            {hotel.name}
                        </h2>

                        <div className="flex items-center text-slate-500 text-sm mt-1">
                            <MapPin size={14} className="mr-1" />
                            {hotel.city || hotel.location.city}
                        </div>
                    </div>

                    <RatingBadge rating={hotel.starRating} />
                </div>

                {/* AMENITIES */}
                <div className="flex flex-wrap gap-2 mt-3 mb-2.5">
                    {hotel.facilities?.slice(0, 3).map((fac, i) => (
                        <span
                            key={i}
                            className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md"
                        >
                            {fac}
                        </span>
                    ))}
                </div>

                {/* BUTTON */}
                <button className="mt-auto bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-600 transition">
                    View Details
                </button>

            </div>
        </div>
    );
};

export default HotelCard;
