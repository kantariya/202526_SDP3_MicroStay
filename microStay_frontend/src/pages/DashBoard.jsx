import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ChevronRight, Bed, Coffee, Wifi, Heart } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/hotels'),
      api.get('/users/favourites')
    ])
      .then(([hotelRes, favRes]) => {
        setHotels(hotelRes.data);

        const favSet = new Set(favRes.data.map(f => f.hotelId));
        setFavorites(favSet);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleFavorite = async (hotelId, e) => {
    e.stopPropagation(); // prevent card click

    try {
      if (favorites.has(hotelId)) {
        await api.delete(`/users/favourites/${hotelId}`);
        setFavorites(prev => {
          const copy = new Set(prev);
          copy.delete(hotelId);
          return copy;
        });
      } else {
        await api.post(`/users/favourites/${hotelId}`);
        setFavorites(prev => new Set(prev).add(hotelId));
      }
    } catch (err) {
      console.error("Favorite error", err);
    }
  };

  const filteredHotels = hotels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-black font-semibold">
        Loading hotels...
      </div>
    );

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="max-w-6xl mx-auto px-6 pt-12 pb-8 border-b border-gray-200">
        <h1 className="text-3xl font-extrabold text-black mb-2">
          Available Stays
        </h1>
        <p className="text-gray-700">
          Compare hotels and book your next stay
        </p>

        {/* SEARCH BAR — HIGH CONTRAST */}
        <div className="mt-8 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by hotel or city..."
            className="
              w-full pl-12 pr-4 py-3
              bg-white
              border border-gray-400
              rounded-xl
              text-black
              placeholder-gray-600
              focus:ring-2 focus:ring-blue-600
              focus:border-blue-600
              outline-none
              shadow-sm
            "
          />
        </div>
      </header>

      {/* LIST */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="space-y-6">

          {filteredHotels.map((hotel) => {
            const isFav = favorites.has(hotel.id);

            return (
              <div
                key={hotel.id}
                onClick={() => navigate(`/hotel/${hotel.id}`)}
                className="
                  group flex flex-col md:flex-row
                  bg-white border border-gray-200
                  rounded-2xl overflow-hidden
                  hover:border-blue-300 hover:shadow-xl
                  transition-all cursor-pointer
                "
              >

                {/* IMAGE */}
                <div className="md:w-72 h-48 md:h-auto overflow-hidden relative">

                  <img
                    src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* HEART ICON */}
                  <button
                    onClick={(e) => toggleFavorite(hotel.id, e)}
                    className="
                      absolute top-3 right-3
                      bg-white/95 backdrop-blur
                      p-2 rounded-full
                      shadow-md border border-gray-200
                      hover:scale-110 transition
                    "
                  >
                    <Heart
                      size={20}
                      className={isFav ? "text-red-600 fill-red-600" : "text-gray-700"}
                    />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 p-6 flex flex-col justify-between">

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-2xl font-bold text-black group-hover:text-blue-700">
                        {hotel.name}
                      </h2>

                      <div className="flex items-center gap-1 bg-amber-100 px-2 py-1 rounded-lg">
                        <Star size={14} className="text-amber-600 fill-amber-600" />
                        <span className="text-sm font-bold text-amber-800">
                          {hotel.starRating}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center text-gray-800 text-sm mb-4 font-medium">
                      <MapPin size={14} className="mr-1" />
                      {hotel.city}
                    </div>

                    {/* AMENITIES */}
                    <div className="flex gap-4 text-gray-700 font-medium">
                      <div className="flex items-center gap-1 text-xs"><Wifi size={14}/> WiFi</div>
                      <div className="flex items-center gap-1 text-xs"><Coffee size={14}/> Breakfast</div>
                      <div className="flex items-center gap-1 text-xs"><Bed size={14}/> King Bed</div>
                    </div>
                  </div>
                </div>

                {/* PRICE */}
                <div className="md:w-64 p-6 bg-gray-100 md:border-l border-gray-200 flex flex-col justify-center items-end">
                  <p className="text-xs text-gray-700 font-bold uppercase mb-1">
                    Starting from
                  </p>

                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-3xl font-extrabold text-black">
                      ₹{hotel.startingPrice}
                    </span>
                    <span className="text-gray-700 text-sm">/night</span>
                  </div>

                  <button className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-800 transition flex items-center gap-2">
                    View Details
                    <ChevronRight size={18} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
