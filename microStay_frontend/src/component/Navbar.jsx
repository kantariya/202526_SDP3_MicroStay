// components/Navbar.jsx
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, LogOut, Bell } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 p-1.5 rounded-lg group-hover:bg-black transition-colors">
            <div className="w-5 h-5 border-2 border-white rounded-sm rotate-45" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900 uppercase">
            Micro<span className="text-blue-600">Stay</span>
          </span>
        </Link>

        {/* NAV LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Explore</Link>
          <Link to="/bookings" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">My Bookings</Link>
          <Link to="/support" className="text-sm font-bold text-gray-500 hover:text-blue-600 transition-colors">Support</Link>
        </div>

        {/* USER ACTIONS */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="h-8 w-[1px] bg-gray-100 mx-2" />

          {userId ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                <User size={20} />
              </div>
              <button 
                onClick={handleLogout}
                className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-all shadow-lg shadow-gray-200"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;