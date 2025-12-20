import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Cart.css';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useShop();
    const [includeDelivery, setIncludeDelivery] = useState(true);

    const subtotal = getCartTotal();
    const deliveryFee = (subtotal > 0 && includeDelivery) ? 100 : 0;
    const total = subtotal + deliveryFee;

    return (
        <>
            <Navbar />
            <div className="container section">
                <h2 className="section-title">Your Cart</h2>

                {cart.length === 0 ? (
                    <div className="text-center">
                        <p className="text-xl mb-4">Your cart is empty.</p>
                        <Link to="/products" className="btn btn-primary">Start Shopping</Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {cart.map(item => (
                                <div key={item.id} className="cart-item card p-4 flex gap-4 items-center">
                                    <img src={item.image} alt={item.name} className="cart-item-img" />
                                    <div className="flex-1">
                                        <h3 className="font-bold">{item.name}</h3>
                                        <p className="text-gray-500">Ksh {item.price}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="quantity-controls flex items-center gap-2">
                                            <button
                                                className="btn-sm"
                                                onClick={() => updateQuantity(item.id, -1)}
                                            >-</button>
                                            <span>{item.quantity}</span>
                                            <button
                                                className="btn-sm"
                                                onClick={() => updateQuantity(item.id, 1)}
                                            >+</button>
                                        </div>
                                        <button
                                            className="text-danger"
                                            onClick={() => removeFromCart(item.id)}
                                        >
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

                            <div className="delivery-toggle mb-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includeDelivery}
                                        onChange={(e) => setIncludeDelivery(e.target.checked)}
                                        className="delivery-checkbox"
                                    />
                                    <span className="text-sm">Include delivery fee (Ksh 100)</span>
                                </label>
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
                )}
            </div>
        </>
    );
};

export default Cart;
