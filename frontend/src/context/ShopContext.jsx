import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { API_URL } from '../config';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);

    // Initial load from local storage for guests
    useEffect(() => {
        if (!user) {
            const savedCart = localStorage.getItem('staffood_cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
        }
    }, [user]);

    // Sync with DB when user logs in
    useEffect(() => {
        if (user) {
            fetchUserCart();
        } else {
            // If user logs out, we could clear cart or keep local one. 
            // Usually clearing is safer/less confusing.
            // But for now, we revert to localStorage which might have old specific-device data.
            const savedCart = localStorage.getItem('staffood_cart');
            setCart(savedCart ? JSON.parse(savedCart) : []);
        }
    }, [user]);

    // Save to local storage only for guests
    useEffect(() => {
        if (!user) {
            localStorage.setItem('staffood_cart', JSON.stringify(cart));
        }
    }, [cart, user]);

    const fetchUserCart = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/api/cart/${user.id}`);
            const data = await response.json();

            if (data.success) {
                // Map DB structure to frontend structure
                const formattedCart = data.cartItems.map(item => ({
                    id: item.product_id,
                    name: item.name,
                    price: parseFloat(item.price),
                    image: item.image,
                    category: item.category,
                    stock_quantity: item.stock_quantity,
                    quantity: item.quantity
                }));
                setCart(formattedCart);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (product) => {
        if (user) {
            // Optimistic update
            setCart(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
                }
                return [...prev, { ...product, quantity: 1 }];
            });

            // API Call
            try {
                await fetch(`${API_URL}/api/cart/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId: product.id, quantity: 1 })
                });
            } catch (error) {
                console.error('Error syncing add to cart:', error);
                // Ideally revert optimistic update on failure
            }
        } else {
            // Guest Logic
            setCart(prev => {
                const existing = prev.find(item => item.id === product.id);
                if (existing) {
                    return prev.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [...prev, { ...product, quantity: 1 }];
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (user) {
            setCart(prev => prev.filter(item => item.id !== productId));
            try {
                await fetch(`${API_URL}/api/cart/remove`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId })
                });
            } catch (error) {
                console.error('Error removing from cart:', error);
            }
        } else {
            setCart(prev => prev.filter(item => item.id !== productId));
        }
    };

    const updateQuantity = async (productId, change) => {
        // Find current quantity to ensure we don't go below 1 or negative inappropriately here if needed
        const item = cart.find(i => i.id === productId);
        if (!item) return;
        const newQuantity = Math.max(1, item.quantity + change);

        if (user) {
            setCart(prev => prev.map(item => {
                if (item.id === productId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }));

            try {
                await fetch(`${API_URL}/api/cart/update`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id, productId, quantity: newQuantity })
                });
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        } else {
            setCart(prev => prev.map(item => {
                if (item.id === productId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }));
        }
    };

    const clearCart = async () => {
        setCart([]);
        if (user) {
            try {
                await fetch(`${API_URL}/api/cart/clear`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId: user.id })
                });
            } catch (error) {
                console.error('Error clearing cart:', error);
            }
        }
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cart.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <ShopContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount,
            loading
        }}>
            {children}
        </ShopContext.Provider>
    );
};
