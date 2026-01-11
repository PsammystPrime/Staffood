import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

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
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Staffoods API Server Running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Determine if running directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}

export default app;
