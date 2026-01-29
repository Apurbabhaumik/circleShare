import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Share2, LogOut, PlusCircle, LayoutGrid, Clock, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    if (!user) return <Outlet />;

    return (
        <div className="min-h-screen">
            {/* Sticky Glass Navbar */}
            <motion.nav 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-white/40 shadow-sm"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/dashboard" className="flex items-center gap-3 group">
                                <motion.div 
                                    whileHover={{ rotate: 180 }}
                                    className="bg-gray-900 p-2 rounded-xl"
                                >
                                    <Share2 className="w-5 h-5 text-white" />
                                </motion.div>
                                <span className="font-bold text-xl text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">CircleShare</span>
                            </Link>
                        </div>
                        
                        <div className="flex items-center gap-6">
                            <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/50">
                                <LayoutGrid className="w-4 h-4" />
                                <span className="hidden sm:inline">Dashboard</span>
                            </Link>
                            <Link to="/add-item" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/50">
                                <PlusCircle className="w-4 h-4" />
                                <span className="hidden sm:inline">Share Item</span>
                            </Link>

                            <Link to="/loans" className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100/50">
                                <Clock className="w-4 h-4" />
                                <span className="hidden sm:inline">My Loans</span>
                            </Link>
                            
                            <div className="h-6 w-px bg-gray-300/50 mx-2"></div>
                            
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:flex flex-col items-end mr-2">
                                    <span className="text-sm font-bold text-gray-800">@{user.username}</span>
                                    <div className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                                        <Shield className="w-3 h-3 fill-current" />
                                        <span>Trust Score: {user.trustScore || 100}</span>
                                    </div>
                                </div>
                                <motion.button 
                                    whileHover={{ scale: 1.1, color: "#EF4444" }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 rounded-full transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Main Content Wrapper */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 min-h-screen">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
