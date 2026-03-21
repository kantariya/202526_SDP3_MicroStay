import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign } from 'lucide-react';
import api from '../../admin/utils/api';

const Revenue = () => {
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                // First fetch manager hotels to get hotelIds (same as Manager Dashboard)
                const hotelsRes = await api.get('/manager/hotels');
                const hotels = hotelsRes.data || [];
                const hotelIds = hotels.map(h => h.id);

                // If no hotels, return zeroed revenue
                if (hotelIds.length === 0) {
                    setRevenueData({ revenue: 0 });
                    return;
                }

                // build params with repeated hotelIds entries like Dashboard
                const params = new URLSearchParams(
                    hotelIds.map(id => ['hotelIds', id])
                );

                // GET /manager/revenue with params
                const res = await api.get('/manager/revenue', { params });
            
                setRevenueData(res.data);
            } catch (error) {
                console.error("Error fetching revenue:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRevenue();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <TrendingUp className="text-emerald-500" /> Revenue Analytics
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <h3 className="text-slate-400 text-sm font-medium mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-emerald-400 flex items-center gap-1">
                        <DollarSign size={24} /> {loading ? '...' : revenueData?.revenue || 0}
                    </p>
                </div>
            </div>

            <div className="bg-slate-800 rounded-xl border border-slate-700 p-12 text-center text-slate-500">
                <p className="text-xl">Detailed Revenue charts coming soon...</p>
                <p className="text-sm mt-2">Implementation pending Chart.js integration.</p>
            </div>
        </div>
    );
};

export default Revenue;
