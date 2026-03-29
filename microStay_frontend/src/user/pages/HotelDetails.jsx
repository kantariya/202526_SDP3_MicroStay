import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Star, Phone, Mail, ArrowLeft, CheckCircle2,
  Users, Baby, ShieldCheck, PawPrint, CigaretteOff, IndianRupee,
  Calendar, Wifi, Coffee, Bed, Utensils, Car, Dumbbell, X, Heart, Link,
  Check, History
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import api from "../../utils/api";
import RatingBadge from '../components/RatingBadge';
import ReviewCard from '../components/ReviewCard';
import HotelMap from '../components/HotelMap';
import DateRangePicker from '../components/DateRangePicker';
import PriceBox from '../components/PriceBox';
import LoadingSkeleton from '../components/LoadingSkeleton';
import clsx from 'clsx';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
  'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'
];

const HotelDetails = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [copied, setCopied] = useState(false);

  // Review form state
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [editingReview, setEditingReview] = useState(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  // Booking State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [availabilityMap, setAvailabilityMap] = useState({});

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Set default dates (today + tomorrow)
  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setCheckIn(today.toISOString().split('T')[0]);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    fetchData();
  }, [hotelId]);

  useEffect(() => {
    if (!hotel || !checkIn || !checkOut) return;

    const checkAllRooms = async () => {
      const results = {};

      await Promise.all(
        hotel.rooms.map(async (room) => {
          try {
            const res = await api.post('/hotels/check-availability', {
              hotelId: hotel.id,
              roomId: room.roomId,
              checkInDate: checkIn,
              checkOutDate: checkOut,
              roomsRequired: numberOfRooms
            });

            results[room.roomId] = res.data;
          } catch {
            results[room.roomId] = {
              available: false,
              message: "Unable to check availability"
            };
          }
        })
      );

      setAvailabilityMap(results);
    };

    checkAllRooms();
  }, [hotel, checkIn, checkOut, numberOfRooms]);

  const fetchData = async () => {
    try {
      const [hotelRes, reviewRes] = await Promise.all([
        api.get(`/hotels/${hotelId}`),
        api.get(`/hotels/${hotelId}/reviews`)
      ]);

      setHotel(hotelRes.data);

      const reviews = reviewRes.data;

      // ✅ Get unique userIds
      const uniqueUserIds = [...new Set(reviews.map(r => r.userId))];

      // ✅ Fetch usernames
      const userMap = {};

      await Promise.all(
        uniqueUserIds.map(async (id) => {
          try {
            const res = await api.get(`/users/${id}/username`);
            userMap[id] = res.data;
          } catch {
            userMap[id] = "User";
          }
        })
      );

      // ✅ Attach username to each review
      const updatedReviews = reviews.map(r => ({
        ...r,
        userName: userMap[r.userId] || "Verified Guest"
      }));

      setReviews(updatedReviews);

      // ✅ fetch current user profile
      try {
        const me = await api.get('/users/profile');
        setCurrentUserId(me.data.id || me.data.userId || null);
      } catch (e) {
        // ignore
      }

    } catch (err) {
      console.error("Failed to load hotel info", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------- Review Handlers ----------
  const submitReview = async (e) => {
    e && e.preventDefault();
    setReviewError('');
    if (!reviewForm.rating || !reviewForm.comment.trim()) {
      setReviewError('Please provide rating and comment');
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (editingReview) {
        // update
        const rid = editingReview.id || editingReview.reviewId || editingReview._id;
        await api.put(`/hotels/${hotelId}/reviews/${rid}`, {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment.trim()
        });
        setEditingReview(null);
      } else {
        // create
        await api.post(`/hotels/${hotelId}/reviews`, {
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment.trim()
        });
      }

      // refresh reviews
      const res = await api.get(`/hotels/${hotelId}/reviews`);
      setReviews(res.data);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Review submit failed');
      setReviewError(err.response?.data?.message || err.response?.data || err.message || 'Failed to submit review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const startEditReview = (rev) => {
    setEditingReview(rev);
    setReviewForm({ rating: rev.rating || 5, comment: rev.comment || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setReviewForm({ rating: 5, comment: '' });
    setReviewError('');
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await api.delete(`/hotels/${hotelId}/reviews/${reviewId}`);
      const res = await api.get(`/hotels/${hotelId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error('Delete failed', err);
      alert(err.response?.data?.message || 'Failed to delete review');
    }
  };

  const handleBookRoom = (room) => {
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    // Validate capacity
    if (adults > room.maxAdults || children > room.maxChildren) {
      alert(`This room can accommodate max ${room.maxAdults} adults and ${room.maxChildren} children`);
      return;
    }

    // Calculate days
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    // Verify Availability API
    setLoading(true);
    api.post('/hotels/check-availability', {
      hotelId: hotel.id,
      roomId: room.roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      roomsRequired: numberOfRooms
    })
      .then((res) => {
        const data = res.data;

        if (!data.available) {
          // do nothing (UI will show message)
          return;
        }

        navigate('/booking/checkout', {
          state: {
            hotel,
            room,
            checkIn,
            checkOut,
            adults,
            children,
            numberOfRooms,
            days: diffDays,
            totalAmount: data.totalAmount
          }
        });
      })
      .catch(err => {
        alert(err.response?.data?.message || "Room not available for selected dates.");
      })
      .finally(() => setLoading(false));
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <LoadingSkeleton type="details" count={1} />
    </div>
  );

  if (!hotel) return <div className="min-h-screen flex items-center justify-center font-bold text-slate-400">Hotel not found in database</div>;

  const images = hotel.images || [];

  // Icon mapping for facilities
  const getFacilityIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('wifi')) return <Wifi size={16} className="text-blue-500" />;
    if (n.includes('break')) return <Coffee size={16} className="text-amber-600" />;
    if (n.includes('pool')) return <Bed size={16} className="text-cyan-500" />;
    if (n.includes('park')) return <Car size={16} className="text-slate-600" />;
    if (n.includes('gym')) return <Dumbbell size={16} className="text-red-500" />;
    if (n.includes('rest')) return <Utensils size={16} className="text-orange-500" />;
    return <CheckCircle2 size={16} className="text-green-500" />;
  };

  const lat = hotel?.location?.geo?.coordinates?.[1];
  const lng = hotel?.location?.geo?.coordinates?.[0];

  return (
    <div className="bg-white min-h-screen pb-20">

      {/* TOP HEADER SECTION */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-gray-100 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-slate-600 transition-all border border-gray-200 shadow-sm"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500">
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/dashboard')}>Home</span>
            <span className="text-gray-300">/</span>
            <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/search?city=${hotel.location.city}`)}>{hotel.location.city}</span>
            <span className="text-gray-300">/</span>
            <span className="text-slate-900">{hotel.name}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                {hotel.name}
              </h1>
              {hotel.brand && hotel.brand !== hotel.name && (
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider self-start mt-2">
                  {hotel.brand}
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-slate-900 rounded-lg border border-gray-100">
                <MapPin size={14} className="text-blue-500" />
                <span>
                  {[
                    hotel.location?.address,
                    hotel.location?.city,
                    hotel.location?.state,
                    hotel.location?.country,
                    hotel.location?.pincode
                  ].filter(Boolean).join(", ")}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100">
                <Star size={14} className="fill-current" />
                <span>{hotel.starRating} Star Hotel</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-100">
                <Star size={14} className="fill-current" />
                <span>
                  {hotel.ratingSummary?.average > 0
                    ? `${hotel.ratingSummary.average.toFixed(1)} (${hotel.ratingSummary.totalReviews} Reviews)`
                    : 'No Ratings Yet'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-slate-900 rounded-lg border border-gray-100">
                <Mail size={14} className="text-slate-400" />
                <span className="underline cursor-pointer">{hotel.contact?.email || hotel.email}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-slate-900 rounded-lg border border-gray-100">
                <Phone size={14} className="text-slate-400" />
                <span>{hotel.contact?.phone || hotel.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={handleShare}
              className="flex items-center gap-2.5 px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-slate-700 hover:bg-gray-50 transition shadow-sm active:scale-95 relative overflow-hidden group"
            >
              <div className={clsx(
                "flex items-center gap-2 transition-transform duration-300",
                copied ? "-translate-y-10" : "translate-y-0"
              )}>
                <Link size={18} className="text-blue-500" />
                <span>Share</span>
              </div>
              <div className={clsx(
                "absolute inset-0 flex items-center justify-center gap-2 bg-green-50 text-green-700 transition-transform duration-300",
                copied ? "translate-y-0" : "translate-y-10"
              )}>
                <Check size={18} />
                <span>Copied!</span>
              </div>
            </button>
            <button className="p-3 text-gray-400 hover:text-red-500 transition-colors active:scale-125">
              <Heart size={32} className="hover:fill-current transition-all duration-300" />
            </button>
          </div>
        </div>
      </div>

      {/* MODERN IMAGE GALLERY */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        {images.length > 0 ? (
          <div className="grid grid-cols-4 md:grid-cols-12 h-[50vh] md:h-[60vh] gap-3 rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/10">
            {/* Main Large Image */}
            <div className="col-span-4 md:col-span-8 relative overflow-hidden group">
              <img
                src={images[0]}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                alt="Main Feature"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Side Grids */}
            <div className="hidden md:grid md:col-span-4 grid-rows-2 gap-3">
              <div className="grid grid-cols-2 gap-3 rows-span-1">
                <div className="relative overflow-hidden group">
                  <img src={images[1] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 1" />
                </div>
                <div className="relative overflow-hidden group">
                  <img src={images[2] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 2" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 rows-span-1">
                <div className="relative overflow-hidden group">
                  <img src={images[3] || images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Gallery 3" />
                </div>
                <div className="relative overflow-hidden group bg-slate-100">
                  {images[4] && (
                    <img src={images[4]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60" alt="Gallery 4" />
                  )}
                  <div
                    onClick={() => setShowGallery(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-black/10 transition group/btn"
                  >
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl font-bold text-slate-900 shadow-xl group-hover/btn:scale-110 transition">
                      Show all {images.length} photos
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-[40vh] bg-slate-50 border border-dashed border-slate-200 rounded-[32px] flex flex-col items-center justify-center text-slate-400 gap-4">
            <X size={48} className="opacity-20" />
            <p className="font-bold">No photos available for this property</p>
          </div>
        )}
      </div>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT CONTENT */}
          <div className="flex-1 min-w-0">
            <div className="mb-12">
              <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full" />
                Overview
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-8">
                {hotel.description}
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <ShieldCheck size={24} className="text-blue-600" />
                Top Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.facilities?.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl text-sm font-semibold text-slate-700 border border-gray-100 shadow-sm hover:border-blue-100 hover:shadow-md transition">
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition">
                      {getFacilityIcon(f)}
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <ShieldCheck size={24} className="text-blue-600" />
                Hotel Policies & Timings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                    <Clock size={18} className="text-blue-500" />
                    Check-in / Check-out
                  </div>
                  <div className="space-y-3 text-sm font-semibold text-slate-600">
                    <div className="flex justify-between items-center px-4 py-2 bg-white rounded-xl">
                      <span>Check-in From</span>
                      <span className="text-slate-900">{hotel.checkInTime || 'Not specified'}</span>
                    </div>
                    <div className="flex justify-between items-center px-4 py-2 bg-white rounded-xl">
                      <span>Check-out Until</span>
                      <span className="text-slate-900">{hotel.checkOutTime || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-[24px] border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-2 mb-4 text-slate-900 font-bold">
                    <ShieldCheck size={18} className="text-blue-500" />
                    Hotel Rules
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className={clsx(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border transition",
                      hotel.policies?.petsAllowed ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                    )}>
                      <PawPrint size={20} className="mb-2" />
                      <span className="text-[10px] font-black uppercase">Pets {hotel.policies?.petsAllowed ? 'Allowed' : 'Not Allowed'}</span>
                    </div>
                    <div className={clsx(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border transition",
                      hotel.policies?.smokingAllowed ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                    )}>
                      <CigaretteOff size={20} className="mb-2" />
                      <span className="text-[10px] font-black uppercase">Smoking {hotel.policies?.smokingAllowed ? 'Allowed' : 'Not Allowed'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-12 mb-12">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <Bed size={28} className="text-blue-600" />
                Available Rooms
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {hotel.rooms.map(room => {
                  const availability = availabilityMap[room.roomId];
                  const isAvailable = availability?.available;
                  return (
                    <div key={room.roomId} className="bg-white border border-gray-100 rounded-[32px] p-8 hover:border-blue-200 transition-all shadow-sm hover:shadow-xl group">
                      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        {/* Left Side: Room Details */}
                        <div className="flex-1 w-full md:w-auto">
                          <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">{room.roomType}</h4>
                          <p className="text-slate-500 text-sm font-medium mb-4">{room.description}</p>

                          <div className="flex items-center gap-4 mb-4">
                            <div className="flex items-center gap-1.5 text-slate-600 text-sm font-bold">
                              <Users size={16} className="text-slate-400" />
                              {room.maxAdults} Adults
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-600 text-sm font-bold">
                              <Baby size={16} className="text-slate-400" />
                              {room.maxChildren} Children
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {room.amenities.slice(0, 4).map(a => (
                              <span key={a} className="text-[10px] uppercase font-black bg-slate-50 text-slate-500 px-3 py-1.5 rounded-lg border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition tracking-wider">
                                {a}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right Side: Pricing & Action */}
                        <div className="flex flex-col items-center md:items-end gap-6 min-w-[200px] w-full md:w-auto">
                          <div className="text-center md:text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">PER NIGHT</p>
                            <div className="flex items-baseline justify-center md:justify-end gap-1">
                              <span className="text-3xl font-black text-slate-900">₹{room.pricing.basePrice}</span>
                              <span className="text-slate-500 text-sm font-bold">/night</span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">+ taxes & fees</p>
                          </div>

                          <div className="flex flex-col items-center md:items-end gap-2 w-full">
                            {!isAvailable && availability?.message && (
                              <p className="text-[10px] text-red-500 font-bold bg-red-50 px-3 py-1.5 rounded-xl border border-red-50 flex items-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                {availability.message}
                              </p>
                            )}
                            <button
                              onClick={() => isAvailable && handleBookRoom(room)}
                              disabled={!isAvailable}
                              className={clsx(
                                "w-full md:w-auto px-10 py-4 rounded-2xl font-black text-sm transition-all active:scale-95 shadow-xl",
                                isAvailable
                                  ? "bg-slate-900 text-white hover:bg-black hover:-translate-y-1 shadow-slate-900/10"
                                  : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                              )}
                            >
                              {isAvailable ? "Book Now" : "Not Available"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* REVIEWS */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-6">Guest Reviews</h3>

              {/* Reviews List */}
              {reviews.length > 0 ? (
                <div className="grid gap-4">
                  {reviews.map((rev) => (
                    <ReviewCard key={rev.id || rev.reviewId || rev._id} review={rev} onDelete={deleteReview} onEdit={startEditReview} currentUserId={currentUserId} />
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No reviews yet. Be the first to review.</p>
              )}

              {/* Add / Edit Review Form */}
              <div className="mt-2.5 bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
                <h4 className="text-sm font-bold text-slate-800 mb-2">{editingReview ? 'Edit Your Review' : 'Write a Review'}</h4>
                <form onSubmit={submitReview} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">Rating</label>
                    <select
                      value={reviewForm.rating}
                      onChange={e => setReviewForm(prev => ({ ...prev, rating: e.target.value }))}
                      className="text-[#1A1A1A] ml-2 bg-white border rounded px-3 py-2 text-sm"
                    >
                      {[5, 4, 3, 2, 1].map(r => (
                        <option key={r} value={r}>{r} ★</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase">Comment</label>
                    <textarea
                      value={reviewForm.comment}
                      onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                      rows={3}
                      className="text-[#1A1A1A] w-full mt-2 border border-gray-200 rounded-lg p-3 text-sm resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>

                  {reviewError && <div className="text-red-600 text-sm">{reviewError}</div>}

                  <div className="flex items-center gap-3">
                    <button type="submit" disabled={isSubmittingReview} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">
                      {isSubmittingReview ? 'Saving...' : (editingReview ? 'Update Review' : 'Submit Review')}
                    </button>
                    {editingReview && (
                      <button type="button" onClick={cancelEdit} className="text-sm text-slate-600">Cancel</button>
                    )}
                  </div>
                </form>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR (Booking Widget) */}
          <aside className="lg:w-[400px] shrink-0">
            <div className="sticky top-28 space-y-8">
              <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-2xl shadow-blue-900/5 hover:shadow-blue-900/10 transition-all duration-500">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
                  <h3 className="text-xl font-black text-slate-900">Book your stay</h3>
                </div>

                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Check-in / Check-out</label>
                    <DateRangePicker
                      checkIn={checkIn}
                      checkOut={checkOut}
                      setCheckIn={setCheckIn}
                      setCheckOut={setCheckOut}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Adults</label>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:bg-white focus-within:border-blue-200 transition">
                        <Users size={16} className="text-blue-500" />
                        <select
                          value={adults}
                          onChange={e => setAdults(Number(e.target.value))}
                          className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none"
                        >
                          {[1, 2, 3, 4, 5, 6].map(num => (
                            <option key={num} value={num}>{num} Adult{num > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Children</label>
                      <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:bg-white focus-within:border-blue-200 transition">
                        <Baby size={16} className="text-blue-500" />
                        <select
                          value={children}
                          onChange={e => setChildren(Number(e.target.value))}
                          className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none"
                        >
                          {[0, 1, 2, 3, 4].map(num => (
                            <option key={num} value={num}>{num} {num === 1 ? 'Child' : 'Children'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Number of Rooms</label>
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-3 focus-within:bg-white focus-within:border-blue-200 transition">
                      <Bed size={16} className="text-blue-500" />
                      <select
                        value={numberOfRooms}
                        onChange={e => setNumberOfRooms(Number(e.target.value))}
                        className="bg-transparent w-full text-sm font-bold text-slate-900 outline-none"
                      >
                        {[1, 2, 3, 4, 5].map(num => (
                          <option key={num} value={num}>{num} Room{num > 1 ? 's' : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 mt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 size={18} className="text-blue-600 mt-0.5 shrink-0" />
                      <p className="text-xs text-blue-800 font-bold leading-relaxed">
                        {hotel.policies?.cancellation || 'Cancellation policy not specified.'}
                        <span className="underline cursor-pointer ml-1">Learn more</span>
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Location / Map */}
              <div className="rounded-[32px] overflow-hidden border border-gray-100 shadow-xl">
                <div className="p-6 bg-white border-b border-gray-50">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <MapPin size={16} className="text-blue-600" />
                    Hotel Location
                  </h4>
                </div>
                <div className="h-64 relative group rounded-2xl overflow-hidden">
                  <HotelMap lat={lat} lng={lng} name={hotel.name} />
                  <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-[1000] pointer-events-none group-hover:bg-black/20 transition-all">
                    <button
                      onClick={() => setShowMap(true)}
                      className="pointer-events-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-2xl hover:bg-blue-700 hover:scale-110 active:scale-95 transition-all flex items-center gap-2 border border-white/20"
                    >
                      <MapPin size={18} />
                      Show on map
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* PHOTO GALLERY MODAL */}
      <AnimatePresence>
        {showGallery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center p-6 md:p-10"
          >
            <div className="w-full max-w-7xl flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-white">{hotel.name}</h2>
                <p className="text-slate-400 text-sm font-medium">{images.length} Photos Available</p>
              </div>
              <button
                onClick={() => setShowGallery(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="w-full max-w-7xl overflow-y-auto custom-scrollbar pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                {images.map((img, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-slate-800 border border-white/5"
                  >
                    <img
                      src={img}
                      alt={`Gallery ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                      <span className="text-white text-xs font-bold uppercase tracking-wider">Photo {i + 1}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL SCREEN MAP MODAL */}
      <AnimatePresence>
        {showMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-md flex flex-col items-center p-6 md:p-10"
          >
            <div className="w-full max-w-7xl flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-black text-white">Location on Map</h2>
                <p className="text-slate-400 text-sm font-medium">{hotel.name} - {hotel.location.city}</p>
              </div>
              <button
                onClick={() => setShowMap(false)}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 group"
              >
                <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            <div className="w-full max-w-7xl h-full rounded-3xl overflow-hidden shadow-2xl relative">
              <HotelMap lat={lat} lng={lng} name={hotel.name} />
              
              {/* Reset/Recenter indicator or zoom? Leaflet has those. */}
              <div className="absolute bottom-6 left-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl max-w-xs border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 text-white p-2 rounded-lg">
                    <MapPin size={18} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Property Location</h3>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {[hotel.location.address, hotel.location.city, hotel.location.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default HotelDetails;
