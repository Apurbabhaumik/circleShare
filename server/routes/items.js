const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Circle = require('../models/Circle');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/items
// @desc    Create a new item
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, description, category, condition, circles, images } = req.body;

        if (!name || !circles) {
            return res.status(400).json({ message: 'Name and at least one Circle are required' });
        }

        const item = await Item.create({
            owner: req.user._id,
            name,
            description,
            category,
            condition,
            circles, // Array of circle IDs
            images
        });

        res.status(201).json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/items/circle/:circleId
// @desc    Get all items in a specific circle
// @access  Private
router.get('/circle/:circleId', protect, async (req, res) => {
    try {
        // First check if user is a member of this circle
        const circle = await Circle.findById(req.params.circleId);
        if (!circle) {
            return res.status(404).json({ message: 'Circle not found' });
        }

        if (!circle.members.includes(req.user._id)) {
            return res.status(403).json({ message: 'Not authorized to view this circle' });
        }

        const items = await Item.find({ circles: req.params.circleId }).populate('owner', 'username profileImage trustScore');
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/items/mine
// @desc    Get all my items
// @access  Private
router.get('/mine', protect, async (req, res) => {
    try {
        const items = await Item.find({ owner: req.user._id });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
