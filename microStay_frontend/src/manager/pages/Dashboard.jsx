import React, { useState, useEffect } from 'react';
import { Users, Building2, CalendarCheck, TrendingUp } from 'lucide-react';
import api from '../../admin/utils/api';

const ManagerDashboard = () => {
    // Mock data for now until API integration
    const [stats, setStats] = useState({
        myHotels: 0,
        todayCheckins: 0,
        totalBookings: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // STEP 1: Fetch manager hotels first
                const hotelsRes = await api.get('/manager/hotels');

                const hotels = hotelsRes.data || [];
                const hotelIds = hotels.map(h => h.id);

                // If no hotels, avoid unnecessary calls
                if (hotelIds.length === 0) {
                    setStats({
                        myHotels: 0,
                        todayCheckins: 0,
                        totalBookings: 0,
                        revenue: 0
                    });
                    return;
                }

                const params = new URLSearchParams(
                    hotelIds.map(id => ['hotelIds', id])
                );

                // STEP 2: Fetch dependent APIs in parallel
                const [todayRes, bookingsRes, revenueRes] = await Promise.all([
                    api.get('/manager/bookings/today-count', {
                        params
                    }),
                    api.get('/manager/bookings', {
                        params
                    }),
                    api.get('/manager/revenue', {
                        params
                    })
                ]);

                setStats({
                    myHotels: hotels.length,
                    todayCheckins: todayRes.data?.count || 0,
                    totalBookings: bookingsRes.data?.length || 0,
                    revenue: revenueRes.data?.revenue || 0
                });

            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'My Hotels', value: stats.myHotels, icon: <Building2 size={24} />, color: 'bg-blue-600', textColor: 'text-blue-400' },
        { title: 'Today Check-ins', value: stats.todayCheckins, icon: <Users size={24} />, color: 'bg-emerald-600', textColor: 'text-emerald-400' },
        { title: 'Total Bookings', value: stats.totalBookings, icon: <CalendarCheck size={24} />, color: 'bg-purple-600', textColor: 'text-purple-400' },
        { title: 'Revenue', value: stats.revenue, icon: <TrendingUp size={24} />, color: 'bg-orange-600', textColor: 'text-orange-400' },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Manager Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {cards.map((card, index) => (
                    <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg transform transition-all hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-lg bg-opacity-20 ${card.textColor} bg-current`}>
                                {card.icon}
                            </div>
                            {loading ? (
                                <div className="h-4 w-16 bg-slate-700 rounded animate-pulse"></div>
                            ) : (
                                <span className={`text-sm font-bold ${card.textColor} px-2 py-1 rounded bg-opacity-10 bg-current`}>
                                    +0%
                                </span>
                            )}
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

            {/* Placeholder for more dashboard content */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-64 flex items-center justify-center text-slate-500">
                    Recent Bookings (Coming Soon)
                </div>
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 h-64 flex items-center justify-center text-slate-500">
                    Revenue Chart (Coming Soon)
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard;
