import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Auth.css';
import { API_URL } from '../config';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        phone: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Basic Kenyan Phone Validation
        const kenyanPhoneRegex = /^(?:254|\+254|0)?([71]\d{8})$/;
        if (!kenyanPhoneRegex.test(formData.phone)) {
            setError('Please enter a valid Kenyan phone number');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Use AuthContext login
                login(data.token, data.user);
                // Redirect to home
                navigate('/');
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Staffoods<span className="logo-dot">.</span></h1>
                    <h2>Welcome Back</h2>
                    <p>Login with your phone number</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="input-wrapper">
                            <Phone size={20} />
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="e.g., 0712345678"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="forgot-password">
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div className="auth-footer">
                        <p>Don't have an account? <Link to="/register">Register here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
