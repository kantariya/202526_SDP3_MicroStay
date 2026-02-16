import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Clock,
  MapPin,
  Star,
  Phone,
  Mail,
  Send,
  ArrowLeft,
  CheckCircle2,
  Users,
  Baby,
  ShieldCheck,
  PawPrint,
  CigaretteOff,
  CreditCard,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../utils/api';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
];

const HotelDetails = () => {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [usernames, setUsernames] = useState({});

  // Booking / payment flow state
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    checkInDate: "",
    checkOutDate: "",
    rooms: 1,
    adults: 2,
    children: 0,
    fullName: "",
    email: "",
    phone: "",
  });
  const [bookingResponse, setBookingResponse] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [latestPaymentStatus, setLatestPaymentStatus] = useState(null);
  const [mockResult, setMockResult] = useState("SUCCESS");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [flowError, setFlowError] = useState("");



  useEffect(() => {
    fetchData();
  }, [hotelId]);

  const fetchData = async () => {
    try {
      const hotelRes = await api.get(`/hotels/${hotelId}`);
      const reviewRes = await api.get(`/hotels/${hotelId}/reviews`);

      setHotel(hotelRes.data);
      setReviews(reviewRes.data);

      //  Fetch usernames
      await fetchUsernames(reviewRes.data);

    } catch (err) {
      console.error("Failed to load hotel info", err);
    }
  };

  const fetchUsernames = async (reviews) => {
    // Get unique userIds
    const uniqueUserIds = [...new Set(reviews.map(r => r.userId))];

    const usernameMap = {};

    await Promise.all(
      uniqueUserIds.map(async (id) => {
        try {
          const res = await api.get(`/users/${id}/username`);
          usernameMap[id] = res.data;
        } catch {
          usernameMap[id] = `User #${id}`;
        }
      })
    );

    setUsernames(usernameMap);
  };



  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-600">
        Loading hotel details...
      </div>
    );
  }

  const images = hotel.images?.length ? hotel.images : FALLBACK_IMAGES;
  const [lng, lat] = hotel.location.geo.coordinates;


  const role = localStorage.getItem('role');

  const handleRoomSelectForBooking = (room) => {
    setSelectedRoom(room);
    setBookingResponse(null);
    setPaymentResponse(null);
    setBookingStatus(null);
    setLatestPaymentStatus(null);
    setFlowError("");

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    setBookingForm((prev) => ({
      ...prev,
      checkInDate: prev.checkInDate || today.toISOString().split('T')[0],
      checkOutDate: prev.checkOutDate || tomorrow.toISOString().split('T')[0],
    }));
  };

  const handleBookingFormChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: name === 'rooms' || name === 'adults' || name === 'children'
        ? Number(value)
        : value,
    }));
  };

  const initiateBooking = async (e) => {
    e.preventDefault();
    if (!selectedRoom) {
      setFlowError("Please select a room to book.");
      return;
    }
    if (!bookingForm.checkInDate || !bookingForm.checkOutDate) {
      setFlowError("Please select check-in and check-out dates.");
      return;
    }
    if (!bookingForm.fullName || !bookingForm.email || !bookingForm.phone) {
      setFlowError("Please fill guest name, email and phone.");
      return;
    }

    setBookingLoading(true);
    setFlowError("");

    try {
      const payload = {
        hotelId: String(hotel.id),
        hotelName: hotel.name,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        rooms: [
          {
            roomId: String(selectedRoom.roomId),
            roomType: selectedRoom.roomType,
            pricePerNight: selectedRoom.pricing?.basePrice,
            numberOfRooms: bookingForm.rooms,
            adults: bookingForm.adults,
            children: bookingForm.children,
          },
        ],
        guestDetails: {
          fullName: bookingForm.fullName,
          email: bookingForm.email,
          phone: bookingForm.phone,
        },
      };

      const res = await api.post('/bookings/initiate', payload);
      setBookingResponse(res.data);
      setBookingStatus(null);
      setLatestPaymentStatus(null);
      setFlowError("");

      // Persist for /bookings page
      try {
        sessionStorage.setItem('lastBooking', JSON.stringify(res.data));
      } catch {
        // ignore
      }
    } catch (err) {
      console.error("Booking failed", err);

      setFlowError(err.message || "Failed to create booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const performPayment = async () => {
    if (!bookingResponse) {
      setFlowError("Create a booking before making payment.");
      return;
    }
    setPaymentLoading(true);
    setFlowError("");
    try {
      const res = await api.post('/payments', {
        bookingId: bookingResponse.bookingId,
        amount: bookingResponse.totalAmount,
        currency: bookingResponse.currency,
        paymentGateway: "MOCK",
        mockResult,
      });
      setPaymentResponse(res.data);

      // Immediately refresh statuses so user sees CONFIRMED / INITIATED
      await refreshStatuses(res.data.bookingId, bookingResponse.bookingReference);
    } catch (err) {
      console.error("Payment failed", err);
      setFlowError(err.message || "Payment failed. Please try again.");
    } finally {
      setPaymentLoading(false);
    }
  };

  const refreshStatuses = async (
    bookingIdOverride,
    bookingRefOverride
  ) => {
    if (!bookingResponse && !bookingRefOverride) return;
    const bookingRef = bookingRefOverride || bookingResponse.bookingReference;
    const bookingId = bookingIdOverride || bookingResponse.bookingId;

    setStatusLoading(true);
    setFlowError("");

    try {
      const [bookingRes, paymentRes] = await Promise.all([
        api.get(`/bookings/${bookingRef}`),
        api.get(`/payments/booking/${bookingId}`),
      ]);
      setBookingStatus(bookingRes.data);
      setLatestPaymentStatus(paymentRes.data);
    } catch (err) {
      console.error("Status fetch failed", err);
      setFlowError(err.message || "Failed to fetch latest booking/payment status.");
    } finally {
      setStatusLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim() || rating === 0) {
      alert("Please add rating and comment");
      return;
    }

    try {
      await api.post(`/hotels/${hotelId}/reviews`, {
        rating,
        comment
      });

      setComment("");
      setRating(0);
      fetchData();
    } catch (err) {
      alert("Failed to post review");
    }
  };


  const StarRatingInput = ({ rating, setRating }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={`cursor-pointer transition ${star <= rating ? 'text-amber-500' : 'text-slate-300'
            }`}
          fill={star <= rating ? 'currentColor' : 'none'}
          onClick={() => setRating(star)}
        />
      ))}
    </div>
  );


  const deleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) return;

    try {
      await api.delete(`/hotels/${hotelId}/reviews/${reviewId}`);
      fetchData();
    } catch (err) {
      alert("Failed to delete review");
    }
  };



  return (
    <div className="bg-white pb-20 text-slate-900">

      {/* TOP BAR */}
      <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-slate-900"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600">
          {hotel.brand}
        </span>
      </div>

      <main className="max-w-7xl mx-auto px-6">

        {/* ================= PHOTOS ================= */}
        <section className="grid grid-cols-4 gap-4 h-80 mb-12">
          {images.slice(0, 4).map((img, i) => (
            <div
              key={i}
              className={`${i === 0 ? 'col-span-2' : 'col-span-1'} rounded-3xl overflow-hidden`}
            >
              <img
                src={img}
                alt="Hotel"
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />
            </div>
          ))}
        </section>

        {/* ================= HEADER ================= */}
        <section className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Star size={12} fill="currentColor" /> {hotel.starRating} Star
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-slate-700">
              <MapPin size={14} />
              {hotel.location.city}, {hotel.location.state}
            </span>
          </div>

          <h1 className="text-5xl font-extrabold mb-3">{hotel.name}</h1>
          <p className="text-slate-700 text-lg max-w-3xl">{hotel.description}</p>

          {/* CONTACT + ADDRESS */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-200">
            <div className="space-y-2 font-semibold">
              <p className="flex items-center gap-2">
                <Phone size={16} /> {hotel.contact.phone}
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} /> {hotel.contact.email}
              </p>
            </div>

            <div className="text-slate-700 font-medium">
              <p>{hotel.location.address}</p>
              <p>{hotel.location.city}, {hotel.location.state}</p>
              <p>{hotel.location.country} – {hotel.location.pincode}</p>
            </div>
          </div>
        </section>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-12">

            {/* CHECK IN / OUT */}
            <div className="flex gap-16 border-y border-gray-200 py-6">
              <div className="flex gap-4 items-center">
                <Clock className="text-blue-600" />
                <div>
                  <p className="text-xs uppercase font-semibold text-slate-600">Check-In</p>
                  <p className="text-lg font-semibold">{hotel.checkInTime}</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <Clock className="text-blue-600" />
                <div>
                  <p className="text-xs uppercase font-semibold text-slate-600">Check-Out</p>
                  <p className="text-lg font-semibold">{hotel.checkOutTime}</p>
                </div>
              </div>
            </div>

            {/* FACILITIES */}
            <div>
              <h3 className="text-2xl font-extrabold mb-4">Facilities</h3>
              <div className="flex flex-wrap gap-4">
                {hotel.facilities.map(f => (
                  <span key={f} className="flex items-center gap-2 font-semibold text-slate-700">
                    <CheckCircle2 size={14} className="text-green-600" /> {f}
                  </span>
                ))}
              </div>
            </div>

            {/* POLICIES */}
            <div>
              <h3 className="text-2xl font-extrabold mb-4">Policies</h3>
              <ul className="space-y-3 text-slate-700 font-medium">
                <li className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  {hotel.policies.cancellation}
                </li>
                <li className="flex items-center gap-2">
                  <PawPrint size={16} className="text-blue-600" />
                  Pets Allowed: {hotel.policies.petsAllowed ? "Yes" : "No"}
                </li>
                <li className="flex items-center gap-2">
                  <CigaretteOff size={16} className="text-blue-600" />
                  Smoking Allowed: {hotel.policies.smokingAllowed ? "Yes" : "No"}
                </li>
              </ul>
            </div>

            {/* ROOMS */}
            <div>
              <h3 className="text-2xl font-extrabold mb-6">Available Rooms</h3>

              {hotel.rooms.map(room => (
                <div
                  key={room.roomId}
                  className="border border-gray-200 rounded-3xl p-6 mb-4 hover:border-blue-300 transition"
                >
                  <div className="flex justify-between items-start gap-6">
                    <div>
                      <h4 className="text-xl font-extrabold tracking-wide">
                        {room.roomType}
                      </h4>
                      <p className="text-slate-700 text-sm mt-1">
                        {room.description}
                      </p>

                      <div className="flex gap-6 mt-3 text-sm font-medium">
                        <span className="flex gap-1 items-center">
                          <Users size={14} /> {room.maxAdults} Adults
                        </span>
                        <span className="flex gap-1 items-center">
                          <Baby size={14} /> {room.maxChildren} Children
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-3 mt-4">
                        {room.amenities.map(a => (
                          <span
                            key={a}
                            className="text-xs font-semibold uppercase text-slate-600"
                          >
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-right min-w-[180px]">
                      <p className="text-xs uppercase font-semibold text-slate-600">
                        Per Night
                      </p>
                      <p className="text-3xl font-extrabold text-blue-700 flex items-center justify-end gap-1">
                        <IndianRupee size={18} />
                        {room.pricing.basePrice}
                      </p>
                      <button
                        className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition"
                        onClick={() => handleRoomSelectForBooking(room)}
                      >
                        {selectedRoom?.roomId === room.roomId ? 'Selected' : 'Book Now'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* BOOKING & PAYMENT FLOW */}
            <div className="mt-10 border border-gray-200 rounded-3xl p-6 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <CreditCard size={22} className="text-blue-600" />
                  Book & Pay
                </h3>
                {bookingResponse && (
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                    Booking created: {bookingResponse.bookingReference}
                  </span>
                )}
              </div>

              {flowError && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {flowError}
                </div>
              )}

              {!selectedRoom && (
                <p className="text-sm text-slate-600 mb-4">
                  Select a room type above to start booking.
                </p>
              )}

              {/* STEP 1 – BOOKING FORM */}
              <form
                onSubmit={initiateBooking}
                className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!selectedRoom ? 'opacity-60 pointer-events-none' : ''
                  }`}
              >
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Step 1 · Stay Details
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Check-In</label>
                      <input
                        type="date"
                        name="checkInDate"
                        value={bookingForm.checkInDate}
                        onChange={handleBookingFormChange}
                        className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Check-Out</label>
                      <input
                        type="date"
                        name="checkOutDate"
                        value={bookingForm.checkOutDate}
                        onChange={handleBookingFormChange}
                        className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Rooms</label>
                      <input
                        type="number"
                        min={1}
                        name="rooms"
                        value={bookingForm.rooms}
                        onChange={handleBookingFormChange}
                        className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Adults</label>
                      <input
                        type="number"
                        min={1}
                        name="adults"
                        value={bookingForm.adults}
                        onChange={handleBookingFormChange}
                        className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Children</label>
                      <input
                        type="number"
                        min={0}
                        name="children"
                        value={bookingForm.children}
                        onChange={handleBookingFormChange}
                        className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Guest Details
                  </p>

                  <div>
                    <label className="text-xs font-semibold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={bookingForm.fullName}
                      onChange={handleBookingFormChange}
                      className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      placeholder="Primary guest name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={bookingForm.email}
                        onChange={handleBookingFormChange}
                        className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={bookingForm.phone}
                        onChange={handleBookingFormChange}
                        className="mt-1 w-full rounded-2xl border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="mt-2 inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {bookingLoading ? 'Creating booking...' : 'Create Booking'}
                  </button>
                </div>
              </form>

              {/* STEP 2 – MOCK PAYMENT */}
              <div
                className={`mt-6 pt-4 border-t border-dashed border-gray-200 ${!bookingResponse ? 'opacity-60 pointer-events-none' : ''
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Step 2 · Mock Payment
                  </p>
                  {bookingResponse && (
                    <div className="text-xs text-slate-600">
                      Booking ID:
                      <span className="font-semibold text-slate-900 ml-1">
                        {bookingResponse.bookingId}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-600">Mock result:</span>
                    <div className="inline-flex rounded-full bg-white border border-gray-200 p-1">
                      <button
                        type="button"
                        onClick={() => setMockResult("SUCCESS")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${mockResult === 'SUCCESS'
                          ? 'bg-emerald-500 text-white'
                          : 'text-slate-700'
                          }`}
                      >
                        SUCCESS
                      </button>
                      <button
                        type="button"
                        onClick={() => setMockResult("FAILED")}
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${mockResult === 'FAILED'
                          ? 'bg-red-500 text-white'
                          : 'text-slate-700'
                          }`}
                      >
                        FAILED
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={performPayment}
                    disabled={paymentLoading}
                    className="inline-flex items-center justify-center rounded-2xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition disabled:opacity-60"
                  >
                    {paymentLoading ? 'Processing...' : 'Pay with Mock Gateway'}
                  </button>

                  {paymentResponse && (
                    <span className="text-xs font-semibold rounded-full px-3 py-1 bg-slate-900 text-white flex items-center gap-1">
                      Status:
                      <span className="uppercase">
                        {paymentResponse.status}
                      </span>
                    </span>
                  )}
                </div>
              </div>

              {/* STEP 3 – STATUS CHECK */}
              <div
                className={`mt-6 pt-4 border-t border-dashed border-gray-200 ${!bookingResponse ? 'opacity-60 pointer-events-none' : ''
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                    Step 3 · Status
                  </p>
                  {statusLoading && (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <RefreshCw size={14} className="animate-spin" /> Refreshing
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => refreshStatuses()}
                  disabled={statusLoading}
                  className="inline-flex items-center justify-center rounded-2xl border border-gray-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-gray-100 transition disabled:opacity-60"
                >
                  <RefreshCw size={14} className="mr-2" />
                  Refresh booking & payment status
                </button>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      Booking
                    </p>
                    {bookingStatus ? (
                      <div>
                        <p className="font-semibold text-slate-900">
                          {bookingStatus.hotelName}
                        </p>
                        <p className="mt-1">
                          Ref:
                          <span className="font-mono text-xs ml-1">
                            {bookingStatus.bookingReference}
                          </span>
                        </p>
                        <p className="mt-1">
                          Status:
                          <span className="ml-1 font-semibold uppercase">
                            {bookingStatus.status}
                          </span>
                        </p>
                        <p className="mt-1 flex items-center gap-1">
                          <IndianRupee size={14} />
                          <span className="font-semibold">
                            {bookingStatus.totalAmount} {bookingStatus.currency}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500">
                        Status will appear here after refresh.
                      </p>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-4">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      Payment
                    </p>
                    {latestPaymentStatus ? (
                      <div>
                        <p className="mt-1">
                          Payment ID:
                          <span className="font-mono text-xs ml-1">
                            {latestPaymentStatus.paymentId}
                          </span>
                        </p>
                        <p className="mt-1">
                          Status:
                          <span className="ml-1 font-semibold uppercase">
                            {latestPaymentStatus.status}
                          </span>
                        </p>
                        <p className="mt-1 flex items-center gap-1">
                          <IndianRupee size={14} />
                          <span className="font-semibold">
                            {latestPaymentStatus.amount} {latestPaymentStatus.currency}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500">
                        Status will appear here after refresh.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <aside className="bg-gray-50 rounded-3xl p-8 h-fit sticky top-24">
            <h3 className="text-xl font-extrabold mb-4 text-slate-900">
              Guest Reviews
            </h3>

            {/* REVIEW LIST */}
            <div className="space-y-4 mb-8">
              {reviews.length > 0 ? (
                reviews.map((r) => (
                  <div
                    key={r.id}
                    className="bg-white p-4 rounded-2xl border border-gray-200"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {usernames[r.userId] || `User #${r.userId}`}
                        </p>

                        <div className="flex text-amber-500 mt-1">
                          {Array(r.rating).fill(0).map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" />
                          ))}
                        </div>
                      </div>

                      {/* ✅ DELETE BUTTON */}
                      {role === 'ADMIN' && (
                        <button
                          onClick={() => deleteReview(r.id)}
                          className="text-xs font-semibold text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      )}
                    </div>

                    <p className="text-sm text-slate-700 italic mt-3">
                      "{r.comment}"
                    </p>

                    <p className="text-xs text-slate-500 mt-2">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                ))
              ) : (
                <p className="text-sm italic text-slate-600">
                  No reviews yet
                </p>
              )}
            </div>

            {/* ADD REVIEW */}
            <form onSubmit={submitReview} className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                Add your review
              </p>

              {/* STAR INPUT */}
              <StarRatingInput rating={rating} setRating={setRating} />

              <textarea
                className="w-full p-4 rounded-2xl border border-gray-300 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="Share your experience..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-slate-900 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition"
              >
                Post Review
              </button>
            </form>
          </aside>



        </div>

        {/* ================= MAP LAST ================= */}
        <section className="mt-16">
          <h3 className="text-2xl font-extrabold mb-4">Location on Map</h3>
          <div className="h-80 rounded-3xl overflow-hidden border border-gray-200">
            <MapContainer center={[lat, lng]} zoom={13} className="h-full w-full">
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lat, lng]}>
                <Popup>
                  <strong>{hotel.name}</strong><br />
                  {hotel.location.address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </section>

      </main>
    </div>
  );
};

export default HotelDetails;
