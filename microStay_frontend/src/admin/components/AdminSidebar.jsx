import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, CalendarCheck, LogOut, MessageSquare, CreditCard, CheckCircle, Settings } from 'lucide-react';

const AdminSidebar = () => {
    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Hotels', path: '/admin/hotels', icon: <Building2 size={20} /> },
        { name: 'Managers', path: '/admin/managers', icon: <Users size={20} /> },
        { name: 'Approvals', path: '/admin/approvals', icon: <CheckCircle size={20} /> },
        { name: 'Bookings', path: '/admin/bookings', icon: <CalendarCheck size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Reviews', path: '/admin/reviews', icon: <MessageSquare size={20} /> },
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> }
        // { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
    ];

    return (
        <aside className="w-64 bg-slate-800 text-slate-100 min-h-screen flex flex-col border-r border-slate-700">
            <div className="h-16 flex items-center justify-center border-b border-slate-700">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
                    MicroStay Admin
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                                : 'text-slate-400 hover:bg-slate-700 hover:text-slate-100'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-700">
                <button
                    onClick={() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/admin/login';
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default AdminSidebar;
