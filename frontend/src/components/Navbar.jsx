import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
    const { getCartCount } = useShop();
    const count = getCartCount();

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
                        {count > 0 && <span className="cart-badge">{count}</span>}
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
