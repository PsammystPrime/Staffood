const express = require('express');
const router = express.Router();
const db = require('../config/database');

// @route   POST /api/orders
// @desc    Create new order and initiate payment
// @access  Private
router.post('/', async (req, res) => {
    let connection;
    try {
        const { userId, items, delivery, phone, location, notes } = req.body;

        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ message: 'Missing required order fields' });
        }

        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Calculate totals securely on server
        let subtotal = 0;
        const validItems = [];

        for (const item of items) {
            const [rows] = await connection.query(
                'SELECT id, name, price, stock_quantity, is_available FROM products WHERE id = ?',
                [item.id]
            );

            if (rows.length === 0 || !rows[0].is_available) {
                throw new Error(`Product with ID ${item.id} is unavailable`);
            }

            const product = rows[0];
            const itemTotal = parseFloat(product.price) * item.quantity;
            subtotal += itemTotal;

            validItems.push({
                product_id: product.id,
                product_name: product.name,
                price: parseFloat(product.price),
                quantity: item.quantity,
                subtotal: itemTotal
            });
        }

        const deliveryFee = delivery ? 100 : 0;
        const total = subtotal + deliveryFee;
        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        // 2. Create Order
        const [orderResult] = await connection.query(
            `INSERT INTO orders 
            (user_id, order_number, subtotal, delivery_fee, total, status, payment_method, payment_status, phone_number, delivery_location, notes) 
            VALUES (?, ?, ?, ?, ?, 'Pending', 'M-Pesa', 'Pending', ?, ?, ?)`,
            [userId, orderNumber, subtotal, deliveryFee, total, phone, location, notes]
        );

        const orderId = orderResult.insertId;

        // 3. Create Order Items
        for (const item of validItems) {
            await connection.query(
                `INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) 
                VALUES (?, ?, ?, ?, ?, ?)`,
                [orderId, item.product_id, item.product_name, item.quantity, item.price, item.subtotal]
            );
        }

        // 4. Clear/Remove processed items from User's Cart
        await connection.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Order created successfully. Initiate M-Pesa payment.',
            order: {
                id: orderId,
                orderNumber,
                total
            }
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Order creation error:', error);
        res.status(500).json({ message: error.message || 'Server error creating order' });
    } finally {
        if (connection) connection.release();
    }
});

// @route   GET /api/orders/user/:userId
// @desc    Get all orders for a specific user with items
// @access  Private
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Fetch orders
        const [orders] = await db.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );

        // Fetch items for each order
        // Note: In production, a JOIN or single query with aggregation is better for performance,
        // but for simplicity and clarity here, we'll map.
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const [items] = await db.query(
                'SELECT product_name, quantity, price, subtotal FROM order_items WHERE order_id = ?',
                [order.id]
            );
            return {
                ...order,
                items
            };
        }));

        res.json({ success: true, orders: ordersWithItems });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// @route   GET /api/orders/admin
// @desc    Get all orders for admin (with user details)
// @access  Private/Admin
router.get('/admin', async (req, res) => {
    try {
        // Fetch all orders with user name
        const [orders] = await db.query(`
            SELECT o.*, u.name as user_name 
            FROM orders o 
            LEFT JOIN users u ON o.user_id = u.id 
            ORDER BY o.created_at DESC
        `);

        // Fetch items for each order
        const ordersWithItems = await Promise.all(orders.map(async (order) => {
            const [items] = await db.query(
                'SELECT product_name, quantity, price, subtotal FROM order_items WHERE order_id = ?',
                [order.id]
            );
            return {
                ...order,
                items
            };
        }));

        res.json({ success: true, orders: ordersWithItems });
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const [result] = await db.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json({ success: true, message: 'Order status updated successfully' });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error updating order status' });
    }
});

module.exports = router;
