import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import './Footer.css';

const Footer = ({ isAdmin }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={`footer ${isAdmin ? 'footer-admin' : ''}`}>
            <div className="container footer-content">
                <div className="footer-section footer-info">
                    <h3>Staffoods<span className="footer-logo-dot">.</span></h3>
                    <p>
                        Bringing the freshest farm produce and organic juices to your doorstep.
                        We pride ourselves on quality, health, and speed. Your neighborhood's favorite
                        one-stop grocery shop in Kahawa Sukari.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Facebook size={20} className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
                        <Instagram size={20} className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
                        <Twitter size={20} className="text-gray-400 hover:text-yellow-400 cursor-pointer transition-colors" />
                    </div>
                </div>

                <div className="footer-section footer-links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Shop</Link></li>
                        <li><Link to="/cart">My Cart</Link></li>
                        <li><Link to="/history">Order History</Link></li>
                        <li><Link to="/profile">My Profile</Link></li>
                    </ul>
                </div>

                <div className="footer-section footer-contact">
                    <h4>Contact Us</h4>
                    <ul>
                        <li className="contact-item">
                            <MapPin size={20} />
                            <span>Kahawa Sukari, Avenue 1, Near Quickmart, Nairobi, Kenya</span>
                        </li>
                        <li className="contact-item">
                            <Phone size={20} />
                            <span>+254 710 933 724</span>
                        </li>
                        <li className="contact-item">
                            <Mail size={20} />
                            <span>hello@staffoods.co.ke</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="footer-bottom">
                <div className="container footer-bottom-content">
                    <p>&copy; {currentYear} Staffoods Groceries. All rights reserved.</p>
                    <p className="footer-credit">
                        System built and maintained by <span>MASTERPIECE SOFTWARES</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
