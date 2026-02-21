import React, { useState, useEffect } from 'react';
import { Star, Eye, EyeOff, Trash2, Filter, Building2, User } from 'lucide-react';
import api from '../utils/api';

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hotelFilter, setHotelFilter] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [hotelFilter]);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const params = hotelFilter ? { hotelId: hotelFilter } : {};
            const response = await api.get('/admin/reviews', { params });
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleHide = async (review) => {
        const action = review.hidden ? 'unhide' : 'hide';
        try {
            const response = await api.put(`/admin/reviews/${review.id}/${action}`);
            setReviews(reviews.map(r => r.id === review.id ? response.data : r));
        } catch (error) {
            console.error(`Failed to ${action} review:`, error);
            alert(`Failed to ${action} review.`);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to permanently delete this review?")) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews(reviews.filter(r => r.id !== id));
            alert("Review deleted successfully.");
        } catch (error) {
            console.error("Failed to delete review:", error);
            alert("Failed to delete review.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-slate-100">System Wide Reviews</h1>
                <div className="flex items-center bg-slate-800 rounded-lg px-3 py-2 border border-slate-700 w-64">
                    <Filter size={18} className="text-slate-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Filter by Hotel ID..."
                        className="bg-transparent border-none focus:outline-none text-slate-200 text-sm w-full placeholder-slate-500"
                        value={hotelFilter}
                        onChange={(e) => setHotelFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-slate-400">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-slate-400">No reviews found in the system.</div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className={`bg-slate-800 rounded-xl p-6 border ${review.hidden ? 'border-red-500/30 bg-red-500/5' : 'border-slate-700'} shadow-lg transform transition-all`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded bg-blue-600/20 flex items-center justify-center text-blue-400">
                                            <Building2 size={16} />
                                        </div>
                                        <h3 className="font-bold text-slate-200">{review.hotelName || `Hotel: ${review.hotelId}`}</h3>
                                        {review.hidden && (
                                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-500 border border-red-500/30">HIDDEN</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"} />
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <User size={12} /> {review.userName || review.userId || 'Guest'}
                                            <span className="mx-1">•</span>
                                            {new Date(review.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleHide(review)}
                                        className={`p-2 rounded-lg transition-colors ${review.hidden ? 'bg-emerald-600/20 text-emerald-500 hover:bg-emerald-600/30' : 'bg-slate-700 text-slate-400 hover:text-white'}`}
                                        title={review.hidden ? "Show Review" : "Hide Review"}
                                    >
                                        {review.hidden ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="p-2 bg-slate-700 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                        title="Delete Review"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <p className="p-4 bg-slate-900/40 rounded-lg text-slate-300 text-sm leading-relaxed italic border-l-2 border-slate-600">
                                "{review.comment}"
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
