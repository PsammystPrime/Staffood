import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, ShoppingBag, Users, DollarSign, TrendingUp, LogOut, Menu, X } from 'lucide-react';
import './AdminDashboard.css';
import { API_URL } from '../config';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalUsers: 0,
        totalProducts: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminName, setAdminName] = useState('Admin');

    useEffect(() => {
        // Get admin name
        const adminData = localStorage.getItem('admin');
        if (adminData) {
            const admin = JSON.parse(adminData);
            setAdminName(admin.name || admin.username || 'Admin');
        }

        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch(API_URL + '/api/admin/stats');
            const data = await response.json();
            if (data.success) {
                setStats(data.stats);
                setRecentOrders(data.recentOrders);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
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
                    <Link to="/admin" className="admin-nav-item active">
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
                </nav>

                <button className="admin-logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h1>Dashboard Overview</h1>
                    <p className="text-gray-600">Welcome back, {adminName}</p>
                </header>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon revenue">
                            <DollarSign size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Revenue</p>
                            <h3 className="stat-value">Ksh {stats.totalRevenue.toLocaleString()}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon orders">
                            <ShoppingBag size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Orders</p>
                            <h3 className="stat-value">{stats.totalOrders}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon users">
                            <Users size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Users</p>
                            <h3 className="stat-value">{stats.totalUsers}</h3>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon products">
                            <Package size={24} />
                        </div>
                        <div className="stat-content">
                            <p className="stat-label">Total Products</p>
                            <h3 className="stat-value">{stats.totalProducts}</h3>
                        </div>
                    </div>
                </div>

                <div className="admin-section">
                    <h2 className="section-title">Recent Orders</h2>
                    <div className="orders-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map(order => (
                                        <tr key={order.id}>
                                            <td className="order-id">#{order.id}</td>
                                            <td>{order.customer || 'Guest'}</td>
                                            <td>Ksh {order.amount.toLocaleString()}</td>
                                            <td>
                                                <span className={`status-badge ${order.status.toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td>{order.date}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-4">No recent orders</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
