import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import './Auth.css';
import { API_URL } from '../config';

const Register = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: '',
        location: ''
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

    const validatePhone = (phone) => {
        const kenyanPhoneRegex = /^(?:254|\+254|0)?([71]\d{8})$/;
        return kenyanPhoneRegex.test(phone);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (!validatePhone(formData.phone)) {
            setError('Please enter a valid Kenyan phone number');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    password: formData.password,
                    location: formData.location
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Use AuthContext login
                login(data.token, data.user);
                // Redirect to home
                navigate('/');
            } else {
                setError(data.message || 'Registration failed');
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
                    <h2>Create Account</h2>
                    <p>Join us and start shopping fresh!</p>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <User size={20} />
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Enter your full name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

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
                        <label htmlFor="location">Location</label>
                        <div className="input-wrapper">
                            <MapPin size={20} />
                            <input
                                type="text"
                                id="location"
                                name="location"
                                placeholder="e.g., Kahawa Sukari, Nairobi"
                                value={formData.location}
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <Lock size={20} />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                        {loading ? 'Creating Account...' : 'Create Account'}
                    </button>

                    <div className="auth-footer">
                        <p>Already have an account? <Link to="/login">Login here</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
