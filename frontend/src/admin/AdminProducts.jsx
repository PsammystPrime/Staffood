import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, TrendingUp, ShoppingBag, Users, LogOut, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import './AdminDashboard.css';
import './AdminProducts.css';

const AdminProducts = () => {
    const [products, setProducts] = useState(PRODUCTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'Fruits',
        price: '',
        image: ''
    });

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleAddProduct = () => {
        if (newProduct.name && newProduct.price) {
            const product = {
                id: products.length + 1,
                ...newProduct,
                price: parseFloat(newProduct.price)
            };
            setProducts([...products, product]);
            setNewProduct({ name: '', category: 'Fruits', price: '', image: '' });
            setIsAddingProduct(false);
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setNewProduct({
            name: product.name,
            category: product.category,
            price: product.price.toString(),
            image: product.image
        });
    };

    const handleUpdateProduct = () => {
        if (editingProduct && newProduct.name && newProduct.price) {
            setProducts(products.map(p =>
                p.id === editingProduct.id
                    ? { ...p, ...newProduct, price: parseFloat(newProduct.price) }
                    : p
            ));
            setEditingProduct(null);
            setNewProduct({ name: '', category: 'Fruits', price: '', image: '' });
        }
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            setProducts(products.filter(p => p.id !== id));
        }
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setIsAddingProduct(false);
        setNewProduct({ name: '', category: 'Fruits', price: '', image: '' });
    };

    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
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
                </nav>

                <button className="admin-logout">
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
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map(product => (
                                    <tr key={product.id}>
                                        <td className="order-id">#{product.id}</td>
                                        <td>{product.name}</td>
                                        <td>
                                            <span className="category-badge">{product.category}</span>
                                        </td>
                                        <td className="price-cell">Ksh {product.price}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <button
                                                    className="action-btn edit"
                                                    onClick={() => handleEditProduct(product)}
                                                    title="Edit"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    className="action-btn delete"
                                                    onClick={() => handleDeleteProduct(product.id)}
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminProducts;
