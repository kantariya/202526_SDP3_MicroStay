import React, { useEffect, useState } from "react";
import { MapPin, Bed, Filter, Calendar, IndianRupee, Star, XCircle, CheckCircle2, Clock } from "lucide-react";
// Importing your actual API utility
import api from "../utils/api"; 

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [upcomingCount, setUpcomingCount] = useState(0);
  const [pastCount, setPastCount] = useState(0);

  useEffect(() => {
    fetchBookings();
  }, []);

  /**
   * FETCH ACTUAL DATA
   */
  async function fetchBookings() {
    try {
      setLoading(true);
      // Actual GET request to your backend
      const res = await api.get("/bookings/my");
      
      const bookingList = res.data.bookings || [];
      setBookings(bookingList);
      setUpcomingCount(res.data.upcomingCount || 0);
      setPastCount(res.data.pastCount || 0);

      // Extract unique hotel IDs to fetch additional details if they aren't in the booking object
      const uniqueHotelIds = [...new Set(bookingList.map((b) => b.hotelId))];
      fetchHotelsDetails(uniqueHotelIds);
    } catch (e) {
      console.error("Fetch bookings failed", e);
    } finally {
      setLoading(false);
    }
  }

  async function fetchHotelsDetails(ids) {
    const hotelData = { ...hotels };
    for (const id of ids) {
      if (!hotelData[id]) {
        try {
          // Actual GET request for hotel details
          const res = await api.get(`/hotels/${id}`);
          hotelData[id] = res.data;
        } catch (err) {
          console.error(`Failed to fetch hotel details for ${id}`, err);
        }
      }
    }
    setHotels(hotelData);
  }

  async function cancelBooking(ref) {
    const confirmed = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmed) return;
    
    try {
      // Actual POST request to cancel
      await api.post(`/bookings/${ref}/cancel`);
      alert("Booking cancelled successfully.");
      fetchBookings(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed. Please try again.");
      console.error("Cancellation error:", err);
    }
  }

  const today = new Date();

  function formatDate(d) {
    return new Date(d).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  function getStatusBadge(status) {
    const configs = {
      CONFIRMED: { 
        class: "bg-emerald-100 text-emerald-700 ring-emerald-200", 
        icon: <CheckCircle2 size={12} className="mr-1" /> 
      },
      CANCELLED: { 
        class: "bg-rose-100 text-rose-700 ring-rose-200", 
        icon: <XCircle size={12} className="mr-1" /> 
      },
      FAILED: { 
        class: "bg-amber-100 text-amber-700 ring-amber-200", 
        icon: <Clock size={12} className="mr-1" /> 
      }
    };
    const config = configs[status] || { class: "bg-slate-100 text-slate-700 ring-slate-200", icon: null };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ring-1 ${config.class}`}>
        {config.icon}
        {status}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-medium">Syncing your reservations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 font-sans antialiased text-slate-900 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Bookings</h2>
          <p className="text-slate-500 font-medium">Manage your upcoming journeys and stay history.</p>
        </div>
        {/* <button className="flex items-center justify-center px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-all">
          <Filter className="mr-2" size={16} />
          Filter
        </button> */}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard color="indigo" value={bookings.length} label="Total Stays" />
        <StatCard color="emerald" value={upcomingCount} label="Upcoming" />
        <StatCard color="rose" value={pastCount} label="Previous" />
      </div>

      {/* Bookings List */}
      <div className="space-y-6">
        {bookings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-xl font-bold text-slate-800">No Reservations</h3>
            <p className="text-slate-400">Time to plan your next adventure!</p>
          </div>
        ) : (
          bookings.map((booking) => {
            const hotel = hotels[booking.hotelId];
            const room = booking.rooms?.[0];
            const isUpcoming = new Date(booking.checkInDate) > today && booking.status === "CONFIRMED";
            const hotelImage = hotel?.images?.[0] || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800";

            return (
              <div
                key={booking.bookingReference}
                className="group bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image Area */}
                  <div className="relative w-full md:w-72 h-52 md:h-auto overflow-hidden">
                    <img 
                      src={hotelImage} 
                      alt={booking.hotelName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Details Area */}
                  <div className="flex-1 p-6 lg:p-8 flex flex-col">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-extrabold text-slate-900 leading-tight">
                          {booking.hotelName}
                        </h3>
                        <div className="flex items-center text-slate-400 font-semibold">
                          <MapPin size={14} className="mr-1.5 text-indigo-500" />
                          <span className="text-xs uppercase tracking-wider">
                            {hotel ? `${hotel.location.city}, ${hotel.location.state}` : 'Fetching Location...'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>

                    {/* Data Points */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4 mb-8">
                      <Field label="Check-in" value={formatDate(booking.checkInDate)} />
                      <Field label="Check-out" value={formatDate(booking.checkOutDate)} />
                      <Field label="Guests" value={`${booking.totalGuests} Guest(s)`} />
                      <Field label="Total Paid" value={`₹${booking.totalAmount.toLocaleString('en-IN')}`} isPrice />
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-auto pt-6 border-t border-slate-50 flex flex-wrap items-center justify-between gap-4">
                      <div className="inline-flex items-center px-4 py-2 bg-slate-50 rounded-2xl text-slate-600 border border-slate-100 text-sm font-bold">
                        <Bed size={16} className="mr-2 text-indigo-500" />
                        {room?.roomType || "Standard Room"}
                      </div>

                      {isUpcoming && (
                        <button
                          onClick={() => cancelBooking(booking.bookingReference)}
                          className="px-6 py-2.5 text-sm font-black text-rose-600 bg-rose-50 rounded-2xl hover:bg-rose-100 transition-colors border border-rose-100 active:scale-95"
                        >
                          Cancel Stay
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

/* --- Styled Sub-components --- */

function StatCard({ color, value, label }) {
  const themes = {
    indigo: "from-indigo-500 to-blue-600 text-white",
    emerald: "from-emerald-400 to-teal-500 text-white",
    rose: "from-rose-400 to-pink-500 text-white"
  };

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${themes[color]} p-7 rounded-[2rem] shadow-lg transition-transform hover:-translate-y-1 duration-300`}>
      <div className="relative z-10">
        <div className="text-4xl font-black tracking-tighter">{value}</div>
        <div className="text-xs font-black uppercase tracking-widest opacity-80 mt-1">{label}</div>
      </div>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
}

function Field({ label, value, isPrice }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">{label}</p>
      <p className={`text-base font-bold ${isPrice ? 'text-indigo-600' : 'text-slate-700'}`}>
        {value}
      </p>
    </div>
  );
}