import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, variant = 'danger' }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200">

                <div className="p-6 text-center">
                    <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
                        <AlertTriangle size={32} />
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                        {message}
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onClose}
                            className="py-3 px-4 rounded-xl font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => { onConfirm(); onClose(); }}
                            className={`py-3 px-4 rounded-xl font-bold text-white shadow-lg transition ${variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'}`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ConfirmDialog;
