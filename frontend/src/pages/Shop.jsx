import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { Filter } from 'lucide-react';
import './Shop.css';
import { API_URL } from '../config';

const Shop = () => {
    const [category, setCategory] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProducts();
    }, [category]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const url = category === 'All'
                ? `${API_URL}/api/products`
                : `${API_URL}/api/products?category=${category}`;

            const response = await fetch(url);
            const data = await response.json();

            if (response.ok) {
                // Sort alphabetically by name
                const sortedProducts = data.products.sort((a, b) => a.name.localeCompare(b.name));
                setProducts(sortedProducts);
            } else {
                setError(data.message || 'Failed to fetch products');
            }
        } catch (err) {
            setError('Network error. Please try again.');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container section">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h2 className="section-title mb-0" style={{ marginBottom: 0 }}>Shop</h2>

                    <div className="filter-menu">
                        <button
                            className={`filter-btn ${category === 'All' ? 'active' : ''}`}
                            onClick={() => setCategory('All')}
                        >
                            <Filter size={18} />
                            All
                        </button>
                        <button
                            className={`filter-btn ${category === 'Fruits' ? 'active' : ''}`}
                            onClick={() => setCategory('Fruits')}
                        >
                            Fruits
                        </button>
                        <button
                            className={`filter-btn ${category === 'Juices' ? 'active' : ''}`}
                            onClick={() => setCategory('Juices')}
                        >
                            Juices
                        </button>
                        <button
                            className={`filter-btn ${category === 'Groceries' ? 'active' : ''}`}
                            onClick={() => setCategory('Groceries')}
                        >
                            Groceries
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center' }}>
                        <Loader />
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p>{error}</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="empty-state">
                        <p>No products found in this category.</p>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Shop;
