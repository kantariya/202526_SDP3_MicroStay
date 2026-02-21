import React from 'react';

const ManagerNavbar = () => {
    // You might want to fetch the user name from local storage or context
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const role = localStorage.getItem('role') || 'Manager';

    return (
        <header className="h-16 bg-slate-800/50 backdrop-blur-md border-b border-slate-700 flex items-center justify-between px-6 sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-slate-100">
                Manager Dashboard
            </h2>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-slate-300 text-sm font-medium">
                            {user.name || 'Manager User'}
                        </span>
                        <span className="text-slate-500 text-xs uppercase font-bold">
                            {role}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default ManagerNavbar;
