import { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import { Loader2, Check, X, Undo2, Clock, CalendarDays } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const LoanManager = () => {
    const { user } = useContext(AuthContext);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await axios.get('/loans/mine');
            setLoans(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (loanId, status) => {
        try {
            await axios.put(`/loans/${loanId}/status`, { status });
            fetchLoans(); // Refresh data
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    const handleReturn = async (loanId) => {
        if (!confirm("Confirm that this item has been returned?")) return;
        try {
            await axios.put(`/loans/${loanId}/return`);
            fetchLoans();
        } catch (error) {
            alert(error.response?.data?.message || 'Action failed');
        }
    };

    // Split loans into two groups
    const myRequests = loans.filter(l => l.borrower._id === user._id); // Things I want to borrow
    const incomingRequests = loans.filter(l => l.lender._id === user._id); // Things people want from me

    const StatusBadge = ({ status }) => {
        const styles = {
            Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            Approved: 'bg-green-100 text-green-700 border-green-200',
            Active: 'bg-blue-100 text-blue-700 border-blue-200',
            Completed: 'bg-gray-100 text-gray-600 border-gray-200',
            Rejected: 'bg-red-50 text-red-600 border-red-100',
        };
        return (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.Completed}`}>
                {status}
            </span>
        );
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-500" /></div>;

    return (
        <PageTransition>
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Loan Manager</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Section 1: Incoming Requests (I am Lender) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg"><Undo2 className="w-5 h-5" /></span>
                        Requests for Me
                    </h2>
                    {incomingRequests.length === 0 ? (
                        <div className="glass p-8 text-center text-gray-400 rounded-2xl border-dashed border-2 border-gray-200">No incoming requests</div>
                    ) : (
                        incomingRequests.map(loan => (
                            <motion.div key={loan._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card bg-white p-5 rounded-2xl relative">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <img src={loan.borrower.profileImage || `https://ui-avatars.com/api/?name=${loan.borrower.username}&background=random`} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">@{loan.borrower.username}</div>
                                            <div className="text-xs text-gray-500">wants your <span className="font-bold text-gray-700">{loan.item.name}</span></div>
                                        </div>
                                    </div>
                                    <StatusBadge status={loan.status} />
                                </div>
                                
                                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 flex gap-4 mb-4">
                                    <div className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-gray-400" /> {new Date(loan.startDate).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-1.5"><ArrowRight className="w-3 h-3 text-gray-300" /></div>
                                    <div className="flex items-center gap-1.5">{new Date(loan.endDate).toLocaleDateString()}</div>
                                </div>

                                {/* Actions */}
                                {loan.status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStatusUpdate(loan._id, 'Approved')} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                                            <Check className="w-4 h-4" /> Approve
                                        </button>
                                        <button onClick={() => handleStatusUpdate(loan._id, 'Rejected')} className="flex-1 bg-white border border-gray-200 hover:bg-red-50 text-gray-700 hover:text-red-600 py-2 rounded-xl text-sm font-bold transition-colors">
                                            Reject
                                        </button>
                                    </div>
                                )}
                                {(loan.status === 'Active' || loan.status === 'Approved') && (
                                    <button onClick={() => handleReturn(loan._id)} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 rounded-xl text-sm font-bold transition-colors">
                                        Mark as Returned
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>

                {/* Section 2: My Borrows (I am Borrower) */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><Clock className="w-5 h-5" /></span>
                        My Borrows
                    </h2>
                    {myRequests.length === 0 ? (
                        <div className="glass p-8 text-center text-gray-400 rounded-2xl border-dashed border-2 border-gray-200">You haven't borrowed anything</div>
                    ) : (
                        myRequests.map(loan => (
                            <motion.div key={loan._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card bg-white p-5 rounded-2xl border-l-4 border-l-blue-500">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="text-lg font-bold text-gray-900">{loan.item.name}</div>
                                        <div className="text-xs text-gray-500">from <span className="font-bold">@{loan.lender.username}</span></div>
                                    </div>
                                    <StatusBadge status={loan.status} />
                                </div>

                                <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 flex gap-4 mb-2">
                                    <div className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-gray-400" /> {new Date(loan.startDate).toLocaleDateString()}</div>
                                    <div className="flex items-center gap-1.5">-</div>
                                    <div className="flex items-center gap-1.5">{new Date(loan.endDate).toLocaleDateString()}</div>
                                </div>

                                {loan.status === 'Active' && (
                                    <div className="text-xs text-blue-600 font-bold mt-2 flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> Due Soon
                                    </div>
                                )}
                                 {(loan.status === 'Active' || loan.status === 'Approved') && (
                                    <button onClick={() => handleReturn(loan._id)} className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl text-sm font-bold transition-colors">
                                        Return Item
                                    </button>
                                )}
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default LoanManager;
