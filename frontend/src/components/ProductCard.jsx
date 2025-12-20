import React from 'react';
import { Plus } from 'lucide-react';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="card product-card">
            <div className="product-image-container">
                <img src={product.image} alt={product.name} className="product-image" />
            </div>
            <div className="p-4">
                <div className="flex justify-between items-center">
                    <h3 className="font-bold text-xl">{product.name}</h3>
                    <span className="price-tag">Ksh {product.price}</span>
                </div>
                <p className="text-gray-500 mt-1 text-sm">{product.category}</p>
                <button className="btn btn-primary mt-4 w-full">
                    <Plus size={18} /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
