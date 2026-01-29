import { useState } from 'react';
import axios from '../utils/axios';
import { X, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BorrowModal = ({ isOpen, onClose, item, onSucces }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('/loans/request', {
                itemId: item._id,
                startDate,
                endDate
            });
            onSucces();
            onClose();
            // Reset form
            setStartDate('');
            setEndDate('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send request');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
                />
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                    animate={{ scale: 1, opacity: 1, y: 0 }} 
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="glass bg-white rounded-3xl p-6 w-full max-w-sm relative z-10 shadow-2xl"
                >
                    <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-6">
                        <div className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">Request Item</div>
                        <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
                        <p className="text-sm text-gray-500 mt-1">From @{item.owner.username}</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs font-bold mb-4 border border-red-100">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">From</label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-sm font-bold"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">To</label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="date" 
                                    required
                                    min={startDate || new Date().toISOString().split('T')[0]}
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="glass-input w-full pl-10 pr-4 py-3 rounded-xl text-gray-800 text-sm font-bold"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send Request <ArrowRight className="w-4 h-4" /></>}
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BorrowModal;
