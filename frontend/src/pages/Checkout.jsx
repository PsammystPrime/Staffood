import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { CheckCircle, MapPin, Phone, CreditCard, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const Checkout = () => {
    const { user } = useAuth();
    const { cart, getCartTotal, clearCart } = useShop();
    const navigate = useNavigate();

    // Use initial state or default to empty string, but we'll set it in useEffect to be safe
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const subtotal = getCartTotal();
    const deliveryFee = 100;
    const total = subtotal + deliveryFee;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Pre-fill data if available
        if (user.phone) setPhone(user.phone);
        if (user.location) setLocation(user.location);
    }, [user, navigate]);

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        if (cart.length === 0) {
            setError('Your cart is empty');
            setLoading(false);
            return;
        }

        try {
            // Prepare payload with only IDs and quantities
            const orderItems = cart.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    items: orderItems,
                    delivery: true, // Assuming always delivery for now
                    phone,
                    location, // This is the delivery location
                    notes
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // In a real app, we would wait for M-Pesa Callback
                // For now, we simulate success message
                alert(`Order Placed Successfully! Order #${data.order.orderNumber}. \nCheck your phone ${phone} for the STK push.`);

                clearCart();
                navigate('/history');
            } else {
                setError(data.message || 'Order creation failed');
            }
        } catch (err) {
            console.error('Payment Error:', err);
            setError('Network error processing order');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    return (
        <>
            <Navbar />
            <div className="container section flex justify-center bg-gray-50 min-h-screen">
                <div className="w-full max-w-2xl">
                    <h2 className="section-title text-center mb-8">Secure Checkout</h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Order Summary Column */}
                        <div className="order-summary-card">
                            <h3 className="card-header">Order Summary</h3>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal ({cart.length} items)</span>
                                    <span>Ksh {subtotal.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span>Ksh {deliveryFee}</span>
                                </div>
                                <div className="summary-total">
                                    <span>Total to Pay</span>
                                    <span>Ksh {total.toLocaleString()}</span>
                                </div>
                            </div>
                            <div className="secure-badge">
                                <CheckCircle size={14} />
                                <span>SSL Secure Payment</span>
                            </div>
                        </div>

                        {/* Delivery Details Form */}
                        <div className="delivery-form-card">
                            <h3 className="card-header">Delivery & Payment</h3>

                            {error && <div className="error-message mb-4">{error}</div>}

                            <form onSubmit={handlePayment}>
                                <div className="form-group mb-4">
                                    <label className="form-label">Delivery Location</label>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <MapPin size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder={user?.location || "e.g. Kahawa Sukari, Avenue 1"}
                                            className="form-input"
                                            value={location}
                                            onChange={e => setLocation(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <span className="helper-text">We'll deliver to this address.</span>
                                </div>

                                <div className="form-group mb-4">
                                    <label className="form-label">M-Pesa Number</label>
                                    <div className="input-group">
                                        <div className="input-icon">
                                            <Phone size={18} />
                                        </div>
                                        <input
                                            type="number"
                                            placeholder={user?.phone || "07XX XXX XXX"}
                                            className="form-input"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <span className="helper-text">For Payment Prompt & Delivery Contact</span>
                                </div>

                                <div className="form-group mb-6">
                                    <label className="form-label">Notes (Optional)</label>
                                    <textarea
                                        placeholder="Specific instructions (e.g. 'Leave at gate')"
                                        className="form-textarea"
                                        rows="2"
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block checkout-btn"
                                    disabled={loading}
                                >
                                    <span>Pay Ksh {total.toLocaleString()}</span>
                                    <div className="btn-icon-bg">
                                        <ChevronRight size={20} />
                                    </div>
                                </button>

                                <div className="payment-methods mt-4">
                                    <p>Safe and seamless payment via</p>
                                    <div className="mpesa-badge">M-PESA</div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
