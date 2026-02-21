import React from 'react';
import { Outlet } from 'react-router-dom';
import ManagerSidebar from '../components/ManagerSidebar';
import ManagerNavbar from '../components/ManagerNavbar';

const ManagerLayout = () => {
    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-100 w-full overflow-hidden">
            <ManagerSidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <ManagerNavbar />
                <main className="flex-1 overflow-y-auto p-6 bg-slate-900 w-full">
                    <div className="max-w-7xl mx-auto w-full">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ManagerLayout;
