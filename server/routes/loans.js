const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
const Item = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

// @desc    Request to borrow an item
// @route   POST /api/loans/request
// @access  Private
router.post('/request', protect, async (req, res) => {
    try {
        const { itemId, startDate, endDate } = req.body;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        if (item.owner.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot borrow your own item' });
        }

        if (item.status !== 'Available') {
            return res.status(400).json({ message: 'Item is not available' });
        }

        const loan = await Loan.create({
            item: itemId,
            borrower: req.user._id,
            lender: item.owner,
            startDate,
            endDate,
            status: 'Pending'
        });

        res.status(201).json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Approve or Reject a loan request
// @route   PUT /api/loans/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
    try {
        const { status } = req.body; // 'Approved' or 'Rejected'
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: 'Loan request not found' });
        }

        // Only the lender can approve/reject
        if (loan.lender.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized to manage this loan' });
        }

        loan.status = status;
        await loan.save();

        // If approved, update item status to 'Borrowed'
        if (status === 'Approved') {
            const item = await Item.findById(loan.item);
            item.status = 'Borrowed';
            await item.save();
            loan.status = 'Active'; // Switch to Active immediately upon approval
             await loan.save();
        } else if (status === 'Rejected') {
            loan.status = 'Rejected';
            await loan.save();
        }

        res.json(loan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const User = require('../models/User');

// @desc    Mark loan as returned/completed
// @route   PUT /api/loans/:id/return
// @access  Private
router.put('/:id/return', protect, async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.id);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Allow Lender or Borrower to mark as returned (for simplicity)
        if (loan.borrower.toString() !== req.user._id.toString() && loan.lender.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        loan.status = 'Completed';
        await loan.save();

        // Make item available again
        const item = await Item.findById(loan.item);
        item.status = 'Available';
        await item.save();

        // Increment Borrower's Trust Score
        const borrower = await User.findById(loan.borrower);
        if (borrower) {
            borrower.trustScore = (borrower.trustScore || 100) + 5;
            await borrower.save();
        }

        res.json({ message: 'Loan completed', loan, newTrustScore: borrower ? borrower.trustScore : null });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get my loans (both borrowing and lending)
// @route   GET /api/loans/mine
// @access  Private
router.get('/mine', protect, async (req, res) => {
    try {
        const loans = await Loan.find({
            $or: [{ borrower: req.user._id }, { lender: req.user._id }]
        })
        .populate('item', 'name images category')
        .populate('borrower', 'username profileImage')
        .populate('lender', 'username profileImage')
        .sort({ createdAt: -1 });

        res.json(loans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
