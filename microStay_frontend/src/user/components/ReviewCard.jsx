import React from 'react';
import { ThumbsUp, Trash2, Edit2 } from 'lucide-react';
import RatingBadge from './RatingBadge';

const ReviewCard = ({ review, onDelete, onEdit, currentUserId }) => {
    const isOwner = currentUserId && review.userId == currentUserId;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-md transition group">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-700 font-bold text-lg">
                        {review.userName ? review.userName[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 text-sm">{review.userName || 'Verified User'}</p>
                        <p className="text-xs text-slate-500">{new Date(review.date || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>
                <RatingBadge rating={review.rating} size="sm" showText={false} />
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-4">
                "{review.comment}"
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <button className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-blue-600 transition">
                    <ThumbsUp size={14} /> Helpful
                </button>

                {isOwner && (
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                        {onEdit && (
                            <button
                                onClick={() => onEdit(review)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
                            >
                                <Edit2 size={14} /> Edit
                            </button>
                        )}

                        {onDelete && (
                            <button
                                onClick={() => onDelete(review.id || review.reviewId || review._id)}
                                className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 transition"
                            >
                                <Trash2 size={14} /> Delete
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewCard;
