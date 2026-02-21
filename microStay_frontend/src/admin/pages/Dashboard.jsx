import React, { useState, useEffect } from 'react';
import { Users, Building2, CalendarCheck, TrendingUp, ShieldCheck, UserCircle } from 'lucide-react';
import api from '../utils/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalHotels: 0,
        pendingApprovals: 0,
        totalUsers: 0,
        totalManagers: 0,
        totalBookings: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                const data = response.data;

                setStats({
                    totalHotels: data.totalHotels || 0,
                    pendingApprovals: data.pendingHotels || 0,
                    totalUsers: data.totalUsers || 0,
                    totalManagers: data.totalManagers || 0,
                    totalBookings: data.totalBookings || 0
                });

            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Hotels', value: stats.totalHotels, icon: <Building2 size={24} />, color: 'bg-blue-600', textColor: 'text-blue-400' },
        { title: 'Pending Approvals', value: stats.pendingApprovals, icon: <ShieldCheck size={24} />, color: 'bg-yellow-600', textColor: 'text-yellow-400' },
        { title: 'Total Users', value: stats.totalUsers, icon: <Users size={24} />, color: 'bg-emerald-600', textColor: 'text-emerald-400' },
        { title: 'Total Managers', value: stats.totalManagers, icon: <UserCircle size={24} />, color: 'bg-indigo-600', textColor: 'text-indigo-400' },
        { title: 'Total Bookings', value: stats.totalBookings, icon: <CalendarCheck size={24} />, color: 'bg-purple-600', textColor: 'text-purple-400' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Administrator Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {cards.map((card, index) => (
                    <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-opacity-20 ${card.textColor} bg-current`}>
                                {card.icon}
                            </div>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium">{card.title}</h3>
                        {loading ? (
                            <div className="h-8 w-24 bg-slate-700 rounded mt-2 animate-pulse"></div>
                        ) : (
                            <p className="text-3xl font-bold text-slate-100 mt-1">{card.value}</p>
                        )}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-64 flex items-center justify-center text-slate-500">
                    System Overview (Coming Soon)
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-64 flex items-center justify-center text-slate-500">
                    User Growth Chart (Coming Soon)
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
