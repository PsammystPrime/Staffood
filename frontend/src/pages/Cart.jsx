import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
    // Mock cart data
    const [cartItems, setCartItems] = useState([
        { id: 1, name: 'Fresh Mangoes', price: 150, quantity: 2, image: 'https://placehold.co/100x100/FFCC00/1A1A1A?text=Mango' },
        { id: 2, name: 'Premium Rice (5kg)', price: 1200, quantity: 1, image: 'https://placehold.co/100x100/FEFCF5/1A1A1A?text=Rice' },
    ]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = 100; // Mock fee
    const total = subtotal + deliveryFee;

    return (
        <>
            <Navbar />
            <div className="container section">
                <h2 className="section-title">Your Cart</h2>

                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item.id} className="cart-item card p-4 flex gap-4 items-center">
                                <img src={item.image} alt={item.name} className="cart-item-img" />
                                <div className="flex-1">
                                    <h3 className="font-bold">{item.name}</h3>
                                    <p className="text-gray-500">Ksh {item.price}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="quantity-controls flex items-center gap-2">
                                        <button className="btn-sm">-</button>
                                        <span>{item.quantity}</span>
                                        <button className="btn-sm">+</button>
                                    </div>
                                    <button className="text-danger">
                                        <Trash2 size={20} color="#EF4444" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary card p-4">
                        <h3 className="font-bold text-xl mb-4">Order Summary</h3>
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>Ksh {subtotal}</span>
                        </div>
                        <div className="flex justify-between mb-4">
                            <span>Delivery Fee</span>
                            <span>Ksh {deliveryFee}</span>
                        </div>
                        <div className="flex justify-between font-bold text-xl mb-6 border-t pt-4">
                            <span>Total</span>
                            <span>Ksh {total}</span>
                        </div>

                        <Link to="/checkout" className="btn btn-primary w-full">
                            Proceed to M-Pesa Checkout <ArrowRight size={18} />
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cart;
