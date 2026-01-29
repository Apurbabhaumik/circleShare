import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { AuthContext } from '../context/AuthContext';
import CreateCircleModal from '../components/CreateCircleModal';
import JoinCircleModal from '../components/JoinCircleModal';
import ItemCard from '../components/ItemCard';
import PageTransition from '../components/PageTransition';
import { Plus, Users, Search, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [circles, setCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchCircles();
    }, []);

    useEffect(() => {
        if (selectedCircle) {
            fetchItems(selectedCircle._id);
        } else if (circles.length > 0) {
            setSelectedCircle(circles[0]);
        }
    }, [circles, selectedCircle]);

    const fetchCircles = async () => {
        try {
            const res = await axios.get('/circles');
            setCircles(res.data);
            if (res.data.length > 0 && !selectedCircle) {
                setSelectedCircle(res.data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchItems = async (circleId) => {
        try {
            const res = await axios.get(`/items/circle/${circleId}`);
            setItems(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleCircleCreated = (newCircle) => {
        setCircles([...circles, newCircle]);
        setSelectedCircle(newCircle);
    };

    const filteredItems = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <PageTransition className="flex gap-8 items-start">
            {/* Sidebar (Circles) */}
            <div className="w-72 flex-shrink-0 space-y-6 hidden lg:block sticky top-24">
                <div className="glass-card rounded-2xl p-5">
                    <h3 className="font-bold text-gray-800 mb-4 px-2 uppercase text-xs tracking-wider opacity-70">Your Circles</h3>
                    <div className="space-y-2">
                        {loading ? (
                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-blue-500" /></div>
                        ) : circles.length === 0 ? (
                            <div className="text-sm text-gray-500 px-4 py-8 text-center bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                                No circles yet.
                            </div>
                        ) : circles.map(circle => (
                            <motion.button
                                whileHover={{ x: 4 }}
                                key={circle._id}
                                onClick={() => setSelectedCircle(circle)}
                                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between group ${
                                    selectedCircle?._id === circle._id 
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                                    : 'text-gray-600 hover:bg-white hover:shadow-md'
                                }`}
                            >
                                <span className="truncate">{circle.name}</span>
                                {selectedCircle?._id === circle._id && (
                                    <motion.div layoutId="active-dot" className="w-2 h-2 rounded-full bg-white shadow-lg"></motion.div>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <motion.button 
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsCreateModalOpen(true)}
                        className="glass bg-white/40 hover:bg-white/80 p-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 text-xs font-bold text-gray-700 shadow-sm"
                    >
                        <div className="bg-blue-100 p-2 rounded-full text-blue-600">
                            <Plus className="w-5 h-5" />
                        </div>
                        Create New
                    </motion.button>
                    <motion.button 
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsJoinModalOpen(true)}
                        className="glass bg-white/40 hover:bg-white/80 p-4 rounded-2xl transition-all flex flex-col items-center justify-center gap-3 text-xs font-bold text-gray-700 shadow-sm"
                    >
                        <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                            <Users className="w-5 h-5" />
                        </div>
                        Join Code
                    </motion.button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Mobile Circle Select */}
                <div className="lg:hidden mb-6">
                    <select 
                        className="glass-input w-full p-3 rounded-xl text-gray-800 font-bold"
                        onChange={(e) => {
                            const c = circles.find(c => c._id === e.target.value);
                            setSelectedCircle(c);
                        }}
                        value={selectedCircle?._id || ''}
                    >
                        {circles.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                        {circles.length === 0 && <option>No Circles found</option>}
                    </select>
                </div>

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={selectedCircle ? selectedCircle._id : 'empty'}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                    {selectedCircle ? selectedCircle.name : 'Dashboard'}
                                </h1>
                                <p className="text-gray-500 font-medium mt-1 flex items-center gap-2">
                                    {selectedCircle 
                                        ? <>Invite Code: <span className="bg-gray-200 px-2 py-0.5 rounded text-gray-800 font-mono text-xs">{selectedCircle.inviteCode}</span></> 
                                        : 'Select a circle to view items'}
                                </p>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            type="text" 
                            placeholder="Search items..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="glass-input pl-10 pr-4 py-2.5 rounded-xl w-full sm:w-64 text-sm font-medium"
                        />
                    </div>
                </div>

                {/* Grid */}
                {selectedCircle ? (
                    filteredItems.length > 0 ? (
                        <motion.div 
                            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-20"
                            initial="hidden"
                            animate="show"
                            variants={{
                                hidden: { opacity: 0 },
                                show: {
                                    opacity: 1,
                                    transition: {
                                        staggerChildren: 0.1
                                    }
                                }
                            }}
                        >
                            {filteredItems.map(item => (
                                <ItemCard key={item._id} item={item} />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass rounded-3xl p-16 text-center border-2 border-dashed border-gray-200"
                        >
                            <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">No items found</h3>
                            <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                                {items.length === 0 ? "This circle is empty. Be the first to share something!" : "No items match your search."}
                            </p>
                            <Link to="/add-item" className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-black transition-all shadow-xl hover:shadow-2xl inline-flex items-center gap-2">
                                <Plus className="w-5 h-5" />
                                Share Item
                            </Link>
                        </motion.div>
                    )
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 glass rounded-3xl"
                    >
                        <Users className="w-20 h-20 text-indigo-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome to CircleShare</h2>
                        <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg">
                            The smartest way to share tools, books, and gear with the people you trust.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <button onClick={() => setIsCreateModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                                Create New Circle
                            </button>
                            <button onClick={() => setIsJoinModalOpen(true)} className="bg-white text-gray-700 border border-gray-200 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-all">
                                Join with Code
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>

            <CreateCircleModal 
                isOpen={isCreateModalOpen} 
                onClose={() => setIsCreateModalOpen(false)} 
                onCircleCreated={handleCircleCreated}
            />
            <JoinCircleModal 
                isOpen={isJoinModalOpen} 
                onClose={() => setIsJoinModalOpen(false)} 
                onCircleJoined={handleCircleCreated}
            />
        </PageTransition>
    );
};

export default Dashboard;
