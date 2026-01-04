 // UserProfile.jsx
import React, { useState } from 'react';
import {
  UserCircle,
  Calendar,
  MapPin,
  Star,
  Settings,
  Bell,
  CreditCard,
  Shield,
  Mail,
  Phone,
  Home,
  Edit2,
  Save,
  X,
  ChevronRight,
  Clock,
  Users,
  Bed,
  DollarSign,
  Filter,
  Plus,
  Trash2,
  Moon,
  Wifi,
  Car,
  Coffee
} from 'lucide-react';

const UserProfile = () => {
  // User state
  const [user, setUser] = useState({
    id: 'USR001',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    joinDate: '2023-01-15',
    loyaltyPoints: 1250,
    membershipTier: 'Gold',
    address: '123 Main St, New York, NY 10001',
    dateOfBirth: '1990-05-15'
  });

  // Bookings state
  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      hotelName: 'Grand Luxury Hotel',
      location: 'New York, NY',
      checkIn: '2024-12-20',
      checkOut: '2024-12-25',
      guests: 2,
      totalAmount: 1200,
      status: 'Upcoming',
      roomType: 'Deluxe Suite',
      bookingDate: '2024-11-10',
      hotelImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400'
    },
    {
      id: 'BK002',
      hotelName: 'Beach Resort & Spa',
      location: 'Miami, FL',
      checkIn: '2024-10-15',
      checkOut: '2024-10-20',
      guests: 4,
      totalAmount: 1800,
      status: 'Completed',
      roomType: 'Family Villa',
      bookingDate: '2024-09-01',
      hotelImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w-400'
    },
    {
      id: 'BK003',
      hotelName: 'Mountain View Lodge',
      location: 'Denver, CO',
      checkIn: '2024-09-05',
      checkOut: '2024-09-10',
      guests: 2,
      totalAmount: 800,
      status: 'Completed',
      roomType: 'Standard Room',
      bookingDate: '2024-08-20',
      hotelImage: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400'
    }
  ]);

  // Preferences state
  const [preferences, setPreferences] = useState([
    { id: 1, icon: <Bed size={20} />, category: 'Room Type', value: 'King Bed' },
    { id: 2, icon: <Moon size={20} />, category: 'Sleep Preference', value: 'Firm Pillows' },
    { id: 3, icon: <Coffee size={20} />, category: 'Wake-up Call', value: '7:30 AM' },
    { id: 4, icon: <Wifi size={20} />, category: 'Internet', value: 'High Speed' },
    { id: 5, icon: <Car size={20} />, category: 'Parking', value: 'Valet Required' }
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...user });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    bookingReminders: true
  });

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save edited profile
  const handleSaveProfile = () => {
    setUser(editForm);
    setIsEditing(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate nights
  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Upcoming': return 'bg-blue-100 text-blue-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get membership badge class
  const getMembershipBadgeClass = (tier) => {
    switch (tier) {
      case 'Platinum': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-900';
      case 'Gold': return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 'Silver': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  // Toggle notification setting
  const toggleNotification = (key) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Stats
  const upcomingBookings = bookings.filter(b => b.status === 'Upcoming');
  const pastBookings = bookings.filter(b => b.status === 'Completed');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
              <p className="text-gray-600 mt-1">Manage your account, bookings, and preferences</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                Need Help?
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                  />
                  <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold ${getMembershipBadgeClass(user.membershipTier)}`}>
                    {user.membershipTier}
                  </div>
                </div>
                
                <h2 className="mt-6 text-2xl font-bold text-gray-900">{user.fullName}</h2>
                <p className="text-gray-600">{user.email}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-4 w-full">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-700">{user.loyaltyPoints.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Loyalty Points</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-700">{bookings.length}</div>
                    <div className="text-sm text-gray-600">Total Stays</div>
                  </div>
                </div>
                
                <div className="mt-6 w-full">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Member since</span>
                    <span className="font-medium">{formatDate(user.joinDate)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Last booking</span>
                    <span className="font-medium">{formatDate(bookings[0]?.bookingDate)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <UserCircle className="mr-3" size={20} />
                  <span className="font-medium">Profile Details</span>
                  <ChevronRight className="ml-auto" size={20} />
                </button>
                
                <button
                  onClick={() => setActiveTab('bookings')}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    activeTab === 'bookings'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Calendar className="mr-3" size={20} />
                  <span className="font-medium">My Bookings</span>
                  <div className="ml-auto bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {upcomingBookings.length}
                  </div>
                </button>
                
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    activeTab === 'preferences'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Star className="mr-3" size={20} />
                  <span className="font-medium">Preferences</span>
                  <ChevronRight className="ml-auto" size={20} />
                </button>
                
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    activeTab === 'notifications'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Bell className="mr-3" size={20} />
                  <span className="font-medium">Notifications</span>
                  <ChevronRight className="ml-auto" size={20} />
                </button>
                
                <button
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center w-full p-3 rounded-xl transition-all ${
                    activeTab === 'security'
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Shield className="mr-3" size={20} />
                  <span className="font-medium">Security</span>
                  <ChevronRight className="ml-auto" size={20} />
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-2/3">
            {/* Profile Details */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Profile Details</h2>
                    <p className="text-gray-600 mt-1">Update your personal information</p>
                  </div>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Edit2 className="mr-2" size={16} />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Save className="mr-2" size={16} />
                        Save Changes
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="mr-2" size={16} />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={editForm.fullName}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={editForm.dateOfBirth}
                          onChange={handleEditChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                          rows="2"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <UserCircle className="text-gray-400 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Full Name</p>
                            <p className="font-medium text-gray-900">{user.fullName}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Mail className="text-gray-400 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Email Address</p>
                            <p className="font-medium text-gray-900">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="text-gray-400 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Phone Number</p>
                            <p className="font-medium text-gray-900">{user.phone}</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <Calendar className="text-gray-400 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Date of Birth</p>
                            <p className="font-medium text-gray-900">{formatDate(user.dateOfBirth)}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Home className="text-gray-400 mr-3" size={20} />
                          <div>
                            <p className="text-sm text-gray-500">Address</p>
                            <p className="font-medium text-gray-900">{user.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bookings */}
            {activeTab === 'bookings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
                      <p className="text-gray-600 mt-1">Manage your upcoming and past stays</p>
                    </div>
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                      <Filter className="mr-2" size={16} />
                      Filter
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-blue-700">{bookings.length}</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-green-700">{upcomingBookings.length}</div>
                      <div className="text-sm text-gray-600">Upcoming</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-purple-700">{pastBookings.length}</div>
                      <div className="text-sm text-gray-600">Past Stays</div>
                    </div>
                  </div>

                  {/* Bookings List */}
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                          <img
                            src={booking.hotelImage}
                            alt={booking.hotelName}
                            className="w-full md:w-48 h-40 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900">{booking.hotelName}</h3>
                                <div className="flex items-center text-gray-600 mt-1">
                                  <MapPin size={16} className="mr-1" />
                                  <span className="text-sm">{booking.location}</span>
                                </div>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(booking.status)}`}>
                                {booking.status}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">Check-in</p>
                                <p className="font-medium">{formatDate(booking.checkIn)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Check-out</p>
                                <p className="font-medium">{formatDate(booking.checkOut)}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Guests</p>
                                <p className="font-medium">{booking.guests} guests</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-medium text-green-700">${booking.totalAmount}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-4">
                              <div className="flex items-center text-gray-600">
                                <Bed size={16} className="mr-2" />
                                <span className="text-sm">{booking.roomType}</span>
                              </div>
                              <div className="flex space-x-2">
                                <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                  View Details
                                </button>
                                {booking.status === 'Upcoming' && (
                                  <button className="px-4 py-2 text-sm font-medium text-red-700 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Preferences */}
            {activeTab === 'preferences' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Stay Preferences</h2>
                    <p className="text-gray-600 mt-1">Customize your hotel experience</p>
                  </div>
                  <button className="flex items-center px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <Plus className="mr-2" size={16} />
                    Add Preference
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {preferences.map((pref) => (
                    <div key={pref.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="p-2 bg-blue-50 rounded-lg mr-3">
                            {pref.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{pref.category}</h4>
                            <p className="text-sm text-gray-600 mt-1">{pref.value}</p>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl">
                  <h3 className="font-medium text-gray-900 mb-2">Special Requests</h3>
                  <p className="text-sm text-gray-600 mb-4">Add any special requests for your next stay</p>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows="3"
                    placeholder="E.g., Extra pillows, early check-in, dietary requirements..."
                  />
                </div>
              </div>
            )}

            {/* Notifications */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Settings</h2>
                
                <div className="space-y-6">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          Receive notifications about {key.toLowerCase().replace('notifications', '')}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleNotification(key)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          value ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Security */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Security Settings</h2>
                
                <div className="space-y-6">
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">Change Password</h4>
                        <p className="text-sm text-gray-600 mt-1">Update your password regularly to keep your account secure</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        Change
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-gray-200 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-600 mt-1">Add an extra layer of security to your account</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-6 border border-red-200 bg-red-50 rounded-xl">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-red-900">Delete Account</h4>
                        <p className="text-sm text-red-600 mt-1">Permanently delete your account and all data</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;