import React from 'react';
import { IndianRupee, Tag } from 'lucide-react';

const PriceBox = ({ price, discount = 0, period = "night" }) => {
    const discountedPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

    return (
        <div className="flex flex-col items-end">
            {discount > 0 && (
                <div className="flex items-center gap-2 mb-1">
                    <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Tag size={10} /> {discount}% OFF
                    </span>
                    <span className="text-xs text-slate-400 line-through font-semibold">
                        ₹{price}
                    </span>
                </div>
            )}
            <div className="flex items-baseline gap-0.5">
                <IndianRupee size={18} className="text-slate-900" />
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                    {discountedPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-bold text-slate-500 ml-1">/{period}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">+ taxes & fees</p>
        </div>
    );
};

export default PriceBox;
