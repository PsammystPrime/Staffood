import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Smartphone, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import './Checkout.css';

const Checkout = () => {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { getCartTotal, clearCart } = useShop();

    const total = getCartTotal() + (getCartTotal() > 0 ? 100 : 0); // Adding mock delivery fee

    const handlePayment = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate STK push
        setTimeout(() => {
            setLoading(false);
            alert('STK Push sent to ' + phone + '. Complete payment on your phone.');
            clearCart();
            navigate('/history');
        }, 2000);
    };

    return (
        <>
            <Navbar />
            <div className="container section flex justify-center">
                <div className="card p-4 checkout-card">
                    <h2 className="section-title">M-Pesa Checkout</h2>
                    <div className="text-center mb-6">
                        <p className="text-gray-500">Total to Pay</p>
                        <h1 className="font-bold text-xl" style={{ fontSize: '2.5rem' }}>Ksh {total}</h1>
                    </div>

                    <form onSubmit={handlePayment}>
                        <div className="form-group">
                            <label>M-Pesa Phone Number</label>
                            <div className="input-with-icon">
                                <Smartphone size={20} className="input-icon" />
                                <input
                                    type="tel"
                                    placeholder="07XX XXX XXX"
                                    className="form-input"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Enter the number to receive the STK push.</p>
                        </div>

                        <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
                            {loading ? 'Processing...' : 'Pay with M-Pesa'}
                        </button>
                    </form>

                    <div className="mpesa-logo-container mt-4 text-center">
                        <span className="text-sm font-bold text-success flex items-center justify-center gap-2">
                            <CheckCircle size={16} /> Secure Payment
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Checkout;
