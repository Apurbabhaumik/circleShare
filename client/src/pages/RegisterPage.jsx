import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <PageTransition className="min-h-screen flex items-center justify-center p-4">
            <motion.div 
                className="glass rounded-3xl p-8 w-full max-w-md relative overflow-hidden"
                whileHover={{ scale: 1.01 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
                {/* Decorative blobs */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-400/20 rounded-full blur-2xl -mr-10 -mb-10 pointer-events-none"></div>

                <div className="flex justify-center mb-6">
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                        className="bg-gradient-to-tr from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg shadow-indigo-500/30"
                    >
                        <UserPlus className="w-8 h-8 text-white" />
                    </motion.div>
                </div>
                
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-1 tracking-tight">Join the Circle</h2>
                <p className="text-center text-gray-500 mb-8 font-medium">Start sharing, stop spending.</p>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-red-50/80 border border-red-100 text-red-600 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                     <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Username</label>
                        <input
                            type="text"
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-400"
                            placeholder="johndoe"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Email</label>
                        <input
                            type="email"
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-400"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="glass-input w-full px-4 py-3 rounded-xl text-gray-800 placeholder-gray-400"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full bg-gray-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-gray-400/20 flex items-center justify-center gap-2 group"
                    >
                        Create Account
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </form>

                <div className="mt-8 text-center text-gray-600 text-sm relative z-10">
                    Already in?{' '}
                    <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline">
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </PageTransition>
    );
};

export default RegisterPage;
