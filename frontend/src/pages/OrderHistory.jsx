import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Loader from '../components/Loader';
import { Package, Clock, X, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './OrderHistory.css';

const OrderHistory = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/orders/user/${user.id}`);
            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            } else {
                setError('Failed to fetch orders');
            }
        } catch (err) {
            setError('Network error fetching orders');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Completed': return 'status-completed';
            case 'Delivered': return 'status-delivered';
            case 'Pending': return 'status-pending';
            case 'Processing': return 'status-processing';
            case 'Cancelled': return 'status-cancelled';
            default: return '';
        }
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const closeModal = () => {
        setSelectedOrder(null);
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    return (
        <>
            <Navbar />
            <div className="container section">
                <h2 className="section-title">Order History</h2>

                {orders.length === 0 ? (
                    <div className="card p-4 text-center">
                        <p>No orders found.</p>
                    </div>
                ) : (
                    <div className="orders-list">
                        {orders.map(order => (
                            <div
                                key={order.id}
                                className="card p-4 mb-4 order-card"
                                onClick={() => handleOrderClick(order)}
                            >
                                <div className="flex justify-between items-center mb-4 border-b pb-2">
                                    <div>
                                        <h3 className="font-bold flex items-center gap-2">
                                            <Package size={20} /> {order.order_number}
                                        </h3>
                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                            <Clock size={14} /> {formatDate(order.created_at)}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold">Ksh {parseFloat(order.total).toLocaleString()}</p>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <p>
                                        {order.items ? `${order.items.length} Items` : 'No items'}
                                    </p>
                                    <span className="text-primary text-xs font-bold">View Details</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Details Modal */}
                {selectedOrder && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <div className="modal-header">
                                <div>
                                    <h3 className="modal-title">Order Details</h3>
                                    <p className="text-sm text-gray-500">{selectedOrder.order_number}</p>
                                </div>
                                <button className="btn-close" onClick={closeModal}>
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="modal-body">
                                <div className="detail-row">
                                    <span className="detail-label">Status</span>
                                    <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Date & Time</span>
                                    <span className="detail-value">{formatDate(selectedOrder.created_at)}</span>
                                </div>

                                {selectedOrder.delivery_location && (
                                    <div className="detail-row">
                                        <span className="detail-label">Delivery To</span>
                                        <span className="detail-value flex items-center gap-1" style={{ textAlign: 'right', maxWidth: '60%' }}>
                                            <MapPin size={14} /> {selectedOrder.delivery_location}
                                        </span>
                                    </div>
                                )}

                                <div className="items-list">
                                    <h4 className="font-bold mb-2">Items</h4>
                                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                                        <div key={index} className="item-row">
                                            <span className="item-name">{item.product_name}</span>
                                            <span className="item-qty">x{item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <span className="total-label">Total Amount</span>
                                <span className="total-amount">Ksh {parseFloat(selectedOrder.total).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default OrderHistory;
