import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Clock, MapPin, Star, Phone, Mail, ArrowLeft, CheckCircle2,
  Users, Baby, ShieldCheck, PawPrint, CigaretteOff, IndianRupee,
  Calendar, Wifi, Coffee, Bed, Utensils, Car, Dumbbell
} from 'lucide-react';
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
        userName: userMap[r.userId] || "User"
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

  if (!hotel) return <div className="min-h-screen flex items-center justify-center">Hotel not found</div>;

  const images = hotel.images?.length ? hotel.images : FALLBACK_IMAGES;

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

      {/* HEADER IMAGES */}
      <div className="h-[40vh] md:h-[50vh] relative group">
        <div className="absolute top-6 left-6 z-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur hover:bg-white p-3 rounded-full shadow-lg transition text-slate-900"
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="grid grid-cols-4 h-full gap-1 p-1">
          <div className="col-span-2 relative overflow-hidden">
            <img src={images[0]} className="w-full h-full object-cover" alt="Main" />
          </div>
          <div className="col-span-1 relative overflow-hidden">
            <img src={images[1] || images[0]} className="w-full h-full object-cover" alt="Gallery 1" />
          </div>
          <div className="col-span-1 grid grid-rows-2 gap-1">
            <div className="relative overflow-hidden">
              <img src={images[2] || images[0]} className="w-full h-full object-cover" alt="Gallery 2" />
            </div>
            <div className="relative overflow-hidden">
              <img src={images[3] || images[0]} className="w-full h-full object-cover" alt="Gallery 3" />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer hover:bg-black/40 transition">
                <span className="text-white font-bold underline">View all photos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 -mt-10 relative z-10">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col md:flex-row gap-10">

          {/* LEFT CONTENT */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <RatingBadge rating={hotel.starRating} size="lg" />
              <span className="text-slate-500 text-sm font-medium flex items-center gap-1">
                <MapPin size={14} className="text-blue-500" /> {hotel.location.city}, {hotel.location.country}
              </span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 mb-4">{hotel.name}</h1>
            <p className="text-slate-600 leading-relaxed mb-8">{hotel.description}</p>

            <div className="mb-10">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Popular Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {hotel.facilities?.map((f, i) => (
                  <span key={i} className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl text-sm font-medium text-slate-700 border border-gray-100">
                    {getFacilityIcon(f)} {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 pt-8 mb-10">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Available Rooms</h3>
              <div className="space-y-4">
                {hotel.rooms.map(room => {
                  const availability = availabilityMap[room.roomId];
                  const isAvailable = availability?.available;
                  return (
                    <div key={room.roomId} className="border border-gray-200 rounded-2xl p-6 hover:border-blue-400 transition group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-xl font-bold text-slate-900 mb-1">{room.roomType}</h4>
                          <p className="text-slate-500 text-sm mb-3">{room.description}</p>
                          <div className="flex gap-4 text-xs font-semibold text-slate-600 mb-4">
                            <span className="flex items-center gap-1"><Users size={14} /> {room.maxAdults} Adults</span>
                            <span className="flex items-center gap-1"><Baby size={14} /> {room.maxChildren} Children</span>
                          </div>
                          <div className="flex gap-2">
                            {room.amenities.map(a => (
                              <span key={a} className="text-[10px] uppercase font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{a}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase mb-1">Per Night</p>
                          <PriceBox price={room.pricing.basePrice} />
                          <div
                            onClick={() => {
                              if (!isAvailable) return;
                              handleBookRoom(room);
                            }}
                          >
                            <button
                              disabled={!isAvailable}
                              className={clsx(
                                "mt-4 px-6 py-2.5 rounded-xl font-bold text-sm transition shadow-lg",
                                isAvailable
                                  ? "bg-slate-900 text-white hover:bg-blue-600"
                                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                              )}
                            >
                              {isAvailable ? "Book Now" : "Not Available"}
                            </button>
                            {!isAvailable && availability?.message && (
                              <p className="text-xs text-red-500 mt-2 font-medium">
                                {availability.message}
                              </p>
                            )}
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
          <div className="md:w-85 shrink-0">
            {/* <div className="sticky top-24 space-y-6"> OR below */}
            <div className="space-y-6">
              <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xl shadow-blue-900/5">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Book your stay</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Dates</label>
                    <DateRangePicker
                      checkIn={checkIn}
                      checkOut={checkOut}
                      setCheckIn={setCheckIn}
                      setCheckOut={setCheckOut}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Adults</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 flex items-center gap-3">
                      <Users size={16} className="text-slate-400" />
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Children</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 flex items-center gap-3">
                      <Baby size={16} className="text-slate-400" />
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

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Number of Rooms</label>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 flex items-center gap-3">
                      <Bed size={16} className="text-slate-400" />
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

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="text-blue-600 mt-0.5" />
                      <p className="text-xs text-blue-800 font-medium">Free cancellation until 24 hours before check-in.</p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Location / Map Placeholder */}
              <div className="mt-6">
                <HotelMap lat={lat} lng={lng} name={hotel.name} />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default HotelDetails;
