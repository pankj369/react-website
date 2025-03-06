const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const authController = {
    register: async (req, res) => {
        try {
            const { fullname, email, contact, batch, password, role } = req.body;
            
            // Validate required fields
            if (!fullname || !email || !contact || !batch || !password) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Check if user exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ message: 'Email already registered' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const user = await User.create({
                fullname,
                email,
                contact,
                batch,
                password: hashedPassword,
                role
            });

            // Create token
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.status(201).json({ 
                message: 'Registration successful',
                token,
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                    batch: user.batch
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ message: 'Error registering user' });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            console.log('Login request:', { email });

            // Find user
            const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
            
            if (users.length === 0) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const user = users[0];

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            console.log('Password verification:', { isValid: validPassword });

            if (!validPassword) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Create token
            const token = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    fullname: user.fullname,
                    email: user.email,
                    role: user.role,
                    batch: user.batch
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ success: false, message: 'Error logging in' });
        }
    }, // Added comma here

    verifyToken: async (req, res) => {
        try {
            const [users] = await db.query(
                'SELECT id, fullname, email, role, batch FROM users WHERE id = ?', 
                [req.user.id]
            );
            
            if (users.length === 0) {
                return res.status(401).json({ message: 'Token is not valid' });
            }

            res.json(users[0]);
        } catch (error) {
            console.error('Token verification error:', error);
            res.status(500).json({ message: 'Token verification failed' });
        }
    },

    getProfile: async (req, res) => {
        try {
            const [users] = await db.query(
                'SELECT id, fullname, email, contact, batch, role FROM users WHERE id = ?',
                [req.user.id]
            );

            if (users.length === 0) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.json(users[0]);
        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({ message: 'Error fetching profile' });
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { fullname, email, contact, batch } = req.body;
            
            // Check if email is already taken by another user
            const [existingUsers] = await db.query(
                'SELECT id FROM users WHERE email = ? AND id != ?',
                [email, req.user.id]
            );

            if (existingUsers.length > 0) {
                return res.status(400).json({ message: 'Email already in use' });
            }

            await db.query(
                'UPDATE users SET fullname = ?, email = ?, contact = ?, batch = ? WHERE id = ?',
                [fullname, email, contact, batch, req.user.id]
            );

            const [updatedUser] = await db.query(
                'SELECT id, fullname, email, contact, batch, role FROM users WHERE id = ?',
                [req.user.id]
            );

            res.json(updatedUser[0]);
        } catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({ message: 'Error updating profile' });
        }
    },

    logout: async (req, res) => {
        try {
            res.json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error('Logout error:', error);
            res.status(500).json({ message: 'Error logging out' });
        }
    }
};

module.exports = authController;