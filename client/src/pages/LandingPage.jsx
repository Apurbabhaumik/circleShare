import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Share2, Shield, Users, Zap, ArrowRight, Star, Globe, Smartphone, Lock, Wrench, Book, Coffee, Camera } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

// --- Components ---

const SpotlightButton = ({ children, to, primary = false, isDark }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }) {
        let { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    }

    return (
        <Link
            to={to}
            onMouseMove={handleMouseMove}
            className={`group relative flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg overflow-hidden transition-transform active:scale-95 ${
                primary 
                ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/40' 
                : isDark 
                    ? 'bg-white/10 text-white border border-white/10 hover:bg-white/20' 
                    : 'bg-white text-gray-900 border border-gray-200'
            }`}
        >
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                    background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(59, 130, 246, 0.15),
              transparent 80%
            )
          `,
                }}
            />
            <span className="relative z-10 flex items-center gap-2">
                {children}
            </span>
        </Link>
    );
};

const TiltCard = ({ icon: Icon, title, desc, delay, isDark }) => {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay, type: "spring", stiffness: 50 }}
            style={{ x, y, rotateX, rotateY, z: 100 }}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                x.set((e.clientX - rect.left) - rect.width / 2);
                y.set((e.clientY - rect.top) - rect.height / 2);
            }}
            onMouseLeave={() => {
                x.set(0);
                y.set(0);
            }}
            className={`group relative h-full backdrop-blur-xl border p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow perspective-1000 ${
                isDark 
                ? 'bg-gray-800/40 border-white/10 hover:shadow-blue-500/10' 
                : 'bg-white/50 border-white/40 hover:shadow-blue-500/10'
            }`}
        >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg transition-transform duration-300 group-hover:scale-110 ${
                    isDark ? 'bg-gray-700 text-white shadow-gray-900/40' : 'bg-gradient-to-br from-gray-900 to-gray-700 text-white shadow-gray-900/20'
                }`}>
                    <Icon className="w-7 h-7" />
                </div>
                <h3 className={`text-2xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                <p className={`font-medium leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{desc}</p>
            </div>
        </motion.div>
    );
};

