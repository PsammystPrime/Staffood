const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock Database for development if MySQL isn't ready
const PRODUCTS = [
    { id: 1, name: 'Apple Mangoes', category: 'Fruits', price: 50, image: '/mangoes.png' },
    { id: 2, name: 'Orange Juice', category: 'Juices', price: 250, image: '/orange_juice.png' },
    // ... we can move the full list here later
];

// Routes
app.get('/', (req, res) => {
    res.send('Staffoods API is running');
});

app.get('/api/products', (req, res) => {
    res.json(PRODUCTS);
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
