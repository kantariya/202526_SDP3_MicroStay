import React, { useState, useEffect } from 'react';
import { Search, CreditCard, DollarSign, Calendar, CheckCircle } from 'lucide-react';
import api from '../utils/api';

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/payments');
            setPayments(response.data);
        } catch (error) {
            console.error("Error fetching payments:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-slate-100 mb-6 flex items-center gap-2">
                <CreditCard className="text-emerald-500" /> Payment Transactions
            </h1>

            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-700/50 text-slate-300 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Txn ID</th>
                                <th className="p-4 font-semibold">Booking ID</th>
                                <th className="p-4 font-semibold">Amount</th>
                                <th className="p-4 font-semibold">Method</th>
                                <th className="p-4 font-semibold">Date</th>
                                <th className="p-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">Loading payments...</td></tr>
                            ) : payments.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-slate-400">No payment records found.</td></tr>
                            ) : (
                                payments.map((payment) => (
                                    <tr key={payment.paymentId} className="hover:bg-slate-700/30 transition-colors">
                                        <td className="p-4 text-slate-400 font-mono text-xs">{payment.paymentId}</td>
                                        <td className="p-4 text-slate-300 text-sm">{payment.bookingId}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-1 text-slate-100 font-bold">
                                                <DollarSign size={14} className="text-emerald-500" />
                                                {payment.amount?.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-400 text-xs uppercase">
                                            {payment.paymentMethod || 'Credit Card'}
                                        </td>
                                        <td className="p-4 text-slate-300 text-sm">
                                            {payment.paymentTime ? new Date(payment.paymentTime).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${payment.status === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    payment.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payments;
