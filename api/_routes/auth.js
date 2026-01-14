import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../_config/database.js';

const router = express.Router();

// JWT Secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET;

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, phone, password, location } = req.body;
        
        // Basic Validation
        if (!name || !phone || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        // Kenyan Phone Validation (accepts 07..., 01..., 254..., +254...)
        const kenyanPhoneRegex = /^(?:254|\+254|0)?([71]\d{8})$/;
        const match = phone.match(kenyanPhoneRegex);
        if (!match) {
            return res.status(400).json({ message: 'Please provide a valid Kenyan phone number (e.g., 0712345678)' });
        }
        
        // Normalize phone to format like 0712345678
        const normalizedPhone = '0' + match[1];
        const generatedEmail = `${normalizedPhone}@staffoods.co.ke`;

        // Check if user already exists
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE phone = ? OR email = ?',
            [normalizedPhone, generatedEmail]
        );

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'User already exists with this phone number' });
        }

        // Generate unique username from name
        const baseUsername = name.toLowerCase().replace(/\s+/g, '');
        let username = baseUsername;
        let counter = 1;

        // Check if username exists and generate unique one
        while (true) {
            const [usernameCheck] = await db.query(
                'SELECT id FROM users WHERE username = ?',
                [username]
            );

            if (usernameCheck.length === 0) {
                break; // Username is unique
            }

            // Add random number to make it unique
            username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
            counter++;

            if (counter > 10) {
                // Fallback to timestamp if too many attempts
                username = `${baseUsername}${Date.now()}`;
                break;
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert user
        const [result] = await db.query(
            'INSERT INTO users (name, username, email, phone, location, password) VALUES (?, ?, ?, ?, ?, ?)',
            [name, username, generatedEmail, normalizedPhone, location || null, hashedPassword]
        );

        const userId = result.insertId;

        // Initialize user points with default values
        await db.query(
            'INSERT INTO user_points (user_id, points, total_spent, total_orders) VALUES (?, 0, 0, 0)',
            [userId]
        );

        // Create JWT token
        const token = jwt.sign(
            { id: userId, email: generatedEmail, username, name, role: 'user' },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            token,
            user: {
                id: userId,
                name,
                username,
                email: generatedEmail,
                phone: normalizedPhone,
                role: 'user'
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
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({ message: 'Please provide phone number and password' });
        }

        // Normalize phone for searching
        const kenyanPhoneRegex = /^(?:254|\+254|0)?([71]\d{8})$/;
        const match = phone.match(kenyanPhoneRegex);
        if (!match) {
            return res.status(400).json({ message: 'Invalid phone number format' });
        }
        const normalizedPhone = '0' + match[1];

        // Check if user exists
        const [users] = await db.query(
            'SELECT * FROM users WHERE phone = ?',
            [normalizedPhone]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'No such user, please register' });
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
            { id: user.id, email: user.email, username: user.username, name: user.name, role: user.role },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                email: user.email,
                phone: user.phone,
                location: user.location,
                role: user.role,
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
        const { phone, password } = req.body;

        // Validation
        if (!phone || !password) {
            return res.status(400).json({ message: 'Please provide phone and password' });
        }

        // Normalize 
        const kenyanPhoneRegex = /^(?:254|\+254|0)?([71]\d{8})$/;
        const match = phone.match(kenyanPhoneRegex);
        const normalizedPhone = match ? '0' + match[1] : phone;

        // Check if admin exists
        const [admins] = await db.query(
            "SELECT * FROM users WHERE phone = ? AND role = 'admin'",
            [normalizedPhone]
        );

        if (admins.length === 0) {
            return res.status(401).json({ message: 'Access denied: Admin account not found' });
        }

        const admin = admins[0];

        // Check password
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

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
                name: admin.name,
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

export default router;
