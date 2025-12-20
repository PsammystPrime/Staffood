import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Home, Store, Package, UserCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import './Navbar.css';

const Navbar = () => {
    const { getCartCount } = useShop();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const count = getCartCount();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="logo" onClick={closeMenu}>
                    Staffoods<span className="logo-dot">.</span>
                </Link>

                {/* Desktop Links */}
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/products">Shop</Link>
                    <Link to="/history">Orders</Link>
                </div>

                <div className="nav-actions">
                    <Link to="/cart" className="cart-icon" onClick={closeMenu}>
                        <ShoppingCart size={24} />
                        {count > 0 && <span className="cart-badge">{count}</span>}
                    </Link>

                    <Link to="/profile" className="user-icon" onClick={closeMenu}>
                        <User size={24} />
                    </Link>

                    <button className="menu-icon" onClick={toggleMenu}>
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="mobile-menu">
                    <Link to="/" onClick={closeMenu}>
                        <Home size={20} />
                        <span>Home</span>
                    </Link>
                    <Link to="/products" onClick={closeMenu}>
                        <Store size={20} />
                        <span>Shop</span>
                    </Link>
                    <Link to="/history" onClick={closeMenu}>
                        <Package size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link to="/profile" onClick={closeMenu}>
                        <UserCircle size={20} />
                        <span>My Profile</span>
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
