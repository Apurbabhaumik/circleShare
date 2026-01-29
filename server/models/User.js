const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ''
    },
    trustScore: {
        type: Number,
        default: 100
    },
    circles: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Circle'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
