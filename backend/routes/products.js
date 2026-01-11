const express = require('express');
const router = express.Router();
const db = require('../config/database');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        
        let query = 'SELECT * FROM products WHERE is_available = TRUE';
        let params = [];

        if (category && category !== 'All') {
            query += ' AND category = ?';
            params.push(category);
        }

        query += ' ORDER BY name ASC';

        const [products] = await db.query(query, params);

        res.json({
            success: true,
            count: products.length,
            products
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products WHERE id = ? AND is_available = TRUE',
            [req.params.id]
        );

        if (products.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            success: true,
            product: products[0]
        });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Server error fetching product' });
    }
});

// @route   POST /api/products
// @desc    Create new product (Admin only)
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const { name, category, price, image, description, stock_quantity } = req.body;

        // Validation
        if (!name || !category || !price || !image) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const [result] = await db.query(
            'INSERT INTO products (name, category, price, image, description, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)',
            [name, category, price, image, description || null, stock_quantity || 0]
        );

        res.status(201).json({
            success: true,
            message: 'Product created successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Server error creating product' });
    }
});

// @route   PUT /api/products/:id
// @desc    Update product (Admin only)
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const { name, category, price, image, description, stock_quantity, is_available } = req.body;

        const [result] = await db.query(
            'UPDATE products SET name = ?, category = ?, price = ?, image = ?, description = ?, stock_quantity = ?, is_available = ? WHERE id = ?',
            [name, category, price, image, description, stock_quantity, is_available, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            success: true,
            message: 'Product updated successfully'
        });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
});

// @route   DELETE /api/products/:id
// @desc    Delete product (Admin only)
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'DELETE FROM products WHERE id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            success: true,
            message: 'Product deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Server error deleting product' });
    }
});

module.exports = router;
