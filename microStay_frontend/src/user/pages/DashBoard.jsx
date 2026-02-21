import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, ArrowRight, Sparkles } from 'lucide-react';
import api from "../../utils/api";
import HotelCard from '../components/HotelCard';
import DateRangePicker from '../components/DateRangePicker';
import LoadingSkeleton from '../components/LoadingSkeleton';

const Dashboard = () => {
  const [hotels, setHotels] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Search State
  const [city, setCity] = useState('');
  const [dates, setDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(2);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      api.get('/hotels'), // Public endpoint, returns ACTIVE hotels
      api.get('/users/favourites')
    ])
      .then(([hotelRes, favRes]) => {
        setHotels(hotelRes.data);
        const favSet = new Set(favRes.data.map(f => f.hotelId));
        setFavorites(favSet);
      })
      .catch(err => console.error("Failed to load data", err))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to Search Page with query params
    const params = new URLSearchParams();
    if (city) params.append('city', city);
    if (dates.checkIn) params.append('checkIn', dates.checkIn);
    if (dates.checkOut) params.append('checkOut', dates.checkOut);
    params.append('guests', guests);

    navigate(`/search?\${params.toString()}`);
  };

  const featuredHotels = hotels.slice(0, 4); // Just taking first 4 for demo

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-10">
        <div className="w-full max-w-7xl">
          <LoadingSkeleton type="card" count={3} />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white">

      {/* HERO SECTION */}
      <section className="relative bg-slate-900 py-20 lg:py-32 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-6xl font-black text-white leading-tight">
            Find your perfect <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">MicroStay</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Experience premium hotels with flexible check-ins, hourly bookings, and instant confirmation.
          </p>

          {/* SEARCH WIDGET */}
          <div className="mt-10 bg-white p-4 rounded-3xl shadow-2xl shadow-blue-900/20 max-w-5xl mx-auto">
            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">

              {/* CITY */}
              <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Where?</label>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className="text-blue-600" />
                  <input
                    type="text"
                    placeholder="City or Hotel..."
                    className="bg-transparent w-full text-slate-900 font-bold text-sm outline-none placeholder:text-slate-400"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                  />
                </div>
              </div>

              {/* DATES */}
              <div className="col-span-1 border-gray-100">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 ml-1">When?</label>
                <DateRangePicker
                  checkIn={dates.checkIn}
                  checkOut={dates.checkOut}
                  setCheckIn={(val) => setDates(prev => ({ ...prev, checkIn: val }))}
                  setCheckOut={(val) => setDates(prev => ({ ...prev, checkOut: val }))}
                />
              </div>

              {/* GUESTS */}
              <div className="bg-gray-50 px-4 py-3 rounded-2xl border border-gray-100 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Who?</label>
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  <select
                    className="bg-transparent w-full text-slate-900 font-bold text-sm outline-none"
                    value={guests}
                    onChange={e => setGuests(e.target.value)}
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4+ Guests</option>
                  </select>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-blue-500/30">
                <Search size={20} />
                Search
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* POPULAR CITIES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Popular Destinations</h2>
          <button className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Mumbai', 'Delhi', 'Bangalore', 'Goa'].map((city) => (
            <div key={city} onClick={() => { setCity(city); }} className="relative group cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] bg-gray-200">
              <img src={`https://source.unsplash.com/800x600/?\${city}`} alt={city} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-lg">{city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DEALS BANNER */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-bold mb-4 border border-white/30">
              <Sparkles size={14} /> SPECIAL OFFER
            </div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Get 20% off your first booking</h2>
            <p className="text-blue-100 mb-8">Use code <span className="font-mono bg-white/20 px-2 py-1 rounded text-white">MICRO2026</span> at checkout.</p>
            <button onClick={() => navigate('/search')} className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition shadow-xl">
              Explore Deals
            </button>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl"></div>
        </div>
      </section>

      {/* FEATURED HOTELS */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Featured Stays</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredHotels.map(hotel => (
              <HotelCard
                key={hotel.id}
                hotel={hotel}
                favorites={favorites}
                setFavorites={setFavorites}
              />
            ))}
          </div>

          {featuredHotels.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              No hotels found.
            </div>
          )}
        </div>
      </section>

      {/* NEWSLETTER / CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">Ready for your next micro-adventure?</h2>
        <p className="text-slate-600 mb-8 max-w-2xl mx-auto">Join thousands of travelers who are discovering a smarter way to stay.</p>
        <button onClick={() => navigate('/register')} className="bg-slate-900 text-white px-8 py-3 rounded-full font-bold hover:bg-slate-800 transition shadow-lg">
          Create Free Account
        </button>
      </section>

    </div>
  );
};

export default Dashboard;
