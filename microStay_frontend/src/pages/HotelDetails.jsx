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
  CigaretteOff
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
                  <div className="flex justify-between items-start">
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

                    <div className="text-right">
                      <p className="text-xs uppercase font-semibold text-slate-600">
                        Per Night
                      </p>
                      <p className="text-3xl font-extrabold text-blue-700">
                        ₹{room.pricing.basePrice}
                      </p>
                      <button className="mt-4 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition">
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
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
