import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    BedDouble,
    CalendarDays,
    CalendarCheck,
    MessageSquare,
    TrendingUp,
    User,
    LogOut
} from 'lucide-react';

const ManagerSidebar = () => {
    const navigate = useNavigate();

    const navItems = [
        { name: 'Dashboard', path: '/manager/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'My Hotels', path: '/manager/hotels', icon: <Building2 size={20} /> },
        { name: 'Bookings', path: '/manager/bookings', icon: <CalendarCheck size={20} /> },
        { name: 'Reviews', path: '/manager/reviews', icon: <MessageSquare size={20} /> },
        { name: 'Revenue', path: '/manager/revenue', icon: <TrendingUp size={20} /> },
        { name: 'Profile', path: '/manager/profile', icon: <User size={20} /> },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-800 text-slate-100 min-h-screen flex flex-col border-r border-slate-700">
            <div className="h-16 flex items-center justify-center border-b border-slate-700">
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">
                    Hotel Manager
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
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
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default ManagerSidebar;
