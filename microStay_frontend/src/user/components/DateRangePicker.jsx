import React from 'react';
import { Calendar } from 'lucide-react';

const DateRangePicker = ({ checkIn, checkOut, setCheckIn, setCheckOut }) => {
    return (
        // make component responsive and allow children to shrink inside tight containers
        <div className="w-full min-w-0 flex items-center gap-2 bg-gray-50 border border-gray-200 p-1 rounded-xl focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition hover:border-blue-300">
            <div className="pl-3 text-slate-400 flex-shrink-0">
                <Calendar size={18} />
            </div>

            <div className="flex items-center gap-2 flex-1 min-w-0">
                <div className="relative flex-1 min-w-0">
                    <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full min-w-0 bg-transparent text-sm font-bold text-slate-800 outline-none p-2"
                        placeholder="Check-in"
                    />
                    <span className="absolute -top-3 left-2 bg-gray-50 px-1 text-[10px] font-bold text-slate-500 uppercase">Check-in</span>
                </div>

                <div className="w-px h-8 bg-gray-300"></div>

                <div className="relative flex-1 min-w-0">
                    <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full min-w-0 bg-transparent text-sm font-bold text-slate-800 outline-none p-2"
                        placeholder="Check-out"
                    />
                    <span className="absolute -top-3 left-2 bg-gray-50 px-1 text-[10px] font-bold text-slate-500 uppercase">Check-out</span>
                </div>
            </div>
        </div>
    );
};

export default DateRangePicker;
