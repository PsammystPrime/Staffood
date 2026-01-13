import express from 'express';
import db from '../_config/database.js';
import authMiddleware from '../_config/authMiddleware.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users (Admin)
// @access  Private/Admin
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin' && !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied' });
        }
        const query = `
            SELECT u.id, u.name, u.username, u.email, u.phone, u.location, u.created_at,
                   COALESCE(up.points, 0) as points, 
                   COALESCE(up.total_orders, 0) as orders, 
                   COALESCE(up.total_spent, 0) as totalSpent
            FROM users u
            LEFT JOIN user_points up ON u.id = up.user_id
            ORDER BY u.created_at DESC
        `;
        
        const [users] = await db.query(query);

        res.json({
            success: true,
            users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error fetching users' });
    }
});

// @route   GET /api/users/profile/:userId
// @desc    Get user profile
// @access  Private
router.get('/profile/:userId', authMiddleware, async (req, res) => {
    try {
        // Security: Only allow user to see their own profile or admin
        if (parseInt(req.params.userId) !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: You can only view your own profile' });
        }
        const [users] = await db.query(
            'SELECT id, username,name, location, email, phone FROM users WHERE id = ?',
            [req.params.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get user points
        const [pointsData] = await db.query(
            'SELECT points, points_spent, total_spent, total_orders FROM user_points WHERE user_id = ?',
            [req.params.userId]
        );

        const user = users[0];
        const points = pointsData[0] || { points: 0, points_spent: 0, total_orders: 0 };

        res.json({
            success: true,
            user: {
                ...user,
                points: points.points,
                points_spent: points.points_spent,
                total_orders: points.total_orders
            }
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error fetching profile' });
    }
});

export default router;
