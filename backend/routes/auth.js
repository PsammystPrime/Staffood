const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

// JWT Secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { username, email, phone, password, location } = req.body;
        // Validation
        if (!username || !email || !phone || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE email = ? OR username = ? OR phone = ?',
            [email, username, phone]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this email or username' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)',
            [username, email, phone, hashedPassword]
        );

        const userId = result.insertId;

        // Initialize user points
        await db.query(
            'INSERT INTO user_points (user_id, points, total_spent, total_orders) VALUES (?, 0, 0, 0)',
            [userId]
        );

        // Create JWT token
        const token = jwt.sign(
            { id: userId, email, username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                username,
                email,
                phone
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if user exists
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'No such user,please register' });
        }

        const user = users[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials, try again' });
        }

        // Get user points
        const [pointsData] = await db.query(
            'SELECT * FROM user_points WHERE user_id = ?',
            [user.id]
        );

        // Create JWT token
        const token = jwt.sign(
            { id: user.id, email: user.email, username: user.username },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                points: pointsData[0]?.points || 0
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @route   POST /api/auth/admin-login
// @desc    Login admin user
// @access  Public
router.post('/admin-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        // Check if admin exists
        const [admins] = await db.query(
            'SELECT * FROM users WHERE email = ? AND role = "admin"',
            [email]
        );

        if (admins.length === 0) {
            return res.status(401).json({ message: 'No such user' });
        }

        const admin = admins[0];

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        // Update last login
        await db.query(
            'UPDATE admin_users SET last_login = NOW() WHERE id = ?',
            [admin.id]
        );

        // Create JWT token
        const token = jwt.sign(
            { id: admin.id, email: admin.email, role: admin.role, isAdmin: true },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Admin login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error during admin login' });
    }
});

module.exports = router;
