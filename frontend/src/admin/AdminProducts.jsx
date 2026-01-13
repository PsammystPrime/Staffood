import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, LogOut, Plus, Edit2, Trash2, Search, Menu, X, RefreshCw, Settings } from 'lucide-react';
import Toast from '../components/Toast';
import './AdminDashboard.css';
import './AdminProducts.css';
import { API_URL } from '../config';


const AdminProducts = () => {
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Fruits',
        price: '',
        image: '',
        description: '',
        stock_quantity: 0
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/products/admin`, {
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });
            const data = await response.json();
            if (data.success) {
                setProducts(data.products);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setToast({ message: 'Failed to fetch products', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('admin');
        navigate('/');
    };

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.category.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const handleAddProduct = async () => {
        if (!newProduct.name || !newProduct.price || !newProduct.image) {
            setToast({ message: 'Please fill in Name, Price, and Image URL', type: 'error' });
            return;
        }

        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify(newProduct)
            });

            const data = await response.json();

            if (response.ok) {
                fetchProducts();
                setNewProduct({ name: '', category: 'Fruits', price: '', image: '', description: '', stock_quantity: 0 });
                setIsAddingProduct(false);
                setToast({ message: 'Product added successfully', type: 'success' });
            } else {
                setToast({ message: data.message || 'Failed to add product', type: 'error' });
            }
        } catch (error) {
            console.error('Error adding product:', error);
            setToast({ message: 'Error adding product', type: 'error' });
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            image: product.image,
            description: product.description || '',
            stock_quantity: product.stock_quantity || 0,
            is_available: product.is_available
        });
    };

    const handleUpdateProduct = async () => {
        if (editingProduct && newProduct.name && newProduct.price) {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const response = await fetch(`${API_URL}/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify({
                        ...newProduct,
                        price: parseFloat(newProduct.price)
                    })
                });

                if (response.ok) {
                    fetchProducts();
                    setEditingProduct(null);
                    setNewProduct({ name: '', category: 'Fruits', price: '', image: '', description: '', stock_quantity: 0 });
                    setToast({ message: 'Product updated successfully', type: 'success' });
                } else {
                    setToast({ message: 'Failed to update product', type: 'error' });
                }
            } catch (error) {
                console.error('Error updating product:', error);
                setToast({ message: 'Error updating product', type: 'error' });
            }
        }
    };

    const handleSoftDelete = async (id) => {
        if (window.confirm('Are you sure you want to mark this product as unavailable?')) {
            try {
                const adminToken = localStorage.getItem('adminToken');
                const response = await fetch(`${API_URL}/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`
                    }
                });
                if (response.ok) {
                    fetchProducts();
                    setToast({ message: 'Product marked as unavailable', type: 'success' });
                } else {
                    setToast({ message: 'Failed to update product status', type: 'error' });
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                setToast({ message: 'Error updating product status', type: 'error' });
            }
        }
    };

    const handleRestock = async (product) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await fetch(`${API_URL}/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${adminToken}`
                },
                body: JSON.stringify({
                    name: product.name,
                    category: product.category,
                    price: product.price,
                    image: product.image,
                    description: product.description,
                    stock_quantity: product.stock_quantity,
                    is_available: true
                })
            });

            if (response.ok) {
                fetchProducts();
                setToast({ message: 'Product restocked successfully', type: 'success' });
            } else {
                setToast({ message: 'Failed to restock product', type: 'error' });
            }
        } catch (error) {
            console.error('Error restocking product:', error);
            setToast({ message: 'Error restocking product', type: 'error' });
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setIsAddingProduct(false);
        setNewProduct({ name: '', category: 'Fruits', price: '', image: '', description: '', stock_quantity: 0 });
    };

    return (
        <div className="admin-container">
            {toast && <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
            />}

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
                    <Link to="/admin/products" className="admin-nav-item active">
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
                    <Link to="/admin/settings" className="admin-nav-item">
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
                    <h1>Product Management</h1>
                    <button className="btn btn-primary" onClick={() => setIsAddingProduct(true)}>
                        <Plus size={18} /> Add New Product
                    </button>
                </header>

                <div className="admin-section">
                    <div className="products-header">
                        <div className="search-box">
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-tabs" style={{ marginTop: '1rem' }}>
                            {['All', 'Fruits', 'Juices', 'Groceries'].map(category => (
                                <button
                                    key={category}
                                    className={`filter-tab ${categoryFilter === category ? 'active' : ''}`}
                                    onClick={() => setCategoryFilter(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {(isAddingProduct || editingProduct) && (
                        <div className="product-form card">
                            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Product Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        placeholder="e.g., Fresh Mangoes"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Category</label>
                                    <select
                                        className="form-input"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="Fruits">Fruits</option>
                                        <option value="Juices">Juices</option>
                                        <option value="Groceries">Groceries</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Price (Ksh)</label>
                                    <input
                                        type="number"
                                        className="form-input"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        placeholder="150"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Image URL</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                        placeholder="/product.png"
                                    />
                                </div>
                            </div>
                            <div className="form-actions">
                                <button
                                    className="btn btn-primary"
                                    onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                                >
                                    {editingProduct ? 'Update Product' : 'Add Product'}
                                </button>
                                <button className="btn btn-outline" onClick={handleCancelEdit}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="products-table-container">
                        <table className="orders-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => {
                                    const isUnavailable = product.is_available === 0 || product.is_available === false;
                                    return (
                                        <tr key={product.id} className={isUnavailable ? 'unavailable-product' : ''}>
                                            <td className="order-id">#{product.id}</td>
                                            <td style={isUnavailable ? { textDecoration: 'line-through', color: '#9CA3AF' } : {}}>
                                                {product.name}
                                            </td>
                                            <td className="price-cell">Ksh {product.price}</td>
                                            <td>
                                                <span className="category-badge">{product.category}</span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${!isUnavailable ? 'completed' : 'cancelled'}`}>
                                                    {!isUnavailable ? 'In Stock' : 'Out of Stock'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="action-btn edit"
                                                        onClick={() => handleEditProduct(product)}
                                                        title="Edit"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    {isUnavailable ? (
                                                        <button
                                                            className="action-btn restock"
                                                            onClick={() => handleRestock(product)}
                                                            title="Restock"
                                                            style={{ color: '#059669', background: '#ECFDF5' }}
                                                        >
                                                            <Plus size={16} />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            className="action-btn delete"
                                                            onClick={() => handleSoftDelete(product.id)}
                                                            title="Mark as Unavailable"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProducts;
