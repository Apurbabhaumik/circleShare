const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(cookieParser());

// Database Connection
connectDB();

// Basic Route
app.get('/', (req, res) => {
    res.send('CircleShare API is running...');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/circles', require('./routes/circles'));
app.use('/api/items', require('./routes/items'));
app.use('/api/loans', require('./routes/loans'));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
