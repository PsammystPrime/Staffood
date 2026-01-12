import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { CheckCircle, MapPin, Phone, ChevronRight, Store, Truck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';
import { API_URL } from '../config';

const Checkout = () => {
    const { user } = useAuth();
    const { cart, getCartTotal, clearCart } = useShop();
    const navigate = useNavigate();
    const locationState = useLocation().state;

    // Initialize isDelivery based on passed state, default to true
    const [isDelivery, setIsDelivery] = useState(locationState?.includeDelivery !== false);

    // Initialize phone and location directly from user object if available
    const [phone, setPhone] = useState(user?.phone || '');
    const [location, setLocation] = useState(user?.location || "Kahawa Sukari, Avenue 1");
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const subtotal = getCartTotal();
    const deliveryFee = isDelivery ? 100 : 0;
    const total = subtotal + deliveryFee;

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        // Only set if state was empty (prevents overwriting user typing if re-renders happen)
        if (!phone && user.phone) setPhone(user.phone);
        if (!location && user.location) setLocation(user.location);
    }, [user, navigate, phone, location]);

    const [paymentProcessing, setPaymentProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState('waiting'); // waiting, success, failed

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
            const orderItems = cart.map(item => ({
                id: item.id,
                quantity: item.quantity
            }));

            // 1. Create Order
            const orderResponse = await fetch(`${API_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: user.id,
                    items: orderItems,
                    delivery: isDelivery,
                    phone,
                    location: isDelivery ? location : 'Pickup at Store',
                    notes
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok) {
                setError(orderData.message || 'Order creation failed');
                setLoading(false);
                return;
            }

            const orderId = orderData.order.id;

            // 2. Initiate STK Push
            setPaymentProcessing(true);
            setLoading(false); // Hide the full screen loader, show the payment overlay

            const paymentResponse = await fetch(`${API_URL}/api/payments/initiate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phoneNumber: phone,
                    amount: total,
                    orderId: orderId,
                    userId: user.id
                }),
            });

            const paymentData = await paymentResponse.json();

            if (!paymentResponse.ok) {
                setPaymentProcessing(false);
                setError(paymentData.error || 'Failed to initiate M-Pesa payment');
                return;
            }

            const checkoutRequestId = paymentData.data.checkoutRequestId;

            // 3. Start Polling for Status
            pollPaymentStatus(checkoutRequestId, orderId);

        } catch (err) {
            console.error('Payment Error:', err);
            setError('Network error processing order');
            setLoading(false);
            setPaymentProcessing(false);
        }
    };

    const pollPaymentStatus = async (checkoutRequestId, orderId) => {
        let attempts = 0;
        const maxAttempts = 12; // 12 * 5 seconds = 60 seconds

        const interval = setInterval(async () => {
            try {
                attempts++;
                const response = await fetch(`${API_URL}/api/payments/status/${checkoutRequestId}`);
                const data = await response.json();

                if (data.success && data.status === 'completed') {
                    clearInterval(interval);
                    setPaymentStatus('success');
                    setTimeout(() => {
                        clearCart();
                        navigate('/history');
                    }, 2000);
                } else if (data.status === 'failed' || data.status === 'cancelled' || attempts >= maxAttempts) {
                    clearInterval(interval);
                    setPaymentStatus('failed');
                    setTimeout(() => {
                        setPaymentProcessing(false);
                        setPaymentStatus('waiting');
                        setError('Payment was not completed. Please try again from Order History.');
                    }, 3000);
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 5000);
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
                                {/* Only show delivery fee row if delivery is selected */}
                                {isDelivery && (
                                    <div className="summary-row">
                                        <span>Delivery Fee</span>
                                        <span>Ksh {deliveryFee}</span>
                                    </div>
                                )}
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

                            {/* Delivery Toggle */}
                            <div className="delivery-toggle-container mb-6">
                                <button
                                    type="button"
                                    className={`delivery-toggle-btn ${isDelivery ? 'active' : ''}`}
                                    onClick={() => setIsDelivery(true)}
                                >
                                    <Truck size={18} /> Delivery
                                </button>
                                <button
                                    type="button"
                                    className={`delivery-toggle-btn ${!isDelivery ? 'active' : ''}`}
                                    onClick={() => setIsDelivery(false)}
                                >
                                    <Store size={18} /> Pickup
                                </button>
                            </div>

                            {error && <div className="error-message mb-4">{error}</div>}

                            <form onSubmit={handlePayment}>
                                {isDelivery && (
                                    <div className="form-group mb-4">
                                        <label className="form-label">Delivery Location</label>
                                        <div className="input-group">
                                            <div className="input-icon">
                                                <MapPin size={18} />
                                            </div>

                                            <input
                                                type="text"
                                                className="form-input"
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                                required={isDelivery}
                                            />
                                        </div>
                                        <span className="helper-text">We'll deliver to this address.</span>
                                    </div>
                                )}

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
                                    <span className="helper-text">For Payment Prompt & Confirmation</span>
                                </div>

                                <div className="form-group mb-6">
                                    <label className="form-label">Notes (Optional)</label>
                                    <textarea
                                        placeholder="Specific instructions..."
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

            {/* Payment Processing Overlay */}
            {paymentProcessing && (
                <div className="payment-overlay">
                    <div className="payment-modal">
                        {paymentStatus === 'waiting' && (
                            <div className="payment-status-content">
                                <span className="payment-loader"></span>
                                <h3>Waiting for Payment</h3>
                                <p>Please check your phone for an M-Pesa STK push. Enter your PIN to complete the payment of <strong>Ksh {total.toLocaleString()}</strong>.</p>
                                <div className="payment-hint">Do not close this page or press back.</div>
                            </div>
                        )}
                        {paymentStatus === 'success' && (
                            <div className="payment-status-content success">
                                <CheckCircle size={64} className="text-success" />
                                <h3>Payment Successful!</h3>
                                <p>Thank you for your order. We are now processing it.</p>
                                <p>Redirecting to order history...</p>
                            </div>
                        )}
                        {paymentStatus === 'failed' && (
                            <div className="payment-status-content failed">
                                <div className="error-icon">×</div>
                                <h3>Payment Failed</h3>
                                <p>We couldn't confirm your payment. Please try again or contact support if you were charged.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Checkout;
