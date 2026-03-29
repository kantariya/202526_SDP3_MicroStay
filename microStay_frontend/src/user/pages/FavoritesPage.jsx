import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import api from '../../utils/api';
import HotelCard from '../components/HotelCard';

const FavoritesPage = () => {
  const [hotels, setHotels] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/users/favourites'),
      api.get('/hotels')
    ])
      .then(([favRes, hotelRes]) => {
        const favIds = new Set(favRes.data.map(f => f.hotelId));
        setFavorites(favIds);

        const favHotels = hotelRes.data.filter(h => favIds.has(h.id));
        setHotels(favHotels);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-black font-semibold">
        Loading favourites...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-1">
              Your Favourites ❤️
            </h1>
            <p className="text-slate-500">
              Saved Hotels for your next trip
            </p>
          </div>

          <div className="relative mt-4 md:mt-0 w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search your list..."
              className="text-[#1A1A1A] w-full bg-white border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-sm font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400"
            />
          </div>
        </div>

        {/* LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length > 0 ? (
            filtered.map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                favorites={favorites}
                setFavorites={(newFavs) => {
                  setFavorites(newFavs);
                  // Optimistic remove from view
                  if (newFavs instanceof Set && !newFavs.has(hotel.id)) {
                    setHotels(prev => prev.filter(h => h.id !== hotel.id));
                  }
                  // If callback handles it differently
                  if (typeof newFavs === 'function') {
                    // Force re-filter? No need, HotelCard handles API
                    setHotels(prev => prev.filter(h => h.id !== hotel.id));
                  }
                }}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <Heart size={48} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-500 font-medium">No favourite hotels found.</p>
              <button onClick={() => navigate('/')} className="mt-4 text-blue-600 font-bold hover:underline">Explore Hotels</button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default FavoritesPage;
