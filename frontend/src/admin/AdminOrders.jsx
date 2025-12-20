import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, LogOut, Search, Eye, CheckCircle, XCircle, Menu, X } from 'lucide-react';
import './AdminDashboard.css';
import './AdminOrders.css';

const AdminOrders = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    // Mock orders data - will be replaced with API calls
    const [orders] = useState([
        {
            id: 'ORD-001',
            customer: 'John Doe',
            phone: '+254 712 345 678',
            items: ['Apple Mangoes', 'Orange Juice'],
            amount: 1400,
            status: 'Completed',
            date: '2023-12-20',
            location: 'Kahawa Sukari'
        },
        {
            id: 'ORD-002',
            customer: 'Jane Smith',
            phone: '+254 723 456 789',
            items: ['Premium Rice', 'Cooking Oil'],
            amount: 1650,
            status: 'Pending',
            date: '2023-12-20',
            location: 'Kahawa West'
        },
        {
            id: 'ORD-003',
            customer: 'Mike Johnson',
            phone: '+254 734 567 890',
            items: ['Hass Avocados', 'Pineapple', 'Watermelon'],
            amount: 670,
            status: 'Processing',
            date: '2023-12-19',
            location: 'Kahawa Sukari'
        },
        {
            id: 'ORD-004',
            customer: 'Sarah Williams',
            phone: '+254 745 678 901',
            items: ['Mango Juice', 'Passion Juice'],
            amount: 380,
            status: 'Completed',
            date: '2023-12-19',
            location: 'Kahawa Wendani'
        },
        {
            id: 'ORD-005',
            customer: 'David Brown',
            phone: '+254 756 789 012',
            items: ['Sweet Bananas', 'Pawpaw'],
            amount: 220,
            status: 'Cancelled',
            date: '2023-12-18',
            location: 'Kahawa Sukari'
        },
    ]);

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.phone.includes(searchTerm);

        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleStatusChange = (orderId, newStatus) => {
        // This will be connected to API later
        console.log(`Changing order ${orderId} to ${newStatus}`);
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
                    <Link to="/admin/orders" className="admin-nav-item active">
                        <ShoppingBag size={20} />
                        <span>Orders</span>
                    </Link>
                    <Link to="/admin/users" className="admin-nav-item">
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
                    <h1>Order Management</h1>
                </header>

                <div className="admin-section">
                    <div className="orders-filters">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search by order ID, customer, or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-tabs">
                            {['All', 'Pending', 'Processing', 'Completed', 'Cancelled'].map(status => (
                                <button
                                    key={status}
                                    className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
                                    onClick={() => setFilterStatus(status)}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="orders-grid">
                        {filteredOrders.map(order => (
                            <div key={order.id} className="order-card card">
                                <div className="order-header">
                                    <div>
                                        <h3 className="order-id">{order.id}</h3>
                                        <p className="order-date">{order.date}</p>
                                    </div>
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                                </div>

                                <div className="order-details">
                                    <div className="detail-row">
                                        <span className="detail-label">Customer:</span>
                                        <span className="detail-value">{order.customer}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Phone:</span>
                                        <span className="detail-value">{order.phone}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Location:</span>
                                        <span className="detail-value">{order.location}</span>
                                    </div>
                                    <div className="detail-row">
                                        <span className="detail-label">Items:</span>
                                        <span className="detail-value">{order.items.join(', ')}</span>
                                    </div>
                                    <div className="detail-row total">
                                        <span className="detail-label">Total:</span>
                                        <span className="detail-value">Ksh {order.amount}</span>
                                    </div>
                                </div>

                                <div className="order-actions">
                                    <button className="action-btn view">
                                        <Eye size={16} />
                                        <span>View Details</span>
                                    </button>
                                    {order.status === 'Pending' && (
                                        <button
                                            className="action-btn approve"
                                            onClick={() => handleStatusChange(order.id, 'Processing')}
                                        >
                                            <CheckCircle size={16} />
                                            <span>Process</span>
                                        </button>
                                    )}
                                    {order.status === 'Processing' && (
                                        <button
                                            className="action-btn approve"
                                            onClick={() => handleStatusChange(order.id, 'Completed')}
                                        >
                                            <CheckCircle size={16} />
                                            <span>Complete</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredOrders.length === 0 && (
                        <div className="empty-state">
                            <ShoppingBag size={48} />
                            <p>No orders found</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminOrders;
