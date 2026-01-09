// App.jsx - Updated with React Router
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import UserProfile from './pages/userprofile';
import WrapperLayout from './layout/wrapperLayout';
import DashBoard from './pages/DashBoard';
import HotelDetails from './pages/HotelDetails';
import OAuthSuccess from './pages/oauthSuccess'
import './index.css'
import { ProtectedRoute, PublicRoute } from './layout/ProtectedRoute'

function App() {
  return (

    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-50">

        <Routes>
          {/* Public routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<WrapperLayout />}>
              <Route path="/profile" element={<UserProfile />} />
              <Route path="/" element={<DashBoard />} />
              <Route path="/hotel/:hotelId" element={<HotelDetails />} />
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