const LandingPage = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);
    
    // Dark mode state (default to dark for "high-tech" feel?)
    const [isDark, setIsDark] = useState(true);

    return (
        <div className={`min-h-screen selection:bg-blue-500 selection:text-white overflow-x-hidden font-sans relative transition-colors duration-500 ${
            isDark ? 'bg-[#0B0F19]' : 'bg-[#eef2f6]'
        }`}>
            
            {/* --- Interactive Particle Background --- */}
            <ParticleBackground theme={isDark ? 'dark' : 'light'} />

            {/* --- Navbar --- */}
            <nav className="fixed top-0 w-full z-50 px-6 py-6 transition-all duration-300">
                <div className={`max-w-7xl mx-auto flex justify-between items-center backdrop-blur-md border px-6 py-4 rounded-full shadow-lg transition-colors duration-500 ${
                    isDark ? 'bg-gray-900/60 border-white/10 shadow-black/20' : 'bg-white/70 border-white/50 shadow-gray-200/20'
                }`}>
                    <div className="flex items-center gap-3">
                        <motion.div 
                            whileHover={{ rotate: 180 }}
                            className={`p-2 rounded-xl ${isDark ? 'bg-white' : 'bg-black'}`}
                        >
                            <Share2 className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} />
                        </motion.div>
                        <span className={`font-extrabold text-xl tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>CircleShare</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Dark Mode Toggle */}
                        <button 
                            onClick={() => setIsDark(!isDark)}
                            className={`p-2.5 rounded-full transition-colors ${
                                isDark ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            {isDark ? <Zap className="w-5 h-5 fill-current" /> : <Star className="w-5 h-5" />}
                        </button>

                        <Link to="/login" className={`hidden sm:block px-6 py-2.5 rounded-full font-bold transition-all ${
                            isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                        }`}>
                            Log In
                        </Link>
                        <Link to="/register" className={`px-6 py-2.5 rounded-full font-bold shadow-lg transition-transform hover:scale-105 ${
                            isDark ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-gray-900/20'
                        }`}>
                            Get App
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- Hero Section --- */}
            <main className="relative pt-40 pb-20 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm mb-8 backdrop-blur-sm ${
                            isDark ? 'bg-white/5 border-white/10 text-blue-300' : 'bg-white/80 border-blue-100 text-gray-600'
                        }`}
                    >
                        <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-sm font-bold tracking-wide uppercase">The Future of Sharing</span>
                    </motion.div>

                    {/* Headline */}
                    <motion.h1 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                        className={`text-7xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9] ${
                            isDark ? 'text-white' : 'text-gray-900'
                        }`}
                    >
                        Own Less.<br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 animate-gradient-x">
                            Live More.
                        </span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className={`text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium leading-relaxed ${
                            isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                    >
                        The hyper-local platform for borrowing high-quality gear from people you trust. 
                        Reduce waste, save money, and build community.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24"
                    >
                        <SpotlightButton to="/register" primary isDark={isDark}>
                            Start Your Circle <ArrowRight className="w-5 h-5" />
                        </SpotlightButton>
                        <SpotlightButton to="/login" isDark={isDark}>
                            Explore Demo
                        </SpotlightButton>
                    </motion.div>

                    {/* --- Infinite Icon Marquee (Inspired by Req) --- */}
                    <div className="relative max-w-6xl mx-auto mb-20">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1 text-left">
                                <h3 className={`text-3xl font-bold leading-tight mb-4 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                    CircleShare is your community warehouse, evolving ownership into access.
                                </h3>
                            </div>
                            
                            <div className="flex-1 w-full overflow-hidden mask-linear-fade relative">
                                <div className={`absolute inset-y-0 left-0 w-20 z-10 bg-gradient-to-r ${isDark ? 'from-[#0B0F19]' : 'from-[#eef2f6]'} to-transparent`}></div>
                                <div className={`absolute inset-y-0 right-0 w-20 z-10 bg-gradient-to-l ${isDark ? 'from-[#0B0F19]' : 'from-[#eef2f6]'} to-transparent`}></div>
                                
                                <motion.div 
                                    className="flex gap-8"
                                    animate={{ x: [0, -1000] }}
                                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                                >
                                    {[...Array(2)].map((_, i) => (
                                        <div key={i} className="flex gap-8 shrink-0">
                                            {[Wrench, ArrowRight, Book, Zap, Smartphone, Coffee, Star, Shield, Lock, Globe, Share2, Users].map((Icon, idx) => (
                                                <div key={idx} className={`w-16 h-16 rounded-full flex items-center justify-center shrink-0 ${
                                                    isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500 shadow-sm'
                                                }`}>
                                                    <Icon className="w-8 h-8" />
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* --- Features 3D Cards --- */}
            <section className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-center">
                        <h2 className={`text-4xl md:text-5xl font-black mb-4 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Everything you need.</h2>
                        <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Powerful features wrapped in a beautiful design.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <TiltCard 
                            icon={Users} 
                            title="Private Circles" 
                            desc="Create exclusive, invite-only groups. Perfect for neighborhoods, workplaces, or friend groups." 
                            delay={0}
                            isDark={isDark}
                        />
                        <TiltCard 
                            icon={Smartphone} 
                            title="Smart Inventory" 
                            desc="AI-enhanced cataloging. Just snap a photo, and let our system organize your items beautifully." 
                            delay={0.2}
                            isDark={isDark}
                        />
                        <TiltCard 
                            icon={Lock} 
                            title="Secure Lending" 
                            desc="Bank-grade security for your data. Trust scores and history tracking keep everyone accountable." 
                            delay={0.4}
                            isDark={isDark}
                        />
                    </div>
                </div>
            </section>
            
            {/* --- How It Works --- */}
            <section className={`py-32 px-6 relative z-10 transition-colors duration-500 ${isDark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="max-w-7xl mx-auto">
                    <div className="mb-20 text-center">
                        <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-2 block">Workflow</span>
                        <h2 className={`text-4xl md:text-6xl font-black tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Simple. Seamless. <span className="text-blue-500">Secure.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12 relative">
                        {/* Connecting Line (Desktop) */}
                        <div className={`hidden md:block absolute top-12 left-0 w-full h-0.5 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>

                        {[
                            { step: '01', title: 'Create a Circle', desc: 'Start a private group for your neighbors or friends.', icon: Users },
                            { step: '02', title: 'List Items', desc: 'Add tools, books, or camping gear in seconds.', icon: Camera },
                            { step: '03', title: 'Start Sharing', desc: 'Borrow what you need, lend what you don\'t.', icon: Share2 }
                        ].map((item, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.2 }}
                                className="relative z-10"
                            >
                                <div className={`w-24 h-24 rounded-3xl mx-auto mb-8 flex items-center justify-center text-3xl font-bold shadow-xl border-4 ${
                                    isDark ? 'bg-gray-900 border-[#0B0F19] text-blue-400' : 'bg-white border-gray-50 text-blue-600'
                                }`}>
                                    {item.step}
                                </div>
                                <h3 className={`text-2xl font-bold text-center mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                                <p className={`text-center leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- Testimonials --- */}
            <section className="py-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto mb-16 text-center">
                    <h2 className={`text-3xl md:text-5xl font-black tracking-tight mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Loved by communities everywhere.</h2>
                </div>
                
                <div className="relative mask-linear-fade">
                    <div className={`absolute inset-y-0 left-0 w-32 z-10 bg-gradient-to-r ${isDark ? 'from-[#0B0F19]' : 'from-[#eef2f6]'} to-transparent`}></div>
                    <div className={`absolute inset-y-0 right-0 w-32 z-10 bg-gradient-to-l ${isDark ? 'from-[#0B0F19]' : 'from-[#eef2f6]'} to-transparent`}></div>

                    <motion.div 
                        className="flex gap-6"
                        animate={{ x: [0, -2000] }}
                        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
                    >
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex gap-6 shrink-0">
                                {[
                                    { name: "Sarah J.", role: "Community Lead", text: "CircleShare completely transformed how our apartment complex interacts. We've saved thousands on tools!" },
                                    { name: "Mike T.", role: "Carpenter", text: "I love that my expensive tools are getting used instead of collecting dust. The trust score system is genius." },
                                    { name: "Emily R.", role: "Student", text: "Borrowed a projector for movie night. Saved me $50 rental fee. This app is a no-brainer." },
                                    { name: "David K.", role: "Gardener", text: "Finally, a way to share my lawnmower with neighbors without the awkward coordination." },
                                    { name: "Jessica L.", role: "Teacher", text: "We set up a Circle for our school staff. Sharing books and supplies has never been easier." }
                                ].map((testimonial, idx) => (
                                    <div key={idx} className={`w-[400px] p-8 rounded-3xl border flex-shrink-0 ${
                                        isDark 
                                        ? 'bg-gray-800/30 border-white/10 text-gray-300' 
                                        : 'bg-white border-gray-200 text-gray-600 shadow-sm'
                                    }`}>
                                        <div className="flex gap-1 mb-4 text-yellow-500">
                                            {[...Array(5)].map((_, si) => <Star key={si} className="w-4 h-4 fill-current" />)}
                                        </div>
                                        <p className="text-lg font-medium mb-6">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                isDark ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {testimonial.name[0]}
                                            </div>
                                            <div>
                                                <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{testimonial.name}</div>
                                                <div className="text-sm opacity-60">{testimonial.role}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

             {/* --- CTA Section --- */}
             <section className="py-32 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay"></div>
                
                {/* Abstract Shapes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
                    <motion.h2 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-8xl font-black mb-8 tracking-tighter"
                    >
                        Ready to join the revolution?
                    </motion.h2>
                    <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-2xl mx-auto font-medium">
                        Join thousands of users who are already saving money and reducing their carbon footprint.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/register" className="bg-white text-blue-600 px-12 py-5 rounded-full font-bold text-xl transition-all hover:scale-105 shadow-2xl hover:bg-gray-50 flex items-center justify-center gap-2">
                            Get Started Now <ArrowRight className="w-6 h-6" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* --- Footer --- */}
            <footer className={`py-20 px-6 border-t ${isDark ? 'bg-[#05080f] border-white/5 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-xl ${isDark ? 'bg-white' : 'bg-black'}`}>
                                <Share2 className={`w-5 h-5 ${isDark ? 'text-black' : 'text-white'}`} />
                            </div>
                            <span className={`font-extrabold text-2xl tracking-tighter ${isDark ? 'text-white' : 'text-gray-900'}`}>CircleShare</span>
                        </div>
                        <p className="max-w-sm mb-8">
                            Reimagining ownership for the 21st century. We believe in access over excess, community over isolation.
                        </p>
                        <div className="flex gap-4">
                            {[Star, Globe, Shield].map((Icon, i) => (
                                <a key={i} href="#" className={`p-3 rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-200 hover:bg-gray-300'}`}>
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <h4 className={`font-bold text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Platform</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">How it Works</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Safety & Trust</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Mobile App</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className={`font-bold text-lg mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Stories</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className={`pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm ${isDark ? 'border-white/5' : 'border-gray-200'}`}>
                    <div>&copy; 2024 CircleShare Inc. All rights reserved.</div>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-blue-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-blue-500 transition-colors">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
