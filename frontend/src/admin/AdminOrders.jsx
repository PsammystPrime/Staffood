import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, LogOut, Search, Eye, CheckCircle, XCircle, Menu, X, X as CloseIcon } from 'lucide-react';
import Toast from '../components/Toast';
import './AdminDashboard.css';
import './AdminOrders.css';

const AdminOrders = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [toast, setToast] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders/admin');
            const data = await response.json();
            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setToast({ message: 'Failed to fetch orders', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/');
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchOrders(); // Refresh to show new status
                // If modal is open for this order, close it or update it? 
                // Let's close it or update the selectedOrder locally if it affects the modal view.
                if (selectedOrder && selectedOrder.id === orderId) {
                    setSelectedOrder(prev => ({ ...prev, status: newStatus }));
                }
                setToast({ message: `Order status updated to ${newStatus}`, type: 'success' });
            } else {
                setToast({ message: 'Failed to update order status', type: 'error' });
            }
        } catch (error) {
            console.error('Error updating status:', error);
            setToast({ message: 'Error updating order status', type: 'error' });
        }
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch =
            (order.order_number && order.order_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.user_name && order.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (order.phone_number && order.phone_number.includes(searchTerm));

        const matchesStatus = filterStatus === 'All' || order.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
    };

    return (
        <div className="admin-container">
            {toast && <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
            />}

            {/* Mobile Header */}
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

            {/* Sidebar */}
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

                <button className="admin-logout" onClick={handleLogout}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            {/* Main Content */}
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
                                placeholder="Search by Order #, Customer, or Phone..."
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

                    {loading ? (
                        <div className="p-4 text-center">Loading orders...</div>
                    ) : (
                        <div className="orders-grid">
                            {filteredOrders.map(order => (
                                <div key={order.id} className="order-card card">
                                    <div className="order-header">
                                        <div>
                                            <h3 className="order-id">{order.order_number || `#${order.id}`}</h3>
                                            <p className="order-date">{formatDate(order.created_at)}</p>
                                        </div>
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>

                                    <div className="order-details">
                                        <div className="detail-row">
                                            <span className="detail-label">Customer:</span>
                                            <span className="detail-value">{order.user_name || 'Guest'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Phone:</span>
                                            <span className="detail-value">{order.phone_number || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Location:</span>
                                            <span className="detail-value">{order.delivery_location || 'N/A'}</span>
                                        </div>
                                        <div className="detail-row">
                                            <span className="detail-label">Items:</span>
                                            <span className="detail-value">
                                                {order.items && order.items.length > 0
                                                    ? `${order.items[0].product_name}${order.items.length > 1 ? ` +${order.items.length - 1} more` : ''}`
                                                    : 'No items'}
                                            </span>
                                        </div>
                                        <div className="detail-row total">
                                            <span className="detail-label">Total:</span>
                                            <span className="detail-value">Ksh {order.total}</span>
                                        </div>
                                    </div>

                                    <div className="order-actions">
                                        <button className="action-btn view" onClick={() => setSelectedOrder(order)}>
                                            <Eye size={16} />
                                            <span>View Details</span>
                                        </button>

                                        {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                                            <button
                                                className="action-btn approve"
                                                onClick={() => handleStatusChange(order.id, 'Completed')}
                                            >
                                                <CheckCircle size={16} />
                                                <span>Mark Complete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredOrders.length === 0 && (
                        <div className="empty-state">
                            <ShoppingBag size={48} />
                            <p>No orders found</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Order Details</h2>
                            <button className="close-btn" onClick={() => setSelectedOrder(null)}>
                                <CloseIcon size={24} />
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="order-info-section">
                                <div className="info-group">
                                    <label>Order Number</label>
                                    <p>{selectedOrder.order_number}</p>
                                </div>
                                <div className="info-group">
                                    <label>Date</label>
                                    <p>{formatDate(selectedOrder.created_at)}</p>
                                </div>
                                <div className="info-group">
                                    <label>Status</label>
                                    <span className={`status-badge ${selectedOrder.status.toLowerCase()}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                            </div>

                            <div className="customer-info-section">
                                <h3>Customer Information</h3>
                                <div className="info-grid">
                                    <div className="info-group">
                                        <label>Name</label>
                                        <p>{selectedOrder.user_name}</p>
                                    </div>
                                    <div className="info-group">
                                        <label>Phone</label>
                                        <p>{selectedOrder.phone_number}</p>
                                    </div>
                                    <div className="info-group">
                                        <label>Location</label>
                                        <p>{selectedOrder.delivery_location}</p>
                                    </div>
                                </div>
                                {selectedOrder.notes && (
                                    <div className="info-group mt-2">
                                        <label>Notes</label>
                                        <p className="text-sm italic text-gray-600">{selectedOrder.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div className="order-items-section">
                                <h3>Order Items</h3>
                                <div className="items-list">
                                    {selectedOrder.items && selectedOrder.items.map((item, idx) => (
                                        <div key={idx} className="order-item-row">
                                            <div className="item-name">
                                                <span className="font-medium">{item.product_name}</span>
                                            </div>
                                            <div className="item-qty-price">
                                                <span>x{item.quantity}</span>
                                                <span>Ksh {item.price ? parseFloat(item.price).toLocaleString() : '-'}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="order-summary-section">
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>Ksh {selectedOrder.subtotal?.toLocaleString() || 0}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span>Ksh {selectedOrder.delivery_fee?.toLocaleString() || 0}</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Amount</span>
                                    <span>Ksh {selectedOrder.total?.toLocaleString() || 0}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-outline" onClick={() => setSelectedOrder(null)}>
                                Close
                            </button>
                            {selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled' && (
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleStatusChange(selectedOrder.id, 'Completed')}
                                >
                                    Mark as Complete
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrders;
