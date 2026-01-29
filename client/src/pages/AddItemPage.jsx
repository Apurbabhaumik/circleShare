import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Camera, Save, ArrowLeft } from 'lucide-react';

const AddItemPage = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Other');
    const [condition, setCondition] = useState('Good');
    const [selectedCircles, setSelectedCircles] = useState([]);
    const [userCircles, setUserCircles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchCircles();
    }, []);

    const fetchCircles = async () => {
        try {
            const res = await axios.get('/circles');
            setUserCircles(res.data);
            // Default select all circles? No, let user choose.
            if (res.data.length > 0) {
                setSelectedCircles([res.data[0]._id]);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCircleToggle = (circleId) => {
        setSelectedCircles(prev => 
            prev.includes(circleId) 
                ? prev.filter(id => id !== circleId)
                : [...prev, circleId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/items', {
                name,
                description,
                category,
                condition,
                circles: selectedCircles,
                images: [] // Placeholder for now
            });
            navigate('/');
        } catch (error) {
            console.error(error);
            alert('Failed to add item');
        } finally {
            setLoading(false);
        }
    };

    const categories = ['Tools', 'Kitchen', 'Electronics', 'Outdoors', 'Books', 'Other'];
    const conditions = ['New', 'Good', 'Fair', 'Poor'];

    return (
        <div className="max-w-2xl mx-auto">
            <button 
                onClick={() => navigate('/')} 
                className="mb-6 flex items-center text-gray-500 hover:text-blue-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Dashboard
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-lg">
                        <Camera className="w-6 h-6 text-blue-600" />
                    </div>
                    Share New Item
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Cordless Drill"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            rows="3"
                            placeholder="Any details about the item..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Condition */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                value={condition}
                                onChange={(e) => setCondition(e.target.value)}
                            >
                                {conditions.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Circles Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Share with Circles</label>
                        {userCircles.length > 0 ? (
                            <div className="space-y-2 border rounded-lg p-4 bg-gray-50 max-h-48 overflow-y-auto">
                                {userCircles.map(circle => (
                                    <label key={circle._id} className="flex items-center gap-3 p-2 bg-white rounded border border-gray-100 cursor-pointer hover:border-blue-300 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                            checked={selectedCircles.includes(circle._id)}
                                            onChange={() => handleCircleToggle(circle._id)}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{circle.name}</span>
                                    </label>
                                ))}
                            </div>
                        ) : (
                            <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded-lg">
                                You need to join a circle before you can share items!
                            </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                            Your item will only be visible to members of the selected circles.
                        </p>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || selectedCircles.length === 0}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? 'Saving...' : (
                            <>
                                <Save className="w-5 h-5" />
                                Add to Inventory
                            </>
                        )}
                    </button>
                    {selectedCircles.length === 0 && userCircles.length > 0 && (
                        <p className="text-center text-red-500 text-xs mt-2">Please select at least one circle.</p>
                    )}
                </form>
            </div>
        </div>
    );
};

export default AddItemPage;
