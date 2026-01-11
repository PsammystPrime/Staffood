import express from 'express';
import db from '../config/database.js';

const router = express.Router();

// Middleware to extract user ID (assuming you have one, or we pass it in)
// For now, we'll assume the frontend sends userId in the body or query for simplicity, 
// or optimally extract it from the token if we had middleware set up.
// Since we don't have global middleware yet, we'll check body/params.

// @route   GET /api/cart/:userId
// @desc    Get user cart with product details (real-time prices)
// @access  Private
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const query = `
            SELECT 
                ci.id as cart_item_id,
                ci.quantity,
                p.id as product_id,
                p.name,
                p.price,
                p.image,
                p.category,
                p.stock_quantity,
                p.is_available
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.id
            WHERE ci.user_id = ?
        `;

        const [cartItems] = await db.query(query, [userId]);

        // Calculate totals on the fly
        let subtotal = 0;
        cartItems.forEach(item => {
            subtotal += parseFloat(item.price) * item.quantity;
        });

        res.json({
            success: true,
            cartItems,
            subtotal
        });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Server error fetching cart' });
    }
});

// @route   POST /api/cart/add
// @desc    Add item to cart or update quantity if exists
// @access  Private
router.post('/add', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;
        
        if (!userId || !productId) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const qty = quantity || 1;

        // Check if item exists in cart
        const [existing] = await db.query(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        if (existing.length > 0) {
            // Update quantity
            const newQty = existing[0].quantity + qty;
            await db.query(
                'UPDATE cart_items SET quantity = ? WHERE id = ?',
                [newQty, existing[0].id]
            );
        } else {
            // Insert new item
            await db.query(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, qty]
            );
        }

        res.json({ success: true, message: 'Cart updated' });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Server error updating cart' });
    }
});

// @route   PUT /api/cart/update
// @desc    Update specific item quantity
// @access  Private
router.put('/update', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (quantity < 1) {
            // If quantity < 1, remove item
            await db.query(
                'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
                [userId, productId]
            );
        } else {
            await db.query(
                'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
        }

        res.json({ success: true, message: 'Cart updated' });

    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Server error updating cart item' });
    }
});

// @route   DELETE /api/cart/remove
// @desc    Remove item from cart
// @access  Private
router.delete('/remove', async (req, res) => {
    try {
        const { userId, productId } = req.body;

        await db.query(
            'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );

        res.json({ success: true, message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Server error removing item' });
    }
});

// @route   DELETE /api/cart/clear
// @desc    Clear user cart
// @access  Private
router.delete('/clear', async (req, res) => {
    try {
        const { userId } = req.body;

        await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);

        res.json({ success: true, message: 'Cart cleared' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ message: 'Server error clearing cart' });
    }
});

export default router;
