import React, { useState, useEffect } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import api from '../../admin/utils/api';

const ManagerReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            // Strictly use allowed API: GET /manager/reviews
            const response = await api.get('/manager/reviews');
            console.log("Fetched reviews:", response.data);
            setReviews(response.data);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            // Fallback for dev
            if (error.response && error.response.status === 404) {
                setReviews([]);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Guest Reviews for your hotel</h1>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-slate-400">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-slate-400">No reviews yet.</div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg hover:shadow-emerald-500/10 hover:border-slate-600 transition-all duration-300">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                            {review.username?.charAt(0).toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-100 text-lg">{review.hotel}</h3>
                                            <p className="text-xs text-slate-400">
                                                <span className="font-medium text-slate-300">{review.username}</span> • {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 ml-13">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={16} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "fill-slate-700 text-slate-700"} />
                                            ))}
                                        </div>
                                        <span className="text-sm font-semibold text-yellow-400">{review.rating}.0</span>
                                        <span className="text-xs text-slate-500 px-2 py-0.5 bg-slate-700/50 rounded">
                                            {review.rating >= 4 ? '😊 Excellent' : review.rating >= 3 ? '👍 Good' : '😐 Fair'}
                                        </span>
                                    </div>
                                </div>
                                <button className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1.5">
                                    <MessageSquare size={16} /> Reply
                                </button>
                            </div>
                            <div className="ml-13 pl-3 border-l-2 border-slate-700">
                                <p className="text-slate-300 text-sm leading-relaxed">
                                    {review.comment}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManagerReviews;
