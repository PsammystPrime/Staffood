import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { PRODUCTS } from '../data/products';
import { Filter } from 'lucide-react';
import './Shop.css';

const Shop = () => {
    const [category, setCategory] = useState('All');

    const filteredProducts = useMemo(() => {
        let items = PRODUCTS;

        if (category !== 'All') {
            items = items.filter(product => product.category === category);
        }

        // Sort alphabetically by name
        return [...items].sort((a, b) => a.name.localeCompare(b.name));
    }, [category]);

    return (
        <>
            <Navbar />
            <div className="container section">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="section-title mb-0" style={{ marginBottom: 0 }}>Shop</h2>

                    <div className="filter-menu">
                        <button
                            className={`filter-btn ${category === 'All' ? 'active' : ''}`}
                            onClick={() => setCategory('All')}
                        >
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

                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-3">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-xl">No products found in this category.</p>
                        <button className="btn btn-outline mt-4" onClick={() => setCategory('All')}>View All Products</button>
                    </div>
                )}
            </div>
        </>
    );
};

export default Shop;
