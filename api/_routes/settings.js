import express from 'express';
import jwt from 'jsonwebtoken';
import db from '../_config/database.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// @route   GET /api/settings/delivery-fee
// @desc    Get current delivery fee
// @access  Public
router.get('/delivery-fee', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT delivery_fee FROM settings WHERE id = 1');
        if (rows.length === 0) {
            return res.json({ success: true, deliveryFee: 100.00 }); // Fallback
        }
        res.json({ success: true, deliveryFee: parseFloat(rows[0].delivery_fee) });
    } catch (error) {
        console.error('Error fetching delivery fee:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/settings/delivery-fee
// @desc    Update delivery fee
// @access  Private/Admin
router.put('/delivery-fee', async (req, res) => {
    try {
        // Simple Admin Auth Check
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            if (decoded.role !== 'admin' && !decoded.isAdmin) {
                return res.status(403).json({ message: 'Forbidden' });
            }
        } catch (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { deliveryFee } = req.body;
        
        if (deliveryFee === undefined || isNaN(deliveryFee)) {
            return res.status(400).json({ message: 'Invalid delivery fee' });
        }

        // Upsert logic
        await db.query(
            'INSERT INTO settings (id, delivery_fee) VALUES (1, ?) ON DUPLICATE KEY UPDATE delivery_fee = ?',
            [deliveryFee, deliveryFee]
        );

        res.json({ success: true, message: 'Delivery fee updated successfully' });
    } catch (error) {
        console.error('Error updating delivery fee:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
