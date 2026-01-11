import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, LogOut, Search, Mail, Phone, MapPin, Award, Menu, X } from 'lucide-react';
import './AdminDashboard.css';
import './AdminUsers.css';
import { API_URL } from '../config';


const AdminUsers = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await fetch(API_URL + '/api/users');
            const data = await response.json();

            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/');
    };

    const filteredUsers = users.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.includes(searchTerm)) ||
        (user.location && user.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    // Helper to format currency
    const formatCurrency = (amount) => {
        return parseFloat(amount || 0).toLocaleString();
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
                    <Link to="/admin/users" className="admin-nav-item active">
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
                    <h1>User Management</h1>
                </header>

                <div className="admin-section">
                    <div className="users-header">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search users by name, email, phone, or location..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-4 text-center">Loading users...</div>
                    ) : (
                        <div className="users-grid">
                            {filteredUsers.map(user => (
                                <div key={user.id} className="user-card card">
                                    <div className="user-avatar">
                                        <Users size={32} />
                                    </div>

                                    <div className="user-info">
                                        <h3 className="user-name">{user.name || user.username || 'User'}</h3>

                                        <div className="user-details">
                                            <div className="user-detail">
                                                <Mail size={16} />
                                                <span title={user.email}>{user.email}</span>
                                            </div>
                                            <div className="user-detail">
                                                <Phone size={16} />
                                                <span>{user.phone || 'N/A'}</span>
                                            </div>
                                            <div className="user-detail">
                                                <MapPin size={16} />
                                                <span>{user.location || 'N/A'}</span>
                                            </div>
                                        </div>

                                        <div className="user-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">Points</span>
                                                <div className="points-display">
                                                    <Award size={16} />
                                                    <span className="stat-value">{user.points}</span>
                                                </div>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Orders</span>
                                                <span className="stat-value">{user.orders}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Total Spent</span>
                                                <span className="stat-value">Ksh {formatCurrency(user.totalSpent)}</span>
                                            </div>
                                        </div>

                                        <div className="user-footer">
                                            <span className="joined-date">Joined: {formatDate(user.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredUsers.length === 0 && (
                        <div className="empty-state">
                            <Users size={48} />
                            <p>No users found</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminUsers;
