import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Star, ChevronRight, Bed, Coffee, Wifi } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/hotels')
      .then(res => setHotels(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen bg-white flex items-center justify-center font-medium">Loading premium stays...</div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <header className="max-w-6xl mx-auto px-6 pt-12 pb-8 border-b border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Available Stays</h1>
        <p className="text-gray-500">Compare the best hotels and book your next adventure.</p>
        
        <div className="mt-8 relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by destination..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all outline-none"
          />
        </div>
      </header>

      {/* List Section */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div 
              key={hotel.id}
              onClick={() => navigate(`/hotel/${hotel.id}`)}
              className="group flex flex-col md:flex-row bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer"
            >
              {/* Hotel Image - Left Side */}
              <div className="md:w-72 h-48 md:h-auto overflow-hidden">
                <img 
                  src={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content - Middle Side */}
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {hotel.name}
                    </h2>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                      <Star size={14} className="text-amber-500 fill-amber-500" />
                      <span className="text-sm font-bold text-amber-700">{hotel.starRating}</span>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    {hotel.city}
                  </div>

                  {/* Amenities Tags (Visual Flourish) */}
                  <div className="flex gap-4 text-gray-400">
                    <div className="flex items-center gap-1 text-xs"><Wifi size={14}/> Free WiFi</div>
                    <div className="flex items-center gap-1 text-xs"><Coffee size={14}/> Breakfast</div>
                    <div className="flex items-center gap-1 text-xs"><Bed size={14}/> King Bed</div>
                  </div>
                </div>
              </div>

              {/* Price & Action - Right Side */}
              <div className="md:w-64 p-6 bg-gray-50/50 md:border-l border-gray-100 flex flex-col justify-center items-center md:items-end">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Starting from</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-gray-900">₹{hotel.startingPrice}</span>
                  <span className="text-gray-500 text-sm">/night</span>
                </div>
                <button className="w-full md:w-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  View Details
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;