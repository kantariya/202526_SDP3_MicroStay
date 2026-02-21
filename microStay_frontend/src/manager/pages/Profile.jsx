import React from 'react';
import { User, Mail, Shield } from 'lucide-react';

const ManagerProfile = () => {
    const [user, setUser] = React.useState(JSON.parse(localStorage.getItem('user') || '{}'));
    const role = localStorage.getItem('role') || 'Manager';
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await import('../../admin/utils/api').then(module => module.default.get('/users/profile'));
                setUser(response.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-6 text-center text-slate-400">Loading profile...</div>;

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-100 mb-8 text-center">My Profile</h1>

            <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-20"></div>

                <div className="relative flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-800 shadow-xl flex items-center justify-center text-emerald-400 mb-4 z-10">
                        <User size={48} />
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-1">{user.name || user.firstName + ' ' + user.lastName}</h2>
                    <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
                        {role}
                    </span>

                    <div className="w-full space-y-4">
                        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center gap-4 border border-slate-700/50">
                            <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                                <Mail size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Email Address</p>
                                <p className="text-slate-200">{user.email}</p>
                            </div>
                        </div>

                        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center gap-4 border border-slate-700/50">
                            <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">Account Status</p>
                                <p className="text-green-400 font-medium flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    Active
                                </p>
                            </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl flex items-center gap-4 border border-slate-700/50">
                            <div className="p-3 bg-slate-800 rounded-lg text-slate-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 uppercase font-bold">User ID</p>
                                <p className="text-slate-200 font-mono text-sm">{user.id}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerProfile;
