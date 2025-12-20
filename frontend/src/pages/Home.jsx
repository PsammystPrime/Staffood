import React from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import './Home.css';

const PRODUCTS = [
    { id: 1, name: 'Fresh Mangoes', category: 'Fruits', price: 150, image: 'https://placehold.co/400x300/FFCC00/1A1A1A?text=Mangoes' },
    { id: 2, name: 'Orange Juice', category: 'Juices', price: 250, image: 'https://placehold.co/400x300/FFA500/1A1A1A?text=Juice' },
    { id: 3, name: 'Premium Rice (5kg)', category: 'Groceries', price: 1200, image: 'https://placehold.co/400x300/FEFCF5/1A1A1A?text=Rice' },
    { id: 4, name: 'Ripe Avocados', category: 'Fruits', price: 80, image: 'https://placehold.co/400x300/10B981/FFFFFF?text=Avocado' },
    { id: 5, name: 'Cooking Oil (1L)', category: 'Groceries', price: 450, image: 'https://placehold.co/400x300/FFD700/1A1A1A?text=Oil' },
    { id: 6, name: 'Mixed Berries', category: 'Fruits', price: 300, image: 'https://placehold.co/400x300/EF4444/FFFFFF?text=Berries' },
];

const Home = () => {
    return (
        <>
            <Navbar />
            <header className="hero">
                <div className="container hero-content">
                    <h1>Freshness Delivered to <br /><span className="text-highlight">Kahawa Sukari</span></h1>
                    <p>Order fresh fruits, juices, and groceries from the comfort of your home.</p>
                    <button className="btn btn-primary hero-btn">Shop Now</button>
                </div>
            </header>

            <main className="container section">
                <h2 className="section-title">Featured Products</h2>
                <div className="grid grid-cols-3">
                    {PRODUCTS.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
        </>
    );
};

export default Home;
