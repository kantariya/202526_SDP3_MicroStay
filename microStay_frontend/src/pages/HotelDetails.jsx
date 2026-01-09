import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Clock, MapPin, Star, ShieldCheck, 
  MessageSquare, Send, ArrowLeft, CheckCircle2, ChevronRight 
} from 'lucide-react';
import api from '../utils/api';

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  const fetchData = async () => {
    try {
      const hotelRes = await api.get(`/hotels/${hotelId}`);
      const reviewRes = await api.get(`/hotels/${hotelId}/reviews`);
      setHotel(hotelRes.data);
      setReviews(reviewRes.data);
    } catch (err) {
      console.error("Failed to load hotel info", err);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    try {
      await api.post(`/hotels/${hotelId}/reviews`, 
        { rating, comment },
        { headers: { 'X-User-Id': userId } }
      );
      setComment("");
      fetchData();
    } catch (err) {
      alert("Error posting review: " + err.message);
    }
  };

  if (!hotel) return <div className="min-h-screen flex items-center justify-center bg-white text-gray-400">Loading details...</div>;

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-12">
      {/* Header Navigation */}
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-black">
          <ArrowLeft size={18} /> BACK
        </button>
        <span className="text-xs font-black uppercase tracking-widest text-blue-600">{hotel.brand || 'Luxury Group'}</span>
      </nav>

      <main className="max-w-6xl mx-auto px-6">
        {/* --- TITLE SECTION (NO IMAGE OVERLAP) --- */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center text-amber-500 bg-amber-50 px-2 py-1 rounded text-xs font-bold">
              <Star size={12} className="fill-amber-500 mr-1" /> {hotel.starRating}
            </div>
            <span className="text-gray-400 text-xs font-bold flex items-center uppercase tracking-tighter">
              <MapPin size={14} className="mr-1 text-blue-500" /> {hotel.city}
            </span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight leading-none mb-4">
            {hotel.name}
          </h1>
          <p className="text-gray-500 max-w-2xl text-lg leading-relaxed">{hotel.description}</p>
        </section>

        {/* --- COMPACT IMAGE GALLERY --- */}
        <section className="grid grid-cols-4 gap-4 h-64 mb-12">
          <div className="col-span-2 overflow-hidden rounded-3xl">
            <img src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} className="w-full h-full object-cover" alt="Main" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-3xl">
            <img src={hotel.images?.[1] || 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'} className="w-full h-full object-cover" alt="Room" />
          </div>
          <div className="col-span-1 overflow-hidden rounded-3xl">
            <img src={hotel.images?.[2] || 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'} className="w-full h-full object-cover" alt="Amenity" />
          </div>
        </section>

        {/* --- CONTENT LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <div className="lg:col-span-2 space-y-12">
            {/* Arrival Info */}
            <div className="flex gap-10 py-6 border-y border-gray-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Clock size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Check-In</p>
                  <p className="font-bold">{hotel.checkInTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-2xl text-blue-600"><Clock size={20} /></div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">Check-Out</p>
                  <p className="font-bold">{hotel.checkOutTime}</p>
                </div>
              </div>
            </div>

            {/* Room Listings */}
            <div>
              <h3 className="text-2xl font-black mb-6">Available Rooms</h3>
              <div className="space-y-4">
                {hotel.rooms?.map((room) => (
                  <div key={room.roomId} className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-gray-100 rounded-3xl hover:border-blue-200 transition-all">
                    <div>
                      <h4 className="text-xl font-bold">{room.roomType}</h4>
                      <div className="flex flex-wrap gap-4 mt-2">
                        {room.amenities?.map(a => (
                          <span key={a} className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-green-500" /> {a}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Per Night</p>
                        <p className="text-2xl font-black text-blue-600">₹{room.pricing.basePrice}</p>
                      </div>
                      <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-blue-600 transition-all">
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: REVIEWS */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50/50 rounded-3xl p-8 sticky top-24">
              <h3 className="text-xl font-black mb-6 flex justify-between items-center">
                Reviews <span className="text-xs text-blue-600 font-bold">See all</span>
              </h3>
              
              <div className="space-y-4 mb-8">
                {reviews.length > 0 ? reviews.slice(0, 3).map(r => (
                  <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50">
                    <div className="flex text-amber-400 mb-2">
                      {Array(Math.floor(r.rating)).fill(0).map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed italic">"{r.comment}"</p>
                  </div>
                )) : <p className="text-gray-400 text-sm italic">No reviews yet.</p>}
              </div>

              <form onSubmit={submitReview} className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Post a Review</p>
                <textarea 
                  className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-blue-100 outline-none h-24" 
                  placeholder="Share your experience..." 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
                />
                <button className="w-full bg-white border border-slate-900 text-slate-900 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-900 hover:text-white transition-all">
                  POST <Send size={14} />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HotelDetails;