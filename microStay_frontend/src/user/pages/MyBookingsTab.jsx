import React, { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import api from "../../utils/api";
import BookingCard from "../components/BookingCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import ConfirmDialog from "../components/ConfirmDialog";

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  // Confirm Dialog State
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const res = await api.get("/bookings/my");
      const bookingList = res.data.bookings || [];
      setBookings(bookingList);

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
          const res = await api.get(`/hotels/${id}`);
          hotelData[id] = res.data;
        } catch (err) {
          // ignore
        }
      }
    }
    setHotels(hotelData);
  }

  const initiateCancel = (ref) => {
    setBookingToCancel(ref);
    setIsConfirmOpen(true);
  };

  async function handleConfirmCancel() {
    if (!bookingToCancel) return;
    try {
      await api.post(`/bookings/${bookingToCancel}/cancel`);
      alert("Booking cancelled successfully.");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed.");
    } finally {
      setIsConfirmOpen(false);
      setBookingToCancel(null);
    }
  }

  const filterBookings = () => {
    const today = new Date();
    return bookings.filter(b => {
      if (activeTab === 'ALL') return true;
      if (activeTab === 'UPCOMING') return new Date(b.checkInDate) > today && b.status !== 'CANCELLED';
      if (activeTab === 'COMPLETED') return new Date(b.checkOutDate) < today && b.status !== 'CANCELLED';
      if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
      return true;
    });
  };

  const filteredBookings = filterBookings();

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center py-10">
        <div className="max-w-5xl w-full px-6">
          <LoadingSkeleton type="list" count={5} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-6">

        <h1 className="text-3xl font-black text-slate-900 mb-2">My Bookings</h1>
        <p className="text-slate-500 mb-8">Manage your upcoming and past stays.</p>

        {/* TABS */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 border-b border-gray-200">
          {['ALL', 'UPCOMING', 'COMPLETED', 'CANCELLED'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition whitespace-nowrap ${
                    activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200' 
                    : 'bg-white text-slate-600 hover:bg-gray-100 border border-gray-200'
                 }`}
            >
              {tab === 'ALL' ? 'All Bookings' : tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {filteredBookings.length > 0 ? (
            filteredBookings.map(booking => (
              <BookingCard
                key={booking.bookingReference}
                booking={booking}
                hotel={hotels[booking.hotelId]}
                onCancel={() => initiateCancel(booking.bookingReference)}
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
              <Calendar className="mx-auto text-slate-300 mb-4" size={48} />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No bookings found</h3>
              <p className="text-slate-500 text-sm">You don't have any {activeTab.toLowerCase()} bookings.</p>
            </div>
          )}
        </div>

      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
      />

    </div>
  );
}