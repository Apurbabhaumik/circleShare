const express = require('express');
const router = express.Router();
const Circle = require('../models/Circle');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/circles
// @desc    Create a new circle
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Circle name is required' });
        }

        const circle = await Circle.create({
            name,
            description,
            admin: req.user._id,
            members: [req.user._id] // Admin is first member
        });

        // Add circle to user's list
        await User.findByIdAndUpdate(req.user._id, {
            $push: { circles: circle._id }
        });

        res.status(201).json(circle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   POST /api/circles/join
// @desc    Join a circle via invite code
// @access  Private
router.post('/join', protect, async (req, res) => {
    try {
        const { inviteCode } = req.body;

        const circle = await Circle.findOne({ inviteCode });

        if (!circle) {
            return res.status(404).json({ message: 'Circle not found with that code' });
        }

        if (circle.members.includes(req.user._id)) {
            return res.status(400).json({ message: 'You are already a member of this circle' });
        }

        circle.members.push(req.user._id);
        await circle.save();

        // Add circle to user's list
        await User.findByIdAndUpdate(req.user._id, {
            $push: { circles: circle._id }
        });

        res.status(200).json(circle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @route   GET /api/circles
// @desc    Get all circles specific to the logged in user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('circles');
        res.json(user.circles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
