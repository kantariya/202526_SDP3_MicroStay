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
            <h1 className="text-2xl font-bold text-slate-100 mb-6">Guest Reviews</h1>

            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-slate-400">Loading reviews...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-center text-slate-400">No reviews yet.</div>
                ) : (
                    reviews.map(review => (
                        <div key={review.id} className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-slate-200">{review.hotel}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={14} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"} />
                                            ))}
                                        </div>
                                        <span className="text-xs text-slate-500">by {review.user} on {review.date}</span>
                                    </div>
                                </div>
                                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                                    <MessageSquare size={14} /> Reply
                                </button>
                            </div>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                {review.comment}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ManagerReviews;
