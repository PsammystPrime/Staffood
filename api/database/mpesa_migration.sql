-- M-Pesa Payment Tables (Updated with order_number and username)
-- Created: January 2026

USE staffoods;

-- ============================================
-- PENDING PAYMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pending_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_number VARCHAR(100),
    username VARCHAR(100),
    checkout_request_id VARCHAR(100) UNIQUE NOT NULL,
    merchant_request_id VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    status ENUM('pending', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    INDEX idx_checkout (checkout_request_id),
    INDEX idx_order (order_id),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TRANSACTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    order_number VARCHAR(100),
    user_id INT NOT NULL,
    username VARCHAR(100),
    amount DECIMAL(10, 2) NOT NULL,
    mpesa_receipt VARCHAR(50) UNIQUE,
    phone_number VARCHAR(20),
    status ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_order (order_id),
    INDEX idx_user (user_id),
    INDEX idx_receipt (mpesa_receipt),
    INDEX idx_order_number (order_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Migration script to add columns to existing tables if they already exist
-- ALTER TABLE pending_payments ADD COLUMN IF NOT EXISTS order_number VARCHAR(100) AFTER order_id;
-- ALTER TABLE pending_payments ADD COLUMN IF NOT EXISTS username VARCHAR(100) AFTER order_number;
-- ALTER TABLE transactions ADD COLUMN IF NOT EXISTS order_number VARCHAR(100) AFTER order_id;
-- ALTER TABLE transactions ADD COLUMN IF NOT EXISTS username VARCHAR(100) AFTER user_id;
