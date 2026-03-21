// App.jsx - Updated with React Router
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './user/pages/Login'
import Register from './user/pages/Register'
import ForgotPassword from './user/pages/ForgotPassword'
import UserProfile from './user/pages/UserProfile';
import WrapperLayout from './user/layout/wrapperLayout';
import DashBoard from './user/pages/DashBoard';
import HotelDetails from './user/pages/HotelDetails';
import OAuthSuccess from './user/pages/oauthSuccess'
import './index.css'
import { ProtectedRoute, PublicRoute, ProtectedAdminRoute } from './user/layout/ProtectedRoute'
import MyBookingsTab from './user/pages/MyBookingsTab';
import FavoritesPage from './user/pages/FavoritesPage';
import SearchPage from './user/pages/SearchPage';
import BookingCheckout from './user/pages/BookingCheckout';
import PaymentPage from './user/pages/PaymentPage';
import BookingSuccess from './user/pages/BookingSuccess';
import BookingDetail from './user/pages/BookingDetail';
import VerifyEmail from './user/pages/VerifyEmail';
import Unauthorized from './error/pages/Unauthorized';

// Admin Imports

import AdminLayout from './admin/layout/AdminLayout';
import AdminRoute from './admin/components/AdminRoute';
import AdminDashboard from './admin/pages/Dashboard';
import AdminHotels from './admin/pages/Hotels';
import AdminManagers from './admin/pages/Managers';
import AdminBookings from './admin/pages/Bookings';
import AdminUsers from './admin/pages/Users';
import AdminReviews from './admin/pages/Reviews';
import AdminApprovals from './admin/pages/Approvals';
import AdminPayments from './admin/pages/Payments';
import AdminSettings from './admin/pages/Settings';

// Manager Imports
import ManagerLayout from './manager/layout/ManagerLayout';
import ManagerRoute from './manager/components/ManagerRoute';
import ManagerDashboard from './manager/pages/Dashboard';
import MyHotels from './manager/pages/MyHotels';
import EditHotel from './manager/pages/EditHotel';
import ManagerRooms from './manager/pages/Rooms';
import ManagerBookings from './manager/pages/Bookings';
import ManagerReviews from './manager/pages/Reviews';
import ManagerRevenue from './manager/pages/Revenue';
import ManagerProfile from './manager/pages/Profile';

function App() {
  return (

    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-50">

        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<WrapperLayout />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/" element={<DashBoard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/hotel/:hotelId" element={<HotelDetails />} />
              <Route path="/booking/checkout" element={<BookingCheckout />} />
              <Route path="/booking/payment" element={<PaymentPage />} />
              <Route path="/booking/success" element={<BookingSuccess />} />
              <Route path="/booking/:bookingId" element={<BookingDetail />} />
              <Route path="/my-bookings" element={<MyBookingsTab />} />
              <Route path="/favourites" element={<FavoritesPage />} />
            </Route>
          </Route>




          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="managers" element={<AdminManagers />} />
              <Route path="approvals" element={<AdminApprovals />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="payments" element={<AdminPayments />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
            </Route>
          </Route>

          {/* Manager Routes */}
          <Route path="/manager" element={<ManagerRoute />}>
            <Route element={<ManagerLayout />}>
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="hotels" element={<MyHotels />} />
              <Route path="hotels/:id/edit" element={<EditHotel />} />
              <Route path="hotels/:id/rooms" element={<ManagerRooms />} />
              <Route path="bookings" element={<ManagerBookings />} />
              <Route path="reviews" element={<ManagerReviews />} />
              <Route path="revenue" element={<ManagerRevenue />} />
              <Route path="profile" element={<ManagerProfile />} />
              <Route index element={<Navigate to="/manager/dashboard" replace />} />
              {/* Add other manager routes here later */}
            </Route>
          </Route>

          {/* Redirect unknown routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App