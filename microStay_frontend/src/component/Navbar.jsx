import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Heart } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // optional
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-extrabold text-slate-900">
          Micro<span className="text-blue-600">Stay</span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-full">
          <Link to="/" className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-white hover:text-blue-600 transition">
            Explore
          </Link>
          <Link to="/bookings" className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-white hover:text-blue-600 transition">
            Bookings
          </Link>
          <Link to="/favourites" className="px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:bg-white hover:text-blue-600 transition flex items-center gap-1">
            <Heart size={16} /> Favourite
          </Link>
        </div>

        {/* USER SECTION */}
        {token ? (
          <div className="relative">
            {/* Profile Button */}
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm hover:shadow-md transition"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <User size={16} />
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block">
                Profile
              </span>
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                  className="w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                >
                  <User size={16} />
                  Profile Details
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm font-semibold text-red-500 hover:bg-gray-50 flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition shadow-md"
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
