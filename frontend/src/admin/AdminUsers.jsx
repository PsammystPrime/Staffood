import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, LogOut, Search, Mail, Phone, MapPin, Award, Menu, X } from 'lucide-react';
import './AdminDashboard.css';
import './AdminUsers.css';

const AdminUsers = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Mock users data - will be replaced with API calls
    const [users] = useState([
        {
            id: 1,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+254 712 345 678',
            location: 'Kahawa Sukari',
            points: 1250,
            orders: 12,
            totalSpent: 15400,
            joinedDate: '2023-10-15'
        },
        {
            id: 2,
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
            phone: '+254 723 456 789',
            location: 'Kahawa West',
            points: 850,
            orders: 8,
            totalSpent: 9200,
            joinedDate: '2023-11-02'
        },
        {
            id: 3,
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            phone: '+254 734 567 890',
            location: 'Kahawa Sukari',
            points: 2100,
            orders: 18,
            totalSpent: 22500,
            joinedDate: '2023-09-20'
        },
        {
            id: 4,
            name: 'Sarah Williams',
            email: 'sarah.w@example.com',
            phone: '+254 745 678 901',
            location: 'Kahawa Wendani',
            points: 450,
            orders: 5,
            totalSpent: 5800,
            joinedDate: '2023-11-28'
        },
        {
            id: 5,
            name: 'David Brown',
            email: 'david.brown@example.com',
            phone: '+254 756 789 012',
            location: 'Kahawa Sukari',
            points: 1680,
            orders: 14,
            totalSpent: 18200,
            joinedDate: '2023-10-08'
        },
    ]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                <button className="admin-logout">
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

                    <div className="users-grid">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="user-card card">
                                <div className="user-avatar">
                                    <Users size={32} />
                                </div>

                                <div className="user-info">
                                    <h3 className="user-name">{user.name}</h3>

                                    <div className="user-details">
                                        <div className="user-detail">
                                            <Mail size={16} />
                                            <span>{user.email}</span>
                                        </div>
                                        <div className="user-detail">
                                            <Phone size={16} />
                                            <span>{user.phone}</span>
                                        </div>
                                        <div className="user-detail">
                                            <MapPin size={16} />
                                            <span>{user.location}</span>
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
                                            <span className="stat-value">Ksh {user.totalSpent.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="user-footer">
                                        <span className="joined-date">Joined: {user.joinedDate}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredUsers.length === 0 && (
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
