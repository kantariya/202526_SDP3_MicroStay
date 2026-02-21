import React from 'react';
import { Star } from 'lucide-react';

const RatingBadge = ({ rating, size = "md", showText = true }) => {
    const getColor = (r) => {
        if (r >= 4.5) return "bg-green-700 text-white";
        if (r >= 4.0) return "bg-green-600 text-white";
        if (r >= 3.0) return "bg-yellow-500 text-white";
        return "bg-orange-500 text-white";
    };

    const sizes = {
        sm: "px-1.5 py-0.5 text-[10px]",
        md: "px-2 py-1 text-xs",
        lg: "px-3 py-1 text-sm"
    };

    return (
        <div className={`inline-flex items-center gap-1 rounded-md font-bold ${getColor(rating)} ${sizes[size]}`}>
            <span className="flex items-center">
                {rating} <Star size={size === 'lg' ? 14 : 10} className="ml-0.5 fill-current" />
            </span>
            {showText && (
                <span className="text-[10px] opacity-90 font-medium ml-1">
                    {rating >= 4 ? 'Excellent' : rating >= 3 ? 'Very Good' : 'Good'}
                </span>
            )}
        </div>
    );
};

export default RatingBadge;
