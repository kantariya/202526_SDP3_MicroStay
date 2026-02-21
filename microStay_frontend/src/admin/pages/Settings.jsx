import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Database } from 'lucide-react';
import api from '../utils/api';

const AdminSettings = () => {
    const [platformFee, setPlatformFee] = useState(10);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [emailNotifications, setEmailNotifications] = useState(true);

    const handleSave = () => {
        // Mock save
        alert("Settings saved successfully!");
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-3">
                <Settings className="text-slate-400" /> Platform Settings
            </h1>

            <div className="space-y-6">
                {/* General Settings */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Database size={18} /> General Configuration
                    </h3>

                    <div className="grid gap-6">
                        <div>
                            <label className="block text-slate-400 text-sm mb-2">Platform Fee (%)</label>
                            <input
                                type="number"
                                value={platformFee}
                                onChange={(e) => setPlatformFee(e.target.value)}
                                className="bg-slate-900 border border-slate-600 rounded-lg p-3 text-slate-100 w-full md:w-1/3 focus:border-blue-500 outline-none"
                            />
                            <p className="text-xs text-slate-500 mt-1">Percentage taken from each booking.</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <label className="text-slate-300 font-medium">Maintenance Mode</label>
                            <button
                                onClick={() => setMaintenanceMode(!maintenanceMode)}
                                className={`w-12 h-6 rounded-full p-1 transition-colors ${maintenanceMode ? 'bg-blue-600' : 'bg-slate-600'}`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${maintenanceMode ? 'translate-x-6' : ''}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Bell size={18} /> Notifications
                    </h3>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            checked={emailNotifications}
                            onChange={(e) => setEmailNotifications(e.target.checked)}
                            className="w-5 h-5 rounded border-slate-600 bg-slate-900 focus:ring-blue-500"
                        />
                        <span className="text-slate-300">Enable Email Alerts for System Events</span>
                    </div>
                </div>

                {/* Security */}
                <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-lg">
                    <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
                        <Shield size={18} /> Security
                    </h3>

                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                        View Audit Logs
                    </button>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-bold shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                    >
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
