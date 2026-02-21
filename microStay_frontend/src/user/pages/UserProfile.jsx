import React, { useState, useEffect } from 'react';
import {
  UserCircle, Calendar, MapPin, Star, Settings, Bell, Shield,
  Mail, Phone, Home, Edit2, Save, X, ChevronRight, Plus, LogOut
} from 'lucide-react';
import api from "../../utils/api";
import BookingCard from '../components/BookingCard';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // 1. Get User Details (Mock ID or from Token if backend supports /users/me)
      // Assuming we have the ID stored or endpoint returns current user
      const userId = localStorage.getItem('userId');
      // 1. Get User Details
      const userRes = await api.get('/users/profile');

      setUser(userRes.data);
      setEditForm(userRes.data);

      // 2. Get Bookings
      const bookRes = await api.get('/bookings/my');
      setBookings(bookRes.data.bookings || []);

    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    try {
      // Strict API Enforcement: PUT /users/profile is not in the allowed list for User Frontend.
      // Editing is disabled for now.
      alert("Profile editing is currently disabled.");
      setIsEditing(false);
    } catch (err) {
      console.error("Profile update disabled");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading profile...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in</div>;

  const NavButton = ({ tab, icon: Icon, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center w-full p-3 rounded-xl transition-all \${
        activeTab === tab ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-gray-50 font-medium'
      }`}
    >
      <Icon className="mr-3" size={20} />
      <span>{label}</span>
      {count !== undefined && (
        <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
          {count}
        </span>
      )}
      {count === undefined && <ChevronRight className="ml-auto opacity-50" size={18} />}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">

      {/* Header Pattern */}
      <div className="bg-slate-900 h-40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT SIDEBAR */}
          <div className="lg:w-1/3 space-y-6">

            {/* User Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-blue-900/5 p-6 border border-gray-100">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center overflow-hidden">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-slate-400">{user.name?.[0]}</span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                    {user.role || 'Member'}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-slate-900">{user.name}</h2>
                <p className="text-slate-500 font-medium mb-6">{user.email}</p>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-2xl font-black text-blue-600">{bookings.length}</p>
                    <p className="text-xs font-bold text-blue-400 uppercase">Bookings</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
                    <p className="text-2xl font-black text-purple-600">0</p>
                    <p className="text-xs font-bold text-purple-400 uppercase">Reviews</p>
                  </div>
                </div>

                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 text-red-600 font-bold bg-red-50 py-3 rounded-xl hover:bg-red-100 transition">
                  <LogOut size={18} /> Sign Out
                </button>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
              <nav className="space-y-1">
                <NavButton tab="profile" icon={UserCircle} label="Profile Details" />
                <NavButton tab="bookings" icon={Calendar} label="My Bookings" count={bookings.length} />
                <NavButton tab="preferences" icon={Star} label="Preferences" />
                <NavButton tab="notifications" icon={Bell} label="Notifications" />
                <NavButton tab="security" icon={Shield} label="Security" />
              </nav>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:w-2/3">

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">Profile Details</h2>
                    <p className="text-slate-500">Update your personal information</p>
                  </div>
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-xl hover:bg-blue-100 transition">
                      <Edit2 size={16} /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={handleSaveProfile} className="flex items-center gap-2 text-white font-bold bg-green-600 px-4 py-2 rounded-xl hover:bg-green-700 transition">
                        <Save size={16} /> Save
                      </button>
                      <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 text-slate-600 font-bold bg-gray-100 px-4 py-2 rounded-xl hover:bg-gray-200 transition">
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <UserCircle size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.name || ''}
                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Mail size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.email || ''}
                        onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Phone</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Phone size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.phone || ''}
                        onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                        placeholder="Add phone number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Address</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <Home size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.address || ''}
                        onChange={e => setEditForm({ ...editForm, address: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                        placeholder="Add address"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BOOKINGS TAB */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                {bookings.length > 0 ? (
                  bookings.map(booking => (
                    <BookingCard key={booking.id} booking={booking} hotel={{ name: booking.hotelName, location: { city: 'Unknown' } }} />
                  ))
                ) : (
                  <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                    <Calendar size={48} className="mx-auto text-slate-200 mb-4" />
                    <p className="text-slate-500 font-bold">No bookings found</p>
                  </div>
                )}
              </div>
            )}

            {/* OTHER TABS (Placeholder) */}
            {(activeTab === 'preferences' || activeTab === 'notifications' || activeTab === 'security') && (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                <Settings size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Coming Soon</h3>
                <p className="text-slate-500">This feature is under development.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;