import React from 'react';
import Navbar from '../components/Navbar';
import { Package, Clock } from 'lucide-react';
import './OrderHistory.css';

const OrderHistory = () => {
    const orders = [
        { id: 'ORD-2023-001', date: 'Oct 24, 2023', total: 1400, status: 'Delivered', items: ['Fresh Mangoes', 'Premium Rice'] },
        { id: 'ORD-2023-002', date: 'Oct 10, 2023', total: 450, status: 'Delivered', items: ['Cooking Oil'] },
    ];

    return (
        <>
            <Navbar />
            <div className="container section">
                <h2 className="section-title">Order History</h2>
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="card p-4 mb-4 order-card">
                            <div className="flex justify-between items-center mb-4 border-b pb-2">
                                <div>
                                    <h3 className="font-bold flex items-center gap-2">
                                        <Package size={20} /> {order.id}
                                    </h3>
                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                        <Clock size={14} /> {order.date}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold">Ksh {order.total}</p>
                                    <span className="status-badge status-delivered">{order.status}</span>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Items: {order.items.join(', ')}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default OrderHistory;
