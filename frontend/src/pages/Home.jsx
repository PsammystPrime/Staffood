import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import './Home.css';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products');
            const data = await response.json();

            if (response.ok) {
                // Show only first 6 products for featured section
                setProducts(data.products.slice(0, 6));
            }
        } catch (err) {
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

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
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader />
                    </div>
                ) : (
                    <div className="grid grid-cols-3">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
};

export default Home;
