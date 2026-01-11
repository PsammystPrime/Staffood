import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import ip from 'ip';

import authRoutes from './routes/auth.js';
import productsRoutes from './routes/products.js';
import usersRoutes from './routes/users.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/users', usersRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Staffoods API Server Running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    const HOST = '0.0.0.0'; // Listen on all network interfaces

    app.listen(PORT, HOST, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Accessible on your network at http://${ip.address()}:${PORT}`);
    });
}

// Export the Express app for Vercel serverless
export default app;
