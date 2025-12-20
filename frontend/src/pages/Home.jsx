import React from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import './Home.css';
import { useNavigate } from 'react-router-dom';

import { PRODUCTS } from '../data/products';

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
