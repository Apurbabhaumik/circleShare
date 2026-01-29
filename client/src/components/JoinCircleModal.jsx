import { useState } from 'react';
import axios from '../utils/axios';
import { X, KeyRound } from 'lucide-react';

const JoinCircleModal = ({ isOpen, onClose, onCircleJoined }) => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post('/circles/join', { inviteCode: code });
            onCircleJoined(res.data);
            onClose();
            setCode('');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to join circle');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <KeyRound className="text-purple-600" />
                        Join Existing Circle
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</div>}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Invite Code</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none uppercase font-mono tracking-widest"
                            placeholder="ABCD12"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                        />
                    </div>
                   
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                        >
                            {loading ? 'Joining...' : 'Join Circle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default JoinCircleModal;
