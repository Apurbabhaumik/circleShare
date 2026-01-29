const mongoose = require('mongoose');

const LoanSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        required: true
    },
    borrower: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    lender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Active', 'Completed', 'Rejected', 'Overdue'],
        default: 'Pending'
    },
    returnCondition: {
        type: String,
        enum: ['Good', 'Damaged', 'Lost'],
    }
}, { timestamps: true });

module.exports = mongoose.model('Loan', LoanSchema);
