import React from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import './Home.css';
import { useNavigate } from 'react-router-dom';

const PRODUCTS = [
    { id: 1, name: 'Fresh Mangoes', category: 'Fruits', price: 150, image: '/mangoes.png' },
    { id: 2, name: 'Orange Juice', category: 'Juices', price: 250, image: '/orange_juice.png' },
    { id: 3, name: 'Premium Rice (5kg)', category: 'Groceries', price: 1200, image: '/rice.png' },
    { id: 4, name: 'Ripe Avocados', category: 'Fruits', price: 80, image: '/avocado.png' },
    { id: 5, name: 'Cooking Oil (1L)', category: 'Groceries', price: 450, image: '/oil.png' },
];

const Home = () => {
    const navigate = useNavigate();

    const scrollToShop = () => {
        document.getElementById('shop-section').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            <Navbar />
            <header className="hero">
                <div className="container hero-content">
                    <h1>Freshness Delivered to <br /><span className="text-highlight">Kahawa Sukari</span></h1>
                    <p>Order fresh fruits, juices, and groceries from the comfort of your home.</p>
                    <button className="btn btn-primary hero-btn" onClick={scrollToShop}>Shop Now</button>
                </div>
            </header>

            <main className="container section" id="shop-section">
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
