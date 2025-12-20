import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import './Navbar.css'; // We'll create this for specific styles if needed, or use inline/utility

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo">
                    Staffoods<span className="logo-dot">.</span>
                </Link>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Shop</Link>
                    <Link to="/history">Orders</Link>
                </div>

                <div className="nav-actions">
                    <Link to="/cart" className="cart-icon">
                        <ShoppingCart size={24} />
                        <span className="cart-badge">3</span>
                    </Link>
                    <button className="user-icon">
                        <User size={24} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
