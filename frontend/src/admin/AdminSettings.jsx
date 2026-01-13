import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, LogOut, Settings, Save, RefreshCw, Truck, Menu, X } from 'lucide-react';
import { API_URL } from '../config';
import './AdminDashboard.css';
import './AdminSettings.css';

const AdminSettings = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/settings/delivery-fee`);
            const data = await response.json();
            if (data.success) {
                setDeliveryFee(data.deliveryFee);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
            setMessage({ type: 'error', text: 'Failed to load settings' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            const token = localStorage.getItem('adminToken'); // Use adminToken like other pages
            const response = await fetch(`${API_URL}/api/settings/delivery-fee`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ deliveryFee: parseFloat(deliveryFee) })
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: 'Settings updated successfully!' });
            } else {
                setMessage({ type: 'error', text: data.message || 'Update failed' });
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            setMessage({ type: 'error', text: 'Server error' });
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/');
    };

    return (
        <div className="admin-container">
            <div className="mobile-header">
                <div className="mobile-header-logo">
                    Staffoods<span className="logo-dot">.</span>
                </div>
                <button
                    className="mobile-menu-toggle"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <div
                className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <aside className={`admin-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
                <div className="admin-logo">
                    <h2>Staffoods<span className="logo-dot">.</span></h2>
                    <p className="admin-label">Admin Panel</p>
                </div>

                <nav className="admin-nav">
                    <Link to="/admin" className="admin-nav-item">
                        <TrendingUp size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/admin/products" className="admin-nav-item">
                        <Package size={20} />
                        <span>Products</span>
                    </Link>
                    <Link to="/admin/orders" className="admin-nav-item">
                        <ShoppingBag size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
                        <Users size={20} />
                        <span>Users</span>
                    </Link>
                    <Link to="/admin/settings" className="admin-nav-item active">
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </nav>

                <button className="admin-logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Store Settings</h1>
                    <p className="text-gray-600">Manage global platform configurations</p>
                </header>

                <div className="admin-section">
                    <div className="settings-card">
                        <form onSubmit={handleSave}>
                            <div className="settings-section-content">
                                <h3 className="section-subtitle"><Truck size={18} /> Logistics & Delivery</h3>
                                <div className="form-group">
                                    <label>Default Delivery Fee (KSh)</label>
                                    <div className="input-with-icon">
                                        <span className="currency-prefix">KSh</span>
                                        <input
                                            type="number"
                                            value={deliveryFee}
                                            onChange={(e) => setDeliveryFee(e.target.value)}
                                            placeholder="Enter fee amount"
                                            min="0"
                                        />
                                    </div>
                                    <small>This fee will be applied to all "Home Delivery" orders.</small>
                                </div>
                            </div>

                            {message.text && (
                                <div className={`settings-message ${message.type}`}>
                                    {message.text}
                                </div>
                            )}

                            <div className="settings-actions">
                                <button
                                    type="button"
                                    className="btn-refresh"
                                    onClick={fetchSettings}
                                    disabled={saving}
                                >
                                    <RefreshCw size={18} /> Refresh
                                </button>
                                <button
                                    type="submit"
                                    className="btn-save"
                                    disabled={saving}
                                >
                                    {saving ? 'Saving...' : <><Save size={18} /> Save Settings</>}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminSettings;
