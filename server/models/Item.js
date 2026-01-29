const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        enum: ['Tools', 'Kitchen', 'Electronics', 'Outdoors', 'Books', 'Other'],
        default: 'Other'
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Poor'],
        default: 'Good'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    circles: [{ // Which circles check this item is visible to
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle'
    }],
    status: {
        type: String,
        enum: ['Available', 'Borrowed', 'Maintenance'],
        default: 'Available'
    },
    images: [{
        type: String
    }]
}, { timestamps: true });

module.exports = mongoose.model('Item', ItemSchema);
