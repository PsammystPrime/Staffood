-- Staffoods Database Schema
-- Created: January 2026

-- Create database (if not exists)
CREATE DATABASE IF NOT EXISTS staffoods CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE staffoods;

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category ENUM('Fruits', 'Juices', 'Groceries') NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image VARCHAR(255) NOT NULL COMMENT 'Image path relative to public folder, e.g., /mangoes.png',
    description TEXT,
    stock_quantity INT DEFAULT 0,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_availability (is_available),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ORDERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL COMMENT 'Format: ORD-XXXXXX',
    subtotal DECIMAL(10, 2) NOT NULL,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('Pending', 'Processing', 'Completed', 'Cancelled') DEFAULT 'Pending',
    payment_method VARCHAR(50) DEFAULT 'M-Pesa',
    payment_status ENUM('Pending', 'Paid', 'Failed') DEFAULT 'Pending',
    phone_number VARCHAR(20),
    delivery_location VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_order_number (order_number),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ORDER ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL COMMENT 'Snapshot of product name at time of order',
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL COMMENT 'Price at time of order',
    subtotal DECIMAL(10, 2) NOT NULL COMMENT 'quantity * price',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT,
    INDEX idx_order (order_id),
    INDEX idx_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- USER POINTS TABLE (for loyalty program)
-- ============================================
CREATE TABLE IF NOT EXISTS user_points (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    points INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    total_orders INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL COMMENT 'Hashed password',
    role ENUM('admin', 'super_admin') DEFAULT 'admin',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT SAMPLE PRODUCTS
-- ============================================
INSERT INTO products (name, category, price, image, description, stock_quantity) VALUES
-- Fruits
('Apple Mangoes', 'Fruits', 50, '/mangoes.png', 'Fresh apple mangoes from local farms', 100),
('Ngowe Mangoes', 'Fruits', 60, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Ngowe+Mango', 'Long Ngowe mangoes typical of Kenya', 80),
('Kent Mangoes', 'Fruits', 70, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Kent+Mango', 'Large, round Kent mangoes', 60),
('Sweet Yellow Bananas', 'Fruits', 100, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Sweet+Bananas', 'Perfect bunch of ripe bananas', 150),
('Hass Avocados', 'Fruits', 40, '/avocado.png', 'Fresh Hass avocados with smooth green skin', 120),
('Fuerte Avocados', 'Fruits', 30, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Fuerte+Avocado', 'Pear-shaped Fuerte avocados', 100),
('Purple Passion Fruits', 'Fruits', 200, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Passion+Fruit', 'Wrinkled ripe purple passion fruits', 70),
('Sweet Pineapple', 'Fruits', 150, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Pineapple', 'Whole ripe pineapple with golden skin', 50),
('Pawpaw (Papaya)', 'Fruits', 120, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Pawpaw', 'Ripe papaya with orange flesh', 60),
('Watermelon', 'Fruits', 400, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Watermelon', 'Large whole watermelon', 30),

-- Juices
('Orange Juice', 'Juices', 250, '/orange_juice.png', 'Fresh squeezed orange juice 500ml', 100),
('Rich Mango Juice (500ml)', 'Juices', 200, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Mango+Juice', 'Thick yellow mango juice', 80),
('Classic Passion Juice', 'Juices', 180, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Passion+Juice', 'Golden-yellow passion fruit juice', 90),
('Fresh Watermelon Juice', 'Juices', 180, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Watermelon+Juice', 'Vibrant red watermelon juice', 70),
('Creamy Avocado Smoothie', 'Juices', 250, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Avo+Smoothie', 'Thick pale green avocado smoothie', 50),

-- Groceries
('Premium Rice (5kg)', 'Groceries', 1200, '/rice.png', 'High quality premium rice', 40),
('Cooking Oil (1L)', 'Groceries', 450, '/oil.png', 'Pure cooking oil 1 liter', 80),
('Green Bananas (Matoke)', 'Groceries', 150, 'https://placehold.co/400x400/D4E157/1A1A1A?text=Matoke', 'Raw green cooking bananas', 100);

-- ============================================
-- CREATE DEFAULT ADMIN USER
-- Password: admin123 (hashed with bcrypt)
-- ============================================
-- Note: You should change this password after first login
INSERT INTO admin_users (username, email, password, role) VALUES
('admin', 'admin@staffoods.com', '$2a$10$YourHashedPasswordHere', 'super_admin');

-- ============================================
-- USEFUL QUERIES FOR REFERENCE
-- ============================================

-- Get all products by category
-- SELECT * FROM products WHERE category = 'Fruits' AND is_available = TRUE ORDER BY name;

-- Get user's order history
-- SELECT o.*, COUNT(oi.id) as item_count 
-- FROM orders o 
-- LEFT JOIN order_items oi ON o.id = oi.order_id 
-- WHERE o.user_id = ? 
-- GROUP BY o.id 
-- ORDER BY o.created_at DESC;

-- Get order details with items
-- SELECT o.*, oi.*, p.name as product_name 
-- FROM orders o 
-- JOIN order_items oi ON o.id = oi.order_id 
-- JOIN products p ON oi.product_id = p.id 
-- WHERE o.id = ?;

-- Update user points after order
-- INSERT INTO user_points (user_id, points, total_spent, total_orders) 
-- VALUES (?, ?, ?, 1) 
-- ON DUPLICATE KEY UPDATE 
--   points = points + VALUES(points),
--   total_spent = total_spent + VALUES(total_spent),
--   total_orders = total_orders + 1;

-- Get admin dashboard stats
-- SELECT 
--   (SELECT COUNT(*) FROM users) as total_users,
--   (SELECT COUNT(*) FROM orders) as total_orders,
--   (SELECT COUNT(*) FROM products WHERE is_available = TRUE) as total_products,
--   (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status = 'Completed') as total_revenue;
