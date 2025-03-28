require('dotenv').config();
const express = require('express');
const eventRegistrationRoutes = require('./routes/eventRegistrationRoutes'); // Import event registration routes

const cors = require('cors');
const mysql = require('mysql2');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || 'your_password',
    database: process.env.DB_NAME || 'library_management'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // Update this to match your frontend URL
    credentials: true
}));
app.use(express.json());

// Add this line to debug requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', bookRoutes);
app.use('/api/admin', studentRoutes);
app.use('/api', eventRegistrationRoutes); // Register event registration routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000; // Make sure this matches your frontend API calls
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
