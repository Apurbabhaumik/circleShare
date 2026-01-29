import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Wrench, Book, Zap, Archive, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';
import BorrowModal from './BorrowModal';

const CategoryIcon = ({ category }) => {
    switch(category) {
        case 'Tools': return <Wrench className="w-4 h-4" />;
        case 'Books': return <Book className="w-4 h-4" />;
        case 'Electronics': return <Zap className="w-4 h-4" />;
        case 'Kitchen': return <Coffee className="w-4 h-4" />;
        default: return <Archive className="w-4 h-4" />;
    }
}

const ItemCard = ({ item }) => {
    const { user } = useContext(AuthContext);
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const isOwner = user && item.owner._id === user._id;

    const handleBorrowClick = (e) => {
        e.stopPropagation(); // Prevent triggering parent card clicks if any
        if (!isOwner) setIsBorrowModalOpen(true);
    };

    return (
        <>
            <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer"
            >
                {/* Image Placeholder */}
                <div className="h-48 bg-gray-50/50 relative overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-300">
                            <CategoryIcon category={item.category} />
                        </div>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-sm border border-white/50">
                        <CategoryIcon category={item.category} />
                        {item.category}
                    </div>
                </div>

                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-1">{item.name}</h3>
                    </div>
                    
                    <p className="text-gray-500 text-sm mb-6 line-clamp-2 min-h-[2.5rem] font-medium leading-relaxed">{item.description || 'No description provided.'}</p>
                    
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/50">
                        <div className="flex items-center gap-2">
                            {item.owner.profileImage ? (
                                 <img src={item.owner.profileImage} className="w-6 h-6 rounded-full ring-2 ring-white" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-500 flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-white shadow-sm">
                                    {item.owner.username[0].toUpperCase()}
                                </div>
                            )}
                            <span className="text-xs font-semibold text-gray-600">@{item.owner.username}</span>
                        </div>
                        
                        {!isOwner ? (
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleBorrowClick}
                                className="text-xs bg-gray-900 text-white hover:bg-black px-4 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-gray-500/20"
                            >
                                Borrow
                            </motion.button>
                        ) : (
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-2 rounded-lg">
                                Your Item
                            </span>
                        )}
                    </div>
                </div>
            </motion.div>

            <BorrowModal 
                isOpen={isBorrowModalOpen} 
                onClose={() => setIsBorrowModalOpen(false)} 
                item={item}
                onSucces={() => {
                    alert("Request Sent! (Wait for approval)"); // Temporary feedback
                }}
            />
        </>
    );
};

export default ItemCard;
