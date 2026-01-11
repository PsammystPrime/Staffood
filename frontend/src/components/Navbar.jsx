import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Home, Store, Package, UserCircle, LogIn, UserPlus, LogOut } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { getCartCount } = useShop();
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const count = getCartCount();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        logout();
        closeMenu();
        navigate('/'); // Navigate to home after logout
    };

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
                    {isAuthenticated() && <Link to="/history">Orders</Link>}
                </div>

                <div className="nav-actions">
                    <Link to="/cart" className="cart-icon" onClick={closeMenu}>
                        <ShoppingCart size={24} />
                        {count > 0 && <span className="cart-badge">{count}</span>}
                    </Link>

                    {/* Show Login/Signup for unauthenticated users */}
                    {!isAuthenticated() ? (
                        <>
                            <Link to="/login" className="btn-auth desktop-only" onClick={closeMenu}>
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                            <Link to="/register" className="btn-auth btn-auth-primary desktop-only" onClick={closeMenu}>
                                <UserPlus size={18} />
                                <span>Sign Up</span>
                            </Link>
                        </>
                    ) : (
                        /* Show Profile for authenticated users */
                        <Link to="/profile" className="user-icon desktop-only" onClick={closeMenu}>
                            <User size={24} />
                        </Link>
                    )}

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

                    {isAuthenticated() ? (
                        <>
                            <Link to="/history" onClick={closeMenu}>
                                <Package size={20} />
                                <span>Orders</span>
                            </Link>
                            <Link to="/profile" onClick={closeMenu}>
                                <UserCircle size={20} />
                                <span>My Profile</span>
                            </Link>
                            <button className="mobile-menu-logout" onClick={handleLogout}>
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu}>
                                <LogIn size={20} />
                                <span>Login</span>
                            </Link>
                            <Link to="/register" onClick={closeMenu}>
                                <UserPlus size={20} />
                                <span>Sign Up</span>
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
