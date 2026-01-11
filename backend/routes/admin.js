import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// @route   GET /api/admin/stats
// @desc    Get dashboard stats
// @access  Private/Admin
router.get('/stats', async (req, res) => {
    try {
        // 1. Total Revenue (from completed orders)
        // If 'status' enum is strict, use 'Completed'. if not, check.
        // Assuming 'Completed' based on previous context.
        const [revenueResult] = await db.query(
            'SELECT SUM(total) as revenue FROM orders WHERE status = ?',
            ['Completed']
        );
        const revenue = revenueResult[0].revenue || 0;

        // 2. Total Orders
        const [ordersResult] = await db.query('SELECT COUNT(*) as count FROM orders');
        const ordersCount = ordersResult[0].count;

        // 3. Total Users
        // Assuming role 'user' or all users? Usually all registered users.
        const [usersResult] = await db.query('SELECT COUNT(*) as count FROM users');
        const usersCount = usersResult[0].count;

        // 4. Total Products
        // Count all (including unavailable, since admin manages them)
        const [productsResult] = await db.query('SELECT COUNT(*) as count FROM products');
        const productsCount = productsResult[0].count;

        // 5. Recent Orders (fetch last 5)
        const [recentOrders] = await db.query(`
            SELECT o.id, o.total as amount, o.status, o.created_at as date, u.name as customer
            FROM orders o
            LEFT JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
            LIMIT 5
        `);
        
        // Format recent orders date to YYYY-MM-DD
        const formattedOrders = recentOrders.map(order => ({
            ...order,
            date: new Date(order.date).toLocaleDateString()
        }));

        res.json({
            success: true,
            stats: {
                totalRevenue: revenue,
                totalOrders: ordersCount,
                totalUsers: usersCount,
                totalProducts: productsCount
            },
            recentOrders: formattedOrders
        });

    } catch (error) {
        console.error('Error fetching admin stats:', error);
        res.status(500).json({ message: 'Server error fetching stats' });
    }
});

export default router;
