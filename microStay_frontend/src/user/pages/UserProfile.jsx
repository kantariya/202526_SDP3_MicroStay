import React, { useState, useEffect } from 'react';
import {
  UserCircle, Calendar, MapPin, Star, Settings, Bell, Shield,
  Mail, Phone, Home, Edit2, Save, X, ChevronRight, Plus, LogOut, Lock, Eye, EyeOff
} from 'lucide-react';
import api from "../../utils/api";
import BookingCard from '../components/BookingCard';
import ConfirmDialog from '../components/ConfirmDialog';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  // Confirm Dialog State for Cancel Booking
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  
  // Two-Factor Auth State
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorLoading, setTwoFactorLoading] = useState(false);

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
  // initialize two-factor state from profile if present
  setTwoFactorEnabled(Boolean(userRes.data.twoFactorEnabled));

      // 2. Get Bookings
      const bookRes = await api.get('/bookings/my');
      const bookingsData = bookRes.data.bookings || [];

      // 3. Enrich each booking with hotel details (city, country, image)
      const enrichedBookings = await Promise.all(
        bookingsData.map(async (booking) => {
          try {
            const hotelRes = await api.get(`/hotels/${booking.hotelId}/card`);
            const hotel = hotelRes.data;
            
            return {
              ...booking,
              city: hotel?.city || '',
              country: hotel?.country || '',
              image: hotel.images?.[0] || hotel.image || ''
            };
          } catch (error) {
            console.error(`Failed to fetch hotel ${booking.hotelId}:`, error);
            // Return booking without enrichment if hotel fetch fails
            return booking;
          }
        })
      );

      setBookings(enrichedBookings);

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
      // PATCH /users/profile with UserUpdateRequest
      const updateRequest = {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        phone: editForm.phone,
        address: editForm.address,
        city: editForm.city,
        country: editForm.country
      };

      const response = await api.patch('/users/profile', updateRequest);
      setUser(response.data);
      setEditForm(response.data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update failed", err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    // Validation
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordError('All fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      const response = await api.post('/users/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      if (response.data.status === 'PASSWORD_CHANGED') {
        setPasswordSuccess('Password changed successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error("Password change failed", err);
      setPasswordError(err.response?.data?.message || "Failed to change password. Please check your current password.");
    }
  };

  const toggleTwoFactor = async () => {
    setTwoFactorLoading(true);
    try {
      const res = await api.patch('/users/two-factor/toggle');
      const enabled = Boolean(res.data.twoFactorEnabled);
      setTwoFactorEnabled(enabled);
      // reflect on user object too
      setUser(prev => ({ ...(prev || {}), twoFactorEnabled: enabled }));
      alert(enabled ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.');
    } catch (err) {
      console.error('Failed to toggle two-factor', err);
      alert(err.response?.data?.message || 'Failed to toggle two-factor authentication.');
    } finally {
      setTwoFactorLoading(false);
    }
  };

  const initiateCancel = (bookingReference) => {
    setBookingToCancel(bookingReference);
    setIsConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (!bookingToCancel) return;
    try {
      await api.post(`/bookings/${bookingToCancel}/cancel`);
      alert("Booking cancelled successfully.");
      // Refresh bookings
      fetchProfileData();
    } catch (err) {
      alert(err.response?.data?.message || "Cancellation failed.");
    } finally {
      setIsConfirmOpen(false);
      setBookingToCancel(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center font-bold">Loading profile...</div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center">Please log in</div>;

  const NavButton = ({ tab, icon: Icon, label, count }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center w-full p-3 rounded-xl transition-all ${
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
                      <span className="text-4xl font-bold text-slate-400">{user.firstName?.[0]}</span>
                    )}
                  </div>
                  <span className="absolute bottom-0 right-0 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white shadow-sm">
                    {user.role || 'Member'}
                  </span>
                </div>

                <h2 className="text-2xl font-black text-slate-900">{user.firstName} {user.lastName}</h2>
                <p className="text-slate-500 font-medium mb-6">{user.email}</p>

                <div className="grid grid-cols-1 gap-4 w-full mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
                    <p className="text-2xl font-black text-blue-600">{bookings.length}</p>
                    <p className="text-xs font-bold text-blue-400 uppercase">Bookings</p>
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
                {/* <NavButton tab="preferences" icon={Star} label="Preferences" />
                <NavButton tab="notifications" icon={Bell} label="Notifications" /> */}
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
                    <label className="text-xs font-bold text-slate-400 uppercase">First Name</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <UserCircle size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.firstName || ''}
                        onChange={e => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                        placeholder="Enter first name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Last Name</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <UserCircle size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.lastName || ''}
                        onChange={e => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl border border-gray-300">
                      <Mail size={20} className="text-slate-400" />
                      <input
                        disabled
                        value={editForm.email || ''}
                        className="bg-transparent w-full font-bold text-slate-400 outline-none cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-400 italic">Email cannot be changed</p>
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

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">City</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <MapPin size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.city || ''}
                        onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                        placeholder="Add city"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Country</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <MapPin size={20} className="text-slate-400" />
                      <input
                        disabled={!isEditing}
                        value={editForm.country || ''}
                        onChange={e => setEditForm({ ...editForm, country: e.target.value })}
                        className="bg-transparent w-full font-bold text-slate-700 outline-none disabled:text-slate-500"
                        placeholder="Add country"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl border border-gray-300">
                      <Shield size={20} className="text-slate-400" />
                      <input
                        disabled
                        value={editForm.role || ''}
                        className="bg-transparent w-full font-bold text-slate-400 outline-none cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-slate-400 italic">Role is system-managed</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase">Member Since</label>
                    <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl border border-gray-300">
                      <Calendar size={20} className="text-slate-400" />
                      <input
                        disabled
                        value={editForm.createdAt ? new Date(editForm.createdAt).toLocaleDateString() : ''}
                        className="bg-transparent w-full font-bold text-slate-400 outline-none cursor-not-allowed"
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
                    <BookingCard 
                      key={booking.bookingId} 
                      booking={booking} 
                      hotel={{ name: booking.hotelName, location: { city: booking.city || booking.location?.city } }} 
                      onCancel={() => initiateCancel(booking.bookingReference)}
                    />
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
            {(activeTab === 'preferences' || activeTab === 'notifications') && (
              <div className="bg-white rounded-3xl p-10 text-center border border-gray-100">
                <Settings size={48} className="mx-auto text-slate-200 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Coming Soon</h3>
                <p className="text-slate-500">This feature is under development.</p>
              </div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-black text-slate-900">Security Settings</h2>
                  <p className="text-slate-500">Manage your password and account security</p>
                </div>

                {/* CHANGE PASSWORD FORM */}
                <div className="max-w-md">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Lock size={20} className="text-blue-600" />
                    Change Password
                  </h3>

                  <form onSubmit={handleChangePassword} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Current Password</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                        <Lock size={20} className="text-slate-400" />
                        <input
                          type="password"
                          value={passwordForm.currentPassword}
                          onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                          className="bg-transparent w-full font-medium text-slate-700 outline-none"
                          placeholder="Enter current password"
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">New Password</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                        <Lock size={20} className="text-slate-400" />
                        <input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          className="bg-transparent w-full font-medium text-slate-700 outline-none"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase">Confirm New Password</label>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition">
                        <Lock size={20} className="text-slate-400" />
                        <input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          className="bg-transparent w-full font-medium text-slate-700 outline-none"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    {/* Error Message */}
                    {passwordError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {passwordError}
                      </div>
                    )}

                    {/* Success Message */}
                    {passwordSuccess && (
                      <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-medium">
                        {passwordSuccess}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 text-white font-bold bg-blue-600 py-3 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                    >
                      <Shield size={18} />
                      Update Password
                    </button>
                  </form>

                  {/* Security Tips */}
                  <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-900 mb-2">Password Security Tips</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Use at least 8 characters with mixed case letters</li>
                      <li>• Include numbers and special characters</li>
                      <li>• Avoid common words or personal information</li>
                      <li>• Don't reuse passwords from other accounts</li>
                    </ul>
                  </div>
                </div>

                {/* TWO-FACTOR AUTHENTICATION SECTION */}
                <div className="mt-12 pt-12 border-t border-gray-100 max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Shield size={20} className="text-blue-600" />
                      <h3 className="text-lg font-bold text-slate-900">Two-Factor Authentication</h3>
                    </div>
                    {/* TOGGLE SWITCH */}
                    <button
                      onClick={toggleTwoFactor}
                      disabled={twoFactorLoading}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                        twoFactorEnabled ? 'bg-blue-600' : 'bg-gray-200'
                      } ${twoFactorLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                    <div className="flex gap-3">
                      <div className={`p-2 rounded-lg ${twoFactorEnabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                        <Shield size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">
                          {twoFactorEnabled ? 'TFA is Currently Enabled' : 'TFA is Currently Disabled'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          Two-factor authentication adds an extra layer of security to your account by requiring an OTP from your email for sign-ins.
                        </p>
                      </div>
                    </div>
                  </div>

                  {twoFactorLoading && (
                    <p className="text-xs text-blue-600 font-medium mt-3 animate-pulse">
                      Updating security settings...
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>
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
};

export default UserProfile;