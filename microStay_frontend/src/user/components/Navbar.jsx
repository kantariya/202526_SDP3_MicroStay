import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Heart, Search, Calendar, Users, Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simple state for compact search (mostly visual for now)
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-black text-slate-900 tracking-tight flex-shrink-0">
          Micro<span className="text-blue-600">Stay</span>
        </Link>

        {/* COMPACT SEARCH BAR (Visible on non-home pages or when scrolled) - Simplified for now */}
        <div className="hidden md:flex items-center bg-gray-100/80 border border-gray-200 rounded-full px-4 py-2 gap-4 cursor-pointer hover:shadow-md transition group"
          onClick={() => navigate('/')}>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 border-r border-gray-300 pr-4">
            <Search size={16} className="text-blue-600" />
            <span>Anywhere</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700 border-r border-gray-300 pr-4">
            <Calendar size={16} className="text-blue-600" />
            <span>Any Week</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <Users size={16} className="text-blue-600" />
            <span>With Your Guests</span>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/my-bookings" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition">
            My Bookings
          </Link>
          <Link to="/favourites" className="text-sm font-bold text-gray-600 hover:text-blue-600 transition flex items-center gap-1">
            <Heart size={18} />
          </Link>

          {/* USER MENU */}
          {token ? (
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-3 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:shadow-md transition"
              >
                <Menu size={18} className="text-gray-600" />
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center">
                  <User size={16} />
                </div>
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-gray-100 mb-2">
                    <p className="text-xs font-bold text-gray-500 uppercase">Account</p>
                  </div>
                  <button onClick={() => { navigate('/profile'); setOpen(false); }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <User size={16} /> Profile
                  </button>
                  <button onClick={() => { navigate('/my-bookings'); setOpen(false); }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3">
                    <Calendar size={16} /> Bookings
                  </button>
                  <div className="border-t border-gray-100 my-2"></div>
                  <button onClick={handleLogout}
                    className="w-full px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm font-bold text-slate-700 hover:text-slate-900">
                Log in
              </Link>
              <Link to="/register" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-600 transition shadow-lg shadow-blue-200">
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
