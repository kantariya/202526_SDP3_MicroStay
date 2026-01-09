// components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../component/Navbar';

const WrapperLayout = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      
      {/* Main content area */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Optional: Simple Footer */}
      <footer className="border-t border-gray-100 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 font-medium">© 2026 MicroStay. All rights reserved.</p>
          <div className="flex gap-6">
            <span className="text-xs font-bold text-gray-300 uppercase cursor-pointer hover:text-gray-900">Privacy</span>
            <span className="text-xs font-bold text-gray-300 uppercase cursor-pointer hover:text-gray-900">Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default WrapperLayout;